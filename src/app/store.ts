import { configureStore } from "@reduxjs/toolkit";
import cursorReducer from "../features/cursor/cursorSlice";
import { slvsSlice } from "./slvs/slvsSlice";
import selectionReducer from "../features/objects/selectionSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

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
