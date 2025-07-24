'use client'

import { FC, FormEvent } from 'react'
import { getTrimmedVideo } from '@core'

interface TrimFormProps {
  video: File
  duration: number
}

const TrimForm: FC<TrimFormProps> = ({ video, duration }) => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const startTime = Number(formData.get('startTime'))
    const endTime = Number(formData.get('endTime'))

    if (!video || startTime >= endTime || endTime > duration) return

    const trimmedVideo = await getTrimmedVideo(video, startTime, endTime)
    if (!trimmedVideo) return

    const a = document.createElement('a')
    a.href = trimmedVideo
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(trimmedVideo)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
      <h3 className="text-lg font-bold">Trim Video</h3>
      <div className="flex gap-4">
        <div className="flex flex-col">
          <label htmlFor="startTime" className="text-sm text-gray-600 mb-1">
            Start time
          </label>
          <input
            type="number"
            id="startTime"
            name="startTime"
            min={0}
            max={duration}
            className="px-3 py-2 border rounded"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="endTime" className="text-sm text-gray-600 mb-1">
            End time
          </label>
          <input
            type="number"
            id="endTime"
            name="endTime"
            min={0}
            max={duration}
            className="px-3 py-2 border rounded"
          />
        </div>
      </div>
      <button type="submit">Download</button>
    </form>
  )
}

export default TrimForm
