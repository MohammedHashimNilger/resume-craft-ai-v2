import axios from "axios";

// withCredentials lets the browser send/receive the HTTP-only auth cookie.
// Locally, VITE_API_URL is left unset and baseURL falls back to "/api",
// which Vite's dev server proxies to http://localhost:5000 (see
// vite.config.js). In production (client on Vercel, server on Render),
// set VITE_API_URL to the deployed backend's full API URL — there's no
// proxy across separate domains, so the client needs the real address.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Normalize error messages so components can just read err.message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default api;
