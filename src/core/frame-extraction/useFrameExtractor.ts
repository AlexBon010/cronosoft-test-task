import { useEffect, useState } from 'react'

import getFrames, { Frame } from './getFrames'

interface UseFrameExtractorProps {
  video: File
  duration: number
}

interface UseFrameExtractorReturn {
  isLoading: boolean
  frames: Frame[]
}

const useFrameExtractor = ({ video, duration }: UseFrameExtractorProps): UseFrameExtractorReturn => {
  const [frames, setFrames] = useState<Frame[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getFramesTemp = async () => {
      try {
        setIsLoading(true)
        const frames = await getFrames(video, duration)
        setFrames(frames)
      } catch (error) {
        setFrames([])
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    getFramesTemp()
  }, [duration, video])

  return {
    frames,
    isLoading,
  }
}

export default useFrameExtractor
