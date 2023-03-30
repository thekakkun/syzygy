import { createSlice } from "@reduxjs/toolkit";
import ModuleLoader, { SlvsModule } from "slvs";

interface SlvsState {
  value: undefined | SlvsModule;
}

const initState: SlvsState = {
  value: undefined,
};

export const slvsSlice = createSlice({
  name: "slvs",
  initialState: initState,
  reducers: {
    initialize: (state) => {
      async function initCanvas() {
        const slvs = await ModuleLoader();
        slvs.clearSketch();
        slvs.addBase2D(1);

        return slvs;
      }
      state.value = initCanvas();
    },
  },
});
