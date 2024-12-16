const Test = require("../model/test.model.v1");
const TestAttempt = require("../model/testAttempt.model");
const TestAttemptService = require("../services/testAttempt.service");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../helpers/error");
const Response = require("../helpers/response");
class TestAttemptController {
  constructor() {
    // Bind all methods to this instance
    this.getTestAttempt = this.getTestAttempt.bind(this);
    this.getTestForAttempt = this.getTestForAttempt.bind(this);
    this.initializeTestAttempt = this.initializeTestAttempt.bind(this);
    this.saveAnswer = this.saveAnswer.bind(this);
    this.completeTestAttempt = this.completeTestAttempt.bind(this);
  }

  async getTestAttempt(req, res) {
    const { id } = req.params;
    const testAttempt = await TestAttempt.findById(id).populate("test").lean();

    if (!testAttempt) {
      throw new BadRequestError("Test attempt not found");
    }

    Response.sendSuccess(res, "Test attempt fetched successfully", testAttempt);
  }

  async getTestForAttempt(req, testId) {
    const selectAttribute = `
      type instruction questionText
      answer
      answers
      text blanks
      leftColumn rightColumn
      items
      prompt
      minWords maxWords rubric
    `;

    const test = await Test.findById(testId)
      .select("title duration description testType sections attemptsAllowed")
      .populate({
        path: "sections.questions._id",
        model: "Question",
        select: selectAttribute,
      })
      .populate({
        path: "sections.passages._id",
        model: "BasePassage",
        select: "text title passageType url soundFile",
        populate: {
          path: "questions",
          model: "Question",
          select: selectAttribute,
        },
      })
      .lean();

    if (!test) {
      throw new NotFoundError("Test not found");
    }

    // Additional validations specific to test attempts
    const existingAttempts = await TestAttempt.countDocuments({
      test: id,
      user: req.user._id,
      status: { $in: ["completed"] },
    });

    if (existingAttempts >= test.attemptsAllowed) {
      throw new ForbiddenError("Maximum attempts reached for this test");
    }
    return test;
  }
  async checkTestAttempt(req, res) {
    const { testId } = req.body;
    const { user } = req;

    // Find test and validate availability
    const test = await Test.findById(testId)
      .select(
        "duration attemptsAllowed availableFrom availableUntil isPublished"
      )
      .lean();

    await TestAttemptService.validateTestAvailability(test);

    // Find or create test attempt
    const { existingAttempt, testAttempt } =
      await TestAttemptService.findOrCreateTestAttempt(user._id, testId, test);

    if (existingAttempt) {
      await TestAttemptService.validateAttemptTime(existingAttempt);
      console.log("it goes here");

      return Response.sendSuccess(
        res,
        "Found existing test attempt currently in progress",
        existingAttempt
      );
    }

    // Validate the test attempt
    await TestAttemptService.validateTestAttempt(
      testAttempt,
      user._id,
      testId,
      test.attemptsAllowed
    );

    Response.sendSuccess(res, "Test attempt checked successfully", testAttempt);
  }
  async initializeTestAttempt(req, res) {
    const { testAttemptId } = req.params;
    const { user } = req;

    let testAttempt = await TestAttempt.findById(testAttemptId);

    // If no attempt exists, create one
    if (!testAttempt) {
      throw new BadRequestError("Test attempt not found");
    }

    if (
      testAttempt.maxEndTime < new Date() &&
      testAttempt.status === "in-progress"
    ) {
      await testAttempt.complete();
      throw new ForbiddenError("Test time has expired");
    }
    const test = await TestAttemptService.getTestForAttempt(
      testAttempt.test,
      user._id
    );

    Response.sendSuccess(res, "Test attempt initialized successfully", {
      test,
      testAttempt,
    });
  }

  async updateAnswer(req, res) {
    const { testAttemptId } = req.params;
    const { questionId, answer } = req.body;

    const testAttempt = await TestAttempt.findById(testAttemptId);
    if (!testAttempt) {
      throw new BadRequestError("Test attempt not found");
    }

    if (testAttempt.isTimeUp()) {
      throw new ForbiddenError("Test time has expired");
    }

    // Update or add new answer
    const answerIndex = testAttempt.answers.findIndex(
      (a) => a.question.toString() === questionId
    );

    if (answerIndex > -1) {
      testAttempt.answers[answerIndex].userAnswer = answer;
    } else {
      testAttempt.answers.push({
        question: questionId,
        userAnswer: answer,
      });
    }

    await testAttempt.save();
    Response.sendSuccess(res, "Answer saved successfully");
  }
  async saveAnswer(req, res) {
    const { testAttemptId } = req.params;
    const { answers } = req.body;
    const testAttempt = await TestAttempt.findById(testAttemptId);
    if (!testAttempt) {
      throw new BadRequestError("Test attempt not found");
    }
    testAttempt.answers = answers;
    await testAttempt.save();
    Response.sendSuccess(res, "Answers saved successfully");
  }

  async completeTestAttempt(req, res) {
    const { testAttemptId } = req.params;

    const testAttempt = await TestAttempt.findById(testAttemptId);
    if (!testAttempt) {
      throw new BadRequestError("Test attempt not found");
    }

    await testAttempt.complete();
    const result = await testAttempt.calculateResult();
    const test = await Test.findById(result.test).select("totalAttempts");
    test.totalAttempts += 1;
    await test.save();
    Response.sendSuccess(res, "Test completed successfully", result);
  }

  // Get all test attempts by user
  async getAllTestAttemptsByUser(req, res) {
    const { user } = req;
    const testAttempts = await TestAttempt.find({ user: user._id })
      .populate("test", "title")
      .select("status startTime endTime test maxEndTime result")
      .lean();
    Response.sendSuccess(
      res,
      "Test attempts fetched successfully",
      testAttempts
    );
  }
}

module.exports = new TestAttemptController();
