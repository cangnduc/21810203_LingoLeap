const mongoose = require("mongoose");

const testAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: [true, "Test is required"],
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
      default: Date.now,
    },
    endTime: { type: Date },
    maxEndTime: {
      type: Date,
      required: [true, "Max end time is required"],
    },
    status: {
      type: String,
      enum: ["in-progress", "completed", "abandoned"],
      default: "in-progress",
      required: [true, "Status is required"],
    },
    result: { type: mongoose.Schema.Types.ObjectId, ref: "TestResult" },
    totalScore: {
      type: Number,
      default: 0,
      min: [0, "Total score cannot be negative"],
    },
    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Questions",
        },
        answer: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexing
testAttemptSchema.index({ user: 1 });
testAttemptSchema.index({ test: 1 });

// Methods that delegate to TestAttemptFunction
testAttemptSchema.methods.start = async function (test) {
  const TestAttemptFunction = require("./function/testAttempt.function");
  return TestAttemptFunction.start(this, test);
};

testAttemptSchema.methods.isTimeUp = function () {
  const TestAttemptFunction = require("./function/testAttempt.function");
  return TestAttemptFunction.isTimeUp(this);
};

testAttemptSchema.methods.complete = async function () {
  const TestAttemptFunction = require("./function/testAttempt.function");
  return TestAttemptFunction.complete(this);
};

testAttemptSchema.methods.calculateResult = async function () {
  const TestAttemptFunction = require("./function/testAttempt.function");
  await TestAttemptFunction.calculateResult(this);
  
  return this;
};

testAttemptSchema.methods.calculateScore = function (
  questionData,
  answer,
  point
) {
  const TestAttemptFunction = require("./function/testAttempt.function");
  return TestAttemptFunction.calculateScore(questionData, answer, point);
};

const TestAttempt = mongoose.model("TestAttempt", testAttemptSchema);

module.exports = TestAttempt;
