import { baseApiWithReauth } from "./baseApi";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseApiWithReauth,
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "/user",
    }),
  }),
});

export const { useGetUserQuery } = userApi;
