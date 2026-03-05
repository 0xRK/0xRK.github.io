import type { WindowState } from '../../types/desktop';
import { useDesktop } from '../../context/DesktopContext';
import { appRegistry } from '../../data/appRegistry';
import { useWindowDrag } from './useWindowDrag';
import { useWindowResize } from './useWindowResize';
import './Window.css';

interface WindowProps {
  windowState: WindowState;
}

export function Window({ windowState }: WindowProps) {
  const { dispatch } = useDesktop();
  const app = appRegistry[windowState.appId];
  const AppComponent = app?.component;

  const { onMouseDown: onTitleBarMouseDown } = useWindowDrag(
    windowState.id,
    windowState.x,
    windowState.y,
    dispatch
  );

  const { onResizeMouseDown } = useWindowResize(
    windowState.id,
    windowState.width,
    windowState.height,
    dispatch
  );

  if (!AppComponent) return null;

  return (
    <div
      className={`window ${windowState.isMaximized ? 'window--maximized' : ''}`}
      style={{
        left: windowState.x,
        top: windowState.y,
        width: windowState.width,
        height: windowState.height,
        zIndex: windowState.zIndex,
      }}
      onMouseDown={() => dispatch({ type: 'FOCUS_WINDOW', id: windowState.id })}
    >
      <div
        className="window__titlebar"
        onMouseDown={onTitleBarMouseDown}
        onDoubleClick={() =>
          dispatch({ type: 'TOGGLE_MAXIMIZE', id: windowState.id })
        }
      >
        <div className="window__controls">
          <button
            className="window__btn window__btn--close"
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: 'CLOSE_WINDOW', id: windowState.id });
            }}
          />
          <button
            className="window__btn window__btn--minimize"
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: 'MINIMIZE_WINDOW', id: windowState.id });
            }}
          />
          <button
            className="window__btn window__btn--maximize"
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: 'TOGGLE_MAXIMIZE', id: windowState.id });
            }}
          />
        </div>
        <span className="window__title">
          {app.icon} {windowState.title}
        </span>
        <div className="window__controls-spacer" />
      </div>
      <div className="window__content">
        <AppComponent windowId={windowState.id} />
      </div>
      {!windowState.isMaximized && (
        <div className="window__resize-handle" onMouseDown={onResizeMouseDown} />
      )}
    </div>
  );
}
