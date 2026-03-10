import { useEffect, useRef } from 'react';
import { projects } from '../../data/projects';
import './Projects.css';

export function Projects() {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = listRef.current?.querySelectorAll('.projects-app__card');
    if (!cards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('projects-app__card--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="projects-app">
      <h2 className="projects-app__title">Projects</h2>
      <div className="projects-app__list" ref={listRef}>
        {projects.map((project, i) => (
          <div
            key={project.title}
            className="projects-app__card"
            style={{ '--card-delay': `${i * 60}ms` } as React.CSSProperties}
          >
            <div
              className="projects-app__icon"
              style={{ background: `${project.color}22`, borderColor: `${project.color}44` }}
            >
              <span style={{ fontSize: 32 }}>{project.icon}</span>
            </div>

            <div className="projects-app__content">
              <div className="projects-app__header">
                <h3 className="projects-app__name">{project.title}</h3>
                <div className="projects-app__links">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      GitHub ↗
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer">
                      Live ↗
                    </a>
                  )}
                </div>
              </div>

              <p className="projects-app__desc">{project.description}</p>

              <div className="projects-app__tech">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="projects-app__tech-tag"
                    style={{ borderColor: `${project.color}55`, color: project.color }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
