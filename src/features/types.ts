export interface SliceState {
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}