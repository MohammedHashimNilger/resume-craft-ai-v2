import EntryListEditor from "./EntryListEditor.jsx";
import AiImproveButton from "../AiImproveButton.jsx";
import { improveExperience } from "../../services/resumeEditorService.js";

const EMPTY = {
  jobTitle: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
};

const AI_MODES = [
  { key: "improve", label: "Improve with AI" },
  { key: "grammar", label: "Fix Grammar" },
  { key: "concise", label: "More Concise" },
  { key: "verbs", label: "Stronger Verbs" },
];

function Field({ label, value, onChange, span }) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <label className="block text-xs font-medium text-ink-muted">{label}</label>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-line px-2.5 py-1.5 text-sm outline-none focus:border-stamp"
      />
    </div>
  );
}

export default function ExperienceStep({ resumeId, experience, onChange }) {
  return (
    <div>
      <h2 className="font-display text-xl text-ink">Experience</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Write what you actually did — use the AI actions below to strengthen it without inventing details.
      </p>

      <div className="mt-4">
        <EntryListEditor
          entries={experience}
          onChange={onChange}
          emptyEntry={EMPTY}
          addLabel="Add experience"
          renderEntry={(entry, index, update) => (
            <div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Job Title" value={entry.jobTitle} onChange={(v) => update({ jobTitle: v })} />
                <Field label="Company" value={entry.company} onChange={(v) => update({ company: v })} />
                <Field label="Location" value={entry.location} onChange={(v) => update({ location: v })} />
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-1.5 pb-1.5 text-xs text-ink-muted">
                    <input
                      type="checkbox"
                      checked={entry.current || false}
                      onChange={(e) => update({ current: e.target.checked })}
                    />
                    Currently working here
                  </label>
                </div>
                <Field label="Start Date" value={entry.startDate} onChange={(v) => update({ startDate: v })} />
                {!entry.current && (
                  <Field label="End Date" value={entry.endDate} onChange={(v) => update({ endDate: v })} />
                )}
              </div>

              <div className="mt-3">
                <label className="block text-xs font-medium text-ink-muted">Description</label>
                <textarea
                  value={entry.description || ""}
                  onChange={(e) => update({ description: e.target.value })}
                  rows={3}
                  placeholder="e.g. worked on the checkout flow, fixed bugs, wrote tests"
                  className="mt-1 w-full rounded-md border border-line px-2.5 py-1.5 text-sm outline-none focus:border-stamp"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {AI_MODES.map((m) => (
                    <AiImproveButton
                      key={m.key}
                      label={m.label}
                      onGenerate={() => improveExperience(resumeId, index, m.key)}
                      onAccept={(result) => update({ description: result.description })}
                      renderSuggestion={(result) => (
                        <pre className="whitespace-pre-wrap font-body text-sm">{result.description}</pre>
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
