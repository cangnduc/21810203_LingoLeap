const TestResult = require("../model/testResult.model");
const { BadRequestError, NotFoundError } = require("../helpers/error");
class TestResultService {
  static async getTestResultByUser(userId) {
    // First get the raw documents
    const rawResults = await TestResult.find({ userId });
    console.log("Raw results:", rawResults); // Check if testAttempt IDs exist

    const testResult = await TestResult.find({ userId })
      .select("-__v -createdAt -updatedAt")
      .populate({
        path: "test",
        model: "Test",
        select: "title",
      })
      .populate({
        path: "testAttempt",
        model: "TestAttempt",
        select: "startTime endTime",
      })

      .lean();
    return testResult;
  }

  static getQuestionPoints(sections, questionId) {
    for (const section of sections) {
      // Check regular questions
      if (section.questions) {
        const question = section.questions.find(
          (q) => q._id.toString() === questionId.toString()
        );
        if (question) return question.points;
      }

      // Check passage questions
      if (section.passages) {
        for (const passage of section.passages) {
          const questionsCount = passage._id.questions.length;

          // Convert both the passage questions and the questionId to strings before comparing
          const passageQuestionIds = passage._id.questions.map((id) =>
            id.toString()
          );
          const questionIdString = questionId.toString();

          if (passageQuestionIds.includes(questionIdString)) {
            return passage.points / questionsCount;
          }
        }
      }
    }
    return null;
  }

  static getWritingQuestionPoints(sections, questionId) {
    const writingSection = sections.find((s) => s.name === "writing");
    if (!writingSection?.questions) return null;

    const question = writingSection.questions.find(
      (q) => q._id.toString() === questionId.toString()
    );
    return question ? question.points : null;
  }

  static async getTestResultByAttemptId(attemptId) {
    const testResult = await TestResult.findOne({ testAttempt: attemptId })
      .select("-__v -createdAt -updatedAt")
      .populate({
        path: "test",
        model: "Test",
        select: "title passingScore sections",
        populate: {
          path: "sections.passages._id",
          model: "BasePassage",
          select: "questions",
        },
      })
      .populate({
        path: "testAttempt",
        model: "TestAttempt",
        select: "answers",
      })
      .populate({
        path: "questionScores._id",
        model: "Question",
        select: "questionText type",
      })
      .lean();

    if (!testResult) {
      throw new Error("Test result not found");
    }
    console.log("testResult", testResult);
    // Transform the data into a simpler format
    return {
      testInfo: {
        title: testResult.test.title,
        passingScore: testResult.test.passingScore,
        totalScore: testResult.totalScore,
        maxTotalScore: testResult.maxTotalScore,
        scorePercentage: testResult.scorePercentage,
        isPassing: testResult.totalScore >= testResult.test.passingScore,
        totalQuestions: testResult.totalQuestions,
      },

      sectionScores: testResult.sectionScores.map((section) => ({
        name: section.sectionType,
        score: Number(section.score.toFixed(1)),
        totalQuestions: section.totalQuestions,
      })),

      questions: testResult.questionScores
        .filter((q) => q._id) // Filter out null questions
        .map((q, index) => {
          if (q._id.type === "open_ended") {
            return {
              number: index + 1,
              text: q._id.questionText,
              score: Number(q.score.toFixed(1)),
              speakingResult: testResult.speakingResult,
              points: TestResultService.getQuestionPoints(
                testResult.test.sections,
                q._id._id
              ),
            };
          } else {
            return {
              number: index + 1,
              text: q._id.questionText,
              score: Number(q.score.toFixed(1)),
              points: TestResultService.getQuestionPoints(
                testResult.test.sections,
                q._id._id
              ),
            };
          }
        }),

      writingAssessments: testResult.writingQuestionResults.map((result) => ({
        aspects: result.aspects.map((aspect) => ({
          name: aspect.aspect,
          score: aspect.score,
          feedback: aspect.feedback,
          maxScore: TestResultService.getWritingQuestionPoints(
            testResult.test.sections,
            result.question
          ),
        })),
        overallFeedback: result.summary_feedback,
        totalScore: Number(result.totalScore.toFixed(1)),
        maxScore: TestResultService.getWritingQuestionPoints(
          testResult.test.sections,
          result.question
        ),
      })),
    };
  }

  static async getTestResultByAttemptIdV1(attemptId) {
    console.log("attemptId", attemptId);
    const testResult = await TestResult.findOne({ testAttempt: attemptId })
      .select("-__v -createdAt -updatedAt")
      .populate({
        path: "test",
        model: "Test",
        select: "title passingScore sections",
        populate: {
          path: "sections.passages._id",
          model: "BasePassage",
          select: "questions",
        },
      })
      .populate({
        path: "testAttempt",
        model: "TestAttempt",
        select: "answers",
      })
      .populate({
        path: "questionScores._id",
        model: "Question",
        select: "questionText",
      })
      .lean();
    if (!testResult) {
      throw new NotFoundError("Test result not found");
    }
    testResult.test.sections.forEach((section) => {
      section.passages?.forEach((passage) => {
        const numberOfQuestions = passage._id.questions.length;
        const pointsPerQuestion = passage.points / numberOfQuestions;
        passage.pointsPerQuestion = pointsPerQuestion;
      });
    });
    return testResult;
  }
}

module.exports = TestResultService;
