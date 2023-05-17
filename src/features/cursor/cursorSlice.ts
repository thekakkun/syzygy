import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Coords } from "../types";
import { EntityName } from "../../app/slvs/slvsEntitiesSlice";

interface CursorState {
  coord: Coords;
  mode: number[] | EntityName;
}

interface EntityBuilder {
  type: EntityName;
  coords:
    | [Coords?]
    | [Coords?, Coords?]
    | [Coords?, Coords?, Coords?]
    | [Coords?, Coords?, Coords?, Coords?];
  onClick: (coord: Coords) => void;
}

interface PointBuilder extends EntityBuilder {
  type: "Point";
  coords: [Coords?];
}

const initialState: CursorState = {
  coord: [0, 0],
  mode: [],
};

export const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setCoord: (state, action: PayloadAction<Coords>) => {
      state.coord = action.payload;
    },
    setMode: (state, action: PayloadAction<EntityName>) => {
      console.log(`Set mode to: ${action.payload}`);
      state.mode = action.payload;
    },
    clearMode: (state) => {
      console.log("Clear mode");
      state.mode = [];
    },
  },
});

export const { setCoord } = canvasSlice.actions;
export default canvasSlice.reducer;
