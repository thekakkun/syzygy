import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EntityHandle, Point } from "../drawing/entitiesSlice";
import { SliceState } from "../types";
import { invoke } from "@tauri-apps/api";
import { MouseEvent } from "react";

interface CanvasState extends SliceState {
  pointer: Point;
}

const initialState: CanvasState = {
  pointer: { x: 0, y: 0 },
  status: "idle",
  error: null,
};

export const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setPointer: (state, action: PayloadAction<Point>) => {
      state.pointer = action.payload;
    },
  },
});

export const { setPointer } = canvasSlice.actions;
export default canvasSlice.reducer;
