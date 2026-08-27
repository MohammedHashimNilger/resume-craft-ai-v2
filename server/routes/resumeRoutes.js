import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getResumes,
  createResume,
  getResumeById,
  updateResume,
  deleteResume,
  duplicateResume,
} from "../controllers/resumeController.js";

const router = express.Router();

router.use(protect); // every resume route requires a logged-in user

router.get("/", getResumes);
router.post("/", createResume);
router.get("/:id", getResumeById);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);
router.post("/:id/duplicate", duplicateResume);

export default router;
