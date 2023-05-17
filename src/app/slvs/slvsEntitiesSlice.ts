import { invoke } from "@tauri-apps/api";
import {
  TempEntity,
  cubicHandles,
} from "../../features/objects/selectionSlice";
import { Coords, Handle } from "../../features/types";
import { slvsSlice } from "./slvsSlice";

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
  start: Coords;
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
        console.log(entities);
        return { data: entities };
      },
      providesTags: ["Entity"],
    }),
    addEntity: builder.mutation<Handle, BaseEntityData & TempEntity>({
      queryFn: async (data) => {
        try {
          let newEntityHandle: Handle;

          switch (data.type) {
            case "Arc":
              newEntityHandle = await invoke("add_arc", {
                data: {
                  group: data.group,
                  center: data.coords[0],
                  start: data.coords[1],
                  end: data.coords[2],
                },
              });
              break;

            case "Circle":
              let [centerX, centerY] = data.coords[0] as Coords;
              let [pointX, pointY] = data.coords[1] as Coords;

              newEntityHandle = await invoke("add_circle", {
                data: {
                  group: data.group,
                  center: data.coords[0],
                  radius: Math.hypot(centerX - pointX, centerY - pointY),
                },
              });
              break;

            case "Cubic":
              let [startPoint, startControl, endControl, endPoint] =
                cubicHandles(
                  data.coords[0] as Coords,
                  data.coords[1] as Coords
                );
              newEntityHandle = await invoke("add_cubic", {
                data: {
                  group: data.group,
                  start_point: startPoint,
                  start_control: startControl,
                  end_control: endControl,
                  end_point: endPoint,
                },
              });
              break;

            case "Line":
              newEntityHandle = await invoke("add_line", {
                data: {
                  group: data.group,
                  point_a: data.coords[0],
                  point_b: data.coords[1],
                },
              });
              break;

            case "Point":
              newEntityHandle = await invoke("add_point", {
                data: {
                  group: data.group,
                  coords: data.coords[0],
                },
              });
              break;
          }
          return { data: newEntityHandle };
        } catch (err) {
          console.log(err);
          return { error: err as string };
        }
      },
      invalidatesTags: ["Entity"],
    }),
  }),
});

export const { useGetEntitiesQuery, useAddEntityMutation } = slvsEntitiesSlice;
