import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import cursorReducer from "../features/cursor/cursorSlice";
import selectionReducer from "../features/cursor/selectionSlice";
import { slvsSlice } from "./slvs/slvsSlice";

export const store = configureStore({
  reducer: {
    cursor: cursorReducer,
    selection: selectionReducer,
    [slvsSlice.reducerPath]: slvsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(slvsSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
