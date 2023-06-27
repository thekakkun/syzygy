import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type ElementType = "group" | "entity";
export interface Selection {
  type: ElementType;
  selection: number[];
}

const initialState = { type: "group", selection: [] } as Selection;

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
        const ix = state.selection.indexOf(action.payload.handle);

        if (ix == -1) {
          state.selection = [...state.selection, action.payload.handle];
        } else {
          state.selection = [
            ...state.selection.slice(0, ix),
            ...state.selection.slice(ix + 1),
          ];
        }
      } else {
        
        state.type = action.payload.type;
        state.selection = [action.payload.handle];
      }
    },
  },
});

export const { clearSelection, toggleSelection } = selectionSlice.actions;
export default selectionSlice.reducer;
