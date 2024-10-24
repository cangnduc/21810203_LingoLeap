import { baseApiWithReauth } from "./baseApi";
import { createApi } from "@reduxjs/toolkit/query/react";

export const questionApi = createApi({
  reducerPath: "questionApi",
  baseQuery: baseApiWithReauth,
  tagTypes: ["Questions", "Passages"],
  endpoints: (builder) => ({
    searchQuestions: builder.query({
      query: ({ type, section, text, createdBy, page = 1, limit = 10 }) => {
        const params = new URLSearchParams({
          ...(type && { type }),
          ...(section && { section }),
          ...(text && { text }),
          ...(createdBy && { createdBy }),
          page: page.toString(),
          limit: limit.toString(),
        });
        return `/question/search?${params.toString()}`;
      },
      transformResponse: (response) => {
        console.log("Raw API response:", JSON.stringify(response, null, 2));
        if (response && response.data) {
          return response.data;
        }
        return response; // fallback to original response if structure is unexpected
      },
      refetchOnMountOrArgChange: true,
    }),
    addQuestion: builder.mutation({
      query: (formData) => {
        const section = formData.get("section");
        const contentType =
          section === "listening" ? "multipart/form-data" : "application/json";
        if (contentType === "application/json") {
          // Convert FormData to JSON
          const jsonBody = {};
          for (let [key, value] of formData.entries()) {
            try {
              jsonBody[key] = JSON.parse(value);
            } catch {
              jsonBody[key] = value;
            }
          }
          return {
            url: "/question",
            method: "POST",
            body: jsonBody,
            headers: {
              "Content-Type": "application/json",
            },
          };
        } else {
          return {
            url: "/question",
            method: "POST",
            body: formData,
          };
        }
      },
    }),
    getPassagesWithQuestions: builder.query({
      query: (args) => {
        const { section, page, limit, orderBy, sortBy, createdBy } = args;
        const params = new URLSearchParams({
          ...(page && { page: page.toString() }),
          ...(limit && { limit: limit.toString() }),
          ...(orderBy && { orderBy }),
          ...(sortBy && { sortBy }),
          ...(createdBy && { createdBy }),
        });
        return `/question/passages/${section}?${params.toString()}`;
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.data.passages.map(({ _id }) => ({
                type: "Passages",
                id: _id,
              })),
              { type: "Passages", id: "LIST" },
            ]
          : [{ type: "Passages", id: "LIST" }],
    }),
    getQuestionsBySection: builder.query({
      query: (args) => {
        const { section, page, limit, orderBy, sortBy, createdBy } = args;
        const params = new URLSearchParams({
          ...(page && { page: page.toString() }),
          ...(limit && { limit: limit.toString() }),
          ...(orderBy && { orderBy }),
          ...(sortBy && { sortBy }),
          ...(createdBy && { createdBy }),
        });
        return `/question/${section}?${params.toString()}`;
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.data.questions.map(({ _id }) => ({
                type: "Questions",
                id: _id,
              })),
              { type: "Questions", id: "LIST" },
            ]
          : [{ type: "Questions", id: "LIST" }],
    }),
  }),

  tagTypes: ["Question"],
});

export const {
  useGetQuestionQuery,
  useAddQuestionMutation,
  useSearchQuestionsQuery,
  useGetPassagesWithQuestionsQuery,
  useGetQuestionsBySectionQuery,
} = questionApi;
