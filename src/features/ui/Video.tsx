'use client'

import { ChangeEvent, FC, useRef, useState } from 'react'
import FrameStrip from './FrameStrip'

export const Video: FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setVideoFile(null)
      setVideoUrl(null)
      setCurrentTime(0)
      setDuration(0)
      return
    }
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl)
    }
    setVideoFile(file)
    setVideoUrl(URL.createObjectURL(file))
    setCurrentTime(0)
    setDuration(0)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (time: number) => {
    if (!videoRef.current) throw new Error('Video ref is not set')
    videoRef.current.currentTime = time
    setCurrentTime(time)
  }

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value)
    handleSeek(time)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-120 h-80 bg-gray-400 mb-5">
        <div className="mb-4">
          <input type="file" className="" onChange={handleFileChange} accept="video/*" />
        </div>
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            className="mb-2 rounded bg-black object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            style={{ width: '480px', height: '320px' }}
          >
            Your browser does not support the video tag.
          </video>
        )}
        {duration > 0 && (
          <input
            type="range"
            min={0}
            max={duration}
            step={0.01}
            value={currentTime}
            onChange={handleSliderChange}
            className="w-full mt-1"
          />
        )}
      </div>

      {videoFile && <FrameStrip video={videoFile} currentTime={currentTime} onFrameClick={handleSeek} />}
    </div>
  )
}
