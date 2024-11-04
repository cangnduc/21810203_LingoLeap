const mongoose = require("mongoose");

const aspectSchema = new mongoose.Schema({
  aspect: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  feedback: {
    type: String,
    required: true,
  },
});

const writingQuestionResultSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BaseQuestion",
      required: true,
    },
    aspects: [aspectSchema],
    summary_feedback: {
      type: String,
      required: true,
    },
    totalScore: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = { writingQuestionResultSchema };
