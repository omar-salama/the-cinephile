const ERROR_MESSAGES = {
  rateLimit: "Even Kubrick took breaks between takes. Give me a moment — my brilliance requires pacing.",
  exhausted: "The Cinephile has screened too many films today and has retired to a darkened room to contemplate Bergman. The projection booth reopens at midnight UTC.",
  timeout: "I was mid-thought on an extraordinarily profound observation about mise-en-scène and lost my train of thought. Try again.",
  unavailable: "The screening room appears to be undergoing maintenance. Even the finest theaters close for repairs. Try again in a moment.",
  emptyResponse: "I opened my mouth to deliver a devastating critique and… nothing came out. How embarrassingly human of me. Try again.",
  inputTooLong: "That's a longer monologue than anything in a Tarantino film. Perhaps edit it down to the essentials.",
  generic: "Technical difficulties. Even the best projectors jam occasionally. Try again in a moment.",
} as const;

export function characterErrorResponse(
  type: keyof typeof ERROR_MESSAGES,
  extras?: { retryAfter?: number; exhausted?: boolean }
): Response {
  return new Response(
    JSON.stringify({
      error: true,
      message: ERROR_MESSAGES[type],
      ...extras,
    }),
    {
      status: 200, // Always 200 — errors are in-character chat messages
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    }
  );
}

export function validationErrorResponse(message: string, status: number): Response {
  return new Response(
    JSON.stringify({ error: true, message }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    }
  );
}
