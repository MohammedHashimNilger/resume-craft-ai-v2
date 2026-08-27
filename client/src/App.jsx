import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ResumeBuilder from "./pages/ResumeBuilder.jsx";
import ResumeAnalyzer from "./pages/ResumeAnalyzer.jsx";
import ResumeExport from "./pages/ResumeExport.jsx";
import ResumeCoverLetter from "./pages/ResumeCoverLetter.jsx";
import Landing from "./pages/Landing.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resumes/:id"
        element={
          <ProtectedRoute>
            <ResumeBuilder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resumes/:id/analyze"
        element={
          <ProtectedRoute>
            <ResumeAnalyzer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resumes/:id/export"
        element={
          <ProtectedRoute>
            <ResumeExport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resumes/:id/cover-letter"
        element={
          <ProtectedRoute>
            <ResumeCoverLetter />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Landing />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
