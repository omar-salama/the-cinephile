import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
    el.style.overflowY = el.scrollHeight > 160 ? 'auto' : 'hidden';
  }, [input]);

  // Focus on mount
  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
    // Reset height and scrollbar
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.overflowY = 'hidden';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="shrink-0 sticky bottom-0 border-t border-border bg-bg-primary/90 backdrop-blur-md p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <form onSubmit={handleSubmit} className="flex items-center justify-center gap-2 max-w-3xl mx-auto">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder || "Ask The Cinephile anything..."}
          rows={1}
          maxLength={4000}
          className="flex-1 resize-none bg-surface border border-border rounded-xl px-4 py-3 text-base text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-accent-dim transition-colors duration-200 disabled:opacity-50 overflow-hidden"
          aria-label="Type your message"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-accent text-bg-primary font-semibold text-lg hover:bg-accent-dim transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Send message"
        >
          →
        </button>
      </form>
    </div>
  );
}
