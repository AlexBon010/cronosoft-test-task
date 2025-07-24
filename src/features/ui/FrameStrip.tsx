'use client'

import { FC, useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { useFrameExtractor } from '@core'

interface FrameStripProps {
  video: File
  currentTime: number
  onFrameClick: (timestamp: number) => void
}

const FrameStrip: FC<FrameStripProps> = ({ video, currentTime, onFrameClick }) => {
  const { frames, isLoading } = useFrameExtractor({ video })
  const stripRef = useRef<HTMLDivElement>(null)
  const [cursorPosition, setCursorPosition] = useState(0)

  useEffect(() => {
    if (!frames.length || !stripRef.current) return

    const stripWidth = stripRef.current.scrollWidth
    const totalDuration = frames[frames.length - 1].timestamp
    const position = (currentTime / totalDuration) * stripWidth

    setCursorPosition(Math.min(stripWidth, Math.max(0, position)))
  }, [currentTime, frames])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="relative">
      <div ref={stripRef} className="flex overflow-x-auto rounded-lg">
        {frames.map(({ frame, timestamp }) => {
          return (
            <div key={frame} className="flex-shrink-0 text-center" onClick={() => onFrameClick(timestamp)}>
              <Image src={frame} alt={`Frame at ${timestamp.toFixed(2)}s`} width={80} height={45} />
              <span className="text-xs text-gray-500">{timestamp.toFixed(1)}s</span>
            </div>
          )
        })}
      </div>
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-red-500 opacity-80 z-10 pointer-events-none"
        style={{
          left: 0,
          transform: `translateX(${cursorPosition}px)`,
          transition: 'transform 0.2s linear',
        }}
      />
    </div>
  )
}

export default FrameStrip
