import { invoke } from "@tauri-apps/api";
import { Coords, Handle } from "../../features/types";
import { slvsSlice } from "./slvsSlice";

type Entity = Arc | Circle | Cubic | Point | Line;
type EntityData = ArcData | CircleData | CubicData | PointData | LineData;
export type EntityType = "Arc" | "Circle" | "Cubic" | "Line" | "Point";

interface BaseEntity {
  handle: Handle;
  type: EntityType;
}

interface BaseData {
  group: number;
}

interface Arc extends BaseEntity {
  type: "Arc";
  data: ArcData;
}
interface ArcData extends BaseData {
  center: Coords;
  begin: Coords;
  end: Coords;
}

interface Circle extends BaseEntity {
  type: "Circle";
  data: CircleData;
}
interface CircleData extends BaseData {
  center: Coords;
  radius: number;
}

interface Cubic extends BaseEntity {
  type: "Cubic";
  data: CubicData;
}
interface CubicData extends BaseData {
  start_point: Coords;
  start_control: Coords;
  end_control: Coords;
  end_point: Coords;
}

interface Point extends BaseEntity {
  type: "Point";
  data: PointData;
}
interface PointData extends BaseData {
  coords: Coords;
}

interface Line extends BaseEntity {
  type: "Line";
  data: LineData;
}
interface LineData extends BaseData {
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
  }),
});

export const { useGetEntitiesQuery } = slvsEntitiesSlice;
