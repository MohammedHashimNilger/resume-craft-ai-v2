import Resume from "../models/Resume.js";
import * as groqService from "../services/groqService.js";

// Shared helper: load a resume the user owns, or throw a 404-shaped error.
async function getOwnedResume(resumeId, userId) {
  const resume = await Resume.findOne({ _id: resumeId, userId });
  if (!resume) {
    const err = new Error("Resume not found");
    err.statusCode = 404;
    throw err;
  }
  return resume;
}

// @route  POST /api/ai/improve-summary
// body: { resumeId, mode }  mode: generate | improve | shorten | professional | ats
export const improveSummary = async (req, res, next) => {
  try {
    const { resumeId, mode = "improve" } = req.body;
    const resume = await getOwnedResume(resumeId, req.user._id);

    const result = await groqService.improveSummary({
      currentSummary: resume.summary,
      personalInfo: resume.personalInfo,
      experience: resume.experience,
      skills: resume.skills,
      mode,
    });

    // Suggestion only — the client shows Accept/Regenerate before saving
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/ai/improve-experience
// body: { resumeId, index, mode }  mode: improve | grammar | concise | verbs
export const improveExperience = async (req, res, next) => {
  try {
    const { resumeId, index, mode = "improve" } = req.body;
    const resume = await getOwnedResume(resumeId, req.user._id);
    const entry = resume.experience?.[index];

    if (!entry) {
      return res.status(400).json({ message: "Invalid experience entry index" });
    }

    const result = await groqService.improveExperience({
      jobTitle: entry.jobTitle,
      company: entry.company,
      description: entry.description,
      mode,
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/ai/improve-project
// body: { resumeId, index, mode }  mode: improve | grammar | concise | verbs
export const improveProject = async (req, res, next) => {
  try {
    const { resumeId, index, mode = "improve" } = req.body;
    const resume = await getOwnedResume(resumeId, req.user._id);
    const entry = resume.projects?.[index];

    if (!entry) {
      return res.status(400).json({ message: "Invalid project entry index" });
    }

    const result = await groqService.improveProject({
      name: entry.name,
      technologies: entry.technologies,
      description: entry.description,
      mode,
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/ai/suggest-skills
// body: { resumeId }
export const suggestSkills = async (req, res, next) => {
  try {
    const { resumeId } = req.body;
    const resume = await getOwnedResume(resumeId, req.user._id);

    const result = await groqService.suggestSkills({
      experience: resume.experience,
      projects: resume.projects,
      existingSkills: resume.skills,
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/ai/optimize-one-page
// body: { resumeId }
export const optimizeOnePage = async (req, res, next) => {
  try {
    const { resumeId } = req.body;
    const resume = await getOwnedResume(resumeId, req.user._id);

    const result = await groqService.optimizeOnePage({
      resumeContent: {
        summary: resume.summary,
        experience: resume.experience,
        projects: resume.projects,
      },
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/ai/analyze-resume
// body: { resumeId }
export const analyzeResume = async (req, res, next) => {
  try {
    const { resumeId } = req.body;
    const resume = await getOwnedResume(resumeId, req.user._id);

    const analysis = await groqService.analyzeResume({
      resumeContent: {
        personalInfo: resume.personalInfo,
        summary: resume.summary,
        education: resume.education,
        experience: resume.experience,
        projects: resume.projects,
        skills: resume.skills,
        certifications: resume.certifications,
        achievements: resume.achievements,
      },
    });

    // Persist the score/analysis on the resume itself — this is what makes
    // the dashboard's "ATS Score: 87" real instead of hardcoded.
    resume.atsScore = analysis.score;
    resume.atsAnalysis = { ...analysis, analyzedAt: new Date() };
    await resume.save();

    res.status(200).json({ atsScore: resume.atsScore, atsAnalysis: resume.atsAnalysis });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/ai/cover-letter
// body: { resumeId, jobDescription, companyName, tone }  tone: professional | enthusiastic | concise
export const generateCoverLetter = async (req, res, next) => {
  try {
    const { resumeId, jobDescription, companyName, tone = "professional" } = req.body;

    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({ message: "Please paste a fuller job description" });
    }

    const resume = await getOwnedResume(resumeId, req.user._id);

    const result = await groqService.generateCoverLetter({
      personalInfo: resume.personalInfo,
      summary: resume.summary,
      experience: resume.experience,
      projects: resume.projects,
      skills: resume.skills,
      jobDescription,
      companyName,
      tone,
    });

    // Persisted so it's there if the person navigates away and comes back —
    // same pattern as jobDescription on the job-match endpoint.
    resume.coverLetter = result.coverLetter;
    resume.jobDescription = jobDescription;
    await resume.save();

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
// @route  POST /api/ai/job-match
// body: { resumeId, jobDescription }
export const jobMatch = async (req, res, next) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({ message: "Please paste a fuller job description" });
    }

    const resume = await getOwnedResume(resumeId, req.user._id);

    const result = await groqService.analyzeJobMatch({
      resumeContent: {
        summary: resume.summary,
        experience: resume.experience,
        projects: resume.projects,
        skills: resume.skills,
      },
      jobDescription,
    });

    resume.jobDescription = jobDescription;
    await resume.save();

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
