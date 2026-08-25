import { SYSTEM_PROMPT, buildDefendPrompt } from '../../server/prompt';
import { validateRequest } from '../../server/validation';
import { truncateConversation } from '../../server/truncation';
import { characterErrorResponse, validationErrorResponse } from '../../server/errors';

interface Env {
  AI: {
    run: (model: string, options: Record<string, unknown>) => Promise<ReadableStream>;
  };
  CHAT_RATE_LIMITER: {
    limit: (options: { key: string }) => Promise<{ success: boolean }>;
  };
}

const MODEL = '@cf/meta/llama-3-8b-instruct';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // --- Rate Limiting ---
  const clientIP = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';

  try {
    const { success } = await env.CHAT_RATE_LIMITER.limit({ key: clientIP });
    if (!success) {
      return characterErrorResponse('rateLimit', { retryAfter: 60 });
    }
  } catch {
    // If rate limiter fails, proceed (don't block users due to infrastructure failure)
    console.error('Rate limiter error — proceeding without limit');
  }

  // --- Parse & Validate Request ---
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return validationErrorResponse("I couldn't parse your message. Try again.", 400);
  }

  const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
  const validation = validateRequest(body, contentLength);

  if (!validation.valid) {
    return validationErrorResponse(validation.error, validation.status);
  }

  const { messages: userMessages, mode, defendFilm } = validation;

  // --- Build System Prompt ---
  let systemPrompt = SYSTEM_PROMPT;
  if (mode === 'defend' && defendFilm) {
    systemPrompt += buildDefendPrompt(defendFilm);
  }

  // --- Truncate Conversation ---
  const truncated = truncateConversation(userMessages);

  // --- Build Messages Array ---
  const aiMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...truncated,
  ];

  // --- Call Workers AI ---
  try {
    const stream = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8-fast', {
      messages: aiMessages,
      stream: true,
    });

    // Stream the response back as SSE
    return new Response(stream as unknown as ReadableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-store',
        'Connection': 'keep-alive',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Workers AI error:', message);

    // Check for quota exhaustion
    if (message.includes('exceeded') || message.includes('quota') || message.includes('4006') || message.includes('3036')) {
      return characterErrorResponse('exhausted', { exhausted: true });
    }

    // Check for timeout
    if (message.includes('timeout') || message.includes('AbortError')) {
      return characterErrorResponse('timeout');
    }

    // Generic model error
    return characterErrorResponse('unavailable');
  }
};

// Only allow POST
export const onRequestGet: PagesFunction = async () => {
  return new Response(JSON.stringify({ message: "The Cinephile prefers dialogue, not monologue. Send a POST request." }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', 'Allow': 'POST' },
  });
};
