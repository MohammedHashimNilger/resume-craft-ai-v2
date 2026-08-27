import { Link } from "react-router-dom";
import {
  FileText,
  Sparkles,
  LayoutTemplate,
  Ruler,
  Target,
  Download,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Resume Builder",
    body: "Generate and refine your summary, experience bullets, and project descriptions with AI — it strengthens your wording, never invents facts you didn't provide.",
  },
  {
    icon: Target,
    title: "ATS Analyzer",
    body: "Get an estimated compatibility score broken down by formatting, keywords, content, skills, and readability, with concrete fixes for each weak spot.",
  },
  {
    icon: LayoutTemplate,
    title: "Professional Templates",
    body: "Four clean, single-column layouts built to parse correctly in applicant tracking systems — no tables, icons, or columns that confuse a resume parser.",
  },
  {
    icon: Ruler,
    title: "One-Page Optimization",
    body: "A built-in check flags content that runs long, with an AI action that tightens your wording to fit one page without dropping anything important.",
  },
  {
    icon: FileText,
    title: "Job Description Matching",
    body: "Paste a job posting to see your match score, which keywords you're missing, and where to strengthen your resume for that specific role.",
  },
  {
    icon: Download,
    title: "PDF Export",
    body: "Export a clean, one-page PDF with selectable text — ready to attach to an application in one click.",
  },
];

const STEPS = [
  { n: "01", title: "Enter your information", body: "Fill in your details step by step — personal info, experience, projects, skills." },
  { n: "02", title: "Improve it with AI", body: "Use AI to sharpen your summary and bullet points, section by section." },
  { n: "03", title: "Check your ATS score", body: "Analyze against real ATS criteria and fix what's holding your score back." },
  { n: "04", title: "Export and apply", body: "Download a one-page, ATS-ready PDF and start applying." },
];

export default function Landing() {
  const { user, loading } = useAuth();
  const primaryTo = !loading && user ? "/dashboard" : "/register";
  const primaryLabel = !loading && user ? "Go to Dashboard" : "Create My Resume";

  return (
    <div className="min-h-screen bg-paper">
      <header className="flex items-center justify-between border-b border-line px-6 py-4">
        <div className="flex items-center gap-2">
          <FileText className="text-stamp" size={20} />
          <span className="font-display text-lg text-ink">Resume Craft AI</span>
        </div>
        {!loading && (
          <Link
            to={user ? "/dashboard" : "/login"}
            className="text-sm font-medium text-ink-muted hover:text-ink"
          >
            {user ? "Dashboard" : "Log in"}
          </Link>
        )}
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-20 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-stamp">
          AI-powered · ATS-friendly · One page, always
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-ink sm:text-5xl">
          Build a Resume That Gets Noticed.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-ink-muted">
          Create a professional, ATS-friendly resume with AI assistance — then analyze it against
          real applicant-tracking criteria before you hit send.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={primaryTo}
            className="flex items-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-stamp"
          >
            {primaryLabel} <ArrowRight size={16} />
          </Link>
          <a
            href="#how-it-works"
            className="rounded-lg border border-line px-5 py-3 text-sm font-medium text-ink transition hover:border-stamp"
          >
            See how it works
          </a>
        </div>
      </section>

      {/* Feature grid */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-card border border-line bg-paper-card p-5">
              <Icon className="text-stamp" size={20} />
              <h3 className="mt-3 font-display text-base text-ink">{title}</h3>
              <p className="mt-1.5 text-sm text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-line bg-paper-card py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center font-display text-2xl text-ink">How it works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.n}>
                <p className="font-mono text-xs text-stamp">{step.n}</p>
                <h3 className="mt-1 font-display text-base text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm text-ink-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h2 className="font-display text-2xl text-ink">Ready to build yours?</h2>
        <p className="mt-2 text-sm text-ink-muted">
          It only takes a few minutes to get a first draft down.
        </p>
        <Link
          to={primaryTo}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-stamp"
        >
          {primaryLabel} <ArrowRight size={16} />
        </Link>
      </section>

      <footer className="border-t border-line px-6 py-6 text-center text-xs text-ink-muted">
        Resume Craft AI — built with the MERN stack and Groq.
      </footer>
    </div>
  );
}
