import { baseApiWithReauth } from "./baseApi";
import { createApi } from "@reduxjs/toolkit/query/react";

export const testApi = createApi({
  reducerPath: "testApi",
  baseQuery: baseApiWithReauth,
  keepUnusedDataFor: 300,
  tagTypes: ["Test"],
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
      providesTags: ["Test"],
    }),
    getTest: builder.query({
      query: (id) => `/tests/${id}`,
      transformResponse: (response) => {
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ["Test"],
      keepUnusedDataFor: 600,
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
      invalidatesTags: ["Test"],
    }),
    deleteTest: builder.mutation({
      query: (id) => ({
        url: `/tests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Test"],
    }),
    getTestForAttempt: builder.query({
      query: (id) => `/tests/${id}/attempt`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),
    getTestById: builder.query({
      query: (id) => `/tests/edit/${id}`,

      providesTags: (result, error, id) => [{ type: "Test", id }],
    }),
    updateTest: builder.mutation({
      query: ({ id, ...test }) => ({
        url: `/tests/${id}`,
        method: "PUT",
        body: test,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Test", id },
        "Test",
      ],
    }),
    togglePublished: builder.mutation({
      query: (id) => ({
        url: `/tests/${id}/publish`,
        method: "PATCH",
      }),
      invalidatesTags: ["Test"],
    }),
  }),
});

export const {
  useGetTestsQuery,
  useGetTestQuery,
  useAddTestMutation,
  useDeleteTestMutation,
  useGetTestForAttemptQuery,
  useGetTestByIdQuery,
  useUpdateTestMutation,
  useTogglePublishedMutation,
} = testApi;
