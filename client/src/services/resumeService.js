import api from "./api.js";

export const listResumes = () => api.get("/resumes").then((res) => res.data.resumes);

export const createResume = (title) =>
  api.post("/resumes", { title }).then((res) => res.data.resume);

export const deleteResume = (id) => api.delete(`/resumes/${id}`);

export const duplicateResume = (id) =>
  api.post(`/resumes/${id}/duplicate`).then((res) => res.data.resume);
