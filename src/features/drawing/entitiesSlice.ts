import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api";
import { Coords, SliceState, Handle } from "../types";

type Entity = Point | Line;

interface EntityHandle {
  handle: Handle;
}

interface PointData {
  group: number;
  workplane: Handle;
  coords: [number, number];
}

interface Point extends EntityHandle {
  type: "Point";
  data: PointData;
}

interface LineData {
  group: number;
  workplane: Handle;
  point_a: Handle;
  point_b: Handle;
}

interface Line extends EntityHandle {
  type: "Line";
  data: LineData;
}

// const entitiesAdapter = createEntityAdapter<Entity>({
//   selectId: (entity) => entity.handle.handle,
//   sortComparer: (a, b) => a.handle.handle - b.handle.handle,
// });

// export const addPoint = createAsyncThunk(
//   "entities/addPoint",
//   async (arg: { group: number; point: Coords }) => {
//     let { group, point } = arg;

//     const response: EntityHandle = await invoke("add_point", {
//       group,
//       x: point.x,
//       y: point.y,
//     });

//     return response;
//   }
// );

// const entitiesSlice = createSlice({
//   name: "entities",
//   initialState: entitiesAdapter.getInitialState({
//     status: "idle",
//     error: null,
//   } as SliceState),
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(addPoint.pending, (state) => {
//         state.status = "pending";
//       })
//       .addCase(addPoint.fulfilled, (state, action) => {
//         entitiesAdapter.addOne(state, {
//           handle: action.payload.handle,
//           x: action.meta.arg.point.x,
//           y: action.meta.arg.point.y,
//         } as Point);
//         state.status = "succeeded";
//       })
//       .addCase(addPoint.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message ?? null;
//       });
//   },
// });

// export const {} = entitiesSlice.actions;
// export default entitiesSlice.reducer;
