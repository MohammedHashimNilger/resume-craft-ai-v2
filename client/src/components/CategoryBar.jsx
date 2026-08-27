const LABELS = {
  formatting: "Formatting",
  keywords: "Keywords",
  content: "Content Quality",
  skills: "Skills Match",
  readability: "Readability",
};

export default function CategoryBar({ name, value, max = 20 }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const tone = pct >= 80 ? "bg-stamp" : pct >= 50 ? "bg-warn" : "bg-danger";

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink">{LABELS[name] || name}</span>
        <span className="font-mono text-ink-muted">
          {value}/{max}
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div className={`h-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
