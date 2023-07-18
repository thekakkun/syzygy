import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { EntityHandle } from "../../app/slvs/slvsEntitiesSlice";
import { ObjectHandle } from "../../app/slvs/slvsObjectsSlice";

export type Selection =
  | {
      type: "object";
      handles: ObjectHandle[];
    }
  | {
      type: "entity";
      handles: EntityHandle[];
    };

const initialState = { type: "object", handles: [] } as Selection;

export const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    clearSelection: () => {
      return initialState;
    },
    toggleSelection: (
      state,
      action: PayloadAction<
        | { type: "object"; handle: ObjectHandle }
        | { type: "entity"; handle: EntityHandle }
      >
    ) => {
      if (state.type === "object" && action.payload.type === "object") {
        const ix = state.handles.indexOf(action.payload.handle);

        if (ix === -1) {
          state.handles.push(action.payload.handle);
        } else {
          state.handles.splice(ix, 1);
        }
      } else if (state.type === "entity" && action.payload.type === "entity") {
        const { type: entityType, handle: entityHandle } =
          action.payload.handle;
        const ix = state.handles.findIndex(
          (handle) =>
            handle.type === entityType && handle.handle === entityHandle
        );

        if (ix === -1) {
          state.handles.push(action.payload.handle);
        } else {
          state.handles.splice(ix, 1);
        }
      } else {
        state.type = action.payload.type;
        state.handles = [action.payload.handle] as typeof state.handles;
      }
    },
  },
});

export const { clearSelection, toggleSelection } = selectionSlice.actions;
export default selectionSlice.reducer;
