import Resume from "../models/Resume.js";

// Fields a client is allowed to write. Keeping this explicit (instead of
// spreading req.body straight into Mongoose) stops a client from ever
// setting userId, atsScore, or timestamps directly.
const WRITABLE_FIELDS = [
  "title",
  "template",
  "fontSize",
  "personalInfo",
  "summary",
  "education",
  "experience",
  "projects",
  "skills",
  "certifications",
  "achievements",
  "jobDescription",
  "coverLetter",
];

const pickWritableFields = (body) => {
  const update = {};
  for (const field of WRITABLE_FIELDS) {
    if (body[field] !== undefined) update[field] = body[field];
  }
  return update;
};

// @route  GET /api/resumes
export const getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .select("title template updatedAt createdAt atsScore personalInfo.fullName");

    res.status(200).json({ resumes });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/resumes
export const createResume = async (req, res, next) => {
  try {
    const data = pickWritableFields(req.body);

    const resume = await Resume.create({
      ...data,
      userId: req.user._id,
      title: data.title || "Untitled Resume",
    });

    res.status(201).json({ resume });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/resumes/:id
export const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ resume });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/resumes/:id
// Used for both manual edits and autosave — partial updates are fine,
// only fields present in the body get touched.
export const updateResume = async (req, res, next) => {
  try {
    const update = pickWritableFields(req.body);

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ resume });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/resumes/:id
export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ message: "Resume deleted" });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/resumes/:id/duplicate
export const duplicateResume = async (req, res, next) => {
  try {
    const original = await Resume.findOne({ _id: req.params.id, userId: req.user._id }).lean();

    if (!original) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Strip fields that must not be copied verbatim onto a new document
    const { _id, createdAt, updatedAt, __v, ...rest } = original;

    const duplicate = await Resume.create({
      ...rest,
      title: `${original.title} (Copy)`,
      // ATS analysis is specific to the original's content history — the
      // copy starts unanalyzed rather than inheriting a stale score.
      atsScore: null,
      atsAnalysis: undefined,
    });

    res.status(201).json({ resume: duplicate });
  } catch (err) {
    next(err);
  }
};
