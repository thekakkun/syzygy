import { invoke } from "@tauri-apps/api";
import { Coords } from "../../features/types";
import { slvsSlice } from "./slvsSlice";

export interface Entities {
  [handle: number]: EntityData;
}
// This corresponds to SomeEntityHandle
export interface EntityHandle {
  handle: number;
  type: EntityType;
}
export type EntityData =
  | ArcData
  | CircleData
  | CubicData
  | LineData
  | PointData;
export type EntityType =
  | "ArcOfCircle"
  | "Circle"
  | "Cubic"
  | "LineSegment"
  | "Point";
interface BaseEntityData {
  type: EntityType;
  group: number;
}
export interface ArcData extends BaseEntityData {
  type: "ArcOfCircle";
  center: Coords;
  start: Coords;
  end: Coords;
}
export interface CircleData extends BaseEntityData {
  type: "Circle";
  center: Coords;
  radius: number;
}
export interface CubicData extends BaseEntityData {
  type: "Cubic";
  start_point: Coords;
  start_control: Coords;
  end_control: Coords;
  end_point: Coords;
}
export interface LineData extends BaseEntityData {
  type: "LineSegment";
  point_a: Coords;
  point_b: Coords;
}
export interface PointData extends BaseEntityData {
  type: "Point";
  coords: Coords;
}

export const slvsEntitiesSlice = slvsSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEntities: builder.query<Entities, void>({
      queryFn: async () => {
        let entities: Entities = await invoke("get_entities");
        console.log(entities);
        return { data: entities };
      },
      providesTags: ["Entity"],
    }),
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
    addEntity: builder.mutation<EntityHandle, EntityData>({
      queryFn: async (entityData) => {
        try {
          let entityHandle: EntityHandle = await invoke("add_entity", {
            data: entityData,
          });
          return { data: entityHandle };
        } catch (err) {
          console.log(err);
          return { error: err as string };
        }
      },
      invalidatesTags: ["Entity"],
    }),
  }),
});

// export type Entity = Arc | Circle | Cubic | Point | Line;
// export type EntityName = "Arc" | "Circle" | "Cubic" | "Line" | "Point";

// export interface EntityHandle {
//   handle: Handle;
//   type: EntityName;
// }

// interface EntityData {
//   group: number;
// }

// interface Arc extends EntityHandle {
//   type: "Arc";
//   data: ArcData & EntityData;
// }
// export interface ArcData {
//   center: Coords;
//   start: Coords;
//   end: Coords;
// }

// interface Circle extends EntityHandle {
//   type: "Circle";
//   data: CircleData & EntityData;
// }
// export interface CircleData {
//   center: Coords;
//   radius: number;
// }

// interface Cubic extends EntityHandle {
//   type: "Cubic";
//   data: CubicData & EntityData;
// }
// export interface CubicData {
//   start_point: Coords;
//   start_control: Coords;
//   end_control: Coords;
//   end_point: Coords;
// }

// interface Point extends EntityHandle {
//   type: "Point";
//   data: PointData & EntityData;
// }
// export interface PointData {
//   coords: Coords;
// }

// interface Line extends EntityHandle {
//   type: "Line";
//   data: LineData & EntityData;
// }
// export interface LineData {
//   point_a: Coords;
//   point_b: Coords;
// }

export const { useGetEntitiesQuery, useAddEntityMutation } = slvsEntitiesSlice;
