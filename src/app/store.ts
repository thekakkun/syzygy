import { configureStore } from "@reduxjs/toolkit";
import canvasReducer from "../features/workspace/canvasSlice";
import { slvsSlice } from "./slvs/slvsSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    [slvsSlice.reducerPath]: slvsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(slvsSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
