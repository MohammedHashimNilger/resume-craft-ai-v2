import EntryListEditor from "./EntryListEditor.jsx";
import AiImproveButton from "../AiImproveButton.jsx";
import { improveProject } from "../../services/resumeEditorService.js";

const EMPTY = {
  name: "",
  description: "",
  technologies: "",
  projectUrl: "",
  githubUrl: "",
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

export default function ProjectsStep({ resumeId, projects, onChange }) {
  return (
    <div>
      <h2 className="font-display text-xl text-ink">Projects</h2>
      <p className="mt-1 text-sm text-ink-muted">Personal, academic, or freelance projects worth showing.</p>

      <div className="mt-4">
        <EntryListEditor
          entries={projects}
          onChange={onChange}
          emptyEntry={EMPTY}
          addLabel="Add project"
          renderEntry={(entry, index, update) => (
            <div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Project Name" value={entry.name} onChange={(v) => update({ name: v })} />
                <Field label="Technologies" value={entry.technologies} onChange={(v) => update({ technologies: v })} />
                <Field label="Project URL" value={entry.projectUrl} onChange={(v) => update({ projectUrl: v })} />
                <Field label="GitHub URL" value={entry.githubUrl} onChange={(v) => update({ githubUrl: v })} />
              </div>

              <div className="mt-3">
                <label className="block text-xs font-medium text-ink-muted">Description</label>
                <textarea
                  value={entry.description || ""}
                  onChange={(e) => update({ description: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-line px-2.5 py-1.5 text-sm outline-none focus:border-stamp"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {AI_MODES.map((m) => (
                    <AiImproveButton
                      key={m.key}
                      label={m.label}
                      onGenerate={() => improveProject(resumeId, index, m.key)}
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
