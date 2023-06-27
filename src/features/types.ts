export type Coords = [number, number];
// export interface SliceState {
//   status: "idle" | "pending" | "succeeded" | "failed";
//   error: string | null;
// }


// export interface Handle {
//   handle: number;
//   phantom: null;
// }

// Groups

// // Entities
// export interface Entities {
//   [handle: number]: EntityData;
// }
// export type EntityData =
//   | ArcData
//   | CircleData
//   | CubicData
//   | PointData
//   | LineData;
// export interface ArcData {
//   center: Coords;
//   start: Coords;
//   end: Coords;
// }
// export interface CircleData {
//   center: Coords;
//   radius: number;
// }
// export interface CubicData {
//   start_point: Coords;
//   start_control: Coords;
//   end_control: Coords;
//   end_point: Coords;
// }
// export interface PointData {
//   coord: Coords;
// }
// export interface LineData {
//   point_a: Coords;
//   point_b: Coords;
// }
