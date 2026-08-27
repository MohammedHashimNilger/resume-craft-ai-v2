// Small building blocks shared across templates so bullet-parsing,
// skills-flattening, sizing, and overflow-safety logic stays in one
// place instead of drifting between four near-identical copies.

// Strips leading bullet markers AI output might use — "•", "-", "*",
// "1.", "1)" — so numbered-list output from the model still renders as
// a clean bullet instead of showing a stray "1." in the resume.
export function Bullets({ text, className = "mt-1 list-disc space-y-0.5 pl-4" }) {
  if (!text) return null;
  const lines = text
    .split("\n")
    .map((l) => l.replace(/^(\d+[.)]|[•\-*])\s*/, "").trim())
    .filter(Boolean);
  if (lines.length === 0) return null;
  return (
    <ul className={className}>
      {lines.map((line, i) => (
        <li key={i} className="break-words">
          {line}
        </li>
      ))}
    </ul>
  );
}

export function flattenSkills(skills) {
  if (!skills) return [];
  return [
    ...(skills.programmingLanguages || []),
    ...(skills.frameworks || []),
    ...(skills.frontend || []),
    ...(skills.backend || []),
    ...(skills.databases || []),
    ...(skills.tools || []),
    ...(skills.other || []),
  ];
}

export function contactLine(personalInfo = {}) {
  return [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.portfolio,
  ]
    .filter(Boolean)
    .join("  |  ");
}

// Text-size system: one saved choice per resume, applied as the base
// font-size on the page container. Every other size in a template is
// written in em units relative to this, so scaling it up or down keeps
// the whole layout proportional instead of just changing one element.
export const FONT_SIZE_PX = { small: 9.5, medium: 11, large: 12.5 };
export const FONT_SIZE_LABELS = { small: "Small", medium: "Medium", large: "Large" };

export function fontSizeStyle(fontSize) {
  return { fontSize: `${FONT_SIZE_PX[fontSize] || FONT_SIZE_PX.medium}px` };
}

// Shared page container classes. `break-words` (inherited by all
// children) and `overflow-x-hidden` are the actual fix for long
// unbroken text — job titles, degree names, long URLs — pushing past
// the page edge: without them a flex row with a long label simply grows
// wider than its box instead of wrapping.
export function pageContainerClass(printMode, leadingClass = "leading-snug") {
  const shared = `text-neutral-900 break-words overflow-x-hidden ${leadingClass}`;
  return printMode
    ? `mx-auto w-[8.5in] min-h-[11in] bg-white p-[0.6in] ${shared}`
    : `mx-auto aspect-[8.5/11] w-full max-w-[520px] overflow-y-auto overflow-x-hidden bg-white p-8 shadow-sm ${shared}`;
}

// A title/date (or degree/date) row that must never overflow: the label
// gets `min-w-0 flex-1` so it can actually shrink and wrap, the date
// gets `shrink-0` so it stays compact and never gets squeezed, and
// `flex-wrap` is a last-resort escape hatch if a label is so long the
// date needs to drop to its own line.
export const OVERFLOW_SAFE_ROW = "flex flex-wrap items-baseline justify-between gap-x-2";
export const OVERFLOW_SAFE_LABEL = "min-w-0 flex-1 break-words";
export const OVERFLOW_SAFE_META = "shrink-0 whitespace-nowrap";
