import { FC, RefObject, useReducer, useEffect } from "react";
import {
  trimDraggableSectionReducer,
  TrimDraggableSectionState,
  MIN_WIDTH,
  HANDLE_WIDTH,
  initialState,
} from '../state/trimDraggableSection';

interface TrimDraggableSectionProps {
  containerRef: RefObject<HTMLDivElement | null>;
  ref: RefObject<HTMLDivElement | null>;
}

const TrimDraggableSection: FC<TrimDraggableSectionProps> = ({ ref, containerRef }) => {
  const [state, dispatch] = useReducer(trimDraggableSectionReducer, initialState);

  const handleMouseDown = (e: React.MouseEvent, action: TrimDraggableSectionState['action']) => {
    e.stopPropagation();
    dispatch({ type: 'START_DRAG', payload: { action, clientX: e.clientX } });
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    if (!state.action || !containerRef.current) return;

    const container = containerRef.current;
    const scrollWidth = container.scrollWidth;

    const onMouseMove = (e: MouseEvent) => {
      if (state.action === 'move') {
        dispatch({ type: 'MOVE', payload: { clientX: e.clientX, scrollWidth } });
      } else if (state.action === 'resize-right') {
        dispatch({ type: 'RESIZE_RIGHT', payload: { clientX: e.clientX, scrollWidth } });
      } else if (state.action === 'resize-left') {
        dispatch({ type: 'RESIZE_LEFT', payload: { clientX: e.clientX } });
      }
    };

    const onMouseUp = () => {
      dispatch({ type: 'END_DRAG' });
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [state.action, state.startX, state.startWidth, state.startLeft, state.left, containerRef]);

  return (
    <div
      ref={ref}
      className={`
        absolute top-0
        bg-amber-300 opacity-50
        min-w-[${MIN_WIDTH}px]
        ${state.action === 'move' ? 'cursor-grabbing' : 'cursor-grab'}
      `}
      style={{
        transform: `translateX(${state.left}px)`,
        width: state.width,
        height: containerRef.current?.clientHeight,
      }}
      onMouseDown={(e) => handleMouseDown(e, 'move')}
    >
      <div
        className={`
          absolute left-0 top-0 h-full
          bg-orange-500
          cursor-ew-resize
        `}
        style={{ width: HANDLE_WIDTH }}
        onMouseDown={(e) => handleMouseDown(e, 'resize-left')}
      />
      
      <div
        className={`
          absolute right-0 top-0 h-full
          bg-orange-500
          cursor-ew-resize
        `}
        style={{ width: HANDLE_WIDTH }}
        onMouseDown={(e) => handleMouseDown(e, 'resize-right')}
      />
    </div>
  );
};

export default TrimDraggableSection;