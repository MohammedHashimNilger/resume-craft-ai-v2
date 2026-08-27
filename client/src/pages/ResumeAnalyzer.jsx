import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertTriangle, Sparkles, Target, FileText } from "lucide-react";
import { getResume } from "../services/resumeEditorService.js";
import { analyzeResume, jobMatch } from "../services/resumeEditorService.js";
import ScoreDisplay from "../components/ScoreDisplay.jsx";
import CategoryBar from "../components/CategoryBar.jsx";

const ANALYZING_MESSAGES = [
  "Checking formatting…",
  "Analyzing keywords…",
  "Checking content…",
  "Generating recommendations…",
];

export default function ResumeAnalyzer() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingMessage, setAnalyzingMessage] = useState(ANALYZING_MESSAGES[0]);
  const [analysis, setAnalysis] = useState(null);

  const [jobDescription, setJobDescription] = useState("");
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [matchError, setMatchError] = useState("");

  useEffect(() => {
    getResume(id)
      .then((r) => {
        setResume(r);
        if (r.atsScore != null && r.atsAnalysis) {
          setAnalysis(r.atsAnalysis);
        }
        setJobDescription(r.jobDescription || "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const runAnalysis = async () => {
    setAnalyzing(true);
    setError("");
    let messageIndex = 0;
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % ANALYZING_MESSAGES.length;
      setAnalyzingMessage(ANALYZING_MESSAGES[messageIndex]);
    }, 900);

    try {
      const result = await analyzeResume(id);
      setAnalysis(result.atsAnalysis);
    } catch (err) {
      setError(err.message);
    } finally {
      clearInterval(interval);
      setAnalyzing(false);
      setAnalyzingMessage(ANALYZING_MESSAGES[0]);
    }
  };

  const runJobMatch = async () => {
    if (jobDescription.trim().length < 20) {
      setMatchError("Paste a fuller job description (at least a couple sentences).");
      return;
    }
    setMatching(true);
    setMatchError("");
    try {
      const result = await jobMatch(id, jobDescription);
      setMatchResult(result);
    } catch (err) {
      setMatchError(err.message);
    } finally {
      setMatching(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="font-mono text-sm text-ink-muted">Loading resume…</p>
      </div>
    );
  }

  if (error && !resume) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="flex items-center justify-between border-b border-line bg-paper-card px-6 py-3">
        <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <span className="font-display text-base text-ink">{resume.title}</span>
        <Link to={`/resumes/${id}`} className="text-sm text-stamp hover:underline">
          Edit resume
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-card border border-line bg-paper-card p-6">
          <p className="mb-4 text-xs text-ink-muted">
            The ATS score is an estimated compatibility score, not a guarantee of how any specific
            company's real ATS will read this resume. Real ATS systems vary widely.
          </p>

          {!analysis && !analyzing && (
            <button
              onClick={runAnalysis}
              className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-stamp"
            >
              <Sparkles size={16} /> Analyze this resume
            </button>
          )}

          {analyzing && (
            <div className="flex items-center gap-2 font-mono text-sm text-ink-muted">
              <Sparkles size={16} className="animate-pulse text-stamp" /> {analyzingMessage}
            </div>
          )}

          {error && <p className="mt-3 text-sm text-danger">{error}</p>}

          {analysis && !analyzing && (
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <ScoreDisplay score={analysis.score} />
                <div className="flex-1">
                  <p className="text-sm text-ink">{analysis.summary}</p>
                  <div className="mt-4 space-y-2.5">
                    {Object.entries(analysis.categories || {}).map(([key, value]) => (
                      <CategoryBar key={key} name={key} value={value} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold text-stamp">
                    <CheckCircle2 size={15} /> Strengths
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-ink">
                    {(analysis.strengths || []).map((s, i) => (
                      <li key={i}>✓ {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold text-warn">
                    <AlertTriangle size={15} /> Needs Improvement
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-ink">
                    {(analysis.weaknesses || []).map((w, i) => (
                      <li key={i}>⚠ {w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {(analysis.missingKeywords || []).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-ink">Missing Keywords</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {analysis.missingKeywords.map((k) => (
                      <span key={k} className="rounded-full bg-warn-light px-2.5 py-1 font-mono text-xs text-warn">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(analysis.recommendations || []).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-ink">Recommended Actions</h3>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-ink">
                    {analysis.recommendations.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ol>
                </div>
              )}

              <button
                onClick={runAnalysis}
                className="text-sm font-medium text-stamp hover:underline"
              >
                Re-analyze
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-card border border-line bg-paper-card p-6">
          <h2 className="flex items-center gap-1.5 font-display text-lg text-ink">
            <Target size={17} className="text-stamp" /> Optimize for a Job Description
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Paste a job posting to see how well this resume matches it.
          </p>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            placeholder="Paste the job description here…"
            className="mt-3 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-stamp"
          />

          {matchError && <p className="mt-2 text-sm text-danger">{matchError}</p>}

          <button
            onClick={runJobMatch}
            disabled={matching}
            className="mt-3 flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink transition hover:border-stamp disabled:opacity-60"
          >
            <Sparkles size={15} /> {matching ? "Comparing…" : "Compare to resume"}
          </button>

          {matchResult && (
            <div className="mt-5 space-y-4 border-t border-line pt-4">
              <p className="font-mono text-sm text-ink">
                Job Match Score: <span className="font-semibold text-stamp">{matchResult.matchScore}%</span>
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold text-stamp">Matched Skills</h3>
                  <ul className="mt-1.5 space-y-1 text-sm text-ink">
                    {(matchResult.matchedSkills || []).map((s, i) => (
                      <li key={i}>✓ {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-warn">Missing / Weak Keywords</h3>
                  <ul className="mt-1.5 space-y-1 text-sm text-ink">
                    {(matchResult.missingKeywords || []).map((k, i) => (
                      <li key={i}>• {k}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {(matchResult.suggestions || []).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-ink">Suggestions</h3>
                  <ol className="mt-1.5 list-decimal space-y-1 pl-5 text-sm text-ink">
                    {matchResult.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </div>
              )}

              <Link
                to={`/resumes/${id}/cover-letter`}
                className="flex items-center gap-1.5 text-sm font-medium text-stamp hover:underline"
              >
                <FileText size={15} /> Write a cover letter for this role
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
