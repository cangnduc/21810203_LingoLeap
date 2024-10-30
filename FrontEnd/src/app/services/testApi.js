import { baseApiWithReauth } from "./baseApi";
import { createApi } from "@reduxjs/toolkit/query/react";

export const testApi = createApi({
  reducerPath: "testApi",
  baseQuery: baseApiWithReauth,
  endpoints: (builder) => ({
    getTests: builder.query({
      query: (args = {}) => {
        const {
          page,
          limit,
          orderBy,
          sortBy,
          difficulty,
          testType,
          createdBy,
        } = args;
        const params = new URLSearchParams({
          ...(page && { page: page.toString() }),
          ...(limit && { limit: limit.toString() }),
          ...(orderBy && { orderBy }),
          ...(sortBy && { sortBy }),
          ...(difficulty && { difficulty }),
          ...(testType && { testType }),
          ...(createdBy && { createdBy }),
        });
        return `/tests?${params.toString()}`;
      },
      transformResponse: (response) => {
        if (response && response.data) {
          return {
            tests: response.data,
            totalPages: response.totalPages || 1,
            currentPage: response.currentPage || 1,
            totalTests: response.totalTests || response.data.length,
          };
        }
        return {
          tests: [],
          totalPages: 1,
          currentPage: 1,
          totalTests: 0,
        };
      },
    }),
    getTest: builder.query({
      query: (id) => `/tests/${id}`,
      transformResponse: (response) => {
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
    }),
    addTest: builder.mutation({
      query: (test) => ({
        url: "/tests",
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
    deleteTest: builder.mutation({
      query: (id) => ({
        url: `/tests/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetTestsQuery,
  useGetTestQuery,
  useAddTestMutation,
  useDeleteTestMutation,
} = testApi;
