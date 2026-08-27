import express from "express";
import rateLimit from "express-rate-limit";
import { protect } from "../middleware/auth.js";
import {
  improveSummary,
  improveExperience,
  improveProject,
  suggestSkills,
  optimizeOnePage,
  analyzeResume,
  jobMatch,
  generateCoverLetter,
} from "../controllers/aiController.js";

const router = express.Router();

// AI calls cost money and latency — cap each user to a sane rate rather
// than letting the client hammer Groq on every keystroke.
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many AI requests. Please wait a moment and try again." },
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
});

router.use(protect, aiLimiter);

router.post("/improve-summary", improveSummary);
router.post("/improve-experience", improveExperience);
router.post("/improve-project", improveProject);
router.post("/suggest-skills", suggestSkills);
router.post("/optimize-one-page", optimizeOnePage);
router.post("/analyze-resume", analyzeResume);
router.post("/job-match", jobMatch);
router.post("/cover-letter", generateCoverLetter);

export default router;
