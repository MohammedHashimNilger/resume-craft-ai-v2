import { useState } from "react";
import { X } from "lucide-react";
import AiImproveButton from "../AiImproveButton.jsx";
import { suggestSkills } from "../../services/resumeEditorService.js";

const CATEGORIES = [
  { key: "programmingLanguages", label: "Programming Languages" },
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "databases", label: "Databases" },
  { key: "frameworks", label: "Frameworks" },
  { key: "tools", label: "Tools" },
  { key: "other", label: "Other" },
];

function TagInput({ values, onChange }) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) onChange([...values, trimmed]);
    setDraft("");
  };

  const remove = (tag) => onChange(values.filter((v) => v !== tag));

  return (
    <div className="rounded-md border border-line bg-white px-2 py-1.5">
      <div className="flex flex-wrap gap-1.5">
        {values.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full bg-paper px-2 py-0.5 font-mono text-xs text-ink"
          >
            {tag}
            <button type="button" onClick={() => remove(tag)} aria-label={`Remove ${tag}`}>
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            }
          }}
          onBlur={commit}
          placeholder="Type and press Enter…"
          className="min-w-[120px] flex-1 border-none px-1 py-0.5 text-sm outline-none"
        />
      </div>
    </div>
  );
}

export default function SkillsStep({ resumeId, experience, projects, skills, onChange }) {
  const current = skills || {};

  const setCategory = (key, values) => onChange({ ...current, [key]: values });

  return (
    <div>
      <h2 className="font-display text-xl text-ink">Skills</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Organized by category. AI can suggest skills implied by your experience/projects, but never adds anything you don't approve.
      </p>

      <div className="mt-4 space-y-4">
        {CATEGORIES.map(({ key, label }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-ink-muted">{label}</label>
            <div className="mt-1">
              <TagInput values={current[key] || []} onChange={(values) => setCategory(key, values)} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <AiImproveButton
          label="Suggest skills from my experience"
          onGenerate={() => suggestSkills(resumeId)}
          onAccept={(result) => {
            const additions = result.suggestions || [];
            setCategory("other", [...new Set([...(current.other || []), ...additions])]);
          }}
          renderSuggestion={(result) => (
            <div className="flex flex-wrap gap-1.5">
              {(result.suggestions || []).map((s) => (
                <span key={s} className="rounded-full bg-paper px-2 py-0.5 font-mono text-xs">
                  {s}
                </span>
              ))}
              {(result.suggestions || []).length === 0 && (
                <span className="text-ink-muted">No additional skills found — your list already looks complete.</span>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
}
