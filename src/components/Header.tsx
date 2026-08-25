interface HeaderProps {
  hasMessages: boolean;
  onNewChat: () => void;
}

export function Header({ hasMessages, onNewChat }: HeaderProps) {
  return (
    <header className="shrink-0 sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-border bg-bg-primary/80 backdrop-blur-md">
      <div onClick={onNewChat} className="flex items-center gap-2 cursor-pointer">
        <span className="text-xl" role="img" aria-label="Film">🎬</span>
        <h1 className="font-serif text-xl text-accent tracking-wide logo-shimmer">
          THE CINEPHILE
        </h1>
      </div>
      {hasMessages && (
        <button
          onClick={onNewChat}
          className="text-sm text-text-secondary hover:text-text-primary border border-border hover:border-accent-dim rounded-lg px-3 py-1.5 transition-all duration-200 cursor-pointer"
          aria-label="Start a new conversation"
        >
          New Chat
        </button>
      )}
    </header>
  );
}
