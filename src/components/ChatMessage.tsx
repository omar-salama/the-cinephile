interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div
      className={`animate-message-in flex ${isUser ? 'justify-end' : 'justify-start'} px-4`}
    >
      <div
        className={`max-w-[95%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
          isUser
            ? 'bg-surface text-text-primary rounded-br-md'
            : 'w-full bg-bg-chat text-text-primary rounded-bl-md border border-border'
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-xs font-medium text-accent">The Cinephile</span>
          </div>
        )}
        <div className="whitespace-pre-wrap break-words">
          {content}
          {isStreaming && (
            <span className="inline-block w-0.5 h-4 bg-accent ml-0.5 align-text-bottom animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
}
