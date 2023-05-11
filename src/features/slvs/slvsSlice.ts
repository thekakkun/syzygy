import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { invoke } from "@tauri-apps/api";

export const slvsSlice = createApi({
  baseQuery: fakeBaseQuery<string>(),
  tagTypes: ["Group"],
  endpoints: (builder) => ({
    getGroups: builder.query<number[], void>({
      queryFn: async () => {
        let group_list: number[] = await invoke("get_groups");
        console.log(`Got groups: ${group_list}`);
        return { data: group_list };
      },
      providesTags: ["Group"],
    }),
    addGroup: builder.mutation<number, void>({
      queryFn: async () => {
        let group: number = await invoke("add_group");
        console.log(`added group: ${group}`);
        return { data: group };
      },
      invalidatesTags: ["Group"],
    }),
    deleteGroup: builder.mutation<number, number>({
      queryFn: async (group) => {
        try {
          let deleted_group: number = await invoke("delete_group", { group });
          console.log(`deleted group: ${deleted_group}`);
          return { data: deleted_group };
        } catch (err) {
          console.log(`error deleting group: ${err}`);
          return { error: err as string };
        }
      },
      invalidatesTags: ["Group"],
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useAddGroupMutation,
  useDeleteGroupMutation,
} = slvsSlice;
