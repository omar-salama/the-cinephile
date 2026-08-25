interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const MAX_CONTEXT_MESSAGES = 50;
const PRESERVE_START = 2; // First user message + first assistant reply
const KEEP_RECENT = 20; // Last 20 messages (10 turns)

/**
 * Truncate conversation history to fit within context budget.
 * 
 * Strategy:
 * - Always keep the system prompt (prepended separately)
 * - Keep the first user message + first assistant reply (preserves topic context)
 * - Keep the most recent 20 messages
 * - Drop everything in between
 */
export function truncateConversation(
  messages: Message[]
): Message[] {
  // If short enough, return as-is
  if (messages.length <= MAX_CONTEXT_MESSAGES) {
    return messages;
  }

  const start = messages.slice(0, PRESERVE_START);
  const recent = messages.slice(-KEEP_RECENT);

  return [...start, ...recent];
}
