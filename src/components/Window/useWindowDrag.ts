import { useCallback, useRef } from 'react';
import type { DesktopAction } from '../../types/desktop';

interface DragState {
  offsetX: number;
  offsetY: number;
}

export function useWindowDrag(
  windowId: string,
  x: number,
  y: number,
  dispatch: React.Dispatch<DesktopAction>
) {
  const dragRef = useRef<DragState | null>(null);
  const posRef = useRef({ x, y });
  posRef.current = { x, y };

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('.window__btn')) return;
      e.preventDefault();
      dispatch({ type: 'FOCUS_WINDOW', id: windowId });

      dragRef.current = {
        offsetX: e.clientX - posRef.current.x,
        offsetY: e.clientY - posRef.current.y,
      };
      document.body.style.userSelect = 'none';

      const onMouseMove = (e: MouseEvent) => {
        if (!dragRef.current) return;
        dispatch({
          type: 'MOVE_WINDOW',
          id: windowId,
          x: e.clientX - dragRef.current.offsetX,
          y: Math.max(32, e.clientY - dragRef.current.offsetY),
        });
      };

      const onMouseUp = () => {
        dragRef.current = null;
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [windowId, dispatch]
  );

  return { onMouseDown };
}
