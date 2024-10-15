const mongoose = require("mongoose");

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
      max: [100, "Total score cannot exceed 100"],
    },
    totalQuestions: {
      type: Number,
      required: [true, "Total number of questions is required"],
      min: [1, "Test must have at least one question"],
    },
    sectionScores: [sectionScoreSchema],
    questionScores: [questionScoreSchema],
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
  const maxPoints = this.totalQuestions * 100; // Assuming each question is worth 100 points
  this.totalScore = (totalPoints / maxPoints) * 100;
  return this.totalScore;
};

// Virtuals
testResultSchema.virtual("isPassing").get(function () {
  return this.totalScore >= 60; // Assuming 60% is passing
});

const TestResult = mongoose.model("TestResult", testResultSchema);

module.exports = TestResult;

//generate a test result for a test attempt as json object
/*
{
  testAttempt: ObjectId,
  user: ObjectId,
  test: ObjectId,
  totalScore: Number,
  totalQuestions: Number,
  sectionScores: [sectionScoreSchema],
  questionScores: [questionScoreSchema],
  feedback: String,

}
{
  sectionScoreSchema: {
    sectionType: String,
    score: Number,
    totalQuestions: Number,
  }
}
{
  questionScoreSchema: {
    question: ObjectId,
    score: Number,
  }
}
*/
