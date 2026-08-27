import EntryListEditor from "./EntryListEditor.jsx";

const EMPTY = { name: "", issuingOrganization: "", date: "", credentialUrl: "" };

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

export default function CertificationsStep({ certifications, onChange }) {
  return (
    <div>
      <h2 className="font-display text-xl text-ink">Certifications</h2>
      <p className="mt-1 text-sm text-ink-muted">Optional — add any relevant certifications or training.</p>

      <div className="mt-4">
        <EntryListEditor
          entries={certifications}
          onChange={onChange}
          emptyEntry={EMPTY}
          addLabel="Add certification"
          renderEntry={(entry, _i, update) => (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Certification Name" value={entry.name} onChange={(v) => update({ name: v })} span />
              <Field label="Issuing Organization" value={entry.issuingOrganization} onChange={(v) => update({ issuingOrganization: v })} />
              <Field label="Date" value={entry.date} onChange={(v) => update({ date: v })} />
              <Field label="Credential URL" value={entry.credentialUrl} onChange={(v) => update({ credentialUrl: v })} span />
            </div>
          )}
        />
      </div>
    </div>
  );
}
