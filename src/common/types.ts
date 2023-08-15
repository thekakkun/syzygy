// Handles
// These are the identifiers for various things
export interface EntityHandle {
  handle: number;
  type: EntityType;
}
export type ObjectHandle = number;

// Entities
export type EntityType =
  | "ArcOfCircle"
  | "Circle"
  | "Cubic"
  | "LineSegment"
  | "Point";
export type Entity = ArcOfCircle | Circle | Cubic | LineSegment | Point;

export interface BaseEntityData {
  type: EntityType;
  handle: EntityHandle;
  group: ObjectHandle;
}
export interface ArcOfCircle extends BaseEntityData {
  type: "ArcOfCircle";
  center: PointData;
  start: PointData;
  end: PointData;
}
export interface Circle extends BaseEntityData {
  type: "Circle";
  center: PointData;
  radius: number;
}
export interface Cubic extends BaseEntityData {
  type: "Cubic";
  start_point: PointData;
  start_control: PointData;
  end_control: PointData;
  end_point: PointData;
}
export interface LineSegment extends BaseEntityData {
  type: "LineSegment";
  point_a: PointData;
  point_b: PointData;
}
export interface Point extends BaseEntityData, PointData {
  type: "Point";
}
export interface PointData {
  handle: EntityHandle;
  group: ObjectHandle;
  coords: [number, number];
}

// Objects
export type SyzygyObject = CircleObject | PathObject | ShapeObject;
export interface CircleObject {
  type: "Circle";
  handle: EntityHandle;
}
export interface PathObject {
  type: "Path";
  segments: Segment[];
}
export interface ShapeObject {
  type: "Shape";
  segments: Segment[];
}

export interface Segment {
  from: PointData;
  via: EntityHandle;
  to: PointData;
}
