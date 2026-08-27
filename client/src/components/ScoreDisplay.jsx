function scoreTone(score) {
  if (score >= 80) return { label: "Excellent", color: "text-stamp", bg: "bg-stamp-light" };
  if (score >= 60) return { label: "Good", color: "text-warn", bg: "bg-warn-light" };
  return { label: "Needs work", color: "text-danger", bg: "bg-danger-light" };
}

export default function ScoreDisplay({ score }) {
  const tone = scoreTone(score);
  return (
    <div className={`flex flex-col items-center justify-center rounded-card ${tone.bg} px-8 py-6`}>
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">ATS Score</p>
      <p className={`font-display text-5xl font-semibold ${tone.color}`}>{score}</p>
      <p className="text-xs text-ink-muted">out of 100</p>
      <p className={`mt-2 text-sm font-medium ${tone.color}`}>{tone.label}</p>
    </div>
  );
}
