import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type ElementType = "group" | "entity";
export interface Selection {
  type: ElementType;
  handles: number[];
}

const initialState = { type: "group", handles: [] } as Selection;

export const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    clearSelection: (state) => {
      state = initialState;
    },
    toggleSelection: (
      state,
      action: PayloadAction<{ type: ElementType; handle: number }>
    ) => {
      if (state.type === action.payload.type) {
        const ix = state.handles.indexOf(action.payload.handle);

        if (ix == -1) {
          state.handles = [...state.handles, action.payload.handle];
        } else {
          state.handles = [
            ...state.handles.slice(0, ix),
            ...state.handles.slice(ix + 1),
          ];
        }
      } else {
        state.type = action.payload.type;
        state.handles = [action.payload.handle];
      }
    },
  },
});

export const { clearSelection, toggleSelection } = selectionSlice.actions;
export default selectionSlice.reducer;
