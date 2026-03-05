import { useDesktop } from '../../context/DesktopContext';
import { appRegistry } from '../../data/appRegistry';
import './Dock.css';

export function Dock() {
  const { state, dispatch } = useDesktop();

  // Only show apps that have open windows
  const openAppIds = [...new Set(state.windows.map((w) => w.appId))];

  if (openAppIds.length === 0) return null;

  return (
    <div className="dock">
      {openAppIds.map((appId) => {
        const app = appRegistry[appId];
        if (!app) return null;
        const windows = state.windows.filter((w) => w.appId === appId);
        const hasVisible = windows.some((w) => !w.isMinimized);
        return (
          <button
            key={appId}
            className={`dock__icon ${hasVisible ? 'dock__icon--active' : ''}`}
            title={app.title}
            onClick={() => {
              if (hasVisible) {
                // Minimize all visible windows of this app
                windows
                  .filter((w) => !w.isMinimized)
                  .forEach((w) =>
                    dispatch({ type: 'MINIMIZE_WINDOW', id: w.id })
                  );
              } else {
                // Restore the most recent minimized window
                const minimized = windows.find((w) => w.isMinimized);
                if (minimized) {
                  dispatch({ type: 'FOCUS_WINDOW', id: minimized.id });
                }
              }
            }}
          >
            <span className="dock__icon-emoji">{app.icon}</span>
            <span className="dock__indicator" />
          </button>
        );
      })}
    </div>
  );
}
