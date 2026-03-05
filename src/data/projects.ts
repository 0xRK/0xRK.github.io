export interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
}

export const projects: Project[] = [
  {
    title: "Rishi's Realm",
    description:
      'This very website! An interactive Ubuntu-style desktop OS built with React and TypeScript.',
    tech: ['React', 'TypeScript', 'Vite', 'CSS'],
    github: 'https://github.com/0xRK/0xRK.github.io',
  },
  {
    title: 'Project Two',
    description:
      'A full-stack web application with user authentication and real-time features.',
    tech: ['Node.js', 'React', 'PostgreSQL', 'WebSockets'],
    github: 'https://github.com/0xRK',
  },
  {
    title: 'Project Three',
    description:
      'A CLI tool for automating development workflows and project scaffolding.',
    tech: ['Python', 'Click', 'Docker'],
    github: 'https://github.com/0xRK',
  },
];
