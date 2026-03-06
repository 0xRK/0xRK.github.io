import { useState, useCallback, useRef } from 'react';
import { useDesktop } from '../../context/DesktopContext';
import { TopPanel } from '../TopPanel/TopPanel';
import { Dock } from '../Dock/Dock';
import { Window } from '../Window/Window';
import { Cat } from '../Cat/Cat';
import './Desktop.css';

interface DesktopIcon {
  appId?: string;
  label: string;
  icon: string;
  top: string;
  left: string;
}

const initialIcons: DesktopIcon[] = [
  { appId: 'about-me',     label: 'About Me',      icon: '👤', top: '42.5%', left: '3.5%' },
  { appId: 'projects',     label: 'Projects',       icon: '📦', top: '39.9%', left: '10.5%' },
  { appId: 'contact',      label: 'My Links',        icon: '🪪', top: '37.5%', left: '17.4%' },
  { appId: 'terminal',     label: 'Terminal',        icon: '>_', top: '29.8%', left: '33.3%' },
  { appId: 'text-editor',  label: 'Text Editor',    icon: '📝', top: '26.2%', left: '39.7%' },
  { appId: 'music-player', label: 'Music Player',   icon: '🎵', top: '23.8%', left: '45.5%' },
  { appId: 'file-manager', label: 'Files',           icon: '🗂️', top: '20.9%', left: '51.4%' },
  { appId: 'resume',        label: 'Resume',          icon: '📜', top: '35.5%', left: '23%' },
  { appId: 'about-me',     label: "Rishi's PC",     icon: '🖥️', top: '62.2%', left: '70.6%' },
  {                         label: 'lamp.jpg',        icon: '💡', top: '53.7%', left: '71.9%' },
  {                         label: 'Recycle Bin',     icon: '🗑️', top: '72.4%', left: '75.1%' },
];

interface DesktopProps {
  onSignOut: () => void;
}

export function Desktop({ onSignOut }: DesktopProps) {
  const { state, dispatch } = useDesktop();
  const [icons, setIcons] = useState(initialIcons);
  const dragRef = useRef<{ index: number; offsetX: number; offsetY: number; moved: boolean } | null>(null);

  const onIconMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    // Use the CSS percentage position as anchor, not getBoundingClientRect,
    // so the transform doesn't cause a jump.
    const el = e.currentTarget as HTMLElement;
    const currentTopPct = parseFloat(el.style.top);
    const currentLeftPct = parseFloat(el.style.left);
    dragRef.current = {
      index,
      offsetX: e.clientX - (currentLeftPct / 100) * window.innerWidth,
      offsetY: e.clientY - (currentTopPct / 100) * window.innerHeight,
      moved: false,
    };
    document.body.style.userSelect = 'none';

    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      dragRef.current.moved = true;
      const topPct = ((e.clientY - dragRef.current.offsetY) / window.innerHeight) * 100;
      const leftPct = ((e.clientX - dragRef.current.offsetX) / window.innerWidth) * 100;
      setIcons((prev) =>
        prev.map((ic, i) =>
          i === dragRef.current!.index
            ? { ...ic, top: `${topPct.toFixed(1)}%`, left: `${leftPct.toFixed(1)}%` }
            : ic
        )
      );
    };

    const onMouseUp = () => {
      dragRef.current = null;
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

  const onIconDoubleClick = useCallback((appId?: string) => {
    if (appId) {
      dispatch({ type: 'OPEN_WINDOW', appId });
    }
  }, [dispatch]);

  return (
    <div className="desktop">
      <TopPanel onSignOut={onSignOut} />
      <Dock />
      <div className="desktop__sign desktop__sign--left">important</div>
      <div className="desktop__sign desktop__sign--right">misc.</div>
      <div className="desktop__icons">
        {icons.map(({ appId, label, icon, top, left }, index) => (
          <button
            key={`${label}-${index}`}
            className="desktop__icon desktop__icon--draggable"
            style={{ top, left }}
            onMouseDown={(e) => onIconMouseDown(e, index)}
            onDoubleClick={() => onIconDoubleClick(appId)}
          >
            <span className={`desktop__icon-emoji${appId === 'terminal' ? ' desktop__icon-emoji--terminal' : ''}`}>{icon}</span>
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
      <Cat />
    </div>
  );
}
