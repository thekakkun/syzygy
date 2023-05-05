import { configureStore } from "@reduxjs/toolkit";
import canvasReducer from "../features/workspace/canvasSlice";

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
