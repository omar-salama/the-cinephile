export function StreamingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 text-text-secondary text-sm">
      <span className="italic">Consulting my mental Criterion Collection</span>
      <span className="flex gap-0.5 ml-1">
        <span className="streaming-dot w-1 h-1 rounded-full bg-accent inline-block" />
        <span className="streaming-dot w-1 h-1 rounded-full bg-accent inline-block" />
        <span className="streaming-dot w-1 h-1 rounded-full bg-accent inline-block" />
      </span>
    </div>
  );
}
