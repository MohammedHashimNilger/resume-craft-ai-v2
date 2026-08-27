import { forwardRef } from "react";
import { Bullets, flattenSkills, contactLine, fontSizeStyle, pageContainerClass } from "./templateHelpers.jsx";

const MinimalTemplate = forwardRef(function MinimalTemplate(
  { resume, printMode = false, fontSize = "medium" },
  ref
) {
  const { personalInfo = {}, summary, education = [], experience = [], projects = [], skills, certifications = [] } = resume;
  const contact = contactLine(personalInfo);
  const skillTags = flattenSkills(skills);

  const SectionHeading = ({ children }) => (
    <h2 className="font-bold uppercase tracking-widest text-neutral-900">{children}</h2>
  );

  return (
    <div
      ref={ref}
      className={pageContainerClass(printMode, "leading-normal")}
      style={fontSizeStyle(fontSize)}
    >
      <div>
        <h1 className="break-words text-[1.35em] font-bold">{personalInfo.fullName || "Your Name"}</h1>
        {personalInfo.professionalTitle && <p>{personalInfo.professionalTitle}</p>}
        {contact && <p className="mt-0.5 text-[0.85em] text-neutral-600">{contact}</p>}
      </div>

      {summary && (
        <section className="mt-4">
          <SectionHeading>Summary</SectionHeading>
          <p className="mt-1.5">{summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mt-4">
          <SectionHeading>Experience</SectionHeading>
          {experience.map((exp, i) => (
            <div key={i} className="mt-2">
              <p className="break-words font-semibold">{exp.jobTitle}</p>
              <p className="break-words text-[0.85em] text-neutral-600">
                {exp.company} — {exp.startDate} to {exp.current ? "Present" : exp.endDate}
              </p>
              <Bullets text={exp.description} />
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="mt-4">
          <SectionHeading>Projects</SectionHeading>
          {projects.map((proj, i) => (
            <div key={i} className="mt-2">
              <p className="break-words font-semibold">{proj.name}</p>
              {proj.technologies && <p className="break-words text-[0.85em] text-neutral-600">{proj.technologies}</p>}
              <Bullets text={proj.description} />
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mt-4">
          <SectionHeading>Education</SectionHeading>
          {education.map((edu, i) => (
            <div key={i} className="mt-2">
              <p className="break-words font-semibold">{edu.degree}</p>
              <p className="break-words text-[0.85em] text-neutral-600">
                {edu.institution} — {edu.startDate} to {edu.endDate}
              </p>
            </div>
          ))}
        </section>
      )}

      {skillTags.length > 0 && (
        <section className="mt-4">
          <SectionHeading>Skills</SectionHeading>
          <p className="mt-1.5">{skillTags.join(", ")}</p>
        </section>
      )}

      {certifications.length > 0 && (
        <section className="mt-4">
          <SectionHeading>Certifications</SectionHeading>
          {certifications.map((cert, i) => (
            <p key={i} className="mt-1">
              {cert.name}
              {cert.issuingOrganization ? `, ${cert.issuingOrganization}` : ""}
              {cert.date ? ` (${cert.date})` : ""}
            </p>
          ))}
        </section>
      )}
    </div>
  );
});

export default MinimalTemplate;
