import { resume } from '../../data/resume';
import './AboutMe.css';

export function AboutMe() {
  return (
    <div className="about-me">
      <div className="about-me__header">
        <h1>{resume.name}</h1>
        <p className="about-me__subtitle">{resume.title}</p>
        <p className="about-me__uni">{resume.university}</p>
      </div>

      <p className="about-me__bio">{resume.bio}</p>

      <section className="about-me__section">
        <h2>Skills</h2>
        <div className="about-me__skills">
          {resume.skills.map((skill) => (
            <span key={skill} className="about-me__skill-tag">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="about-me__section">
        <h2>Education</h2>
        {resume.education.map((edu) => (
          <div key={edu.institution} className="about-me__entry">
            <div className="about-me__entry-header">
              <strong>{edu.degree}</strong>
              <span className="about-me__entry-date">{edu.years}</span>
            </div>
            <p>{edu.institution}</p>
          </div>
        ))}
      </section>

      <section className="about-me__section">
        <h2>Experience</h2>
        {resume.experience.map((exp) => (
          <div key={exp.role + exp.company} className="about-me__entry">
            <div className="about-me__entry-header">
              <strong>{exp.role}</strong>
              <span className="about-me__entry-date">{exp.period}</span>
            </div>
            <p>{exp.company}</p>
            <ul>
              {exp.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="about-me__section">
        <h2>Links</h2>
        <div className="about-me__links">
          <a href={resume.links.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={resume.links.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}
