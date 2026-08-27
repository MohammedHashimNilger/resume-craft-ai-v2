import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, trim: true },
    degree: { type: String, trim: true },
    fieldOfStudy: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    gpa: { type: String, trim: true },
    coursework: { type: String, trim: true },
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, trim: true },
    company: { type: String, trim: true },
    location: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    current: { type: Boolean, default: false },
    description: { type: String, trim: true }, // stores bullet points, newline-separated
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    technologies: { type: String, trim: true },
    projectUrl: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
  },
  { _id: false }
);

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    issuingOrganization: { type: String, trim: true },
    date: { type: String, trim: true },
    credentialUrl: { type: String, trim: true },
  },
  { _id: false }
);

const personalInfoSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true },
    professionalTitle: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    portfolio: { type: String, trim: true },
  },
  { _id: false }
);

const skillsSchema = new mongoose.Schema(
  {
    programmingLanguages: [{ type: String, trim: true }],
    frontend: [{ type: String, trim: true }],
    backend: [{ type: String, trim: true }],
    databases: [{ type: String, trim: true }],
    tools: [{ type: String, trim: true }],
    frameworks: [{ type: String, trim: true }],
    other: [{ type: String, trim: true }],
  },
  { _id: false }
);

const atsAnalysisSchema = new mongoose.Schema(
  {
    score: { type: Number, min: 0, max: 100 },
    summary: { type: String, trim: true },
    categories: {
      formatting: Number,
      keywords: Number,
      content: Number,
      skills: Number,
      readability: Number,
    },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    missingKeywords: [{ type: String }],
    recommendations: [{ type: String }],
    analyzedAt: { type: Date },
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Resume title is required"],
      trim: true,
      default: "Untitled Resume",
    },
    template: {
      type: String,
      enum: ["classic", "modern", "minimal", "professional"],
      default: "classic",
    },
    fontSize: {
      type: String,
      enum: ["small", "medium", "large"],
      default: "medium",
    },
    personalInfo: personalInfoSchema,
    summary: { type: String, trim: true, default: "" },
    education: [educationSchema],
    experience: [experienceSchema],
    projects: [projectSchema],
    skills: skillsSchema,
    certifications: [certificationSchema],
    achievements: [{ type: String, trim: true }],
    atsScore: { type: Number, min: 0, max: 100, default: null },
    atsAnalysis: atsAnalysisSchema,
    jobDescription: { type: String, trim: true, default: "" },
    coverLetter: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

resumeSchema.index({ userId: 1, updatedAt: -1 });

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
