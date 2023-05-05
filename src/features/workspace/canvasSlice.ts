import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EntityHandle, Point } from "../drawing/entitiesSlice";
import { SliceState } from "../types";
import { invoke } from "@tauri-apps/api";
import { MouseEvent } from "react";

interface CanvasState extends SliceState {
  canvas: undefined | EntityHandle;
  pointer: Point;
}

const initialState: CanvasState = {
  canvas: undefined,
  pointer: { x: 0, y: 0 },
  status: "idle",
  error: null,
};

export const initCanvas = createAsyncThunk("canvas/initCanvas", async () => {
  let res: EntityHandle = await invoke("init_canvas");
  return res;
});

export const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setPointer: (state, action: PayloadAction<Point>) => {
      state.pointer = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(initCanvas.pending, (state, action) => {
        state.status = "idle";
      })
      .addCase(initCanvas.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.canvas = action.payload;
      })
      .addCase(initCanvas.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export const { setPointer } = canvasSlice.actions;
export default canvasSlice.reducer;
