import { invoke } from "@tauri-apps/api";
import { EntityHandle } from "./slvsEntitiesSlice";
import { slvsSlice } from "./slvsSlice";

export type ObjectHandle = number;
export type SlvsObject = Segment[];

export interface Segment {
  from: EntityHandle & { type: "Point" };
  via: Via;
}

type Via = { type: "Close" | "End" | "Move" } | EntityHandle;

export const slvsObjectsSlice = slvsSlice.injectEndpoints({
  endpoints: (builder) => ({
    getObjects: builder.query<ObjectHandle[], void>({
      queryFn: async () => {
        let objects: ObjectHandle[] = await invoke("get_objects");
        console.log(objects);
        return {
          data: objects,
        };
      },
      providesTags: ["Object"],
    }),
    getObject: builder.query<SlvsObject, ObjectHandle>({
      queryFn: async (handle) => {
        try {
          let object: SlvsObject = await invoke("get_object", { handle });
          console.log(object);
          return { data: object };
        } catch (err) {
          console.log(`error getting object ${handle}: ${err}`);
          return { error: err as string };
        }
      },
      providesTags: ["Object"],
    }),
  }),
});

export const { useGetObjectsQuery, useGetObjectQuery } = slvsObjectsSlice;
