const FIELDS = [
  { key: "fullName", label: "Full Name" },
  { key: "professionalTitle", label: "Professional Title" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "location", label: "Location" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
  { key: "portfolio", label: "Portfolio" },
];

export default function PersonalInfoStep({ data, onChange }) {
  const set = (key, value) => onChange({ ...data, [key]: value });

  return (
    <div>
      <h2 className="font-display text-xl text-ink">Personal Information</h2>
      <p className="mt-1 text-sm text-ink-muted">
        A profile photo isn't included on purpose — ATS-friendly resumes generally parse better without one.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-4">
        {FIELDS.map(({ key, label }) => (
          <div key={key} className={key === "fullName" || key === "professionalTitle" ? "col-span-2" : ""}>
            <label className="block text-sm font-medium text-ink">{label}</label>
            <input
              value={data?.[key] || ""}
              onChange={(e) => set(key, e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-stamp"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
