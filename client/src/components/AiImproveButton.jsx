import { useState } from "react";
import { Sparkles, Check, RefreshCw, X } from "lucide-react";

/**
 * Renders a "✨ Improve with AI" trigger. On click it calls `onGenerate`
 * (which should hit an /api/ai/* endpoint) and shows the suggestion with
 * Accept / Regenerate / Cancel — never overwrites the original silently.
 */
export default function AiImproveButton({ label = "Improve with AI", onGenerate, onAccept, renderSuggestion }) {
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [suggestion, setSuggestion] = useState(null);
  const [error, setError] = useState("");

  const run = async () => {
    setStatus("loading");
    setError("");
    try {
      const result = await onGenerate();
      setSuggestion(result);
      setStatus("ready");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const accept = () => {
    onAccept(suggestion);
    setStatus("idle");
    setSuggestion(null);
  };

  const cancel = () => {
    setStatus("idle");
    setSuggestion(null);
  };

  if (status === "idle" || status === "error") {
    return (
      <div>
        <button
          type="button"
          onClick={run}
          className="flex items-center gap-1.5 rounded-lg border border-stamp/40 bg-stamp-light px-3 py-1.5 text-xs font-medium text-stamp transition hover:border-stamp"
        >
          <Sparkles size={13} /> {label}
        </button>
        {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
      </div>
    );
  }

  if (status === "loading") {
    return (
      <p className="flex items-center gap-1.5 font-mono text-xs text-ink-muted">
        <Sparkles size={13} className="animate-pulse" /> AI is working…
      </p>
    );
  }

  // status === "ready"
  return (
    <div className="rounded-lg border border-stamp/40 bg-stamp-light p-3">
      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wide text-stamp">
        AI suggestion ready
      </p>
      <div className="rounded-md bg-white p-2.5 text-sm text-ink">{renderSuggestion(suggestion)}</div>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={accept}
          className="flex items-center gap-1 rounded-md bg-stamp px-2.5 py-1 text-xs font-medium text-white"
        >
          <Check size={13} /> Accept
        </button>
        <button
          type="button"
          onClick={run}
          className="flex items-center gap-1 rounded-md border border-line px-2.5 py-1 text-xs font-medium text-ink"
        >
          <RefreshCw size={13} /> Regenerate
        </button>
        <button
          type="button"
          onClick={cancel}
          className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-ink-muted"
        >
          <X size={13} /> Cancel
        </button>
      </div>
    </div>
  );
}
