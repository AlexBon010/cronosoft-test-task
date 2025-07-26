export const MIN_WIDTH = 10;
export const HANDLE_WIDTH = 5;

export interface TrimDraggableSectionState  {
  width: number;
  left: number;
  action: null | 'move' | 'resize-left' | 'resize-right';
  startX: number;
  startWidth: number;
  startLeft: number;
};
export const initialState:TrimDraggableSectionState = {
  width: 120,
  left: 0,
  action: null,
  startX: 0,
  startWidth: 0,
  startLeft: 0,
}

export type TrimDraggableSectionAction =
  | { type: 'START_DRAG'; payload: { action: TrimDraggableSectionState['action']; clientX: number } }
  | { type: 'MOVE'; payload: { clientX: number; scrollWidth: number } }
  | { type: 'RESIZE_RIGHT'; payload: { clientX: number; scrollWidth: number } }
  | { type: 'RESIZE_LEFT'; payload: { clientX: number } }
  | { type: 'END_DRAG' };

export const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

export const trimDraggableSectionReducer = (
  state: TrimDraggableSectionState,
  action: TrimDraggableSectionAction
): TrimDraggableSectionState => {
  switch (action.type) {
    case 'START_DRAG':
      return {
        ...state,
        action: action.payload.action,
        startX: action.payload.clientX,
        startWidth: state.width,
        startLeft: state.left,
      };
    case 'MOVE': {
      const { clientX, scrollWidth } = action.payload;
      const deltaX = clientX - state.startX;
      const newLeft = clamp(state.startLeft + deltaX, 0, scrollWidth - state.width);
      return { ...state, left: newLeft };
    }
    case 'RESIZE_RIGHT': {
      const { clientX, scrollWidth } = action.payload;
      const deltaX = clientX - state.startX;
      const newWidth = clamp(state.startWidth + deltaX, MIN_WIDTH, scrollWidth - state.left);
      return { ...state, width: newWidth };
    }
    case 'RESIZE_LEFT': {
      const { clientX } = action.payload;
      const deltaX = clientX - state.startX;
      const newLeft = clamp(state.startLeft + deltaX, 0, state.startLeft + state.startWidth - MIN_WIDTH);
      const newWidth = state.startWidth - (newLeft - state.startLeft);
      return { ...state, left: newLeft, width: newWidth };
    }
    case 'END_DRAG':
      return { ...state, action: null };
    default:
      return state;
  }
}; 