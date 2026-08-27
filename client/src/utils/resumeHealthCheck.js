// Pure heuristic checks — no network call, runs instantly as the person
// types. This is deliberately separate from the AI-based ATS analyzer:
// that one costs a rate-limited Groq call and gives a holistic score;
// this one is free, instant, and catches craftsmanship issues (weak
// phrasing, repeated verbs, overlong lines) as they're being written.

const WEAK_PHRASES = [
  "responsible for",
  "worked on",
  "helped with",
  "duties included",
  "tasked with",
  "in charge of",
  "hard worker",
  "team player",
  "detail oriented",
  "detail-oriented",
];

function getBulletLines(text) {
  if (!text) return [];
  return text
    .split("\n")
    .map((l) => l.replace(/^(\d+[.)]|[•\-*])\s*/, "").trim())
    .filter(Boolean);
}

function firstWord(line) {
  const match = line.trim().match(/^[A-Za-z]+/);
  return match ? match[0].toLowerCase() : null;
}

export function analyzeResumeHealth(resume) {
  if (!resume) return { issues: [] };

  const issues = [];
  const experience = resume.experience || [];
  const projects = resume.projects || [];
  const allBulletSources = [...experience, ...projects];
  const allBullets = allBulletSources.flatMap((entry) => getBulletLines(entry.description));

  // --- Structural completeness ---
  if (!resume.summary || resume.summary.trim().length < 20) {
    issues.push({ severity: "warning", message: "Add a professional summary — it's the first thing a recruiter reads." });
  }
  if (!resume.personalInfo?.email) {
    issues.push({ severity: "warning", message: "Add your email so recruiters can reach you." });
  }
  if (!resume.personalInfo?.phone) {
    issues.push({ severity: "info", message: "Consider adding a phone number." });
  }
  const hasSkills = resume.skills && Object.values(resume.skills).some((v) => Array.isArray(v) && v.length > 0);
  if (!hasSkills) {
    issues.push({ severity: "warning", message: "Add a skills section — it's one of the first things ATS keyword matching looks for." });
  }
  if (experience.length === 0 && projects.length === 0) {
    issues.push({ severity: "warning", message: "Add at least one experience or project entry." });
  }

  // --- Bullet quality ---
  if (allBullets.length > 0) {
    // Repeated opening verbs across all bullets
    const verbCounts = {};
    for (const line of allBullets) {
      const verb = firstWord(line);
      if (!verb) continue;
      verbCounts[verb] = (verbCounts[verb] || 0) + 1;
    }
    const repeated = Object.entries(verbCounts).filter(([, count]) => count >= 3);
    for (const [verb, count] of repeated) {
      issues.push({
        severity: "info",
        message: `You start ${count} bullets with "${verb.charAt(0).toUpperCase() + verb.slice(1)}" — try varying your action verbs for a stronger read.`,
      });
    }

    // Weak filler phrases
    const foundPhrases = new Set();
    for (const line of allBullets) {
      const lower = line.toLowerCase();
      for (const phrase of WEAK_PHRASES) {
        if (lower.includes(phrase)) foundPhrases.add(phrase);
      }
    }
    if (foundPhrases.size > 0) {
      issues.push({
        severity: "warning",
        message: `Found weak phrasing: "${[...foundPhrases].join('", "')}" — try "Improve with AI" or rewrite with a specific action instead.`,
      });
    }

    // Overlong bullets
    const longBullets = allBullets.filter((line) => line.split(/\s+/).length > 25);
    if (longBullets.length > 0) {
      issues.push({
        severity: "info",
        message: `${longBullets.length} bullet${longBullets.length > 1 ? "s run" : " runs"} long (25+ words) — consider tightening for a cleaner one-page read.`,
      });
    }

    // No metrics anywhere — gentle nudge, not a demand
    const hasAnyNumber = allBullets.some((line) => /\d/.test(line));
    if (!hasAnyNumber) {
      issues.push({
        severity: "info",
        message: "None of your bullets include a number yet — even a small one (team size, count of features, time saved) can make an impact concrete.",
      });
    }
  }

  return { issues };
}
