'use client'

import { ChangeEvent, FC, RefObject } from 'react'

interface VideoProps {
  video?: string | null
  ref?: RefObject<HTMLVideoElement | null>
  onTimeUpdate: () => void
  onLoadedMetadata: () => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const Video: FC<VideoProps> = ({ video, ref, onTimeUpdate, onLoadedMetadata, onFileChange }) => {
  return (
    <div className="w-120 h-80 bg-gray-400 mb-5">
      {video ? (
        <video
          ref={ref}
          src={video}
          controls
          className="mb-2 rounded bg-black object-contain"
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          style={{ width: '480px', height: '320px' }}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="mb-4">
          <input type="file" className="" onChange={onFileChange} accept="video/*" />
        </div>
      )}
    </div>
  )
}
export default Video
