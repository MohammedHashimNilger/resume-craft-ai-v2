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

const ProfessionalTemplate = forwardRef(function ProfessionalTemplate(
  { resume, printMode = false, fontSize = "medium" },
  ref
) {
  const { personalInfo = {}, summary, education = [], experience = [], projects = [], skills, certifications = [] } = resume;
  const contact = contactLine(personalInfo);
  const skillTags = flattenSkills(skills);

  const SectionHeading = ({ children }) => (
    <h2 className="border-b-2 border-neutral-800 pb-0.5 font-bold uppercase tracking-wide">{children}</h2>
  );

  return (
    <div ref={ref} className={pageContainerClass(printMode)} style={fontSizeStyle(fontSize)}>
      <div className="border border-neutral-800 px-4 py-3 text-center">
        <h1 className="break-words text-[1.4em] font-bold uppercase tracking-wide">
          {personalInfo.fullName || "Your Name"}
        </h1>
        {personalInfo.professionalTitle && (
          <p className="font-medium text-neutral-700">{personalInfo.professionalTitle}</p>
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
          <SectionHeading>Professional Experience</SectionHeading>
          {experience.map((exp, i) => (
            <div key={i} className="mt-1.5">
              <div className={OVERFLOW_SAFE_ROW}>
                <p className={`font-bold ${OVERFLOW_SAFE_LABEL}`}>{exp.jobTitle}</p>
                <p className={`text-[0.85em] font-medium text-neutral-600 ${OVERFLOW_SAFE_META}`}>
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                </p>
              </div>
              <p className="break-words text-[0.85em] italic text-neutral-700">
                {exp.company}
                {exp.location ? `, ${exp.location}` : ""}
              </p>
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
              <p className="break-words font-bold">{proj.name}</p>
              {proj.technologies && <p className="break-words text-[0.85em] italic text-neutral-700">{proj.technologies}</p>}
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
                <span className="font-bold">{edu.degree}</span>
                {edu.institution ? ` — ${edu.institution}` : ""}
              </p>
              <p className={`text-[0.85em] font-medium text-neutral-600 ${OVERFLOW_SAFE_META}`}>
                {edu.startDate} – {edu.endDate}
              </p>
            </div>
          ))}
        </section>
      )}

      {skillTags.length > 0 && (
        <section className="mt-3">
          <SectionHeading>Core Competencies</SectionHeading>
          <p className="mt-1">{skillTags.join(" | ")}</p>
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

export default ProfessionalTemplate;
