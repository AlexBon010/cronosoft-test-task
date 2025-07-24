import { FC } from 'react'
import Image from 'next/image'

import { useFrameExtractor } from '@core'

interface FrameStripProps {
  video: File
  currentTime: number
  onFrameClick: (timestamp: number) => void
}

const FrameStrip: FC<FrameStripProps> = ({ video, currentTime, onFrameClick }) => {
  const { frames, isLoading } = useFrameExtractor({ video })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex overflow-x-auto rounded-lg bg-gray-100 py-2 px-1 gap-1">
      {frames.map(({ frame, timestamp }, idx) => {
        const isActive = Math.abs(currentTime - timestamp) < 0.05
        return (
          <div
            key={frame}
            className={`flex-shrink-0 text-center cursor-pointer border-2 ${
              isActive ? 'border-blue-500' : 'border-transparent'
            } rounded`}
            onClick={() => onFrameClick(timestamp)}
            style={{ width: 80 }}
          >
            <Image src={frame} alt={`Frame at ${timestamp.toFixed(2)}s`} width={80} height={45} className="rounded" />
            {/* <span className="text-xs text-gray-500">{timestamp.toFixed(1)}s</span> */}
          </div>
        )
      })}
    </div>
  )
}

export default FrameStrip
