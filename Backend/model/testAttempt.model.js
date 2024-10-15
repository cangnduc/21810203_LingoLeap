const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: [true, "Question reference is required"],
  },
  questionType: {
    type: String,
    required: [true, "Question type is required"],
    enum: [
      "single_choice",
      "multiple_choice",
      "true_false",
      "fill_in_the_blank",
      "matching",
      "ordering",
      "essay",
      "open_ended",
    ],
  },
  userAnswer: { type: mongoose.Schema.Types.Mixed },
  selectedChoices: [String],
  matchedPairs: [
    {
      questionId: String,
      answerId: String,
    },
  ],
  audioResponse: String,
  score: {
    type: Number,
    min: [0, "Answer score cannot be negative"],
  },
});

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
    score: {
      type: Number,
      min: [0, "Score cannot be negative"],
      max: [100, "Score cannot exceed 100"],
    },
    answers: [answerSchema],
    status: {
      type: String,
      enum: ["in-progress", "completed", "abandoned"],
      default: "in-progress",
      required: [true, "Status is required"],
    },
    result: { type: mongoose.Schema.Types.ObjectId, ref: "TestResult" },
  },
  {
    timestamps: true,
  }
);

// Indexing
testAttemptSchema.index({ user: 1, test: 1 });
testAttemptSchema.index({ status: 1 });

// Methods
testAttemptSchema.methods.calculateScore = function () {
  this.score = this.answers.reduce(
    (total, answer) => total + (answer.score || 0),
    0
  );
  return this.score;
};

testAttemptSchema.methods.start = function (test) {
  this.startTime = new Date();
  this.maxEndTime = new Date(this.startTime.getTime() + test.duration * 60000); // Convert minutes to milliseconds
  return this.save();
};

testAttemptSchema.methods.complete = function () {
  const now = new Date();
  this.endTime = now > this.maxEndTime ? this.maxEndTime : now;
  this.status = "completed";
  return this.save();
};

testAttemptSchema.methods.isTimeUp = function () {
  return new Date() >= this.maxEndTime;
};

// Hooks
testAttemptSchema.pre("save", function (next) {
  if (this.isModified("answers")) {
    this.calculateScore();
  }
  next();
});

const TestAttempt = mongoose.model("TestAttempt", testAttemptSchema);

module.exports = TestAttempt;

// Example of creating a test attempt with the updated schema
const exampleTestAttempt = new TestAttempt({
  user: new mongoose.Types.ObjectId(), // Assuming this is the ObjectId of an existing user
  test: new mongoose.Types.ObjectId(), // Assuming this is the ObjectId of an existing test
  startTime: new Date(),
  answers: [
    {
      question: new mongoose.Types.ObjectId(), // Assuming this is the ObjectId of an existing question
      questionType: "writing",
      userAnswer: "This is the user's answer to a writing question.",
      score: null, // Will be set when graded
    },
    {
      question: new mongoose.Types.ObjectId(),
      questionType: "single_choice",
      userAnswer: "B", // For a multiple choice question
      score: 1, // Automatically scored
    },
    {
      question: new mongoose.Types.ObjectId(),
      questionType: "speaking",
      audioResponse: "https://audio-file-url.com/user-speaking-answer.mp3", // URL to audio file for speaking question
      score: null, // Will be set when graded
    },
    {
      question: new mongoose.Types.ObjectId(),
      questionType: "multiple_choice",
      selectedChoices: ["A", "C"],
      score: null, // Will be set when graded
    },
    {
      question: new mongoose.Types.ObjectId(),
      questionType: "matching",
      matchedPairs: [
        { questionId: "q1", answerId: "a2" },
        { questionId: "q2", answerId: "a1" },
      ],
      score: null, // Will be set when graded
    },
  ],
  status: "in-progress",
  result: null, // Will be set when TestResult is created
});

// Save the example test attempt
// Uncomment the following lines to actually save the example to the database
/*
exampleTestAttempt.save()
  .then(savedAttempt => {
    console.log("Example test attempt saved:", savedAttempt);
  })
  .catch(error => {
    console.error("Error saving example test attempt:", error);
  });
*/
