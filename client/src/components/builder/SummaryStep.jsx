import AiImproveButton from "../AiImproveButton.jsx";
import { improveSummary } from "../../services/resumeEditorService.js";

const MODES = [
  { key: "generate", label: "Generate" },
  { key: "improve", label: "Improve" },
  { key: "shorten", label: "Shorten" },
  { key: "professional", label: "More professional" },
  { key: "ats", label: "Make ATS-friendly" },
];

export default function SummaryStep({ resumeId, summary, onChange }) {
  return (
    <div>
      <h2 className="font-display text-xl text-ink">Professional Summary</h2>
      <p className="mt-1 text-sm text-ink-muted">2-4 sentences pitching who you are and what you bring.</p>

      <textarea
        value={summary || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="mt-4 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-stamp"
        placeholder="e.g. Final-year Computer Science student with hands-on experience building and deploying full-stack MERN applications…"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {MODES.map((mode) => (
          <AiImproveButton
            key={mode.key}
            label={mode.label}
            onGenerate={() => improveSummary(resumeId, mode.key)}
            onAccept={(result) => onChange(result.summary)}
            renderSuggestion={(result) => result.summary}
          />
        ))}
      </div>
    </div>
  );
}
