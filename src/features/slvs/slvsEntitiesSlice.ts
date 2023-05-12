import { Coords, Handle } from "../types";

type Entity = Point | Line;
type EntityData = LineData | PointData;

interface BaseEntity {
  handle: Handle;
}

interface BaseData {
  type: "Arc" | "Circle" | "Cubic" | "Distance" | "Line" | "Point" | "Other";
  group: number;
}

interface Point extends PointData, BaseEntity {}
interface PointData extends BaseData {
  type: "Point";
  coords: Coords;
}

interface Line extends LineData, BaseEntity {}
interface LineData extends BaseData {
  type: "Line";
  point_a: Coords;
  point_b: Coords;
}
