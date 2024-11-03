const mongoose = require("mongoose");
const { generateCompletion } = require("../helpers/openaiApi");

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
        userAnswer: mongoose.Schema.Types.Mixed,
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
//testAttemptSchema.index({ status: 1 });

testAttemptSchema.methods.start = function (test) {
  this.startTime = new Date();
  this.maxEndTime = new Date(this.startTime.getTime() + test.duration * 60000); // Convert minutes to milliseconds
  return this.save();
};
testAttemptSchema.methods.isTimeUp = function () {
  return new Date() >= this.maxEndTime;
};
testAttemptSchema.methods.complete = async function () {
  this.status = "completed";
  this.endTime = new Date();
  await this.save();
  return this;
};

testAttemptSchema.methods.isTimeUp = function () {
  return new Date() >= this.maxEndTime;
};

// Add this method to the testAttemptSchema
testAttemptSchema.methods.calculateResult = async function () {
  const Test = mongoose.model("Test");
  const TestResult = mongoose.model("TestResult");
  const Question = mongoose.model("Question");

  // Load the test with populated sections and questions
  const test = await Test.findById(this.test).populate({
    path: "sections.questions",
    model: "Question",
  });

  // Load all questions for this test attempt in a single query
  const questionIds = this.answers.map((answer) => answer.question);
  const questions = await Question.find({ _id: { $in: questionIds } });

  // Create a map for quick access to questions
  const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

  const testResult = new TestResult();
  let totalScore = 0;
  let totalQuestions = 0;
  const sectionScores = [];
  const questionScores = [];

  for (const section of test.sections) {
    let sectionScore = 0;
    let sectionQuestions = 0;

    for (const question of section.questions) {
      const answer = this.answers.find(
        (a) => a.question.toString() === question._id.toString()
      );
      let score = 0;

      if (answer) {
        // Use the questionMap instead of querying the database
        const questionData = questionMap.get(question._id.toString());
        score = this.calculateScore(questionData, answer, question.points || 1);

        questionScores.push({
          question: question._id,
          score: score,
        });
        sectionScore += score;
      } else {
        questionScores.push({
          question: question._id,
          score: 0,
        });
      }

      sectionQuestions++;
      totalQuestions++;
    }

    sectionScores.push({
      sectionType: section.name,
      score: sectionScore,
      totalQuestions: sectionQuestions,
    });

    totalScore += sectionScore;
  }

  testResult.testAttempt = this._id;
  testResult.user = this.user;
  testResult.test = this.test;
  testResult.totalScore = totalScore;
  testResult.maxTotalScore = test.total_possible_score;
  testResult.scorePercentage = (totalScore / test.total_possible_score) * 100;
  testResult.totalQuestions = totalQuestions;
  testResult.sectionScores = sectionScores;
  testResult.questionScores = questionScores;

  await testResult.save();

  this.result = testResult._id;
  this.totalScore = totalScore;
  await this.save();

  return testResult;
};

// Helper method to calculate score questions
testAttemptSchema.methods.calculateScore = function (
  questionData,
  answer,
  point
) {
  switch (questionData.type) {
    case "single_choice":
      return answer.userAnswer === questionData.correctAnswer ? point : 0;
    case "true_false":
      return answer.userAnswer === questionData.correctAnswer ? point : 0;
    case "multiple_choice":
      const correctAnswers = new Set(questionData.correctAnswers);
      const userAnswers = new Set(answer.userAnswer);
      const correctCount = [...correctAnswers].filter((a) =>
        userAnswers.has(a)
      ).length;
      const incorrectCount = userAnswers.size - correctCount;
      const multipleChoiceScore =
        Math.max(0, (correctCount - incorrectCount) / correctAnswers.size) *
        point;
      return Math.round(multipleChoiceScore * 100) / 100;

    case "matching":
      const correctPairs = questionData.correctPairs;
      const userPairs = answer.userAnswer;
      let matchingCorrectCount = 0;

      for (const correctPair of correctPairs) {
        const userPair = userPairs.find(
          (pair) => pair.left === correctPair.left
        );
        if (userPair && userPair.right === correctPair.right) {
          matchingCorrectCount++;
        }
      }

      const matchingScore =
        (matchingCorrectCount / correctPairs.length) * point;
      return Math.round(matchingScore * 100) / 100; // Round to 2 decimal places

    case "ordering":
      const correctOrder = questionData.correctOrder;
      const userOrder = answer.userAnswer;

      if (
        !Array.isArray(userOrder) ||
        userOrder.length !== correctOrder.length
      ) {
        return 0; // Invalid answer, return 0 points
      }

      let correctPositions = 0;
      for (let i = 0; i < correctOrder.length; i++) {
        if (correctOrder[i] === userOrder[i]) {
          correctPositions++;
        }
      }

      const orderingScore = (correctPositions / correctOrder.length) * point;
      return Math.round(orderingScore * 100) / 100; // Round to 2 decimal places

    default:
      return 0;
  }
};

// const exampleTestAttempt = {
//   answers: [
//     {
//       question: "666666666666666666666666",
//       userAnswer: "A",
//       questionType: "single_choice",
//     },
//     {
//       question: "666666666666666666666666",
//       userAnswer: ["A", "B"],
//       questionType: "multiple_choice",
//     },
//     {
//       question: "666666666666666666666666",
//       userAnswer: ["A", "B", "C", "D"],
//       questionType: "ordering",
//     },
//     {
//       question: "666666666666666666666666",
//       userAnswer: "A",
//       questionType: "true_false",
//     },
//     {
//       question: "666666666666666666666666",
//       userAnswer: [
//         { left: "1", right: "A" },
//         { left: "2", right: "B" },
//         { left: "3", right: "C" },
//       ],
//       questionType: "matching",
//     },
//     {
//       question: "666666666666666666666666",
//       userAnswer: ["A", "B"],
//       questionType: "matching",
//     },
//   ],
//   test: "666666666666666666666666",
//   user: "666666666666666666666666",
//   startTime: new Date(),
//   maxEndTime: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour from now
//   status: "in-progress",
// };
const TestAttempt = mongoose.model("TestAttempt", testAttemptSchema);

module.exports = TestAttempt;
