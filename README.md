# Resume Craft AI v2

AI-powered ATS resume builder + analyzer (MERN + Groq).

## Status
**Backend** — done for now:
- Folder structure, MongoDB connection, User + Resume models
- JWT auth (register/login/logout/me) via HTTP-only cookies
- Resume CRUD (list/create/get/update/delete/duplicate), scoped to req.user
- Groq AI service: summary, experience/project bullet improvement, skill
  suggestions, one-page optimization, ATS analysis, job-description match —
  every prompt enforces an anti-fabrication rule, AI JSON is validated
- AI routes, rate-limited per user

**Frontend** — in progress:
- [x] Vite + React + Tailwind, design tokens (paper/ink/stamp palette,
      Fraunces/Inter/IBM Plex Mono type system)
- [x] Auth context + protected routes
- [x] Login / Register pages
- [x] Dashboard: resume list, create, duplicate, delete, empty state,
      loading skeleton, real ATS score badges (not hardcoded)
- [x] Resume builder shell: step nav, autosave (debounced), live preview
      panel, template switcher
- [x] All 8 builder steps: Personal Info, Summary, Education, Experience,
      Projects, Skills, Certifications, Achievements
- [x] AI wired into every step that calls for it: Summary (5 modes),
      per-entry "Improve with AI" on Experience and Project bullets,
      "Suggest skills from my experience" — all Accept / Regenerate /
      Cancel, nothing auto-overwrites your text
- [x] Education/Experience/Projects/Certifications support unlimited
      entries with add / remove / reorder
- [x] Skills step: tag input per category (Programming Languages,
      Frontend, Backend, Databases, Frameworks, Tools, Other)
- [x] ATS analyzer page: score display, category bars (formatting/
      keywords/content/skills/readability), strengths, weaknesses,
      missing keywords, recommendations, re-analyze — plus a separate
      job-description match section (match %, matched skills, missing
      keywords, suggestions)
- [x] One-page overflow detection (compares rendered content height to
      page height) — shown on both the builder and export pages as the
      spec's "Your resume is exceeding one page" warning, with an
      "Optimize Resume to One Page" action that requires explicit
      confirmation before applying AI's shortened version
- [x] PDF export via the browser's native print-to-PDF (chosen over a
      server-side headless-Chrome approach — lighter to keep working on
      free-tier hosting). Print CSS isolates just the resume, suggests
      "Name_Resume" as the filename, selectable text preserved since
      it's real HTML/CSS, not a rasterized image
- [x] All 4 templates are real, distinct layouts (all single-column,
      standard section names, no graphics/tables — ATS-safe):
      Classic (traditional), Modern (teal accent + tag-style skills),
      Minimal (plainest possible, most ATS-focused), Professional
      (bordered header block, corporate style). Switching templates in
      the builder never loses content — they all read the same schema.
- [x] Landing page: hero, 6-feature grid, "how it works" (4 steps), CTA
      that adapts to auth state ("Create My Resume" when logged out,
      "Go to Dashboard" when logged in)
- [x] Fixed a real overflow bug: long job titles, degree names, or URLs
      could push past the page edge because flex rows didn't shrink or
      wrap. Every title/date row now uses `min-w-0 flex-1` on the label
      and `shrink-0` on the date, `break-words` is set at the page-container
      level (inherited by everything inside), and `overflow-x-hidden` is
      a hard backstop. Bullet parsing also now strips numbered-list
      markers ("1.", "1)") in addition to •/-/*, so AI output that comes
      back numbered still renders as clean bullets.
- [x] Text size control (Small/Medium/Large), saved per resume
      (`fontSize` field). All four templates are built with em-relative
      sizing off one base value set via inline style, so changing it
      scales the whole layout proportionally instead of just one
      element. Available in the builder sidebar and on the export page.
- [x] Tightened every AI prompt (summary, experience bullets, project
      bullets, one-page optimization): explicit word budgets so bullets
      can't run into multi-line paragraphs, a banned-phrase list ("Worked
      on", "Responsible for", "Duties included"), a requirement to vary
      the opening action verb within an entry, and no markdown/numbering
      in the output.

**All items from the original spec are now built**, including the landing
page. What's realistically still worth doing before treating this as
portfolio/production-ready:
- Toast notifications (errors currently show as inline red text, which
  works but isn't as polished as the spec's toast-based UX)
- Skeleton loaders beyond the dashboard (builder/analyzer just show a
  plain "Loading…" line)
- Confirmation dialogs currently use the browser's native confirm() —
  fine functionally, but a custom modal would look more finished
- Demo/seed data for local development

## New since last pass — extra features beyond the original spec

- **Resume Health Check** (`utils/resumeHealthCheck.js`): a free, instant,
  client-side quality pass that runs on every keystroke — no API call,
  no rate limit. Flags weak filler phrases ("Responsible for", "Worked
  on"), repeated opening verbs across bullets, overlong bullets (25+
  words), missing summary/skills/contact info, and bullets with zero
  quantification (a nudge, not a demand). Shown in the builder sidebar
  below the live preview. This complements — doesn't replace — the
  AI-based ATS Analyzer, which still does the deeper, holistic scoring.
- **More AI actions on Experience/Project bullets**: previously only
  "Improve with AI". Now: Improve, Fix Grammar (light-touch, preserves
  facts/structure exactly), More Concise, and Stronger Verbs (minimal
  edit, just swaps weak/repeated verbs) — matching what the original
  spec's AI Assistant section asked for.
- **Cover Letter Generator** (`/resumes/:id/cover-letter`): paste a job
  description + optional company name, pick a tone (Professional /
  Enthusiastic / Concise), generate a letter built only from what's
  actually in the resume — same anti-fabrication rule as everywhere
  else, and it explicitly won't claim researched knowledge of a company
  it wasn't told about. Editable with autosave, Copy to clipboard, and
  Download as .txt. Linked from the builder sidebar and from the
  Analyzer's job-match section (since the job description is already
  there).

## Bug fixes from the previous pass

- **Overflow bug**: long job titles, degree names, or URLs could push
  past the page edge in flex rows that didn't shrink or wrap. Fixed
  across all four templates with `min-w-0 flex-1` on labels, `shrink-0`
  on dates, `flex-wrap` as a fallback, `break-words` inherited from the
  page container, and `overflow-x-hidden` as a hard backstop.
- **Text size control**: Small/Medium/Large, saved per resume
  (`fontSize` field), all four templates sized in em units off one base
  value so scaling it keeps the whole layout proportional.
- **Tightened AI prompts**: explicit word budgets on every bullet (was
  the root cause of both bad writing and overflow), a banned-phrase
  list, a requirement to vary opening verbs, no markdown/numbering.

## Setup (local development)

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

No `client/.env` is needed locally — Vite's dev server proxies `/api` to
`localhost:5000` (see `vite.config.js`). You only need `VITE_API_URL`
once client and server are deployed to separate domains — see Deployment
below.

Register an account at `/register`, then you'll land on `/dashboard`.
Create a resume to reach the builder, analyzer, and PDF export.

## Deployment (Render + Vercel, both free-tier)

The client and server end up on different domains
(`your-app.vercel.app` vs `your-api.onrender.com`), which has two
consequences the code already accounts for, but are worth understanding:

1. **The client needs the backend's real URL.** There's no dev proxy in
   production, so `VITE_API_URL` must point at the deployed Render URL.
2. **Auth cookies become cross-site.** A cookie set by `onrender.com` for
   a page on `vercel.app` requires `SameSite=None; Secure`, which the
   code already sets — but *only* when `NODE_ENV=production`, so that
   env var must actually be set on Render (it usually is by default, but
   double-check).

### 1. Backend → Render
1. Push this repo to GitHub, create a **Web Service** on Render pointing
   at the `server/` directory (root directory: `server`).
2. Build command: `npm install` — Start command: `npm start`.
3. Set environment variables in Render's dashboard:
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
2. Build command: `npm run build` — Output directory: `dist` (Vercel
   detects Vite automatically).
3. Set an environment variable:
   ```
   VITE_API_URL=https://resume-craft-ai-server.onrender.com/api
   ```
4. Deploy, then copy the resulting Vercel URL back into Render's
   `CLIENT_URL` (step above) and redeploy the backend so CORS allows it.

### Gotchas
- **MongoDB Atlas network access**: allow `0.0.0.0/0` (or Render's IP
  ranges) in Atlas's Network Access settings, or the backend can't connect.
- **Render free-tier cold starts**: the free instance sleeps after
  inactivity — the first request after a while can take 30-60s.
- **Vercel preview deployments** (e.g. `your-app-git-branch.vercel.app`)
  get a different URL than `CLIENT_URL`, so auth will fail on previews
  unless you widen the CORS origin check or add each preview domain.
  Not worth solving until you actually need preview deployments.

## API reference

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
