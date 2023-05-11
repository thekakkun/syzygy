import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Coords } from "../types";

interface CanvasState {
  pointer: Coords;
}

const initialState: CanvasState = {
  pointer: { x: 0, y: 0 },
};

export const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setPointer: (state, action: PayloadAction<Coords>) => {
      state.pointer = action.payload;
    },
  },
});

export const { setPointer } = canvasSlice.actions;
export default canvasSlice.reducer;
