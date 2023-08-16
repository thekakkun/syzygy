import { invoke } from "@tauri-apps/api";

import { slvsSlice } from "./slvsSlice";
import { SyzygyObject, ObjectHandle, PathData } from "../../common/types";

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
    getPath: builder.query<PathData, ObjectHandle>({
      queryFn: async (handle) => {
        try {
          let path: PathData = await invoke("path", { handle });
          console.log(path);
          return { data: path };
        } catch (err) {
          console.log(`error getting path ${handle}: ${err}`);
          return { error: err as string };
        }
      },
    }),
  }),
});

export const { useGetObjectsQuery, useGetObjectQuery, useGetPathQuery } =
  slvsObjectsSlice;
