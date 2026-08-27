// Must be the FIRST import so dotenv is loaded before modules that read
// process.env at module-evaluation time (e.g. groqService's Groq client).
import "./config/env.js";
import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

connectDB();

const app = express();

// Render (and most PaaS hosts) sit behind a reverse proxy that terminates
// TLS. Without this, Express thinks every request is plain HTTP and
// refuses to set cookies flagged `secure`, silently breaking login.
app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://resume-craft-ai-v2.onrender.com",
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);
// PDF export is client-side (browser print) — no backend route needed.

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
