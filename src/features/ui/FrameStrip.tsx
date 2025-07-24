'use client'

import { FC, useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { useFrameExtractor } from '@core'
import styles from './FrameStrip.module.css'

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

    const stripWidth = stripRef.current.clientWidth - 2
    const totalDuration = frames[frames.length - 1].timestamp
    const position = (currentTime / totalDuration) * stripWidth

    setCursorPosition(Math.min(stripWidth, Math.max(0, position)))
  }, [currentTime, frames])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.strip}>
      <div ref={stripRef} className={styles.container}>
        <div
          className={styles.cursor}
          style={{
            transform: `translateX(${cursorPosition}px)`,
          }}
        />
        {frames.map(({ frame, timestamp }) => {
          return (
            <div key={frame} className={styles.item} onClick={() => onFrameClick(timestamp)}>
              <Image src={frame} alt={`Frame at ${timestamp.toFixed(2)}s`} width={120} height={85} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FrameStrip
