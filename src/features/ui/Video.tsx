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
    <div className="flex items-center justify-center w-120 h-80 bg-gray-400 mb-5">
      {video ? (
        <video
          ref={ref}
          src={video}
          controls
          className="rounded bg-black object-contain w-120 h-80"
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div>
          <input type="file" id="file-upload" className="hidden" onChange={onFileChange} accept="video/*" />
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="text-xl text-gray-800">Upload Video</span>
          </label>
        </div>
      )}
    </div>
  )
}
export default Video
