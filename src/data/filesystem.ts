export interface FSNode {
  name: string;
  type: 'file' | 'folder';
  children?: FSNode[];
  opensApp?: string;
  content?: string;
}

export const filesystem: FSNode = {
  name: '~',
  type: 'folder',
  children: [
    {
      name: 'resume.txt',
      type: 'file',
      opensApp: 'about-me',
      content: `Name: Rishi Krishna
Title: Senior Software Engineering Student
University: University of Nebraska - Lincoln

Skills: TypeScript, React, Node.js, Python, Java, Git, SQL, AWS, Docker, Linux

Experience:
  Software Engineering Intern | Company Name | Summer 2024
  - Built and maintained full-stack web applications
  - Collaborated with cross-functional teams
  - Implemented CI/CD pipelines`,
    },
    {
      name: 'projects',
      type: 'folder',
      opensApp: 'projects',
      children: [
        {
          name: 'rishis-realm',
          type: 'file',
          content: 'Interactive Ubuntu-style desktop OS - React + TypeScript',
        },
        {
          name: 'project-two',
          type: 'file',
          content: 'Full-stack web app - Node.js + React + PostgreSQL',
        },
        {
          name: 'project-three',
          type: 'file',
          content: 'CLI automation tool - Python + Docker',
        },
      ],
    },
    {
      name: 'contact.txt',
      type: 'file',
      opensApp: 'contact',
      content: `GitHub:   https://github.com/0xRK
LinkedIn: https://www.linkedin.com/in/rkrishna2/`,
    },
    {
      name: '.bashrc',
      type: 'file',
      content: `# Rishi's config
export PS1="rishi@realm:~$ "
alias ll='ls -la'
alias cls='clear'`,
    },
    {
      name: 'notes.txt',
      type: 'file',
      opensApp: 'text-editor',
      content: 'Welcome to my realm! Feel free to explore.',
    },
    {
      name: 'music',
      type: 'folder',
      children: [
        { name: 'lofi-beats.mp3', type: 'file', content: '[audio file]' },
        { name: 'chill-vibes.mp3', type: 'file', content: '[audio file]' },
      ],
    },
  ],
};

export function resolvePath(path: string): FSNode | null {
  const parts = path
    .replace(/^~?\/?/, '')
    .split('/')
    .filter(Boolean);
  let current: FSNode = filesystem;
  for (const part of parts) {
    if (part === '..') continue;
    const child = current.children?.find((c) => c.name === part);
    if (!child) return null;
    current = child;
  }
  return current;
}
