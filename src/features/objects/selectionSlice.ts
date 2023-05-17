import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { EntityName } from "../../app/slvs/slvsEntitiesSlice";
import { Coords } from "../types";
import { slvsGroupsSlice } from "../../app/slvs/slvsGroupsSlice";

export type TempEntity = TempLine | TempPoint;
interface BaseTempEntity {
  type: EntityName;
}
interface TempLine extends BaseTempEntity {
  type: "Line";
  coords: [Coords?, Coords?];
}
interface TempPoint extends BaseTempEntity {
  type: "Point";
  coords: [Coords?];
}

interface SelectionState {
  group?: number;
  selected: number[] | TempEntity;
}
const initialState = { selected: [] } as SelectionState;

export const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    activateGroup: (state, action: PayloadAction<number>) => {
      state.group = action.payload;
    },
    addTempEntity: (state, action: PayloadAction<EntityName>) => {
      switch (action.payload) {
        case "Arc":
          break;
        case "Circle":
          break;
        case "Cubic":
          break;
        case "Line":
          state.selected = {
            type: "Line",
            coords: [undefined, undefined],
          } as TempLine;
          break;
        case "Point":
          state.selected = {
            type: "Point",
            coords: [undefined],
          } as TempPoint;
          break;
      }
    },
    updateTempEntity: (state, action: PayloadAction<Coords>) => {
      if ("type" in state.selected) {
        let undefined_ix = state.selected.coords.indexOf(undefined);
        if (undefined_ix !== -1) {
          switch (state.selected.type) {
            // case "Arc":
            //   break;
            // case "Circle":
            //   break;
            // case "Cubic":
            //   break;
            case "Line":
              state.selected.coords[undefined_ix] = action.payload;

            case "Point":
              state.selected.coords[undefined_ix] = action.payload;
          }
        }
      }
    },
    clearSelection: (state) => {
      state.selected = [];
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(
        slvsGroupsSlice.endpoints.getGroups.matchFulfilled,
        (state, action) => {
          if (!state.group) {
            if (action.payload.length !== 0) {
              state.group = action.payload[0];
            }
          } else if (action.payload.length !== 0) {
            let current_group = state.group;
            state.group = action.payload.reduce((acc, curr) => {
              if (acc < curr && curr <= current_group) {
                return curr;
              } else {
                return acc;
              }
            }, 0);
          }
        }
      )
      .addMatcher(
        slvsGroupsSlice.endpoints.addGroup.matchFulfilled,
        (state, action) => {
          state.group = action.payload;
        }
      );
  },
});

export const {
  activateGroup,
  addTempEntity,
  updateTempEntity,
  clearSelection,
} = selectionSlice.actions;
export default selectionSlice.reducer;
