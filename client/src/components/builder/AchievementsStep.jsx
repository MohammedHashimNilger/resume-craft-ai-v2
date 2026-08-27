import { Plus, Trash2 } from "lucide-react";

export default function AchievementsStep({ achievements, onChange }) {
  const list = achievements || [];

  const update = (index, value) => {
    const next = [...list];
    next[index] = value;
    onChange(next);
  };

  const remove = (index) => onChange(list.filter((_, i) => i !== index));
  const add = () => onChange([...list, ""]);

  return (
    <div>
      <h2 className="font-display text-xl text-ink">Achievements & Additional Info</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Optional — awards, publications, volunteer work, languages, interests. Keep this section light so the resume stays one page.
      </p>

      <div className="mt-4 space-y-2">
        {list.map((line, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              value={line}
              onChange={(e) => update(index, e.target.value)}
              placeholder="e.g. Solved 1,000+ problems on a competitive programming platform"
              className="flex-1 rounded-md border border-line bg-white px-2.5 py-1.5 text-sm outline-none focus:border-stamp"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="rounded p-1.5 text-danger hover:bg-danger-light"
              aria-label="Remove"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-2 text-sm text-ink-muted transition hover:border-stamp hover:text-stamp"
        >
          <Plus size={15} /> Add line
        </button>
      </div>
    </div>
  );
}
