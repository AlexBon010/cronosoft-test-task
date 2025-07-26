import { RefObject, useEffect, useState } from "react";

interface UseIntersectionProps {
  containerRef: RefObject<HTMLElement | null>;
  draggableRef: RefObject<HTMLElement | null>;
  frameWidth?: number; 
  duration: number; 
  framesCount: number;
}

interface UseIntersectionReturn {
  startTime: number | null;
  endTime: number | null;
}

const useIntersection = ({
  containerRef,
  draggableRef,
  frameWidth = 160,
  duration,
  framesCount,
}: UseIntersectionProps): UseIntersectionReturn => {
  const [range, setRange] = useState<UseIntersectionReturn>({ startTime: null, endTime: null });

  useEffect(() => {
    if (!containerRef.current || !draggableRef.current ) return;

    const container = containerRef.current;
    const draggable = draggableRef.current;

    const calculateTimes = () => {
      const containerRect = container.getBoundingClientRect();
      const draggableRect = draggable.getBoundingClientRect();

      // Учитываем скролл контейнера для абсолютного позиционирования
      const scrollLeft = container.scrollLeft;
      
      // Абсолютная позиция draggable относительно начала ленты
      const absoluteLeft = (draggableRect.left - containerRect.left) + scrollLeft;
      const absoluteRight = absoluteLeft + draggableRect.width;

      const stripWidth = frameWidth * framesCount;

      const startTime = Math.max(0, Math.min(duration, (absoluteLeft / stripWidth) * duration));
      const endTime = Math.max(0, Math.min(duration, (absoluteRight / stripWidth) * duration));

      setRange({
        startTime: Number(startTime.toFixed(2)),
        endTime: Number(endTime.toFixed(2)),
      });
    };

    calculateTimes();

    const draggableResizeObserver = new ResizeObserver(calculateTimes);
    const draggableMutationObserver = new MutationObserver(calculateTimes);

    const containerResizeObserver = new ResizeObserver(calculateTimes);

    draggableResizeObserver.observe(draggable);
    draggableMutationObserver.observe(draggable, { 
      attributes: true, 
      attributeFilter: ['style', 'class'] 
    });
    containerResizeObserver.observe(container);

    window.addEventListener('resize', calculateTimes);
    const containerScrollHandler = () => calculateTimes();
    container.addEventListener('scroll', containerScrollHandler);

    return () => {
      draggableResizeObserver.disconnect();
      draggableMutationObserver.disconnect();
      containerResizeObserver.disconnect();
      window.removeEventListener('resize', calculateTimes);
      container.removeEventListener('scroll', containerScrollHandler);
    };
  }, [containerRef, draggableRef, frameWidth, duration, framesCount]);

  return range;
};

export default useIntersection;