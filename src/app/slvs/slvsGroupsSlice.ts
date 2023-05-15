import { invoke } from "@tauri-apps/api";
import { slvsSlice } from "./slvsSlice";

export const slvsGroupsSlice = slvsSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<number[], void>({
      queryFn: async () => {
        let groups: number[] = await invoke("get_groups");
        console.log(`Got groups: ${groups}`);
        return { data: groups };
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
} = slvsGroupsSlice;
