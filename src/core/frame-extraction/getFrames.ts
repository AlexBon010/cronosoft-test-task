import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

export interface Frame {
  timestamp: number
  frame: string
}

const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'

const getExtractedFrames = async (ffmpeg: FFmpeg, duration: number): Promise<Frame[]> => {
  try {
    const files = await ffmpeg.listDir('frames')

    const frameFilenames = Array.from(
      { length: files.length - 2 },
      (_, i) => `frames/frame_${(i + 1).toString().padStart(3, '0')}.jpg`,
    )
    const frameData = await Promise.all(frameFilenames.map(filename => ffmpeg.readFile(filename)))

    const processedFrames = frameData.map((frameData, index) => {
      const blob = new Blob([frameData as BlobPart], { type: 'image/jpeg' })
      const url = URL.createObjectURL(blob)
      
      return {
        timestamp: +(index * duration * 100 / (files.length - 2)).toFixed(2),
        frame: url,
      }
    })
    return processedFrames
  } catch (error) {
    console.error(error)
    return []
  }
}

const getFrames = async (video: File, duration: number): Promise<Frame[]> => {
  try {
    const ffmpeg = new FFmpeg()

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })
    await Promise.all([ffmpeg.createDir('inputs'), ffmpeg.createDir('frames')])

    await ffmpeg.writeFile('inputs/input.mp4', await fetchFile(video))

    await ffmpeg.exec(['-i', 'inputs/input.mp4', '-vf', 'fps=1,scale=320:-1', '-q:v', '31', 'frames/frame_%03d.jpg'])
    const frameData = await getExtractedFrames(ffmpeg, duration)

    return frameData
  } catch (error) {
    console.error(error)
    return []
  }
}
export default getFrames
