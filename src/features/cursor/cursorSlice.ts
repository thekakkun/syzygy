import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Coords {
  x: number;
  y: number;
}

const initialState: Coords = {
  x: 0,
  y: 0,
};

export const cursorSlice = createSlice({
  name: "cursor",
  initialState,
  reducers: {
    moveTo: (state, action: PayloadAction<Coords>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { moveTo } = cursorSlice.actions;
export default cursorSlice.reducer;
