const Test = require("../model/test.model");
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
};

module.exports = TestAttemptService;
