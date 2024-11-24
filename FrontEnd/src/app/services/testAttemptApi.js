import { baseApiWithReauth } from "./baseApi";
import { createApi } from "@reduxjs/toolkit/query/react";

export const testAttemptApi = createApi({
  reducerPath: "testAttemptApi",
  baseQuery: baseApiWithReauth,
  tagTypes: ["TestAttempt"],
  endpoints: (builder) => ({
    initializeTestAttempt: builder.query({
      query: (testAttemptId) => ({
        url: `/test-attempt/${testAttemptId}/initialize`,
        method: "POST",
      }),
      transformResponse: (response) => {
        return {
          test: response.data.test,
          testAttempt: response.data.testAttempt,
        };
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg !== previousArg;
      },
    }),
    completeTestAttempt: builder.mutation({
      query: (testAttemptId) => ({
        url: `/test-attempt/${testAttemptId}/complete`,
        method: "POST",
      }),
      invalidatesTags: ["TestAttempt"],
    }),
    updateAnswer: builder.mutation({
      query: ({ testAttemptId, questionId, answer }) => ({
        url: `/test-attempt/${testAttemptId}/answer`,
        method: "PUT",
        body: { questionId, answer },
      }),
    }),
    getTestAttempt: builder.query({
      query: (testId) => `/test-attempts/${testId}`,
    }),
    getAllTestAttemptsByUser: builder.query({
      query: () => `/test-attempt/`,
      providesTags: ["TestAttempt"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    saveAnswer: builder.mutation({
      query: (data) => ({
        url: `/test-attempt/${data.testAttemptId}/answers`,
        method: "POST",
        body: { answers: data.answers },
      }),
    }),
    checkTestAttempt: builder.mutation({
      query: ({ testId }) => ({
        url: `/test-attempt/check`,
        method: "POST",
        body: { testId },
      }),
      transformResponse: (response) => {
        return response.data;
      },
      transformErrorResponse: (response) => {
        return response.data;
      },
    }),
  }),
});

export const {
  useInitializeTestAttemptQuery,
  useUpdateAnswerMutation,
  useSaveAnswerMutation,
  useGetTestAttemptQuery,
  useCompleteTestAttemptMutation,
  useCheckTestAttemptMutation,
  useGetAllTestAttemptsByUserQuery,
} = testAttemptApi;
