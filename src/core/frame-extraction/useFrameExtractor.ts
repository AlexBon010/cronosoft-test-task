import { useEffect, useState } from 'react'

import getFrames, { Frame } from './getFrames'

interface UseFrameExtractorProps {
  video: File
}

interface UseFrameExtractorReturn {
  isLoading: boolean
  frames: Frame[]
}

const useFrameExtractor = ({ video }: UseFrameExtractorProps): UseFrameExtractorReturn => {
  const [frames, setFrames] = useState<Frame[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getFramesTemp = async () => {
      try {
        setIsLoading(true)
        const frames = await getFrames(video)
        setFrames(frames)
      } catch (error) {
        setFrames([])
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    getFramesTemp()
  }, [video])

  return {
    frames,
    isLoading,
  }
}

export default useFrameExtractor
