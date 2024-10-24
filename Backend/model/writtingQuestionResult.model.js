// Add this new schema for writing question results
const writingQuestionResultSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: [true, "Question reference is required"],
  },
  totalScore: {
    type: Number,
    required: [true, "Question score is required"],
    min: [0, "Question score cannot be negative"],
  },
  content: {
    score: {
      type: Number,
      required: [true, "Content score is required"],
      min: [0, "Content score cannot be negative"],
    },
    weaknesses: {
      type: String,
      required: [true, "Weaknesses are required for writing questions"],
    },
    strengths: {
      type: String,
      required: [true, "Strengths are required for writing questions"],
    },
  },
  grammar: {
    score: {
      type: Number,
      required: [true, "Grammar score is required"],
    },
    weaknesses: {
      type: String,
      required: [true, "Grammar weaknesses are required for writing questions"],
    },
    strengths: {
      type: String,
      required: [true, "Grammar strengths are required for writing questions"],
    },
  },
  vocabulary: {
    score: {
      type: Number,
      required: [true, "Vocabulary score is required"],
    },
    weaknesses: {
      type: String,
      required: [
        true,
        "Vocabulary weaknesses are required for writing questions",
      ],
    },
    strengths: {
      type: String,
      required: [
        true,
        "Vocabulary strengths are required for writing questions",
      ],
    },
  },
  style: {
    score: {
      type: Number,
      required: [true, "Style score is required"],
    },
    weaknesses: {
      type: String,
      required: [true, "Style weaknesses are required for writing questions"],
    },
    strengths: {
      type: String,
      required: [true, "Style strengths are required for writing questions"],
    },
  },
  overall_feedback: {
    type: String,
    required: [true, "Overall feedback is required for writing questions"],
  },
});
const WritingQuestionResult = mongoose.model(
  "WritingQuestionResult",
  writingQuestionResultSchema
);

module.exports = { writingQuestionResultSchema, WritingQuestionResult };
