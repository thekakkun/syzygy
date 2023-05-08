import { configureStore } from "@reduxjs/toolkit";
import canvasReducer from "../features/workspace/canvasSlice";
import entitiesReducer from "../features/drawing/entitiesSlice";

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    entities: entitiesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
