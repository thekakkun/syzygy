import { configureStore } from "@reduxjs/toolkit";
import canvasReducer from "../features/workspace/canvasSlice";
import { slvsSlice } from "../features/slvs/slvsSlice";

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    [slvsSlice.reducerPath]: slvsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(slvsSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
