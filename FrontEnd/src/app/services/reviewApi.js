import { baseApiWithReauth } from "./baseApi";
import { createApi } from "@reduxjs/toolkit/query/react";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: baseApiWithReauth,
  tagTypes: ["Reviews"],
  endpoints: (builder) => ({
    getTestRatings: builder.query({
      query: (testId) => `/review/test/${testId}/ratings`,
      providesTags: (result, error, testId) => [
        { type: "Reviews", id: `${testId}-ratings` },
      ],
    }),
    getReviewsByTestId: builder.query({
      query: ({ testId, page = 1, limit = 5 }) => ({
        url: `/review/test/${testId}/comments`,
        params: { page, limit },
      }),
      serializeQueryArgs: ({ queryArgs }) => {
        return { testId: queryArgs.testId };
      },
      merge: (currentCache, newItems) => {
        if (!currentCache) return newItems;

        // Create a Set of existing comment IDs
        const existingIds = new Set(
          currentCache.data.comments.map((c) => c._id)
        );

        // Filter out any duplicates from new comments
        const newUniqueComments = newItems.data.comments.filter(
          (comment) => !existingIds.has(comment._id)
        );

        return {
          ...newItems,
          data: {
            ...newItems.data,
            comments: [...currentCache.data.comments, ...newUniqueComments],
          },
        };
      },
      transformResponse: (response) => response.data,
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: (result, error, { testId }) => [
        { type: "Reviews", id: testId },
        { type: "Reviews", id: "LIST" },
      ],
    }),
    addRating: builder.mutation({
      query: ({ testId, rating }) => ({
        url: `/review/test/${testId}/rating`,
        method: "PUT",
        body: { rating: { value: rating } },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { testId }) => [
        { type: "Reviews", id: `${testId}-ratings` },
      ],
    }),
    addComment: builder.mutation({
      query: ({ testId, comment }) => ({
        url: `/review/test/${testId}/comment`,
        method: "POST",
        body: { comment },
      }),
      async onQueryStarted(
        { testId, comment: commentText },
        { dispatch, queryFulfilled, getState }
      ) {
        try {
          const { data: response } = await queryFulfilled;
          const state = getState();
          const currentUser = state.auth.user;

          // Create new comment with the text from the input
          const newComment = {
            _id: response.data._id,
            text: commentText,
            createdAt: new Date().toISOString(),
            user: {
              _id: currentUser._id,
              username: currentUser.username,
              avatar: currentUser.avatar,
            },
          };

          // Update the cache with the new comment
          dispatch(
            reviewApi.util.updateQueryData(
              "getReviewsByTestId",
              { testId, page: 1 },
              (draft) => {
                if (draft?.data?.comments) {
                  // Add the new comment at the beginning of the list
                  draft.data.comments.unshift(newComment);
                  // Update total comments count if it exists
                  if (draft.pagination?.totalComments) {
                    draft.pagination.totalComments += 1;
                  }
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to add comment:", error);
        }
      },
      // invalidatesTags: (result, error, { testId }) => [
      //   { type: "Reviews", id: testId },
      //   { type: "Reviews", id: "LIST" },
      // ],
    }),
  }),
});

export const {
  useGetTestRatingsQuery,
  useGetReviewsByTestIdQuery,
  useAddRatingMutation,
  useAddCommentMutation,
} = reviewApi;
