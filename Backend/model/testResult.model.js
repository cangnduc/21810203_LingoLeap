const mongoose = require("mongoose");
const {
  writingQuestionResultSchema,
} = require("./writtingQuestionResult.model");
const sectionScoreSchema = new mongoose.Schema({
  sectionType: {
    type: String,
    enum: ["reading", "listening", "writing", "speaking"],
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
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: [true, "Question reference is required"],
  },
  score: {
    type: Number,
    required: [true, "Question score is required"],
    min: [0, "Question score cannot be negative"],
  },
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
      required: [true, "User reference is required"],
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: [true, "Test reference is required"],
    },
    totalScore: {
      type: Number,
      required: [true, "Total score is required"],
      min: [0, "Total score cannot be negative"],
    },
    maxTotalScore: {
      type: Number,
      required: [true, "Maximum total score is required"],
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

// Indexing
testResultSchema.index({ user: 1, test: 1 });
testResultSchema.index({ gradedBy: 1 });
testResultSchema.index({ testAttempt: 1 });

// Methods
testResultSchema.methods.addFeedback = function (feedback, graderId) {
  this.feedback = feedback;
  this.gradedBy = graderId;
  this.gradedAt = new Date();
  return this.save();
};

testResultSchema.methods.calculateTotalScore = function () {
  const totalPoints = this.questionScores.reduce(
    (sum, qs) => sum + qs.score,
    0
  );
  const maxPoints = this.questionScores.reduce(
    (sum, qs) => sum + qs.maxScore,
    0
  );
  this.totalScore = totalPoints;
  this.maxTotalScore = maxPoints;
  this.scorePercentage = (totalPoints / maxPoints) * 100;
  return this.scorePercentage;
};

// Virtuals
testResultSchema.virtual("isPassing").get(function () {
  return this.totalScore >= 60; // Assuming 60% is passing
});

const TestResult = mongoose.model("TestResult", testResultSchema);

module.exports = TestResult;
