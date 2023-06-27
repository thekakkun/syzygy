import { invoke } from "@tauri-apps/api";
import { slvsSlice } from "./slvsSlice";
import { EntityHandle } from "./slvsEntitiesSlice";

export interface Groups {
  [handle: number]: GroupData;
}
export interface GroupData {
  entities: EntityHandle[];
}

export const slvsGroupsSlice = slvsSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<Groups, void>({
      queryFn: async () => {
        let groups: Groups = await invoke("get_groups");
        console.log(groups);
        return { data: groups };
      },
      providesTags: ["Group"],
    }),
    getGroup: builder.query<GroupData, number>({
      queryFn: async (handle) => {
        try {
          let groupData: GroupData = await invoke("get_group", {
            group: handle,
          });
          return { data: groupData };
        } catch (err) {
          console.log(`error getting group ${handle}: ${err}`);
          return { error: err as string };
        }
      },
    }),
    addGroup: builder.mutation<number, void>({
      queryFn: async () => {
        let group: number = await invoke("add_group");
        return { data: group };
      },
      invalidatesTags: ["Group"],
    }),
    deleteGroup: builder.mutation<number, number>({
      queryFn: async (handle) => {
        try {
          let deletedGroup: number = await invoke("delete_group", {
            group: handle,
          });
          console.log(`deleted group: ${deletedGroup}`);
          return { data: deletedGroup };
        } catch (err) {
          console.log(`error deleting group ${handle}: ${err}`);
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
