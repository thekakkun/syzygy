import { invoke } from "@tauri-apps/api";

import { slvsSlice } from "./slvsSlice";
import { SyzygyObject, ObjectHandle } from "../../common/types";

export const slvsObjectsSlice = slvsSlice.injectEndpoints({
  endpoints: (builder) => ({
    getObjects: builder.query<ObjectHandle[], void>({
      queryFn: async () => {
        let objects: ObjectHandle[] = await invoke("objects");
        console.log(objects);
        return {
          data: objects,
        };
      },
      providesTags: ["Object"],
    }),
    getObject: builder.query<SyzygyObject, ObjectHandle>({
      queryFn: async (handle) => {
        try {
          let object: SyzygyObject = await invoke("object", { handle });
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
