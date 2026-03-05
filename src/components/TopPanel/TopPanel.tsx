import { useState, useEffect } from 'react';
import './TopPanel.css';

export function TopPanel() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatted = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const clock = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="top-panel">
      <div className="top-panel__left">
        <span className="top-panel__activities">Activities</span>
      </div>
      <div className="top-panel__center">
        <span>{formatted} {clock}</span>
      </div>
      <div className="top-panel__right">
        <span className="top-panel__tray-icon" title="Volume">🔊</span>
        <span className="top-panel__tray-icon" title="Network">📶</span>
        <span className="top-panel__tray-icon" title="Battery">🔋</span>
        <span className="top-panel__tray-icon" title="Power">⏻</span>
      </div>
    </div>
  );
}
