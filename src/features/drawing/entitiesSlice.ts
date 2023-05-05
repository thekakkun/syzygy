import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Coords } from "../workspace/cursorSlice";
import { SliceState } from "../types";
import { invoke } from "@tauri-apps/api";

export interface EntityHandle {
  h: number;
  phantom: null;
}

interface EntityData {}

export interface Point extends EntityData {
  x: number;
  y: number;
}

interface Line extends EntityData {
  p1: Point;
  p2: Point;
}

interface Entities {
  [h: number]: EntityData;
}

interface EntitiesState extends SliceState {
  entities: Entities;
}

const initialState: EntitiesState = {
  entities: {} as Entities,
  status: "idle",
  error: null,
};

export const addPoint = createAsyncThunk(
  "entities/AddPoint",
  async (point_data: { group: number; x: number; y: number }) => {
    let { group, x, y } = point_data;
    const response: EntityHandle = await invoke("add_point", {
      group,
      x,
      y,
    });

    return { [response.h]: { x, y } } as Entities;
  }
);

export const entitiesSlice = createSlice({
  name: "entities",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(addPoint.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(addPoint.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entities = { ...state.entities, ...action.payload };
      })
      .addCase(addPoint.rejected, (state, action) => {
        state.status = "failed";
        state.error = "could not add point";
      });
  },
});

export default entitiesSlice.reducer;
