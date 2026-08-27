import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

/**
 * Renders a list of entries with add/remove/reorder controls.
 * `renderEntry(entry, index, updateEntry)` renders the fields for one entry.
 */
export default function EntryListEditor({ entries, onChange, emptyEntry, addLabel, renderEntry }) {
  const list = entries || [];

  const updateEntry = (index, updates) => {
    const next = [...list];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  };

  const removeEntry = (index) => {
    onChange(list.filter((_, i) => i !== index));
  };

  const addEntry = () => {
    onChange([...list, { ...emptyEntry }]);
  };

  const moveEntry = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    const next = [...list];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {list.map((entry, index) => (
        <div key={index} className="rounded-lg border border-line bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">
              Entry {index + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveEntry(index, -1)}
                disabled={index === 0}
                className="rounded p-1 text-ink-muted hover:bg-paper disabled:opacity-30"
                aria-label="Move up"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => moveEntry(index, 1)}
                disabled={index === list.length - 1}
                className="rounded p-1 text-ink-muted hover:bg-paper disabled:opacity-30"
                aria-label="Move down"
              >
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                onClick={() => removeEntry(index)}
                className="rounded p-1 text-danger hover:bg-danger-light"
                aria-label="Remove entry"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          {renderEntry(entry, index, (updates) => updateEntry(index, updates))}
        </div>
      ))}

      <button
        type="button"
        onClick={addEntry}
        className="flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-2 text-sm text-ink-muted transition hover:border-stamp hover:text-stamp"
      >
        <Plus size={15} /> {addLabel}
      </button>
    </div>
  );
}
