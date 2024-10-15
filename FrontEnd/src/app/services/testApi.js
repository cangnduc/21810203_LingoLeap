import { baseApiWithReauth } from "./baseApi";
import { createApi } from "@reduxjs/toolkit/query/react";

export const testApi = createApi({
  reducerPath: "testApi",
  baseQuery: baseApiWithReauth,
  endpoints: (builder) => ({
    getTests: builder.query({
      query: (args = {}) => {
        const { page, limit, orderBy, sortBy } = args;
        const params = new URLSearchParams({
          ...(page && { page: page.toString() }),
          ...(limit && { limit: limit.toString() }),
          ...(orderBy && { orderBy }),
          ...(sortBy && { sortBy }),
        });
        return `/test?${params.toString()}`;
      },
      transformResponse: (response) => {
        console.log("Raw API response:", JSON.stringify(response, null, 2));
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
    }),
    addTest: builder.mutation({
      query: (test) => ({
        url: "/test",
        method: "POST",
        body: test,
      }),
      transformResponse: (response) => {
        console.log("Raw API response:", JSON.stringify(response, null, 2));
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
    }),
  }),
});

export const { useGetTestsQuery, useAddTestMutation } = testApi;
