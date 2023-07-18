import { invoke } from "@tauri-apps/api";
import { Coords } from "../../common/types";
import { ObjectHandle } from "./slvsObjectsSlice";
import { slvsSlice } from "./slvsSlice";

export interface Entities {
  [handle: number]: EntityData;
}

// This corresponds to SomeEntityHandle
export interface EntityHandle {
  handle: number;
  type: EntityType;
}
export interface PointHandle extends EntityHandle {
  type: "Point";
}

export type EntityType =
  | "ArcOfCircle"
  | "Circle"
  | "Cubic"
  | "LineSegment"
  | "Point";

export type EntityData =
  | ArcOfCircleData
  | CircleData
  | CubicData
  | LineSegmentData
  | PointData;

export interface BaseEntityData {
  type: EntityType;
  group: ObjectHandle;
}
export interface ArcOfCircleData extends BaseEntityData {
  type: "ArcOfCircle";
  center: PointHandle;
  start: PointHandle;
  end: PointHandle;
}
export interface CircleData extends BaseEntityData {
  type: "Circle";
  center: PointHandle;
  radius: number;
}
export interface CubicData extends BaseEntityData {
  type: "Cubic";
  start_point: PointHandle;
  start_control: PointHandle;
  end_control: PointHandle;
  end_point: PointHandle;
}
export interface LineSegmentData extends BaseEntityData {
  type: "LineSegment";
  point_a: PointHandle;
  point_b: PointHandle;
}
export interface PointData extends BaseEntityData {
  type: "Point";
  coords: Coords;
}

export const slvsEntitiesSlice = slvsSlice.injectEndpoints({
  endpoints: (builder) => ({
    // getEntities: builder.query<Entities, void>({
    //   queryFn: async () => {
    //     let entities: Entities = await invoke("get_entities");
    //     console.log(entities);
    //     return { data: entities };
    //   },
    //   providesTags: ["Entity"],
    // }),
    getEntity: builder.query<EntityData, EntityHandle>({
      queryFn: async (entityHandle) => {
        try {
          let entityData: EntityData = await invoke("get_entity", {
            handle: entityHandle,
          });
          return { data: entityData };
        } catch (err) {
          console.log(`error getting entity ${entityHandle}: ${err}`);
          return { error: err as string };
        }
      },
    }),
    getCoords: builder.query<Coords, PointHandle>({
      queryFn: async (handle) => {
        try {
          let coords: Coords = await invoke("coords", { handle });
          return { data: coords };
        } catch (err) {
          console.log(`error getting point ${handle}`);
          return { error: err as string };
        }
      },
    }),
    // addEntity: builder.mutation<EntityHandle, EntityData>({
    //   queryFn: async (entityData) => {
    //     try {
    //       let entityHandle: EntityHandle = await invoke("add_entity", {
    //         data: entityData,
    //       });
    //       return { data: entityHandle };
    //     } catch (err) {
    //       console.log(err);
    //       return { error: err as string };
    //     }
    //   },
    //   invalidatesTags: ["Entity"],
    // }),
  }),
});

export const { useGetEntityQuery, useGetCoordsQuery } = slvsEntitiesSlice;
