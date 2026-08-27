import EntryListEditor from "./EntryListEditor.jsx";

const EMPTY = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  startDate: "",
  endDate: "",
  gpa: "",
  coursework: "",
};

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

export default function EducationStep({ education, onChange }) {
  return (
    <div>
      <h2 className="font-display text-xl text-ink">Education</h2>
      <p className="mt-1 text-sm text-ink-muted">Add one entry per degree, most recent first.</p>

      <div className="mt-4">
        <EntryListEditor
          entries={education}
          onChange={onChange}
          emptyEntry={EMPTY}
          addLabel="Add education"
          renderEntry={(entry, _i, update) => (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Institution" value={entry.institution} onChange={(v) => update({ institution: v })} span />
              <Field label="Degree" value={entry.degree} onChange={(v) => update({ degree: v })} />
              <Field label="Field of Study" value={entry.fieldOfStudy} onChange={(v) => update({ fieldOfStudy: v })} />
              <Field label="Start Date" value={entry.startDate} onChange={(v) => update({ startDate: v })} />
              <Field label="End Date" value={entry.endDate} onChange={(v) => update({ endDate: v })} />
              <Field label="GPA (optional)" value={entry.gpa} onChange={(v) => update({ gpa: v })} />
              <Field label="Relevant Coursework (optional)" value={entry.coursework} onChange={(v) => update({ coursework: v })} span />
            </div>
          )}
        />
      </div>
    </div>
  );
}
