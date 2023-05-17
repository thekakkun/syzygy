import { invoke } from "@tauri-apps/api";
import { Coords, Handle } from "../../features/types";
import { slvsSlice } from "./slvsSlice";
import { TempEntity } from "../../features/objects/selectionSlice";

export type Entity = Arc | Circle | Cubic | Point | Line;
type EntityData = ArcData | CircleData | CubicData | PointData | LineData;
export type EntityName = "Arc" | "Circle" | "Cubic" | "Line" | "Point";

interface BaseEntity {
  handle: Handle;
  type: EntityName;
}

interface BaseEntityData {
  group: number;
}

interface Arc extends BaseEntity {
  type: "Arc";
  data: ArcData & BaseEntityData;
}
export interface ArcData {
  center: Coords;
  begin: Coords;
  end: Coords;
}

interface Circle extends BaseEntity {
  type: "Circle";
  data: CircleData & BaseEntityData;
}
export interface CircleData {
  center: Coords;
  radius: number;
}

interface Cubic extends BaseEntity {
  type: "Cubic";
  data: CubicData & BaseEntityData;
}
export interface CubicData {
  start_point: Coords;
  start_control: Coords;
  end_control: Coords;
  end_point: Coords;
}

interface Point extends BaseEntity {
  type: "Point";
  data: PointData & BaseEntityData;
}
export interface PointData {
  coords: Coords;
}

interface Line extends BaseEntity {
  type: "Line";
  data: LineData & BaseEntityData;
}
export interface LineData {
  point_a: Coords;
  point_b: Coords;
}

export const slvsEntitiesSlice = slvsSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEntities: builder.query<Entity[], void>({
      queryFn: async () => {
        let entities: Entity[] = await invoke("get_entities");
        return { data: entities };
      },
      providesTags: ["Entity"],
    }),
    addEntity: builder.mutation<Handle, BaseEntityData & TempEntity>({
      queryFn: async (data) => {
        try {
          switch (data.type) {
            case "Point":
              let newEntityHandle: Handle = await invoke("add_point", {
                data: {
                  group: data.group,
                  coords: data.coords[0],
                },
              });
              return { data: newEntityHandle };
            default:
              throw `Unknown entity type: ${data.type}`;
          }
        } catch (err) {
          return { error: err as string };
        }
      },
      invalidatesTags: ["Entity"],
    }),
  }),
});

export const { useGetEntitiesQuery, useAddEntityMutation } = slvsEntitiesSlice;
