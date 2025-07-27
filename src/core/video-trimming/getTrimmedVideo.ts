import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'

const getTrimmedVideo = async (video: File, startTime: number, endTime: number): Promise<string | null> => {
  try {
    const ffmpeg = new FFmpeg()

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })

    const videoData = await fetchFile(video)
    await ffmpeg.writeFile('input.mp4', videoData)

    await ffmpeg.exec([
      '-ss',
      startTime.toString(),
      '-i',
      'input.mp4',
      '-t',
      (endTime - startTime).toString(),
      '-c:v',
      'libx264',
      '-c:a',
      'aac',
      '-strict',
      'experimental',
      'output.mp4',
    ])

    const outputData = await ffmpeg.readFile('output.mp4')
    const trimmedVideo = new Blob([outputData as BlobPart], { type: 'video/mp4' })

    return URL.createObjectURL(trimmedVideo)
  } catch (error) {
    console.error('Error trimming video:', error)
    return null
  }
}

export default getTrimmedVideo
