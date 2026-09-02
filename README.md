# Resume Craft AI v2

AI-powered resume builder and ATS analyzer built on the MERN stack, using Groq for every AI feature — resume writing, ATS scoring, job-description matching, and cover letter generation.

**[Live Demo](https://resume-craft-ai-v2.vercel.app/)** — first load may take ~30s if the backend has gone idle (free-tier hosting).

![Tech Stack](https://img.shields.io/badge/stack-MERN-informational)
![AI](https://img.shields.io/badge/AI-Groq-orange)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Screenshots

| Dashboard | Builder + AI Suggestions |
|---|---|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Builder](docs/screenshots/builder.png) |

| ATS Analyzer | PDF Export |
|---|---|
| ![Analyzer](docs/screenshots/analyzer.png) | ![Export](docs/screenshots/export.png) |

> Screenshots go in `docs/screenshots/` — swap the placeholders above once added. A 15-20s GIF of the builder (typing → "Improve with AI" → accept) sells the product better than any of these individually.

---

## Why this exists

Most resume builders either lock good formatting behind a paywall or produce resumes that fail ATS parsing because they use tables, columns, or graphics. Resume Craft AI generates single-column, ATS-safe layouts by construction, and every AI suggestion — bullet rewrites, summaries, skill suggestions — is generated strictly from what's already in your resume. No fabricated experience, no invented metrics.

---

## Features

**Resume building**
- 8-step guided builder (Personal Info, Summary, Education, Experience, Projects, Skills, Certifications, Achievements) with autosave and live preview
- 4 distinct ATS-safe templates (Classic, Modern, Minimal, Professional) — switching templates never loses content
- Unlimited entries per section with add / remove / reorder
- Adjustable text size (Small/Medium/Large), saved per resume
- One-page overflow detection with an AI-assisted "optimize to one page" action

**AI assistance (Groq)**
- Summary generation in 5 modes (generate, improve, shorten, professional, ATS-optimized)
- Per-bullet actions on Experience/Project entries: Improve, Fix Grammar, More Concise, Stronger Verbs
- Skill suggestions based on your existing experience
- Every prompt enforces an anti-fabrication rule; all AI output is JSON-validated before it touches your resume
- Accept / Regenerate / Cancel on every AI suggestion — nothing auto-overwrites your text

**ATS Analyzer**
- Overall score with category breakdown (formatting, keywords, content, skills, readability)
- Strengths, weaknesses, missing keywords, recommendations
- Job-description match mode: match %, matched skills, missing keywords, targeted suggestions

**Resume Health Check**
- Free, instant, client-side quality pass on every keystroke — no API call, no rate limit
- Flags filler phrases ("Responsible for", "Worked on"), repeated opening verbs, overlong bullets, unquantified bullets, missing sections

**Cover Letter Generator**
- Paste a job description + optional company name, pick a tone (Professional / Enthusiastic / Concise)
- Generated only from what's in your resume — same anti-fabrication rule as the rest of the app
- Editable with autosave, copy to clipboard, download as `.txt`

**Export**
- PDF export via browser print-to-PDF — selectable text preserved (real HTML/CSS, not a rasterized image), auto-suggested filename

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite), Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB (Atlas) |
| Auth | JWT via HTTP-only cookies |
| AI | Groq API (Llama 3.3 70B) |
| Hosting | Vercel (client) + Render (server) — both free tier |

---

## Project Structure

```
resume-craft-ai-v2/
├── client/          # React + Vite frontend
│   ├── src/
│   └── vite.config.js
├── server/          # Express backend
│   ├── models/      # User, Resume
│   ├── routes/      # auth, resumes, ai
│   ├── services/     # Groq AI service
│   └── .env.example
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas connection string
- A Groq API key ([console.groq.com](https://console.groq.com))

### Backend

```bash
cd server
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, GROQ_API_KEY
npm install
npm run dev             # http://localhost:5000
```

### Frontend

```bash
cd client
npm install
npm run dev              # http://localhost:5173, proxies /api to :5000
```

No `client/.env` needed locally — Vite proxies `/api` to `localhost:5000` (see `vite.config.js`). You only need `VITE_API_URL` once client and server are deployed to separate domains.

Register an account at `/register`, then you'll land on `/dashboard`. Create a resume to reach the builder, analyzer, and PDF export.

---

## Deployment (Render + Vercel, both free-tier)

The client and server end up on different domains (`your-app.vercel.app` vs `your-api.onrender.com`), which has two consequences:

1. **The client needs the backend's real URL** — `VITE_API_URL` must point at the deployed Render URL in production.
2. **Auth cookies become cross-site** — a cookie set by `onrender.com` for a page on `vercel.app` requires `SameSite=None; Secure`, which the code sets automatically when `NODE_ENV=production`.

### 1. Backend → Render
1. Push this repo to GitHub, create a **Web Service** on Render pointing at the `server/` directory (root directory: `server`).
2. Build command: `npm install` — Start command: `npm start`.
3. Set environment variables:

```
NODE_ENV=production
MONGODB_URI=<your Atlas connection string>
JWT_SECRET=<a long random string>
JWT_EXPIRES_IN=7d
GROQ_API_KEY=<your Groq key>
GROQ_MODEL=llama-3.3-70b-versatile
CLIENT_URL=https://your-app.vercel.app   # set after step 2, then redeploy
PORT=5000
```

4. Note the resulting URL, e.g. `https://resume-craft-ai-server.onrender.com`.

### 2. Frontend → Vercel
1. Import the repo into Vercel, set the project root to `client/`.
2. Build command: `npm run build` — Output directory: `dist` (auto-detected for Vite).
3. Set an environment variable:

```
VITE_API_URL=https://resume-craft-ai-server.onrender.com/api
```

4. Deploy, then copy the resulting Vercel URL into Render's `CLIENT_URL` and redeploy the backend so CORS allows it.

### Gotchas
- **MongoDB Atlas network access**: allow `0.0.0.0/0` (or Render's IP ranges) in Atlas's Network Access settings.
- **Render free-tier cold starts**: the instance sleeps after inactivity — first request after idle can take 30-60s. A cron ping (e.g. cron-job.org, every 10-14 min) keeps it warm.
- **Vercel preview deployments** get a different URL than `CLIENT_URL`, so auth will fail on previews unless you widen the CORS origin check or add each preview domain.

---

## API Reference

### Auth
```
POST /api/auth/register   { name, email, password, confirmPassword }
POST /api/auth/login      { email, password }
POST /api/auth/logout
GET  /api/auth/me
```

### Resumes (require auth cookie)
```
GET    /api/resumes
POST   /api/resumes
GET    /api/resumes/:id
PUT    /api/resumes/:id
DELETE /api/resumes/:id
POST   /api/resumes/:id/duplicate
```

### AI (require auth cookie, rate-limited to 15/min/user)
```
POST /api/ai/improve-summary     { resumeId, mode }              mode: generate | improve | shorten | professional | ats
POST /api/ai/improve-experience  { resumeId, index, mode }       mode: improve | grammar | concise | verbs
POST /api/ai/improve-project     { resumeId, index, mode }       mode: improve | grammar | concise | verbs
POST /api/ai/suggest-skills      { resumeId }
POST /api/ai/optimize-one-page   { resumeId }
POST /api/ai/analyze-resume      { resumeId }
POST /api/ai/job-match           { resumeId, jobDescription }
POST /api/ai/cover-letter        { resumeId, jobDescription, companyName, tone }   tone: professional | enthusiastic | concise
```

---

## Roadmap

- [ ] Toast notifications (replacing inline error text)
- [ ] Skeleton loaders on builder/analyzer pages
- [ ] Custom confirmation modals (replacing native `confirm()`)
- [ ] Seed/demo data for local development

---

## License

MIT — see [LICENSE](LICENSE).

## Author

**Mohammed Hashim Nilger**
[GitHub](https://github.com/MohammedHashimNilger)
