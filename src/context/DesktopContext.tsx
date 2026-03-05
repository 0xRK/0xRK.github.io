import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { DesktopState, DesktopAction } from '../types/desktop';
import { appRegistry } from '../data/appRegistry';

const TOP_PANEL_HEIGHT = 32;

const initialState: DesktopState = {
  windows: [],
  nextZIndex: 1,
  instanceCounter: 0,
};

function desktopReducer(state: DesktopState, action: DesktopAction): DesktopState {
  switch (action.type) {
    case 'OPEN_WINDOW': {
      const app = appRegistry[action.appId];
      if (!app) return state;
      const offset = (state.instanceCounter * 30) % 150;
      const newWindow = {
        id: `${action.appId}-${state.instanceCounter}`,
        appId: action.appId,
        title: app.title,
        x: Math.max(64, (window.innerWidth - app.defaultWidth) / 2 + offset),
        y: Math.max(TOP_PANEL_HEIGHT, (window.innerHeight - app.defaultHeight) / 2 + offset),
        width: app.defaultWidth,
        height: app.defaultHeight,
        zIndex: state.nextZIndex,
        isMinimized: false,
        isMaximized: false,
      };
      return {
        ...state,
        windows: [...state.windows, newWindow],
        nextZIndex: state.nextZIndex + 1,
        instanceCounter: state.instanceCounter + 1,
      };
    }
    case 'CLOSE_WINDOW':
      return {
        ...state,
        windows: state.windows.filter((w) => w.id !== action.id),
      };
    case 'FOCUS_WINDOW':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? { ...w, zIndex: state.nextZIndex, isMinimized: false }
            : w
        ),
        nextZIndex: state.nextZIndex + 1,
      };
    case 'MINIMIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, isMinimized: true } : w
        ),
      };
    case 'TOGGLE_MAXIMIZE':
      return {
        ...state,
        windows: state.windows.map((w) => {
          if (w.id !== action.id) return w;
          if (w.isMaximized) {
            return {
              ...w,
              isMaximized: false,
              x: w.prevBounds?.x ?? 100,
              y: w.prevBounds?.y ?? 100,
              width: w.prevBounds?.width ?? 600,
              height: w.prevBounds?.height ?? 400,
              prevBounds: undefined,
            };
          }
          return {
            ...w,
            isMaximized: true,
            prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
            x: 0,
            y: TOP_PANEL_HEIGHT,
            width: window.innerWidth,
            height: window.innerHeight - TOP_PANEL_HEIGHT,
          };
        }),
        nextZIndex: state.nextZIndex + 1,
      };
    case 'MOVE_WINDOW':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, x: action.x, y: action.y } : w
        ),
      };
    case 'RESIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? {
                ...w,
                width: Math.max(300, action.width),
                height: Math.max(200, action.height),
              }
            : w
        ),
      };
    default:
      return state;
  }
}

const DesktopContext = createContext<{
  state: DesktopState;
  dispatch: React.Dispatch<DesktopAction>;
} | null>(null);

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(desktopReducer, initialState);
  return (
    <DesktopContext.Provider value={{ state, dispatch }}>
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktop() {
  const ctx = useContext(DesktopContext);
  if (!ctx) throw new Error('useDesktop must be used within DesktopProvider');
  return ctx;
}
