import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";

const initialState = {
  answers: [],
};

const testAnswerSlice = createSlice({
  name: "testAnswer",
  initialState,
  reducers: {
    setTestAnswer: (state, action) => {
      const { questionId, answer } = action.payload;

      if (!Array.isArray(state.answers)) {
        state.answers = [];
      }

      const existingIndex = state.answers.findIndex(
        (a) => a.question === questionId
      );

      if (questionId && answer !== undefined) {
        if (existingIndex >= 0) {
          state.answers[existingIndex] = {
            question: questionId,
            answer: answer,
          };
        } else {
          state.answers.push({
            question: questionId,
            answer: answer,
          });
        }
      }
    },
    clearTestAnswers: (state) => {
      state.answers = [];
    },
  },
});

export const { setTestAnswer, clearTestAnswers } = testAnswerSlice.actions;

export default testAnswerSlice.reducer;

export const selectAnswers = createSelector(
  [(state) => state.testAnswer.answers],
  (answers) => [...answers]
);
