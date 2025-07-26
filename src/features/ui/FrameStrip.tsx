'use client'

import { FC, useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { useFrameExtractor } from '@core'
import { TimestampCursor, TrimDraggableSection, useIntersection } from '@entities'
import { TrimForm } from '@features'

interface FrameStripProps {
  video: File
  duration: number
  currentTime: number
  onFrameClick: (timestamp: number) => void
}

const FrameStrip: FC<FrameStripProps> = ({ video, duration, onFrameClick, currentTime }) => {
  const { frames, isLoading } = useFrameExtractor({ video, duration })

  const stripRef = useRef<HTMLDivElement>(null)
  const draggableElRef = useRef<HTMLDivElement>(null)

  const { startTime, endTime } = useIntersection({
    draggableRef: draggableElRef,
    containerRef: stripRef,
    framesCount: frames.length,
    duration,
  })

  console.log(startTime, endTime)
  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <div>
      {video && <TrimForm video={video} duration={duration * 100} externalStart={startTime} externalEnd={endTime} />}

      <div ref={stripRef} className="relative max-w-260 overflow-x-auto">
        <TimestampCursor currentFrame={currentTime} frameWidth={160} framesCount={frames.length} />
        <TrimDraggableSection ref={draggableElRef} containerRef={stripRef} />
        <div className="flex h-23">
          {frames.map(({ frame, timestamp }) => {
            return (
              <div className="w-40 shrink-0" key={timestamp}>
                <Image
                  className="cursor-pointer w-full h-full"
                  src={frame}
                  alt={`Frame at ${timestamp}s`}
                  width={160}
                  height={92}
                  onClick={() => onFrameClick(timestamp)}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FrameStrip
