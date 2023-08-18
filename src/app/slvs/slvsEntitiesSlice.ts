import { invoke } from "@tauri-apps/api";

import { slvsSlice } from "./slvsSlice";
import { Entity, EntityHandle } from "../../common/types";

export const slvsEntitiesSlice = slvsSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEntities: builder.query<EntityHandle[], void>({
      queryFn: async () => {
        try {
          let entities: EntityHandle[] = await invoke("entities");
          console.log(entities);
          return { data: entities };
        } catch (err) {
          console.log(`error getting entities: ${err}`);
          return { error: err as string };
        }
      },
    }),

    getEntity: builder.query<Entity, EntityHandle>({
      queryFn: async (entityHandle) => {
        try {
          let entityData: Entity = await invoke("entity", {
            handle: entityHandle,
          });
          console.log(entityData);
          return { data: entityData };
        } catch (err) {
          console.log(`error getting entity ${entityHandle}: ${err}`);
          return { error: err as string };
        }
      },
    }),
  }),
});

export const { useGetEntitiesQuery, useGetEntityQuery } = slvsEntitiesSlice;

// export interface Entities {
//   [handle: number]: EntityData;
// }

// // This corresponds to SomeEntityHandle
// export interface EntityHandle {
//   handle: number;
//   type: EntityType;
// }
// export interface PointHandle extends EntityHandle {
//   type: "Point";
// }

// export type EntityType =
//   | "ArcOfCircle"
//   | "Circle"
//   | "Cubic"
//   | "LineSegment"
//   | "Point";

// export type EntityData =
//   | ArcOfCircleData
//   | CircleData
//   | CubicData
//   | LineSegmentData
//   | PointData;

// export interface BaseEntityData {
//   type: EntityType;
//   group: ObjectHandle;
// }
// export interface ArcOfCircleData extends BaseEntityData {
//   type: "ArcOfCircle";
//   center: PointHandle;
//   start: PointHandle;
//   end: PointHandle;
// }
// export interface CircleData extends BaseEntityData {
//   type: "Circle";
//   center: PointHandle;
//   radius: number;
// }
// export interface CubicData extends BaseEntityData {
//   type: "Cubic";
//   start_point: PointHandle;
//   start_control: PointHandle;
//   end_control: PointHandle;
//   end_point: PointHandle;
// }
// export interface LineSegmentData extends BaseEntityData {
//   type: "LineSegment";
//   point_a: PointHandle;
//   point_b: PointHandle;
// }
// export interface PointData extends BaseEntityData {
//   type: "Point";
//   coords: Coords;
// }
