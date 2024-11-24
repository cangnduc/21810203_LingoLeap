const Test = require("../model/test.model.v1");
const TestAttempt = require("../model/testAttempt.model");
const { NotFoundError, ForbiddenError } = require("../helpers/error");
const TestAttemptService = {
  getTestForAttempt: async (testId, userId) => {
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

    const test = await Test.findById(testId.toString())
      .select("title duration description testType sections attemptsAllowed")
      .populate({
        path: "sections.questions._id",
        model: "Question",
        select: selectAttribute,
      })
      .populate({
        path: "sections.passages._id",
        model: "BasePassage",
        select: "text title passageType instruction soundFile questions",
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
      test: testId,
      user: userId,
      status: { $in: ["completed"] },
    });

    if (existingAttempts >= test.attemptsAllowed) {
      throw new ForbiddenError("Maximum attempts reached for this test");
    }
    return test;
  },

  validateTestAvailability: async (test) => {
    if (!test) {
      throw new NotFoundError("Test not found");
    }

    if (test.availableFrom && test.availableFrom > new Date()) {
      throw new ForbiddenError("Test is not available yet");
    }

    if (test.availableUntil && test.availableUntil < new Date()) {
      throw new ForbiddenError("Test is not available anymore");
    }
  },

  findOrCreateTestAttempt: async (userId, testId, test) => {
    // First check the number of completed attempts
    const completedAttempts = await TestAttempt.countDocuments({
      test: testId,
      user: userId,
      status: "completed",
    });

    if (completedAttempts >= test.attemptsAllowed) {
      throw new ForbiddenError("Maximum attempts reached for this test");
    }

    // Look for in-progress attempt
    let testAttempt = await TestAttempt.findOne({
      user: userId,
      status: "in-progress",
    })
      .select("test maxEndTime")
      .lean();

    // If there's an in-progress attempt for a different test
    if (testAttempt && testAttempt.test.toString() !== testId) {
      return { existingAttempt: testAttempt };
    }

    // If no attempt exists, create new one
    if (!testAttempt) {
      testAttempt = await TestAttempt.create({
        user: userId,
        test: testId,
        status: "in-progress",
        startTime: new Date(),
        maxEndTime: new Date(Date.now() + test.duration * 60000),
        answers: [],
      });
    }

    return { testAttempt };
  },
  validateAttemptTime: async (testAttempt) => {
    if (testAttempt.maxEndTime < new Date()) {
      await TestAttempt.findByIdAndUpdate(testAttempt._id, {
        status: "completed",
      });
      throw new ForbiddenError("Test time has expired");
    }
  },
  validateTestAttempt: async (testAttempt, userId, testId, attemptsAllowed) => {
    if (testAttempt.maxEndTime < new Date()) {
      await TestAttempt.findByIdAndUpdate(testAttempt._id, {
        status: "completed",
      });
      throw new ForbiddenError("Test time has expired");
    }

    const existingAttempts = await TestAttempt.countDocuments({
      test: testId,
      user: userId,
      status: { $in: ["completed"] },
    });

    if (existingAttempts >= attemptsAllowed) {
      throw new ForbiddenError("Maximum attempts reached for this test");
    }
  },
};

module.exports = TestAttemptService;
