export interface SliceState {
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

export interface Coords {
  x: number;
  y: number;
}

export interface Handle {
  handle: number;
  phantom: null;
}
