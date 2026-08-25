interface Message {
  role: string;
  content: string;
}

interface ValidationResult {
  valid: true;
  messages: { role: 'user' | 'assistant'; content: string }[];
  mode?: 'defend';
  defendFilm?: string;
}

interface ValidationError {
  valid: false;
  error: string;
  status: number;
}

const MAX_BODY_SIZE = 64 * 1024; // 64KB
const MAX_MESSAGE_CONTENT_LENGTH = 4000;
const MAX_MESSAGES = 100;

/**
 * Strip null bytes, control characters (except newlines/tabs), and trim.
 */
function sanitizeContent(content: string): string {
  return content
    .replace(/\0/g, '')
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

export function validateRequest(body: unknown, contentLength: number | null): ValidationResult | ValidationError {
  // Body size check
  if (contentLength && contentLength > MAX_BODY_SIZE) {
    return {
      valid: false,
      error: "That's a longer monologue than anything in a Tarantino film. Keep it shorter.",
      status: 413,
    };
  }

  // Shape check
  if (!body || typeof body !== 'object') {
    return { valid: false, error: "I don't understand the format of your request.", status: 400 };
  }

  const data = body as Record<string, unknown>;

  if (!Array.isArray(data.messages)) {
    return { valid: false, error: "I expected a conversation, not whatever this is.", status: 400 };
  }

  const rawMessages = data.messages as Message[];

  if (rawMessages.length === 0) {
    return { valid: false, error: "You haven't said anything yet.", status: 400 };
  }

  // Sanitize and filter messages — only allow user and assistant roles
  const sanitized: { role: 'user' | 'assistant'; content: string }[] = [];
  for (const msg of rawMessages.slice(-MAX_MESSAGES)) {
    if (msg.role !== 'user' && msg.role !== 'assistant') continue;
    if (typeof msg.content !== 'string') continue;

    const clean = sanitizeContent(msg.content);
    if (!clean) continue;

    sanitized.push({
      role: msg.role as 'user' | 'assistant',
      content: clean.slice(0, MAX_MESSAGE_CONTENT_LENGTH),
    });
  }

  if (sanitized.length === 0) {
    return { valid: false, error: "Your message appears to be empty.", status: 400 };
  }

  // Last message must be from user
  if (sanitized[sanitized.length - 1].role !== 'user') {
    return { valid: false, error: "I'm waiting for you to say something.", status: 400 };
  }

  // Extract mode
  const mode = data.mode === 'defend' ? 'defend' as const : undefined;
  const defendFilm = typeof data.defendFilm === 'string' ? data.defendFilm : undefined;

  return { valid: true, messages: sanitized, mode, defendFilm };
}
