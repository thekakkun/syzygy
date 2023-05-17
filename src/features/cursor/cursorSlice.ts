import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Coords } from "../types";

interface CursorState {
  coord: Coords;
}

const initialState: CursorState = {
  coord: [0, 0],
};

export const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setCoord: (state, action: PayloadAction<Coords>) => {
      state.coord = action.payload;
    },
  },
});

export const { setCoord } = canvasSlice.actions;
export default canvasSlice.reducer;
