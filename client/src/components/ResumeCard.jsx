import { Pencil, Copy, Download, Trash2, Sparkles } from "lucide-react";
import ScoreBadge from "./ScoreBadge.jsx";
import { timeAgo } from "../utils/timeAgo.js";

export default function ResumeCard({ resume, onDuplicate, onDelete }) {
  return (
    <div className="rounded-card border border-line bg-paper-card p-5 transition hover:border-stamp/50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg text-ink">{resume.title}</h3>
          <p className="mt-0.5 text-xs text-ink-muted">
            Updated {timeAgo(resume.updatedAt)} · {resume.template || "classic"} template
          </p>
        </div>
        <ScoreBadge score={resume.atsScore} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <a
          href={`/resumes/${resume._id}`}
          className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink transition hover:border-ink"
        >
          <Pencil size={14} /> Edit
        </a>
        <a
          href={`/resumes/${resume._id}/analyze`}
          className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink transition hover:border-ink"
        >
          <Sparkles size={14} /> Analyze
        </a>
        <button
          onClick={() => onDuplicate(resume._id)}
          className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink transition hover:border-ink"
        >
          <Copy size={14} /> Duplicate
        </button>
        <a
          href={`/resumes/${resume._id}/export`}
          className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink transition hover:border-ink"
        >
          <Download size={14} /> Export
        </a>
        <button
          onClick={() => onDelete(resume._id)}
          className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-danger transition hover:bg-danger-light"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}
