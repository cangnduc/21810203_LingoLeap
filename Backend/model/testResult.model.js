const mongoose = require("mongoose");

const sectionScoreSchema = new mongoose.Schema({
  sectionType: {
    type: String,
    enum: ["reading", "listening", "writing", "speaking", "general"],
    required: [true, "Section type is required"],
  },
  score: {
    type: Number,
    required: [true, "Section score is required"],
    min: [0, "Section score cannot be negative"],
  },
  totalQuestions: {
    type: Number,
    required: [true, "Total questions for the section is required"],
    min: [1, "Section must have at least one question"],
  },
});

const questionScoreSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BaseQuestion",
    required: true,
  },
  score: {
    type: Number,
    required: [true, "Question score is required"],
    min: [0, "Question score cannot be negative"],
  },
});

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

const writingQuestionResultSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BaseQuestion",
    required: true,
  },
  aspects: {
    type: [aspectSchema],
    required: true,
  },
  summary_feedback: {
    type: String,
    required: true,
  },
  totalScore: {
    type: Number,
    required: true,
  },
});
const SpeakingResultSchema = new mongoose.Schema({
  fluency: { type: Number },
  pronunciation: { type: Number },
  vocabulary: { type: Number },
  overallCommunication: { type: Number },
  totalScore: { type: Number },
  feedback: { type: String },
});
const testResultSchema = new mongoose.Schema(
  {
    testAttempt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestAttempt",
      required: [true, "Test attempt reference is required"],
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      //required: [true, "User reference is required"],
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      //required: [true, "Test reference is required"],
    },
    totalScore: {
      type: Number,
      required: [true, "Total score is required"],
      min: [0, "Total score cannot be negative"],
    },
    maxTotalScore: {
      type: Number,
      default: 100,
      min: [0, "Maximum total score cannot be negative"],
    },
    scorePercentage: {
      type: Number,
      min: [0, "Score percentage cannot be negative"],
      max: [100, "Score percentage cannot exceed 100"],
    },
    totalQuestions: {
      type: Number,
      required: [true, "Total number of questions is required"],
      min: [1, "Test must have at least one question"],
    },
    sectionScores: [sectionScoreSchema],
    questionScores: [questionScoreSchema],
    writingQuestionResults: [writingQuestionResultSchema],
    speakingResult: SpeakingResultSchema,
    feedback: { type: String },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    gradedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);
// Fluency: 80
// Pronunciation: 75
// Vocabulary: 70
// Overall communication: 75
// Total score: 75

// Feedback: johndoe, you demonstrated good fluency throughout the conversation and were able to express your thoughts reasonably well. However, there were some moments where hesitation affected the overall flow. Your pronunciation was generally clear, but there were instances where some words could have been articulated better. In terms of vocabulary, you used a range of terms related to technology and education, but incorporating more advanced vocabulary could enhance your responses. Overall, you communicated your ideas effectively, but working on those areas mentioned would improve your performance. Keep practicing, and you'll see great progress!

// Indexing
testResultSchema.index({ user: 1 });
testResultSchema.index({ testAttempt: 1 });

// Methods
testResultSchema.methods.addFeedback = function (feedback, graderId) {
  this.feedback = feedback;
  this.gradedBy = graderId;
  this.gradedAt = new Date();
  return this.save();
};

// Virtuals

const TestResult = mongoose.model("TestResult", testResultSchema);

module.exports = TestResult;
