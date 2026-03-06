import type { AppDefinition } from '../types/desktop';
import { AboutMe } from '../apps/AboutMe/AboutMe';
import { Projects } from '../apps/Projects/Projects';
import { Contact } from '../apps/Contact/Contact';
import { Terminal } from '../apps/Terminal/Terminal';
import { TextEditor } from '../apps/TextEditor/TextEditor';
import { MusicPlayer } from '../apps/MusicPlayer/MusicPlayer';
import { FileManager } from '../apps/FileManager/FileManager';
import { Resume } from '../apps/Resume/Resume';

export const appRegistry: Record<string, AppDefinition> = {
  'about-me': {
    id: 'about-me',
    title: 'About Me',
    icon: '👤',
    defaultWidth: 700,
    defaultHeight: 500,
    component: AboutMe,
    showInDock: true,
  },
  'projects': {
    id: 'projects',
    title: 'Projects',
    icon: '📦',
    defaultWidth: 800,
    defaultHeight: 550,
    component: Projects,
    showInDock: true,
  },
  'contact': {
    id: 'contact',
    title: 'Contact',
    icon: '🪪',
    defaultWidth: 500,
    defaultHeight: 400,
    component: Contact,
    showInDock: true,
  },
  'terminal': {
    id: 'terminal',
    title: 'Terminal',
    icon: '>_',
    defaultWidth: 650,
    defaultHeight: 420,
    component: Terminal,
    showInDock: true,
  },
  'text-editor': {
    id: 'text-editor',
    title: 'Text Editor',
    icon: '📝',
    defaultWidth: 600,
    defaultHeight: 450,
    component: TextEditor,
    showInDock: true,
  },
  'music-player': {
    id: 'music-player',
    title: 'Music Player',
    icon: '🎵',
    defaultWidth: 320,
    defaultHeight: 220,
    component: MusicPlayer,
    showInDock: true,
  },
  'file-manager': {
    id: 'file-manager',
    title: 'Files',
    icon: '🗂️',
    defaultWidth: 750,
    defaultHeight: 500,
    component: FileManager,
    showInDock: true,
  },
  'resume': {
    id: 'resume',
    title: 'Resume',
    icon: '📄',
    defaultWidth: 800,
    defaultHeight: 600,
    component: Resume,
    showInDock: true,
  },
};

export const dockApps = Object.values(appRegistry).filter((a) => a.showInDock);
