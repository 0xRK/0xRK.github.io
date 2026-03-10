export interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  icon: string;
  color: string;
}

export const projects: Project[] = [
  {
    title: "Rishi's Realm",
    description:
      'This very website! An interactive Ubuntu-style desktop OS built with React and TypeScript.',
    tech: ['React', 'TypeScript', 'Vite', 'CSS'],
    github: 'https://github.com/0xRK/0xRK.github.io',
    live: 'https://0xRK.github.io',
    icon: '🖥️',
    color: '#6366f1',
  },
  {
    title: 'Curia',
    description:
      'Hackathon project enabling students to browse campus events with natural language search, group formation, real-time messaging, and push notifications.',
    tech: ['React', 'Vite', 'Node.js', 'Express', 'SQLite', 'Python', 'FastAPI', 'Ollama'],
    icon: '📅',
    color: '#10b981',
  },
  {
    title: 'Zulip (Open Source)',
    description:
      'Contributed features to the open-source chat platform, including user profile pictures in the user list and default times for scheduling messages.',
    tech: ['Python', 'Django', 'JavaScript', 'HTML', 'SQL', 'Node.js'],
    github: 'https://github.com/zulip/zulip',
    icon: '💬',
    color: '#0ea5e9',
  },
  {
    title: 'Olsson Stream Assessment',
    description:
      "Led a team of 3 developers to build a web app that streamlines Olsson's stream assessment workflow with a standardized framework.",
    tech: ['Azure', 'GitLab', 'Docker', 'CI/CD'],
    icon: '🌊',
    color: '#14b8a6',
  },
  {
    title: 'Conagra Capital Dashboard',
    description:
      "Automated dashboard enhancing Conagra Brands' $500M capital expenditure decision-making with historical and projected depreciation data across 42 facilities.",
    tech: ['Python', 'Pandas'],
    icon: '📊',
    color: '#f59e0b',
  },
  {
    title: 'NASA SUITS Challenge',
    description:
      'Led development of a technical proposal and prototype for an AR system for astronauts, featuring real-time navigation and an intuitive UX.',
    tech: ['C#', 'Unity', 'Git'],
    icon: '🚀',
    color: '#8b5cf6',
  },
  {
    title: 'School of Computing SAB',
    description:
      'Vice President — plan and coordinate School of Computing events. Improved the club website with an event calendar and applications page, increasing enrollment by 30%.',
    tech: ['Leadership', 'Web Development', 'Event Planning'],
    icon: '🎓',
    color: '#ec4899',
  },
];
