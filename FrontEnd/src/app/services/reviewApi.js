import { baseApiWithReauth } from "./baseApi";
import { createApi } from "@reduxjs/toolkit/query/react";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: baseApiWithReauth,
  tagTypes: ["Reviews"],
  endpoints: (builder) => ({
    getReviewsByTestId: builder.query({
      query: ({ testId, page = 1, limit = 5 }) => ({
        url: `/review/test/${testId}`,
        params: { page, limit },
      }),
      transformResponse: (response) => {
        return {
          data: response.data.data,
          pagination: {
            currentPage: response.data.pagination.currentPage,
            totalPages: response.data.pagination.totalPages,
            totalReviews: response.data.pagination.totalReviews,
            hasMore: response.data.pagination.hasMore,
          },
        };
      },
      merge: (currentCache, newItems, { arg: { page } }) => {
        // If it's the first page, reset the cache
        if (page === 1) {
          return newItems;
        }

        // Merge the data while preserving pagination info
        return {
          data: [...currentCache.data, ...newItems.data],
          pagination: newItems.pagination, // Use the latest pagination info
        };
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.testId}`;
      },
      forceRefetch({ currentArg, previousArg }) {
        // Only refetch if the page or testId changes
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.testId !== previousArg?.testId
        );
      },
    }),
  }),
});

export const { useGetReviewsByTestIdQuery } = reviewApi;
