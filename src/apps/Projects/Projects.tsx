import { projects } from '../../data/projects';
import './Projects.css';

export function Projects() {
  return (
    <div className="projects-app">
      <h2 className="projects-app__title">Projects</h2>
      <div className="projects-app__grid">
        {projects.map((project) => (
          <div key={project.title} className="projects-app__card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="projects-app__tech">
              {project.tech.map((t) => (
                <span key={t} className="projects-app__tech-tag">
                  {t}
                </span>
              ))}
            </div>
            <div className="projects-app__links">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer">
                  Live
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
