import { baseApiWithReauth } from "./baseApi";
import { createApi } from "@reduxjs/toolkit/query/react";

export const testResultApi = createApi({
  reducerPath: "testResultApi",
  baseQuery: baseApiWithReauth,
  endpoints: (builder) => ({
    getTestResult: builder.query({
      query: (attemptId) => `/test-result/${attemptId}`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetTestResultQuery } = testResultApi;
