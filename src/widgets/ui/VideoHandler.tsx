'use client'

import { ChangeEvent, FC, useReducer, useRef } from 'react'

import { initialVideoState, videoReducer } from '../state/video'

import { FrameStrip, Video } from '@features'

const VideoHandler: FC = () => {
  const [{ videoFile, videoUrl, currentTime }, dispatch] = useReducer(videoReducer, initialVideoState)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      dispatch({ type: 'RESET' })
      return
    }
    dispatch({ type: 'SET_FILE', payload: file })
    dispatch({ type: 'SET_URL', payload: URL.createObjectURL(file) })
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      dispatch({ type: 'SET_CURRENT_TIME', payload: videoRef.current.currentTime })
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      dispatch({ type: 'SET_DURATION', payload: videoRef.current.duration })
    }
  }

  const handleSeek = (time: number) => {
    if (!videoRef.current) throw new Error('Video ref is not set')
    videoRef.current.currentTime = time
    dispatch({ type: 'SET_CURRENT_TIME', payload: time })
  }

  return (
    <div className="flex flex-col items-center">
      <Video
        video={videoUrl}
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onFileChange={handleFileChange}
      />
      {videoFile && <FrameStrip video={videoFile} currentTime={currentTime} onFrameClick={handleSeek} />}
    </div>
  )
}

export default VideoHandler
