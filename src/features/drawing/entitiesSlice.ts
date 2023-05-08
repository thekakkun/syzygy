import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api";
import { Coords, SliceState } from "../types";

export interface EntityHandle {
  handle: number;
  phantom: null;
}

interface EntityData {
  h: number;
}

export interface Point extends EntityData, Coords {}

export const addPoint = createAsyncThunk(
  "entities/addPoint",
  async (arg: { group: number; point: Coords }) => {
    let { group, point } = arg;

    const response: EntityHandle = await invoke("add_point", {
      group,
      x: point.x,
      y: point.y,
    });

    return response;
  }
);

interface Line extends EntityData {
  p1: Point;
  p2: Point;
}

const entitiesAdapter = createEntityAdapter<EntityData>({
  selectId: (entity) => entity.h,
  sortComparer: (a, b) => a.h - b.h,
});

const entitiesSlice = createSlice({
  name: "entities",
  initialState: entitiesAdapter.getInitialState({
    status: "idle",
    error: null,
  } as SliceState),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addPoint.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(addPoint.fulfilled, (state, action) => {
        console.log(action.payload);
        entitiesAdapter.addOne(state, {
          h: action.payload.handle,
          x: action.meta.arg.point.x,
          y: action.meta.arg.point.y,
        } as Point);
        state.status = "succeeded";
      })
      .addCase(addPoint.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
        console.log(action.error.message)
      });
  },
});

export const {} = entitiesSlice.actions;

export default entitiesSlice.reducer;
