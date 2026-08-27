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

const ModernTemplate = forwardRef(function ModernTemplate(
  { resume, printMode = false, fontSize = "medium" },
  ref
) {
  const { personalInfo = {}, summary, education = [], experience = [], projects = [], skills, certifications = [] } = resume;
  const contact = contactLine(personalInfo);
  const skillTags = flattenSkills(skills);

  const SectionHeading = ({ children }) => (
    <h2 className="font-bold uppercase tracking-[0.15em] text-teal-700">{children}</h2>
  );

  return (
    <div ref={ref} className={pageContainerClass(printMode)} style={fontSizeStyle(fontSize)}>
      <div className="border-b-2 border-teal-700 pb-2">
        <h1 className="break-words text-[1.5em] font-semibold text-neutral-900">
          {personalInfo.fullName || "Your Name"}
        </h1>
        {personalInfo.professionalTitle && (
          <p className="font-medium text-teal-700">{personalInfo.professionalTitle}</p>
        )}
        {contact && <p className="mt-0.5 text-[0.85em] text-neutral-600">{contact}</p>}
      </div>

      {summary && (
        <section className="mt-3">
          <SectionHeading>Summary</SectionHeading>
          <p className="mt-1">{summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mt-3">
          <SectionHeading>Experience</SectionHeading>
          {experience.map((exp, i) => (
            <div key={i} className="mt-1.5">
              <div className={OVERFLOW_SAFE_ROW}>
                <p className={`font-semibold ${OVERFLOW_SAFE_LABEL}`}>
                  {exp.jobTitle}
                  <span className="font-normal text-neutral-600">{exp.company ? ` · ${exp.company}` : ""}</span>
                </p>
                <p className={`text-[0.85em] text-neutral-500 ${OVERFLOW_SAFE_META}`}>
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
          <SectionHeading>Projects</SectionHeading>
          {projects.map((proj, i) => (
            <div key={i} className="mt-1.5">
              <p className="break-words font-semibold">
                {proj.name}
                {proj.technologies && <span className="font-normal text-neutral-600"> · {proj.technologies}</span>}
              </p>
              <Bullets text={proj.description} />
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mt-3">
          <SectionHeading>Education</SectionHeading>
          {education.map((edu, i) => (
            <div key={i} className={`mt-1 ${OVERFLOW_SAFE_ROW}`}>
              <p className={OVERFLOW_SAFE_LABEL}>
                <span className="font-semibold">{edu.degree}</span>
                {edu.institution ? <span className="text-neutral-600"> · {edu.institution}</span> : ""}
              </p>
              <p className={`text-[0.85em] text-neutral-500 ${OVERFLOW_SAFE_META}`}>
                {edu.startDate} – {edu.endDate}
              </p>
            </div>
          ))}
        </section>
      )}

      {skillTags.length > 0 && (
        <section className="mt-3">
          <SectionHeading>Skills</SectionHeading>
          <div className="mt-1 flex flex-wrap gap-1">
            {skillTags.map((s) => (
              <span key={s} className="break-words rounded bg-teal-50 px-1.5 py-0.5 text-[0.85em] text-teal-800">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {certifications.length > 0 && (
        <section className="mt-3">
          <SectionHeading>Certifications</SectionHeading>
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

export default ModernTemplate;
