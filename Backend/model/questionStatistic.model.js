const mongoose = require("mongoose");

const questionStatisticsSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      unique: true,
    },
    totalAttempts: { type: Number, default: 0 },
    correctAttempts: { type: Number, default: 0 },
    incorrectAttempts: { type: Number, default: 0 },
    averageTimeSpent: { type: Number, default: 0 }, // in seconds
    difficultyRating: {
      calculated: { type: Number, default: 0 },
      userReported: { type: Number, default: 0 },
    },
    answerDistribution: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    usageInTests: [
      {
        testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
        successRate: { type: Number, default: 0 },
      },
    ],
    tags: [String],
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuestionStatistics", questionStatisticsSchema);
