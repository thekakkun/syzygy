import { configureStore } from "@reduxjs/toolkit";
import cursorReducer from "../features/cursor/cursorSlice";

export const store = configureStore({
  reducer: {
    cursor: cursorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
