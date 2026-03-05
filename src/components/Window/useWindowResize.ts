import { useCallback, useRef } from 'react';
import type { DesktopAction } from '../../types/desktop';

interface ResizeState {
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
}

export function useWindowResize(
  windowId: string,
  width: number,
  height: number,
  dispatch: React.Dispatch<DesktopAction>
) {
  const resizeRef = useRef<ResizeState | null>(null);
  const sizeRef = useRef({ width, height });
  sizeRef.current = { width, height };

  const onResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch({ type: 'FOCUS_WINDOW', id: windowId });

      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: sizeRef.current.width,
        startHeight: sizeRef.current.height,
      };
      document.body.style.userSelect = 'none';

      const onMouseMove = (e: MouseEvent) => {
        if (!resizeRef.current) return;
        const dx = e.clientX - resizeRef.current.startX;
        const dy = e.clientY - resizeRef.current.startY;
        dispatch({
          type: 'RESIZE_WINDOW',
          id: windowId,
          width: resizeRef.current.startWidth + dx,
          height: resizeRef.current.startHeight + dy,
        });
      };

      const onMouseUp = () => {
        resizeRef.current = null;
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [windowId, dispatch]
  );

  return { onResizeMouseDown };
}
