import { useState } from "react";
import { AlertTriangle, Sparkles } from "lucide-react";
import { optimizeOnePage } from "../services/resumeEditorService.js";

/**
 * Shows the spec's required warning when content exceeds one page, with
 * an AI shortening action. The AI's shortened version is only applied
 * after the person explicitly confirms — it never overwrites silently.
 */
export default function OnePageWarning({ resumeId, onApply }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOptimize = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await optimizeOnePage(resumeId);
      const confirmed = window.confirm(
        "AI has shortened your summary, experience, and project descriptions to help this fit one page. Apply these changes? You can review and adjust each section afterward."
      );
      if (confirmed) onApply(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-warn/40 bg-warn-light px-4 py-3">
      <p className="flex items-center gap-1.5 text-sm font-medium text-warn">
        <AlertTriangle size={15} /> Your resume is exceeding one page. Let's optimize it.
      </p>
      <button
        type="button"
        onClick={handleOptimize}
        disabled={loading}
        className="mt-2 flex items-center gap-1.5 rounded-md bg-warn px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
      >
        <Sparkles size={13} /> {loading ? "Optimizing…" : "Optimize Resume to One Page"}
      </button>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
