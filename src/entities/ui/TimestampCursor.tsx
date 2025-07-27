import { FC, useEffect, useRef } from 'react'

interface TimestampCursorProps {
  currentFrame: number
  frameWidth: number
  framesCount: number
}

const TimestampCursor: FC<TimestampCursorProps> = ({ currentFrame, frameWidth, framesCount }) => {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cursorRef.current) return
    const clampedFrame = Math.min(Math.max(currentFrame, 0), framesCount)

    const newPosition = clampedFrame * frameWidth

    cursorRef.current.style.transform = `translateX(${newPosition}px)`
  }, [currentFrame, frameWidth, framesCount])

  return (
    <div
      ref={cursorRef}
      className="absolute left-0 will-change-transform top-0 h-full w-0.5 bg-red-500 z-10 transition-transform duration-100 ease-linear"
    />
  )
}

export default TimestampCursor
