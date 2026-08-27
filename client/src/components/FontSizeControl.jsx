import { FONT_SIZE_LABELS } from "../templates/templateHelpers.jsx";

export default function FontSizeControl({ value, onChange }) {
  return (
    <div>
      <label className="block px-3 text-xs font-medium uppercase tracking-wide text-ink-muted">
        Text Size
      </label>
      <div className="mt-1 flex gap-1 rounded-lg border border-line bg-white p-1">
        {Object.entries(FONT_SIZE_LABELS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
              value === key ? "bg-ink text-paper" : "text-ink-muted hover:bg-paper"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="mt-1 px-3 text-[10px] text-ink-muted">
        Larger text may push content past one page — check the preview.
      </p>
    </div>
  );
}
