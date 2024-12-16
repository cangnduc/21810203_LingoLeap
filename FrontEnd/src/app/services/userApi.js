import { baseApiWithReauth } from "./baseApi";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseApiWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => `/user/me`,
      transformResponse: (response) => response.data,
      providesTags: ["User"],
    }),
    getUserProfile: builder.query({
      query: () => `/user/profile/me`,
      transformResponse: (response) => response.data,
      providesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `/user/me`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetUserProfileQuery,
  useUpdateUserMutation,
} = userApi;
