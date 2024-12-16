import { baseApiWithReauth } from "./baseApi";
import { createApi } from "@reduxjs/toolkit/query/react";
export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseApiWithReauth,
  endpoints: (builder) => ({
    getChat: builder.mutation({
      query: (data) => ({
        url: `/voice`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetChatMutation } = chatApi;
