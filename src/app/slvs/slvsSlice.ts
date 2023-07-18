import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { invoke } from "@tauri-apps/api";

export const slvsSlice = createApi({
  baseQuery: fakeBaseQuery<string>(),
  tagTypes: ["Object", "Entity"],
  endpoints: (builder) => ({
    solve: builder.mutation<null, number>({
      queryFn: async (handle) => {
        try {
          await invoke("solve", { handle });
          return { data: null };
        } catch (err) {
          return { error: err as string };
        }
      },
      invalidatesTags: ["Object", "Entity"],
    }),
  }),
});

export const { useSolveMutation } = slvsSlice;
