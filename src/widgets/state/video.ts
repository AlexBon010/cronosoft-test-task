type VideoAction =
  | { type: 'SET_FILE'; payload: File }
  | { type: 'SET_URL'; payload: string }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'RESET' }

export interface VideoState {
  videoFile: File | null
  videoUrl: string | null
  currentTime: number
  duration: number
}

export const initialVideoState: VideoState = {
  videoFile: null,
  videoUrl: null,
  currentTime: 0,
  duration: 0,
}

export const videoReducer = (state: VideoState, action: VideoAction): VideoState => {
  switch (action.type) {
    case 'SET_FILE':
      return { ...state, videoFile: action.payload }
    case 'SET_URL':
      return { ...state, videoUrl: action.payload }
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload }
    case 'SET_DURATION':
      return { ...state, duration: action.payload }
    case 'RESET':
      return initialVideoState
    default:
      return state
  }
}
