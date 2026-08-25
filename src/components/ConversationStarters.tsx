import { useMemo } from 'react';

import { CONVERSATION_STARTERS } from '../lib/constants';

interface ConversationStartersProps {
  onSelect: (message: string) => void;
  onDefend: () => void;
}

function shuffleAndPick<T>(arr: T[], count: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}

export function ConversationStarters({
  onSelect,
  onDefend,
}: ConversationStartersProps) {
  const starters = useMemo(() => shuffleAndPick(CONVERSATION_STARTERS, 5), []);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto items-center px-4">
      <div className="flex flex-1 flex-col justify-center py-4 max-w-2xl">
        {/* Hero */}
        <div className="mb-6 text-center">
          <div
            className="mb-4 text-5xl"
            role="img"
            aria-label="Film clapperboard"
          >
            🎬
          </div>
          <h1 className="logo-shimmer mb-2 font-serif text-4xl text-accent sm:text-5xl">
            THE CINEPHILE
          </h1>
          <p className="mx-auto max-w-md text-base leading-5 text-text-secondary sm:text-lg">
            An insufferably opinionated film critic who knows more about cinema
            than you do. Probably.
          </p>
        </div>
        {/* Starters */}
        <div className="w-full space-y-2.5">
          {starters.map((starter) => (
            <button
              key={starter}
              onClick={() => onSelect(starter)}
              className="group w-full cursor-pointer rounded-xl border border-border bg-bg-secondary px-4 py-3 text-left text-[15px] text-text-primary transition-all duration-200 hover:border-accent-dim hover:bg-surface"
            >
              <span className="text-accent/70 group-hover:text-accent">"</span>
              {starter}
              <span className="text-accent/70 group-hover:text-accent">"</span>
            </button>
          ))}
        </div>
        {/* Divider */}
        <div className="my-3 flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wider text-text-secondary">
            or
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        {/* Defend */}
        <div className="flex justify-center">
          <button
            onClick={onDefend}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-accent-dim bg-bg-secondary px-5 py-2.5 text-sm font-medium text-accent transition-all duration-200 hover:border-accent hover:bg-surface"
          >
            <span>🎬</span>
            <span>Defend This Film</span>
          </button>
        </div>
      </div>
      <footer className="mb-3 text-center text-xs text-text-secondary/50">
        A fun project · No data stored on servers · Powered by pretentiousness
      </footer>
    </div>
  );
}
