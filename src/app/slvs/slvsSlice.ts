import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { invoke } from "@tauri-apps/api";

export const slvsSlice = createApi({
  baseQuery: fakeBaseQuery<string>(),
  tagTypes: ["Group", "Entity"],
  endpoints: (builder) => ({
    solve: builder.mutation<null, number>({
      queryFn: async (group) => {
        try {
          await invoke("solve", { group: group });
          return { data: null };
        } catch (err) {
          return { error: err as string };
        }
      },
      invalidatesTags: ["Group", "Entity"],
    }),
  }),
});

export const { useSolveMutation } = slvsSlice;
