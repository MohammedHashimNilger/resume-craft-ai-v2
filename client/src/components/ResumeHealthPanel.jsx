import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";

export default function ResumeHealthPanel({ issues }) {
  return (
    <div className="rounded-card border border-line bg-paper-card p-4">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-ink-muted">
        Resume Health Check
      </p>
      {issues.length === 0 ? (
        <p className="flex items-center gap-1.5 text-sm text-stamp">
          <CheckCircle2 size={15} /> No issues found — looking solid.
        </p>
      ) : (
        <ul className="space-y-2">
          {issues.map((issue, i) => (
            <li
              key={i}
              className={`flex items-start gap-1.5 text-xs ${
                issue.severity === "warning" ? "text-warn" : "text-ink-muted"
              }`}
            >
              {issue.severity === "warning" ? (
                <AlertTriangle size={13} className="mt-0.5 shrink-0" />
              ) : (
                <Info size={13} className="mt-0.5 shrink-0" />
              )}
              <span>{issue.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
