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
        //console.log("Raw API response:", JSON.stringify(response, null, 2));
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
            url: "/question/add",
            method: "POST",
            body: jsonBody,
            headers: {
              "Content-Type": "application/json",
            },
          };
        } else {
          return {
            url: "/question/add",
            method: "POST",
            body: formData,
          };
        }
      },
      invalidatesTags: ["Questions"],
    }),
    getMyQuestions: builder.query({
      query: (args) => {
        const {
          sections,
          types,
          page = 1,
          limit = 10,
          search = "",
          sortBy = "createdAt",
          order = "desc",
        } = args;

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(sections && { sections }),
          ...(types && { types }),
          ...(search && { search }),
          ...(sortBy && { sortBy }),
          ...(order && { order }),
        });

        return `/question/my-questions?${params.toString()}`;
      },
      refetchOnMountOrArgChange: 30, // refetch after 30 seconds
      refetchOnFocus: false, // don't refetch when window regains focus
      refetchOnReconnect: true, // refetch when internet reconnects
      providesTags: (result) =>
        result
          ? [
              ...result.questions.map(({ _id }) => ({
                type: "Questions",
                id: _id,
              })),
              { type: "Questions", id: "LIST" },
            ]
          : [{ type: "Questions", id: "LIST" }],
      transformResponse: (response) => {
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
    }),
    deleteQuestion: builder.mutation({
      query: ({ id }) => ({
        url: `/question/my-question/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted({ id, filters }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          questionApi.util.updateQueryData(
            "getMyQuestions",
            filters,
            (draft) => {
              if (Array.isArray(draft?.questions)) {
                const index = draft.questions.findIndex((q) => q._id === id);
                if (index !== -1) {
                  draft.questions.splice(index, 1);
                  if (typeof draft.total === "number") {
                    draft.total -= 1;
                  }
                }
              }

              // Delete the question from the passages
              if (Array.isArray(draft?.passages)) {
                draft.passages.forEach((passage) => {
                  if (Array.isArray(passage.questions)) {
                    const questionIndex = passage.questions.findIndex(
                      (q) => q._id === id
                    );
                    if (questionIndex !== -1) {
                      passage.questions.splice(questionIndex, 1);
                      if (typeof draft.total === "number") {
                        draft.total -= 1;
                      }
                    }
                  }
                });
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();

          throw error;
        }
      },
    }),
    deletePassage: builder.mutation({
      query: ({ id }) => ({
        url: `/question/passage/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted({ id, filters }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          questionApi.util.updateQueryData(
            "getMyQuestions",
            filters,
            (draft) => {
              draft.passages = draft.passages.filter((p) => p._id !== id);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          throw error;
        }
      },
    }),
    editQuestion: builder.mutation({
      query: ({ id, data }) => {
        console.log("data", data);
        return {
          url: `/question/my-question/${id}`,
          method: "PUT",
          body: data,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Questions", id: "LIST" },
        { type: "Questions", id },
      ],
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
    uploadSoundFile: builder.mutation({
      query: (formData) => {
        return {
          url: "/question/upload/sound",
          method: "POST",
          body: formData,
        };
      },
    }),
    getMyQuestionById: builder.query({
      query: (id) => `/question/my-question/${id}`,
      transformResponse: (response) => {
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: ["Questions"],
      providesTags: (result, error, id) => [{ type: "Questions", id }],
    }),
    getQuestionById: builder.query({
      query: (id) => `/question/${id}`,
      transformResponse: (response) => {
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: ["Questions"],
    }),
  }),
});

export const {
  useGetMyQuestionByIdQuery,
  useAddQuestionMutation,
  useDeleteQuestionMutation,
  useSearchQuestionsQuery,
  useGetPassagesWithQuestionsQuery,
  useGetQuestionsBySectionQuery,
  useUploadSoundFileMutation,
  useGetMyQuestionsQuery,
  useEditQuestionMutation,
  useDeletePassageMutation,
  useGetQuestionByIdQuery,
} = questionApi;
