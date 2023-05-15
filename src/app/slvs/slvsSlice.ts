import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const slvsSlice = createApi({
  baseQuery: fakeBaseQuery<string>(),
  tagTypes: ["Group", "Entity"],
  endpoints: () => ({}),
});
