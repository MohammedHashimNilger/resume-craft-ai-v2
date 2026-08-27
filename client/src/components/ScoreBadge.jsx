export default function ScoreBadge({ score }) {
  if (score === null || score === undefined) {
    return (
      <span className="rounded-full border border-line px-2.5 py-1 font-mono text-xs text-ink-muted">
        Not analyzed
      </span>
    );
  }

  const tone = score >= 80 ? "stamp" : score >= 50 ? "warn" : "danger";
  const toneClasses = {
    stamp: "bg-stamp-light text-stamp",
    warn: "bg-warn-light text-warn",
    danger: "bg-danger-light text-danger",
  }[tone];

  return (
    <span className={`rounded-full px-2.5 py-1 font-mono text-xs font-medium ${toneClasses}`}>
      ATS {score}/100
    </span>
  );
}
