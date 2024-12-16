const QuestionsService = require("../services/questions.service");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../helpers/error");
const Response = require("../helpers/response");
const { BaseQuestion, BasePassage } = require("../model/question.model.v1");

class QuestionsControllerV1 {
  constructor() {
    this.addQuestion = this.addQuestion.bind(this);
  }
  getAllQuestions = async (req, res) => {
    const { user } = req;
    const {
      page = 1,
      order = "desc",
      sortBy = "createdAt",
      limit = 10,
      section = "",
      type = "",
      text = "",
    } = req.query;
    const validSortFields = ["createdAt", "type", "difficulty"];

    const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    const filter = {
      createdBy: user._id,
    };
    if (section) {
      filter.section = section;
    }
    if (type) {
      filter.type = type;
    }
    if (text) {
      filter.questionText = { $regex: text, $options: "i" };
    }
    const totalQuestions = await BaseQuestion.countDocuments(filter);
    const questions = await BaseQuestion.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ [sortField]: sortOrder })
      .select(["-__v", "-updatedAt", "-createdAt"])
      .lean();
    const totalPages = Math.ceil(totalQuestions / limit);
    Response.sendSuccess(res, "Questions fetched successfully", {
      currentPage: parseInt(page),
      totalPages,
      totalQuestions,
      questionsPerPage: limit,
      questions,
    });
  };
  addQuestion = async (req, res) => {
    console.log("req.body", req.body);
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
  getAllUserContent = async (req, res) => {
    try {
      const { user } = req;
      const {
        page = 1,
        limit = 10,
        types = "",
        sections = "",
        search = "",
        sortBy = "createdAt",
        order = "desc",
      } = req.query;

      // Convert comma-separated strings to arrays
      const typeArray = types ? types.split(",") : [];
      const sectionArray = sections ? sections.split(",") : [];

      // Validate sort field
      const validSortFields = ["createdAt", "type", "difficulty", "section"];
      const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
      const sortOrder = order === "asc" ? 1 : -1;

      // Base filter for user's content
      const baseFilter = { createdBy: user._id };

      // Get standalone questions filter
      const questionsFilter = {
        ...baseFilter,
        section: { $nin: ["reading", "listening"] }, // Default exclude reading/listening
      };

      // Add sections filter for questions
      if (sectionArray.length > 0) {
        if (
          sectionArray.includes("reading") ||
          sectionArray.includes("listening")
        ) {
          // If reading or listening is selected, modify the $nin filter
          const nonPassageSections = sectionArray.filter(
            (s) => !["reading", "listening"].includes(s)
          );
          if (nonPassageSections.length > 0) {
            questionsFilter.section = { $in: nonPassageSections };
          }
        } else {
          questionsFilter.section = { $in: sectionArray };
        }
      }

      // Add types filter if provided
      if (typeArray.length > 0) {
        questionsFilter.type = { $in: typeArray };
      }

      // Add text search if provided
      if (search) {
        questionsFilter.$or = [
          { questionText: { $regex: search, $options: "i" } },
        ];
      }

      // Get passages filter
      const passagesFilter = {
        ...baseFilter,
        passageType: { $in: ["reading", "listening"] },
      };

      // Add sections filter for passages
      if (sectionArray.length > 0) {
        if (
          sectionArray.includes("reading") ||
          sectionArray.includes("listening")
        ) {
          passagesFilter.passageType = {
            $in: sectionArray.filter((s) =>
              ["reading", "listening"].includes(s)
            ),
          };
        } else {
          passagesFilter.passageType = { $in: [] }; // No passages if no reading/listening sections selected
        }
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Fetch questions or passages based on section
      let questions = [];
      let passages = [];
      let totalQuestions = 0;
      let totalPassages = 0;

      // Only fetch questions if we have valid sections to fetch from
      if (
        !sectionArray.length ||
        sectionArray.some((s) => !["reading", "listening"].includes(s))
      ) {
        questions = await BaseQuestion.find(questionsFilter)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ [sortField]: sortOrder })
          .select("-__v")
          .lean();
        totalQuestions = await BaseQuestion.countDocuments(questionsFilter);
      }

      // Only fetch passages if we have reading or listening sections
      if (
        !sectionArray.length ||
        sectionArray.some((s) => ["reading", "listening"].includes(s))
      ) {
        passages = await BasePassage.find(passagesFilter)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ [sortField]: sortOrder })
          .populate({
            path: "questions",
            select: "-__v",
          })
          .select("-__v")
          .lean();
        totalPassages = await BasePassage.countDocuments(passagesFilter);
      }

      const totalItems = totalQuestions + totalPassages;
      const totalPages = Math.ceil(totalItems / limit);

      Response.sendSuccess(res, "Content fetched successfully", {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        itemsPerPage: parseInt(limit),
        questions,
        passages,
      });
    } catch (error) {
      console.error("Error in getAllUserContent:", error);
      throw error;
    }
  };
  deleteQuestionById = async (req, res) => {
    const { id } = req.params;
    const { user } = req;

    // Find the question first
    const question = await BaseQuestion.findById(id).lean();
    if (!question) {
      throw new NotFoundError("Question not found");
    }

    // Check if user is admin or the creator
    if (
      !user.role.includes("admin") &&
      question.createdBy.toString() !== user._id.toString()
    ) {
      throw new UnauthorizedError(
        "You don't have permission to delete this question"
      );
    }

    // Proceed with deletion
    const deletedQuestion = await BaseQuestion.findByIdAndDelete(id).lean();
    Response.sendSuccess(res, "Question deleted successfully", deletedQuestion);
  };
  deletePassageById = async (req, res) => {
    const { id } = req.params;
    const { user } = req;

    // Find the passage first
    const passage = await BasePassage.findById(id).lean();
    if (!passage) {
      throw new NotFoundError("Passage not found");
    }

    // Check if user is admin or the creator
    if (
      !user.role.includes("admin") &&
      passage.createdBy.toString() !== user._id.toString()
    ) {
      throw new UnauthorizedError(
        "You don't have permission to delete this passage"
      );
    }

    // Get all question IDs associated with this passage
    const questionIds = passage.questions.map((q) => q._id);

    // Delete all associated questions
    await BaseQuestion.deleteMany({ _id: { $in: questionIds } });

    // Delete the passage
    const deletedPassage = await BasePassage.findByIdAndDelete(id);
    Response.sendSuccess(
      res,
      "Passage and associated questions deleted successfully",
      deletedPassage
    );
  };
  editQuestionById = async (req, res) => {
    const { id } = req.params;
    const { user } = req;

    // Find the question first
    const question = await BaseQuestion.findById(id).lean();
    if (!question) {
      throw new NotFoundError("Question not found");
    }

    // Check permissions
    if (
      !user.role.includes("admin") &&
      question.createdBy.toString() !== user._id.toString()
    ) {
      throw new UnauthorizedError(
        "You don't have permission to edit this question"
      );
    }

    const dataToValidate = {
      createdBy: user._id.toString(),
      ...req.body,
    };

    // Validate the data
    const validator = QuestionsService.getValidatorByType(question.type);
    const validationResult = validator.safeParse(dataToValidate);
    if (!validationResult.success) {
      throw new BadRequestError(validationResult.error.message);
    }
    console.log("validationResult.data", validationResult.data);
    // Update the question using the appropriate service method
    const updatedQuestion = await QuestionsService.updateQuestion(
      question.type,
      id,
      validationResult.data
    );

    Response.sendSuccess(res, "Question updated successfully", updatedQuestion);
  };
  getQuestionById = async (req, res) => {
    const { id } = req.params;
    const question = await BaseQuestion.findById(id)
      .select("-__v -updatedAt -createdAt")
      .lean();
    Response.sendSuccess(res, "Question fetched successfully", question);
  };
  getMyQuestionById = async (req, res) => {
    const { id } = req.params;
    const question = await BaseQuestion.findOne({
      _id: id,
      createdBy: req.user._id,
    })
      .select("-__v -updatedAt -createdAt")
      .lean();
    Response.sendSuccess(res, "Question fetched successfully", question);
  };
}

module.exports = new QuestionsControllerV1();
