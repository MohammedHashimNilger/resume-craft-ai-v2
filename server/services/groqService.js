import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

// Every prompt in this file shares this rule. Centralizing it means a
// future prompt can't accidentally be written without it.
const ANTI_FABRICATION_RULE = `
CRITICAL RULE — NEVER FABRICATE:
Do not invent companies, job titles, degrees, certifications, technologies,
projects, achievements, metrics, dates, or responsibilities that are not
present in the information given to you. If a detail (e.g. a percentage,
a metric, a tool) is missing, either omit it or phrase the bullet without
it — never insert a placeholder number or an invented fact to sound more
impressive. Rephrasing and strengthening wording is encouraged; adding
facts that were not provided is not.
`.trim();

// Shared quality bar for any bullet-point output (experience, projects,
// one-page optimization). Vague AI output ("Worked on backend features")
// and run-on 40-word bullets are the two most common complaints about
// AI-generated resumes — this rule targets both directly.
const BULLET_QUALITY_RULE = `
BULLET QUALITY RULES:
- Each bullet is ONE line, 12-20 words. Long, run-on bullets look
  unprofessional and can push a resume past one page — keep them tight.
- Start with a specific, varied action verb (e.g. "Built", "Designed",
  "Automated", "Optimized", "Led", "Reduced", "Migrated", "Debugged") —
  never reuse the same opening verb across bullets from the same entry.
- NEVER use vague filler: "Responsible for", "Worked on", "Helped with",
  "Duties included", "Tasked with", "Was in charge of". State the actual
  action and result instead.
- Where the source text includes a number, tool, or outcome, keep it in
  the bullet. Where it doesn't, describe the concrete technical action
  and its effect — do not pad with generic adjectives like "various" or
  "multiple" to sound more substantial than the input supports.
- Plain text only: no markdown bold/asterisks, no numbering (no "1.").
`.trim();

/**
 * Calls Groq's chat completions endpoint and returns the raw text content.
 * Centralized so every AI feature gets the same timeout/error handling.
 */
async function callGroq({ system, user, temperature = 0.4, jsonMode = false }) {
  try {
    const response = await groq.chat.completions.create({
      model: MODEL,
      temperature,
      max_tokens: 1500,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty response from AI model");
    return content;
  } catch (err) {
    if (err.status === 429) {
      const rateLimitError = new Error(
        "AI service is rate-limited right now. Please try again shortly.",
      );
      rateLimitError.statusCode = 429;
      throw rateLimitError;
    }
    if (err.status === 401 || err.status === 403) {
      const authError = new Error(
        "AI service is misconfigured. Please contact support.",
      );
      authError.statusCode = 500;
      throw authError;
    }
    const genericError = new Error("AI request failed. Please try again.");
    genericError.statusCode = 502;
    throw genericError;
  }
}

/** Parses a JSON string safely, throwing a controlled error on malformed output. */
function parseJsonResponse(text) {
  try {
    // Strip accidental markdown fences even though json_object mode should prevent them
    const cleaned = text.replace(/^```json\s*|```\s*$/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    const err = new Error(
      "AI returned an unexpected format. Please try again.",
    );
    err.statusCode = 502;
    throw err;
  }
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------

export async function improveSummary({
  currentSummary,
  personalInfo,
  experience,
  skills,
  mode,
}) {
  const modeInstruction =
    {
      generate:
        "Write a new professional summary from scratch based on the information given.",
      improve:
        "Improve the existing summary — sharpen the wording and structure.",
      shorten:
        "Shorten the existing summary to 2 sentences while keeping the strongest, most specific points.",
      professional:
        "Rewrite the existing summary in a more professional, confident tone.",
      ats: "Rewrite the existing summary to be more ATS-friendly, using standard industry keywords implied by the user's actual skills and experience.",
    }[mode] || "Improve the existing summary.";

  const system = `You are an expert resume writer. ${ANTI_FABRICATION_RULE}

SUMMARY QUALITY RULES:
- 2-3 sentences, 35-55 words total. Long enough to say something real,
  short enough to never wrap past 3 lines on a one-page resume.
- Lead with the person's actual role/level and 1-2 specific, named
  skills or technologies drawn from the data given — never a generic
  opener like "Highly motivated professional" or "Results-driven team
  player" with nothing concrete backing it up.
- Mention one concrete thing they've built or done if the data supports
  it (a named project, a technology stack, a deployed system) rather
  than only abstract traits.
- No buzzword soup: avoid stacking vague adjectives ("dynamic",
  "passionate", "synergy", "go-getter"). One confident, specific
  sentence beats three vague ones.
- Write in third-person-implied style (no "I", no "My") as is standard
  for resumes.
- Respond with ONLY the summary text — no preamble, no quotes around it.`;

  const user = `${modeInstruction}

Current summary: ${currentSummary || "(none provided)"}
Name/title: ${JSON.stringify(personalInfo || {})}
Experience: ${JSON.stringify(experience || [])}
Skills: ${JSON.stringify(skills || {})}`;

  const text = await callGroq({ system, user, temperature: 0.5 });
  return { summary: text.trim() };
}

// ---------------------------------------------------------------------
// Experience bullets
// ---------------------------------------------------------------------

export async function improveExperience({
  jobTitle,
  company,
  description,
  mode = "improve",
}) {
  const modeInstruction =
    {
      improve: `Turn the raw description into 2-4 achievement-oriented bullet points
following the rules above.`,
      grammar: `Fix ONLY grammar, spelling, verb tense, and punctuation in the raw
description. Preserve the exact facts, structure, and level of detail —
do not rewrite the sentence, change the action verb, or add/remove
information. If it's not already bulleted, format it as bullets without
changing the wording beyond correcting errors.`,
      concise: `Make the raw description more concise — cut filler words and
redundant phrasing — without dropping any fact, tool, or outcome
mentioned. Keep the same number of bullets as the input if it's already
bulleted.`,
      verbs: `Keep the description's structure, facts, and length essentially
unchanged. Only replace weak or repeated opening verbs with stronger,
more specific alternatives (e.g. "Worked on" → "Built", "Helped with" →
"Supported" or a more precise verb matching what was actually done).`,
    }[mode] || null;

  if (!modeInstruction) {
    const err = new Error("Invalid improvement mode");
    err.statusCode = 400;
    throw err;
  }

  const system = `You are an expert resume writer specializing in achievement-oriented bullet points.
${ANTI_FABRICATION_RULE}
${BULLET_QUALITY_RULE}

${modeInstruction}
Respond with ONLY the bullet points, one per line, each starting with "• ".
No preamble, no explanation, no closing remarks.`;

  const user = `Job title: ${jobTitle || "(not provided)"}
Company: ${company || "(not provided)"}
Raw description: ${description}`;

  const text = await callGroq({
    system,
    user,
    temperature: mode === "grammar" ? 0.2 : 0.45,
  });
  return { description: text.trim() };
}

// ---------------------------------------------------------------------
// Project descriptions
// ---------------------------------------------------------------------

export async function improveProject({
  name,
  technologies,
  description,
  mode = "improve",
}) {
  const modeInstruction =
    {
      improve: `Turn the raw description into 1-3 bullet points following the rules
above — mention the specific technologies given where natural, since
project bullets are where technical keywords matter most.`,
      grammar: `Fix ONLY grammar, spelling, and punctuation. Preserve the exact facts
and structure — do not rewrite the sentence or add/remove information.`,
      concise: `Make the raw description more concise — cut filler words — without
dropping any fact, tool, or outcome mentioned.`,
      verbs: `Keep structure, facts, and length essentially unchanged. Only replace
weak or repeated opening verbs with stronger, more specific alternatives.`,
    }[mode] || null;

  if (!modeInstruction) {
    const err = new Error("Invalid improvement mode");
    err.statusCode = 400;
    throw err;
  }

  const system = `You are an expert resume writer.
${ANTI_FABRICATION_RULE}
${BULLET_QUALITY_RULE}

${modeInstruction}
Respond with ONLY the bullet points, one per line, each starting with
"• ". No preamble.`;

  const user = `Project name: ${name || "(not provided)"}
Technologies: ${technologies || "(not provided)"}
Raw description: ${description}`;

  const text = await callGroq({
    system,
    user,
    temperature: mode === "grammar" ? 0.2 : 0.45,
  });
  return { description: text.trim() };
}

// ---------------------------------------------------------------------
// Skill suggestions (from what the user already provided — never invented)
// ---------------------------------------------------------------------

export async function suggestSkills({ experience, projects, existingSkills }) {
  const system = `You are an expert resume writer. Based ONLY on the technologies,
tools, and responsibilities explicitly mentioned in the user's experience and
projects, suggest additional skills they could add to their skills section
that are already implied by that content but missing from their current list.
${ANTI_FABRICATION_RULE}
Do not suggest a skill unless it is directly implied by the text given.
Respond in JSON only: {"suggestions": ["skill1", "skill2", ...]}`;

  const user = `Experience: ${JSON.stringify(experience || [])}
Projects: ${JSON.stringify(projects || [])}
Existing skills: ${JSON.stringify(existingSkills || {})}`;

  const text = await callGroq({
    system,
    user,
    temperature: 0.3,
    jsonMode: true,
  });
  return parseJsonResponse(text);
}

// ---------------------------------------------------------------------
// One-page optimization
// ---------------------------------------------------------------------

export async function optimizeOnePage({ resumeContent }) {
  const system = `You are an expert resume editor. The user's resume content is
too long to fit on one page. Shorten the summary, experience bullets, and
project descriptions to reduce overall length by roughly 25-35%, while
preserving every distinct fact, skill, and achievement mentioned.
${ANTI_FABRICATION_RULE}
${BULLET_QUALITY_RULE}
Do not remove entire entries (jobs, projects) — condense their wording instead.
Respond in JSON only, matching this shape:
{"summary": "...", "experience": [{"description": "..."}], "projects": [{"description": "..."}]}
Return experience/projects arrays in the same order and length as given.`;

  const user = `Resume content: ${JSON.stringify(resumeContent)}`;

  const text = await callGroq({
    system,
    user,
    temperature: 0.3,
    jsonMode: true,
  });
  return parseJsonResponse(text);
}

// ---------------------------------------------------------------------
// ATS analysis
// ---------------------------------------------------------------------

export async function analyzeResume({ resumeContent }) {
  const system = `You are an ATS (Applicant Tracking System) resume analyzer.
Evaluate the resume content given and produce an estimated compatibility
score. Be honest and specific — do not default to a generic high score.
Consider: standard section naming, one-page density, keyword presence,
quantified achievements where appropriate, contact info completeness, and
overall clarity. This is an ESTIMATE, not a guarantee of any specific
company's real ATS behavior.
Respond in JSON only, matching exactly this shape:
{
  "score": 0-100,
  "summary": "one sentence overview",
  "categories": {"formatting": 0-20, "keywords": 0-20, "content": 0-20, "skills": 0-20, "readability": 0-20},
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "missingKeywords": ["...", "..."],
  "recommendations": ["...", "..."]
}`;

  const user = `Resume content: ${JSON.stringify(resumeContent)}`;

  const text = await callGroq({
    system,
    user,
    temperature: 0.3,
    jsonMode: true,
  });
  const parsed = parseJsonResponse(text);

  // Defensive validation — never trust AI output blindly before it reaches the client
  if (
    typeof parsed.score !== "number" ||
    parsed.score < 0 ||
    parsed.score > 100
  ) {
    throw Object.assign(new Error("AI returned an invalid score"), {
      statusCode: 502,
    });
  }

  return parsed;
}

// ---------------------------------------------------------------------
// Cover letter
// ---------------------------------------------------------------------

export async function generateCoverLetter({
  personalInfo,
  summary,
  experience,
  projects,
  skills,
  jobDescription,
  companyName,
  tone = "professional",
}) {
  const toneInstruction =
    {
      professional:
        "Confident and professional — polished, no informal language.",
      enthusiastic:
        "Genuinely enthusiastic and warm, while staying professional — shows real interest without sounding over-the-top.",
      concise:
        "Direct and brief — every sentence earns its place, no filler, roughly 150-200 words total.",
    }[tone] || "Confident and professional.";

  const system = `You are an expert cover letter writer.
${ANTI_FABRICATION_RULE}

Write a complete cover letter using ONLY the candidate's actual resume
content given below, tailored to the job description provided.

STRUCTURE:
- Opening paragraph: which role, and one genuine, specific reason this
  candidate's background fits it (reference something real from their
  resume, not a generic claim).
- 1-2 body paragraphs: connect 2-3 specific, real experiences, projects,
  or skills from the resume to what the job description is asking for.
  Do not just restate the resume — explain the fit.
- Closing paragraph: brief, confident close with a call to action.
- Do NOT invent a company name if none is given — write "your team" or
  similar instead of guessing.
- Do NOT fabricate enthusiasm about specifics of the company that aren't
  in the job description (e.g. don't claim to have researched a mission
  statement you were never given).
- Tone: ${toneInstruction}
- Length: 250-350 words unless the concise tone is requested.
- Output the letter body only — no "Dear Hiring Manager," salutation
  block or "Sincerely, [Name]" signature block; the app adds those
  separately so they stay consistent even if the candidate regenerates.
- Plain text only, no markdown.`;

  const user = `Candidate name/title: ${JSON.stringify(personalInfo || {})}
Candidate summary: ${summary || "(none provided)"}
Experience: ${JSON.stringify(experience || [])}
Projects: ${JSON.stringify(projects || [])}
Skills: ${JSON.stringify(skills || {})}

Target company name: ${companyName || "(not provided)"}
Job description: ${jobDescription}`;

  const text = await callGroq({ system, user, temperature: 0.55 });
  return { coverLetter: text.trim() };
}

export async function analyzeJobMatch({ resumeContent, jobDescription }) {
  const system = `You are an ATS job-match analyzer. Compare the resume content
against the job description. Identify matched skills/keywords, missing or
weak keywords, and give concrete suggestions.
${ANTI_FABRICATION_RULE}
Never suggest the user claim a skill or technology they have not
demonstrated in their resume — only suggest they add it "if you genuinely
have experience with it."
Respond in JSON only, matching exactly this shape:
{
  "matchScore": 0-100,
  "matchedSkills": ["...", "..."],
  "missingKeywords": ["...", "..."],
  "suggestions": ["...", "..."]
}`;

  const user = `Resume content: ${JSON.stringify(resumeContent)}
Job description: ${jobDescription}`;

  const text = await callGroq({
    system,
    user,
    temperature: 0.3,
    jsonMode: true,
  });
  return parseJsonResponse(text);
}
