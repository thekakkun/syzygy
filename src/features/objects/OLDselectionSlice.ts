// import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { EntityName } from "../../app/slvs/slvsEntitiesSlice";
// import { slvsGroupsSlice } from "../../app/slvs/slvsGroupsSlice";
// import { Coords } from "../types";

// export type TempEntity =
//   | TempArc
//   | TempCircle
//   | TempCubic
//   | TempLine
//   | TempPoint;
// interface BaseTempEntity {
//   type: EntityName;
// }
// interface TempArc extends BaseTempEntity {
//   type: "Arc";
//   coords: [Coords?, Coords?, Coords?];
// }
// interface TempCircle extends BaseTempEntity {
//   type: "Circle";
//   coords: [Coords?, Coords?];
// }
// interface TempCubic extends BaseTempEntity {
//   type: "Cubic";
//   coords: [Coords?, Coords?];
// }
// interface TempLine extends BaseTempEntity {
//   type: "Line";
//   coords: [Coords?, Coords?];
// }
// interface TempPoint extends BaseTempEntity {
//   type: "Point";
//   coords: [Coords?];
// }

// export function cubicHandles(start: Coords, end: Coords) {
//   let [startX, startY] = start;
//   let [endX, endY] = end;

//   let startControl: Coords = [(startX + endX) / 3, (startY + endY) / 3];
//   let endControl: Coords = [
//     ((startX + endX) * 2) / 3,
//     ((startY + endY) * 2) / 3,
//   ];

//   // let startControl: Coords = [
//   //   startX / 3 + (endX * 2) / 3,
//   //   startY / 3 + (endY * 2) / 3,
//   // ];
//   // let endControl: Coords = [
//   //   (startX * 2) / 3 + endX / 3,
//   //   (startY * 2) / 3 + endY / 3,
//   // ];

//   return [start, startControl, endControl, end];
// }

// interface SelectionState {
//   group?: number;
//   selected: number[] | TempEntity;
// }
// const initialState = { selected: [] } as SelectionState;

// export const selectionSlice = createSlice({
//   name: "selection",
//   initialState,
//   reducers: {
//     activateGroup: (state, action: PayloadAction<number>) => {
//       state.group = action.payload;
//     },
//     addTempEntity: (state, action: PayloadAction<EntityName>) => {
//       switch (action.payload) {
//         case "Arc":
//           state.selected = {
//             type: "Arc",
//             coords: [undefined, undefined, undefined],
//           };
//           break;
//         case "Circle":
//           state.selected = {
//             type: "Circle",
//             coords: [undefined, undefined],
//           };
//           break;
//         case "Cubic":
//           state.selected = {
//             type: "Cubic",
//             coords: [undefined, undefined],
//           };
//           break;
//         case "Line":
//           state.selected = {
//             type: "Line",
//             coords: [undefined, undefined],
//           } as TempLine;
//           break;
//         case "Point":
//           state.selected = {
//             type: "Point",
//             coords: [undefined],
//           } as TempPoint;
//           break;
//       }
//     },
//     updateTempEntity: (state, action: PayloadAction<Coords>) => {
//       if ("type" in state.selected) {
//         let undefinedIx = state.selected.coords.indexOf(undefined);
//         if (undefinedIx !== -1) {
//           state.selected.coords[undefinedIx] = action.payload;
//         }
//       }
//     },
//     clearSelection: (state) => {
//       state.selected = [];
//     },
//   },
//   extraReducers(builder) {
//     builder
//       .addMatcher(
//         slvsGroupsSlice.endpoints.getGroups.matchFulfilled,
//         (state, action) => {
//           if (!state.group) {
//             if (action.payload.length !== 0) {
//               state.group = action.payload[0];
//             }
//           } else if (action.payload.length !== 0) {
//             let currentGroup = state.group;
//             state.group = action.payload.reduce((acc, curr) => {
//               if (acc < curr && curr <= currentGroup) {
//                 return curr;
//               } else {
//                 return acc;
//               }
//             }, 0);
//           }
//         }
//       )
//       .addMatcher(
//         slvsGroupsSlice.endpoints.addGroup.matchFulfilled,
//         (state, action) => {
//           state.group = action.payload;
//         }
//       );
//   },
// });

// export const {
//   activateGroup,
//   addTempEntity,
//   updateTempEntity,
//   clearSelection,
// } = selectionSlice.actions;
// export default selectionSlice.reducer;
