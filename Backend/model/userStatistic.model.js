const mongoose = require("mongoose");
const userStatisticsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    testsCompleted: {
      total: { type: Number, default: 0 },
      byDifficulty: {
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 },
      },
      byType: {
        practice: { type: Number, default: 0 },
        exam: { type: Number, default: 0 },
      },
    },
    averageScores: {
      overall: { type: Number, default: 0 },
      bySection: {
        reading: { type: Number, default: 0 },
        listening: { type: Number, default: 0 },
        writing: { type: Number, default: 0 },
        speaking: { type: Number, default: 0 },
      },
    },
    questionStats: {
      totalAttempted: { type: Number, default: 0 },
      correctAnswers: { type: Number, default: 0 },
      byType: {
        single_choice: {
          attempted: { type: Number, default: 0 },
          correct: { type: Number, default: 0 },
        },
        multiple_choice: {
          attempted: { type: Number, default: 0 },
          correct: { type: Number, default: 0 },
        },
        fill_in_the_blank: {
          attempted: { type: Number, default: 0 },
          correct: { type: Number, default: 0 },
        },
      },
    },
    timeStats: {
      totalTimeSpent: { type: Number, default: 0 }, // in minutes
      averageTestDuration: { type: Number, default: 0 },
      averageQuestionTime: { type: Number, default: 0 },
    },
    progressOverTime: [
      {
        date: { type: Date },
        score: { type: Number },
        testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
      },
    ],
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserStatistics", userStatisticsSchema);
