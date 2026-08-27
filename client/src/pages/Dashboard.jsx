import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { listResumes, createResume, deleteResume, duplicateResume } from "../services/resumeService.js";
import ResumeCard from "../components/ResumeCard.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const loadResumes = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listResumes();
      setResumes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const resume = await createResume("Untitled Resume");
      // Once the builder route exists this navigates straight into it;
      // for now, refresh the list so the new resume is visible.
      navigate(`/resumes/${resume._id}`);
    } catch (err) {
      setError(err.message);
      setCreating(false);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await duplicateResume(id);
      loadResumes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resume? This can't be undone.")) return;
    try {
      await deleteResume(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-paper-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="text-stamp" size={20} />
            <span className="font-display text-lg text-ink">Resume Craft AI</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink-muted">{user?.name}</span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-ink-muted transition hover:text-ink"
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-ink">
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              {resumes.length} resume{resumes.length === 1 ? "" : "s"}
            </p>
          </div>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-stamp disabled:opacity-60"
          >
            <Plus size={16} /> {creating ? "Creating…" : "Create new resume"}
          </button>
        </div>

        {error && (
          <p className="mt-6 rounded-lg bg-danger-light px-4 py-3 text-sm text-danger">{error}</p>
        )}

        <div className="mt-8">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-card bg-paper-card" />
              ))}
            </div>
          ) : resumes.length === 0 ? (
            <div className="rounded-card border border-dashed border-line py-16 text-center">
              <FileText className="mx-auto text-ink-muted" size={28} />
              <p className="mt-3 font-display text-lg text-ink">No resumes yet</p>
              <p className="mt-1 text-sm text-ink-muted">
                Create your first resume to get started — you can build it in minutes.
              </p>
              <button
                onClick={handleCreate}
                className="mt-5 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-stamp"
              >
                Create your first resume
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume._id}
                  resume={resume}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
