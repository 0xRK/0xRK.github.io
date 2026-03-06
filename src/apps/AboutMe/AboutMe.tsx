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
    </div>
  );
}
