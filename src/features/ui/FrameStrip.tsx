'use client'

import { FC, useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { useFrameExtractor } from '@core'

interface FrameStripProps {
  video: File
  duration: number
  currentTime: number
  onFrameClick: (timestamp: number) => void
}

const FrameStrip: FC<FrameStripProps> = ({ video, duration, currentTime, onFrameClick }) => {
  const { frames, isLoading } = useFrameExtractor({ video, duration })
  const stripRef = useRef<HTMLDivElement>(null)
  const [cursorPosition, setCursorPosition] = useState(0)

  useEffect(() => {
    if (!frames.length || !stripRef.current) return

    const stripWidth = stripRef.current.clientWidth - 2
    const totalDuration = frames[frames.length - 1].timestamp
    const position = (currentTime / totalDuration) * stripWidth

    setCursorPosition(Math.min(stripWidth, Math.max(0, position)))
  }, [currentTime, frames])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div ref={stripRef} className="">
        {/* <div
          className={styles.cursor}
          style={{
            transform: `translateX(${cursorPosition}px)`,
          }}
        /> */}
        <div className="flex w-260 overflow-x-auto">
          {frames.map(({ frame, timestamp }) => {
            return (
              <Image
                className="cursor-pointer"
                key={timestamp}
                src={frame}
                alt={`Frame at ${timestamp}s`}
                data-timestamp={timestamp}
                width={120}
                height={85}
                onClick={() => onFrameClick(timestamp)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FrameStrip
