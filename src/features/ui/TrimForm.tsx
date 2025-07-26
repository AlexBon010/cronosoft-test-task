'use client'

import { FC, FormEvent, useEffect, useState } from 'react'
import { getTrimmedVideo } from '@core'

interface TrimFormProps {
  video: File
  duration: number
  externalStart?: number | null
  externalEnd?: number | null
}

interface Range {
  start: number
  end: number
}

const TrimForm: FC<TrimFormProps> = ({ video, duration, externalStart, externalEnd }) => {
  const [{ start, end }, setRange] = useState<Range>({
    start: 0,
    end: 0,
  })
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    setRange({
      start: externalStart || 0,
      end: externalEnd || 0,
    })
  }, [externalStart, externalEnd])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!video || start >= end || end > duration) return

    try {
      setIsProcessing(true)
      const videoUrl = await getTrimmedVideo(video, start, end)

      if (!videoUrl) {
        throw new Error('Failed to trim video')
      }

      const extension = video.name.split('.').pop() || 'mp4'

      const a = document.createElement('a')
      a.href = videoUrl
      a.download = `trimmed_${Math.floor(Date.now() / 1000)}.${extension}`
      document.body.appendChild(a)
      a.click()

      document.body.removeChild(a)
      URL.revokeObjectURL(videoUrl)
    } catch (error) {
      console.error('Error trimming video:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
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
            step={0.01}
            max={duration}
            value={start}
            onChange={e => setRange(prev => ({ ...prev, start: Number(e.target.value) }))}
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
            step={0.01}
            max={duration}
            value={end}
            onChange={e => setRange(prev => ({ ...prev, end: Number(e.target.value) }))}
            className="px-3 py-2 border rounded"
          />
        </div>
      </div>
      <button type="submit" disabled={isProcessing} className="cursor-pointer">
        {isProcessing ? 'Processing...' : 'Download'}
      </button>
    </form>
  )
}

export default TrimForm
