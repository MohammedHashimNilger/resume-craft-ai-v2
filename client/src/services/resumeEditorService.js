import api from "./api.js";

export const getResume = (id) => api.get(`/resumes/${id}`).then((res) => res.data.resume);

export const updateResume = (id, updates) =>
  api.put(`/resumes/${id}`, updates).then((res) => res.data.resume);

export const improveSummary = (resumeId, mode) =>
  api.post("/ai/improve-summary", { resumeId, mode }).then((res) => res.data);

export const improveExperience = (resumeId, index, mode = "improve") =>
  api.post("/ai/improve-experience", { resumeId, index, mode }).then((res) => res.data);

export const improveProject = (resumeId, index, mode = "improve") =>
  api.post("/ai/improve-project", { resumeId, index, mode }).then((res) => res.data);

export const suggestSkills = (resumeId) =>
  api.post("/ai/suggest-skills", { resumeId }).then((res) => res.data);

export const optimizeOnePage = (resumeId) =>
  api.post("/ai/optimize-one-page", { resumeId }).then((res) => res.data);

export const analyzeResume = (resumeId) =>
  api.post("/ai/analyze-resume", { resumeId }).then((res) => res.data);

export const jobMatch = (resumeId, jobDescription) =>
  api.post("/ai/job-match", { resumeId, jobDescription }).then((res) => res.data);

export const generateCoverLetter = (resumeId, { jobDescription, companyName, tone }) =>
  api.post("/ai/cover-letter", { resumeId, jobDescription, companyName, tone }).then((res) => res.data);
