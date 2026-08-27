import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { getResume } from "../services/resumeEditorService.js";
import { useOverflowDetector } from "../hooks/useOverflowDetector.js";
import OnePageWarning from "../components/OnePageWarning.jsx";
import FontSizeControl from "../components/FontSizeControl.jsx";
import { updateResume } from "../services/resumeEditorService.js";
import { TEMPLATES } from "../templates/index.js";

function buildFilename(resume) {
  const name = resume.personalInfo?.fullName?.trim() || "Resume";
  return `${name.replace(/\s+/g, "_")}_Resume`;
}

export default function ResumeExport() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");

  const previewRef = useRef(null);
  const isOverflowing = useOverflowDetector(previewRef, [resume]);

  useEffect(() => {
    getResume(id)
      .then(setResume)
      .catch((err) => setError(err.message));
  }, [id]);

  const handleApplyOptimization = async (result) => {
    const updates = {};
    if (result.summary !== undefined) updates.summary = result.summary;
    if (Array.isArray(result.experience)) {
      updates.experience = (resume.experience || []).map((exp, i) => ({
        ...exp,
        description: result.experience[i]?.description ?? exp.description,
      }));
    }
    if (Array.isArray(result.projects)) {
      updates.projects = (resume.projects || []).map((proj, i) => ({
        ...proj,
        description: result.projects[i]?.description ?? proj.description,
      }));
    }
    setResume((prev) => ({ ...prev, ...updates }));
    await updateResume(id, updates);
  };

  const handleFontSizeChange = async (fontSize) => {
    setResume((prev) => ({ ...prev, fontSize }));
    await updateResume(id, { fontSize });
  };

  const handleDownload = () => {
    if (isOverflowing) {
      const proceed = window.confirm(
        "This resume is longer than one page and will print onto multiple pages. Export anyway?"
      );
      if (!proceed) return;
    }
    const previousTitle = document.title;
    document.title = buildFilename(resume); // browsers use the page title as the suggested filename
    window.print();
    document.title = previousTitle;
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-danger">{error}</p>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="font-mono text-sm text-ink-muted">Loading resume…</p>
      </div>
    );
  }

  const Template = TEMPLATES[resume.template] || TEMPLATES.classic;

  return (
    <div className="min-h-screen bg-paper">
      {/* Print CSS: hide everything except the resume itself when printing */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; top: 0; left: 0; }
          @page { size: letter; margin: 0; }
        }
      `}</style>

      <header className="flex items-center justify-between border-b border-line bg-paper-card px-6 py-3 print:hidden">
        <Link to={`/resumes/${id}`} className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft size={16} /> Back to editor
        </Link>
        <span className="font-display text-base text-ink">{resume.title}</span>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-stamp"
        >
          <Download size={16} /> Download PDF
        </button>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 print:max-w-none print:p-0">
        {isOverflowing && (
          <div className="mb-4 print:hidden">
            <OnePageWarning resumeId={id} onApply={handleApplyOptimization} />
          </div>
        )}

        <div className="mb-4 max-w-xs print:hidden">
          <FontSizeControl value={resume.fontSize || "medium"} onChange={handleFontSizeChange} />
        </div>

        <div className="flex justify-center overflow-x-auto print:block print:overflow-visible">
          <div className="print-area shadow-sm print:shadow-none">
            <Template ref={previewRef} resume={resume} fontSize={resume.fontSize || "medium"} printMode />
          </div>
        </div>
      </main>
    </div>
  );
}
