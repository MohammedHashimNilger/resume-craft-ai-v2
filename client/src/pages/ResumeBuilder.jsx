import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { getResume, updateResume } from "../services/resumeEditorService.js";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback.js";
import { useOverflowDetector } from "../hooks/useOverflowDetector.js";
import { analyzeResumeHealth } from "../utils/resumeHealthCheck.js";
import OnePageWarning from "../components/OnePageWarning.jsx";
import FontSizeControl from "../components/FontSizeControl.jsx";
import ResumeHealthPanel from "../components/ResumeHealthPanel.jsx";
import PersonalInfoStep from "../components/builder/PersonalInfoStep.jsx";
import SummaryStep from "../components/builder/SummaryStep.jsx";
import EducationStep from "../components/builder/EducationStep.jsx";
import ExperienceStep from "../components/builder/ExperienceStep.jsx";
import ProjectsStep from "../components/builder/ProjectsStep.jsx";
import SkillsStep from "../components/builder/SkillsStep.jsx";
import CertificationsStep from "../components/builder/CertificationsStep.jsx";
import AchievementsStep from "../components/builder/AchievementsStep.jsx";
import { TEMPLATES, TEMPLATE_LABELS } from "../templates/index.js";

const STEPS = [
  { key: "personal", label: "Personal Info" },
  { key: "summary", label: "Summary" },
  { key: "education", label: "Education" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
  { key: "skills", label: "Skills" },
  { key: "certifications", label: "Certifications" },
  { key: "achievements", label: "Achievements" },
];

export default function ResumeBuilder() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState("saved"); // saved | saving

  useEffect(() => {
    getResume(id)
      .then(setResume)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const persist = useCallback(
    async (updates) => {
      setSaveStatus("saving");
      try {
        await updateResume(id, updates);
        setSaveStatus("saved");
      } catch (err) {
        setError(err.message);
      }
    },
    [id]
  );
  const debouncedPersist = useDebouncedCallback(persist, 800);

  const patch = (updates) => {
    setResume((prev) => ({ ...prev, ...updates }));
    debouncedPersist(updates);
  };

  const previewRef = useRef(null);
  const isOverflowing = useOverflowDetector(previewRef, [resume]);
  const health = useMemo(() => analyzeResumeHealth(resume), [resume]);

  const handleApplyOptimization = (result) => {
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
    patch(updates);
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

  const Template = TEMPLATES[resume.template] || TEMPLATES.classic;
  const currentStep = STEPS[stepIndex];

  return (
    <div className="min-h-screen bg-paper">
      <header className="flex items-center justify-between border-b border-line bg-paper-card px-6 py-3">
        <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <input
          value={resume.title}
          onChange={(e) => patch({ title: e.target.value })}
          className="rounded-md border border-transparent bg-transparent px-2 py-1 text-center font-display text-base text-ink outline-none hover:border-line focus:border-stamp"
        />
        <span className="font-mono text-xs text-ink-muted">
          {saveStatus === "saving" ? "Saving…" : "Saved ✓"}
        </span>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-[180px_1fr_460px] gap-6 px-6 py-6">
        <nav className="space-y-1">
          {STEPS.map((step, i) => (
            <button
              key={step.key}
              onClick={() => setStepIndex(i)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                i === stepIndex ? "bg-ink text-paper" : "text-ink-muted hover:bg-paper-card"
              }`}
            >
              {step.label}
            </button>
          ))}

          <div className="pt-4">
            <label className="block px-3 text-xs font-medium uppercase tracking-wide text-ink-muted">
              Template
            </label>
            <select
              value={resume.template}
              onChange={(e) => patch({ template: e.target.value })}
              className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-1.5 text-sm"
            >
              {Object.entries(TEMPLATE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <FontSizeControl
              value={resume.fontSize || "medium"}
              onChange={(fontSize) => patch({ fontSize })}
            />
          </div>
        </nav>

        <div className="rounded-card border border-line bg-paper-card p-6">
          {currentStep.key === "personal" && (
            <PersonalInfoStep
              data={resume.personalInfo}
              onChange={(personalInfo) => patch({ personalInfo })}
            />
          )}
          {currentStep.key === "summary" && (
            <SummaryStep
              resumeId={id}
              summary={resume.summary}
              onChange={(summary) => patch({ summary })}
            />
          )}
          {currentStep.key === "education" && (
            <EducationStep
              education={resume.education}
              onChange={(education) => patch({ education })}
            />
          )}
          {currentStep.key === "experience" && (
            <ExperienceStep
              resumeId={id}
              experience={resume.experience}
              onChange={(experience) => patch({ experience })}
            />
          )}
          {currentStep.key === "projects" && (
            <ProjectsStep
              resumeId={id}
              projects={resume.projects}
              onChange={(projects) => patch({ projects })}
            />
          )}
          {currentStep.key === "skills" && (
            <SkillsStep
              resumeId={id}
              experience={resume.experience}
              projects={resume.projects}
              skills={resume.skills}
              onChange={(skills) => patch({ skills })}
            />
          )}
          {currentStep.key === "certifications" && (
            <CertificationsStep
              certifications={resume.certifications}
              onChange={(certifications) => patch({ certifications })}
            />
          )}
          {currentStep.key === "achievements" && (
            <AchievementsStep
              achievements={resume.achievements}
              onChange={(achievements) => patch({ achievements })}
            />
          )}

          <div className="mt-6 flex justify-between border-t border-line pt-4">
            <button
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              disabled={stepIndex === 0}
              className="flex items-center gap-1 text-sm text-ink-muted disabled:opacity-30"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              onClick={() => setStepIndex((i) => Math.min(STEPS.length - 1, i + 1))}
              disabled={stepIndex === STEPS.length - 1}
              className="flex items-center gap-1 text-sm font-medium text-stamp disabled:opacity-30"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="sticky top-6 self-start">
          <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-wide text-ink-muted">
            Live preview
          </p>
          {isOverflowing && (
            <div className="mb-3">
              <OnePageWarning resumeId={id} onApply={handleApplyOptimization} />
            </div>
          )}
          <Template ref={previewRef} resume={resume} fontSize={resume.fontSize || "medium"} />
          <Link
            to={`/resumes/${id}/export`}
            className="mt-3 block rounded-lg border border-line bg-white px-4 py-2 text-center text-sm font-medium text-ink transition hover:border-stamp"
          >
            Export PDF
          </Link>
          <Link
            to={`/resumes/${id}/cover-letter`}
            className="mt-2 block rounded-lg border border-line bg-white px-4 py-2 text-center text-sm font-medium text-ink transition hover:border-stamp"
          >
            Write a Cover Letter
          </Link>

          <div className="mt-4">
            <ResumeHealthPanel issues={health.issues} />
          </div>
        </div>
      </div>
    </div>
  );
}
