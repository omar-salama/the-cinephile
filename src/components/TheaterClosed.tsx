interface TheaterClosedProps {
  onNewChat: () => void;
}

export function TheaterClosed({ onNewChat }: TheaterClosedProps) {
  // Calculate progress to midnight UTC
  const now = new Date();
  const hoursElapsed = now.getUTCHours() + now.getUTCMinutes() / 60;
  const progress = Math.round((hoursElapsed / 24) * 100);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center">
      <div className="text-5xl mb-6">🎬</div>
      <h2 className="font-serif text-3xl text-accent mb-4">INTERMISSION</h2>
      <p className="text-text-secondary text-base max-w-md leading-relaxed mb-6">
        The Cinephile has screened too many films today and has retired to a darkened room to contemplate Bergman. The projection booth reopens at midnight UTC.
      </p>

      {/* Progress bar */}
      <div className="w-64 mb-2">
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <p className="text-text-secondary/50 text-xs mb-8">
        {progress}% of day elapsed
      </p>

      <button
        onClick={onNewChat}
        className="text-sm text-text-secondary hover:text-text-primary border border-border hover:border-accent-dim rounded-lg px-4 py-2 transition-all duration-200 cursor-pointer"
      >
        Clear & Try Again
      </button>
    </div>
  );
}
