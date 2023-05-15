import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Coords } from "../types";
import { EntityType } from "../../app/slvs/slvsEntitiesSlice";

interface WorkspaceState {
  pointer: Coords;
  mode: number[] | EntityType;
}

const initialState: WorkspaceState = {
  pointer: [0, 0],
  mode: [],
};

export const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setPointer: (state, action: PayloadAction<Coords>) => {
      state.pointer = action.payload;
    },
    setMode: (state, action: PayloadAction<EntityType>) => {
      console.log(`Set mode to: ${action.payload}`);
      state.mode = action.payload;
    },
    clearMode: (state) => {
      console.log("Clear mode");
      state.mode = [];
    },
  },
});

export const { setPointer, setMode, clearMode } = canvasSlice.actions;
export default canvasSlice.reducer;
