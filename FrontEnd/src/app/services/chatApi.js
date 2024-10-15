import { baseApiWithReauth } from "./baseApi";
import { createApi } from "@reduxjs/toolkit/query/react";
export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseApiWithReauth,
  endpoints: (builder) => ({
    getChat: builder.query({
      query: () => "/voice",
    }),
  }),
  transformErrorResponse: (response) => response.data,
  tagTypes: ["Chat"],
});

export const { useGetChatQuery } = chatApi;
