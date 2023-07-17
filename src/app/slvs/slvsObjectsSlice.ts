import { invoke } from "@tauri-apps/api";
import { EntityHandle } from "./slvsEntitiesSlice";
import { slvsSlice } from "./slvsSlice";

type Object = Segment[];

export interface Segment {
  from: EntityHandle & { type: "Point" };
  via: Via;
}

// type Via = "Close" | "End" | "Move" | { Through: EntityHandle };

type Via = { type: "Close" | "End" | "Move" } | EntityHandle;

export const slvsObjectsSlice = slvsSlice.injectEndpoints({
  endpoints: (builder) => ({
    getObjects: builder.query<number[], void>({
      queryFn: async () => {
        let objects: number[] = await invoke("get_objects");
        console.log(objects);
        return {
          data: objects,
        };
      },
      providesTags: ["Object"],
    }),
    getObject: builder.query<Object, number>({
      queryFn: async (handle) => {
        try {
          let object: Object = await invoke("get_object", { group: handle });
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
