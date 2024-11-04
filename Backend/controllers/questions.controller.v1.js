const QuestionsService = require("../services/questions.service");
const { BadRequestError } = require("../helpers/error");
const Response = require("../helpers/response");

class QuestionsController {
  constructor() {
    this.addQuestion = this.addQuestion.bind(this);
  }

  addQuestion = async (req, res) => {
    try {
      const { user } = req;
      const { section } = req.body;

      // Get appropriate validator
      const validator = QuestionsService.getValidator(section);

      // Prepare question data
      const questionData = QuestionsService.prepareQuestionData(
        req.body,
        user,
        req.file
      );

      // Validate data
      const validationResult = QuestionsService.validateData(
        validator,
        questionData
      );

      // Save data
      let result;
      if (["reading", "listening"].includes(section)) {
        result = await QuestionsService.savePassageWithQuestions(
          section,
          validationResult,
          req.audioFilename
        );
      } else {
        const question = QuestionsService.createQuestionInstance(
          validationResult.data.question
        );
        result = await question.save();
      }

      Response.sendSuccess(
        res,
        "Question(s) created successfully",
        result,
        201
      );
    } catch (error) {
      console.error("Error in addQuestion:", error);
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map(
          (err) => err.message
        );
        throw new BadRequestError(validationErrors.join(", "));
      }
      throw error;
    }
  };
}

module.exports = new QuestionsController();
