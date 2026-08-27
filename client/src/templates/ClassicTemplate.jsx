import { forwardRef } from "react";
import {
  Bullets,
  flattenSkills,
  contactLine,
  fontSizeStyle,
  pageContainerClass,
  OVERFLOW_SAFE_ROW,
  OVERFLOW_SAFE_LABEL,
  OVERFLOW_SAFE_META,
} from "./templateHelpers.jsx";

// Traditional, centered header, standard section rules — the safest,
// most universally ATS-parseable layout of the four.
const ClassicTemplate = forwardRef(function ClassicTemplate(
  { resume, printMode = false, fontSize = "medium" },
  ref
) {
  const { personalInfo = {}, summary, education = [], experience = [], projects = [], skills, certifications = [] } = resume;
  const skillsList = flattenSkills(skills);
  const contact = contactLine(personalInfo);

  return (
    <div ref={ref} className={pageContainerClass(printMode)} style={fontSizeStyle(fontSize)}>
      <div className="text-center">
        <h1 className="text-[1.45em] font-bold tracking-wide">{personalInfo.fullName || "Your Name"}</h1>
        {personalInfo.professionalTitle && <p>{personalInfo.professionalTitle}</p>}
        {contact && <p className="mt-0.5 text-[0.85em] text-neutral-600">{contact}</p>}
      </div>

      {summary && (
        <section className="mt-3">
          <h2 className="border-b border-neutral-400 pb-0.5 font-bold uppercase tracking-wide">Summary</h2>
          <p className="mt-1">{summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mt-3">
          <h2 className="border-b border-neutral-400 pb-0.5 font-bold uppercase tracking-wide">Experience</h2>
          {experience.map((exp, i) => (
            <div key={i} className="mt-1.5">
              <div className={OVERFLOW_SAFE_ROW}>
                <p className={`font-semibold ${OVERFLOW_SAFE_LABEL}`}>
                  {exp.jobTitle}
                  {exp.company ? ` — ${exp.company}` : ""}
                </p>
                <p className={`text-[0.85em] text-neutral-600 ${OVERFLOW_SAFE_META}`}>
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                </p>
              </div>
              <Bullets text={exp.description} />
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="mt-3">
          <h2 className="border-b border-neutral-400 pb-0.5 font-bold uppercase tracking-wide">Projects</h2>
          {projects.map((proj, i) => (
            <div key={i} className="mt-1.5">
              <p className="break-words font-semibold">
                {proj.name}
                {proj.technologies ? ` | ${proj.technologies}` : ""}
              </p>
              <Bullets text={proj.description} />
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mt-3">
          <h2 className="border-b border-neutral-400 pb-0.5 font-bold uppercase tracking-wide">Education</h2>
          {education.map((edu, i) => (
            <div key={i} className={`mt-1 ${OVERFLOW_SAFE_ROW}`}>
              <p className={OVERFLOW_SAFE_LABEL}>
                <span className="font-semibold">{edu.degree}</span>
                {edu.institution ? ` — ${edu.institution}` : ""}
              </p>
              <p className={`text-[0.85em] text-neutral-600 ${OVERFLOW_SAFE_META}`}>
                {edu.startDate} – {edu.endDate}
              </p>
            </div>
          ))}
        </section>
      )}

      {skillsList.length > 0 && (
        <section className="mt-3">
          <h2 className="border-b border-neutral-400 pb-0.5 font-bold uppercase tracking-wide">Skills</h2>
          <p className="mt-1">{skillsList.join(" • ")}</p>
        </section>
      )}

      {certifications.length > 0 && (
        <section className="mt-3">
          <h2 className="border-b border-neutral-400 pb-0.5 font-bold uppercase tracking-wide">Certifications</h2>
          {certifications.map((cert, i) => (
            <p key={i} className="mt-0.5">
              {cert.name}
              {cert.issuingOrganization ? ` — ${cert.issuingOrganization}` : ""}
              {cert.date ? ` (${cert.date})` : ""}
            </p>
          ))}
        </section>
      )}
    </div>
  );
});

export default ClassicTemplate;
