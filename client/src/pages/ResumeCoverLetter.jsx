import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Copy, Download, Check } from "lucide-react";
import { getResume, updateResume, generateCoverLetter } from "../services/resumeEditorService.js";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback.js";

const TONES = [
  { key: "professional", label: "Professional" },
  { key: "enthusiastic", label: "Enthusiastic" },
  { key: "concise", label: "Concise" },
];

function buildFilename(resume) {
  const name = resume.personalInfo?.fullName?.trim() || "Cover_Letter";
  return `${name.replace(/\s+/g, "_")}_Cover_Letter.txt`;
}

export default function ResumeCoverLetter() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("professional");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  const [letter, setLetter] = useState("");
  const [saveStatus, setSaveStatus] = useState("saved");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getResume(id)
      .then((r) => {
        setResume(r);
        setJobDescription(r.jobDescription || "");
        setLetter(r.coverLetter || "");
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const persistLetter = useDebouncedCallback(async (value) => {
    setSaveStatus("saving");
    try {
      await updateResume(id, { coverLetter: value });
      setSaveStatus("saved");
    } catch (err) {
      setError(err.message);
    }
  }, 800);

  const handleLetterChange = (value) => {
    setLetter(value);
    setSaveStatus("saving");
    persistLetter(value);
  };

  const handleGenerate = async () => {
    if (jobDescription.trim().length < 20) {
      setGenError("Paste a fuller job description (at least a couple sentences).");
      return;
    }
    setGenerating(true);
    setGenError("");
    try {
      const result = await generateCoverLetter(id, { jobDescription, companyName, tone });
      setLetter(result.coverLetter);
      setSaveStatus("saved"); // already persisted server-side by the endpoint
    } catch (err) {
      setGenError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const salutation = companyName ? `Dear ${companyName} Hiring Team,` : "Dear Hiring Manager,";
  const fullLetterText = letter
    ? `${salutation}\n\n${letter}\n\nSincerely,\n${resume?.personalInfo?.fullName || ""}`
    : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullLetterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([fullLetterText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = buildFilename(resume);
    a.click();
    URL.revokeObjectURL(url);
  };

  if (error && !resume) {
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

  return (
    <div className="min-h-screen bg-paper">
      <header className="flex items-center justify-between border-b border-line bg-paper-card px-6 py-3">
        <Link to={`/resumes/${id}`} className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft size={16} /> Back to editor
        </Link>
        <span className="font-display text-base text-ink">Cover Letter</span>
        <span className="font-mono text-xs text-ink-muted">
          {letter ? (saveStatus === "saving" ? "Saving…" : "Saved ✓") : ""}
        </span>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded-card border border-line bg-paper-card p-6">
          <h1 className="font-display text-xl text-ink">Generate a cover letter</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Built only from what's actually in your resume — it won't invent experience or claim
            knowledge of the company you didn't give it.
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-ink-muted">Company Name (optional)</label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-stamp"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-muted">Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
                placeholder="Paste the job description here…"
                className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-stamp"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-muted">Tone</label>
              <div className="mt-1 flex gap-1 rounded-lg border border-line bg-white p-1">
                {TONES.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTone(t.key)}
                    className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
                      tone === t.key ? "bg-ink text-paper" : "text-ink-muted hover:bg-paper"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {genError && <p className="text-sm text-danger">{genError}</p>}

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-stamp disabled:opacity-60"
            >
              <Sparkles size={16} /> {generating ? "Writing…" : letter ? "Regenerate" : "Generate Cover Letter"}
            </button>
          </div>
        </div>

        {letter && (
          <div className="mt-6 rounded-card border border-line bg-paper-card p-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-display text-lg text-ink">Your letter</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs font-medium text-ink transition hover:border-stamp"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs font-medium text-ink transition hover:border-stamp"
                >
                  <Download size={13} /> Download .txt
                </button>
              </div>
            </div>
            <p className="mb-2 text-xs text-ink-muted">
              Editable — your changes autosave. The salutation and sign-off above are added
              automatically from your name so they stay consistent if you regenerate.
            </p>
            <p className="mb-1 text-sm text-ink">{salutation}</p>
            <textarea
              value={letter}
              onChange={(e) => handleLetterChange(e.target.value)}
              rows={14}
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm leading-relaxed outline-none focus:border-stamp"
            />
            <p className="mt-1 text-sm text-ink">Sincerely,<br />{resume.personalInfo?.fullName}</p>
          </div>
        )}
      </main>
    </div>
  );
}
