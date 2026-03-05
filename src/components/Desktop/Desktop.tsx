import { useDesktop } from '../../context/DesktopContext';
import { TopPanel } from '../TopPanel/TopPanel';
import { Dock } from '../Dock/Dock';
import { Window } from '../Window/Window';
import './Desktop.css';

// Icons positioned on furniture surfaces (percentage-based)
// Left bookshelf: ~3-28% horizontal, shelves at ~28%, 40%, 52%, 64% vertical
// Center bookshelf: ~30-58% horizontal, shelves at ~20%, 33%, 45%, 57% vertical
// Desk: ~66-77% horizontal, surface at ~57% vertical
interface DesktopIcon {
  appId?: string;
  label: string;
  icon: string;
  top: string;
  left: string;
}

const desktopIcons: DesktopIcon[] = [
  // Left shelf, row 1
  { appId: 'about-me',     label: 'About Me',      icon: '👤', top: '27%', left: '8%' },
  { appId: 'projects',     label: 'Projects',       icon: '📁', top: '27%', left: '16%' },
  // Left shelf, row 2
  { appId: 'contact',      label: 'Contact',        icon: '✉️', top: '39%', left: '8%' },
  { appId: 'terminal',     label: 'Terminal',        icon: '💻', top: '39%', left: '16%' },
  // Center shelf, row 1
  { appId: 'text-editor',  label: 'Text Editor',    icon: '📝', top: '19%', left: '36%' },
  { appId: 'music-player', label: 'Music Player',   icon: '🎵', top: '19%', left: '44%' },
  { appId: 'file-manager', label: 'Files',           icon: '🗂️', top: '19%', left: '52%' },
  // On the desk
  { appId: 'about-me',     label: "Rishi's PC",     icon: '🖥️', top: '61.5%', left: '68.5%' },
  {                         label: 'lamp.jpg',        icon: '💡', top: '53%', left: '69%' },
  {                         label: 'Recycle Bin',     icon: '🗑️', top: '76%', left: '74%' },
];

export function Desktop() {
  const { state, dispatch } = useDesktop();

  return (
    <div className="desktop">
      <TopPanel />
      <Dock />
      <div className="desktop__icons">
        {desktopIcons.map(({ appId, label, icon, top, left }) => (
          <button
            key={`${label}-${top}-${left}`}
            className="desktop__icon"
            style={{ top, left }}
            onDoubleClick={() => appId && dispatch({ type: 'OPEN_WINDOW', appId })}
          >
            <span className="desktop__icon-emoji">{icon}</span>
            <span className="desktop__icon-label">{label}</span>
          </button>
        ))}
      </div>
      <div className="desktop__window-layer">
        {state.windows
          .filter((w) => !w.isMinimized)
          .map((w) => (
            <Window key={w.id} windowState={w} />
          ))}
      </div>
    </div>
  );
}
