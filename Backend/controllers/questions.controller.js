//import mongoose server error
const questionFunction = require("../model/function/question.function");
const {
  BaseQuestion,
  MultipleChoiceQuestion,
  SingleChoiceQuestion,
  TrueFalseQuestion,
  FillInTheBlankQuestion,
  MatchingQuestion,
  OrderingQuestion,
  OpenEndedQuestion,
  EssayQuestion,
  BasePassage,
  ReadingPassage,
  ListeningPassage,
} = require("../model/question.model.v1");
const {
  SingleQuestionValidator,
  CombinedQuestionPassageValidator,
} = require("../validator/question.validator.v1");
const { BadRequestError } = require("../helpers/error");
const Response = require("../helpers/response");

class QuestionsController {
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
    const { user } = req;
    const { section } = req.body;
    console.log("req.body", req.body);
    const validator =
      section === "reading" || section === "listening"
        ? CombinedQuestionPassageValidator
        : SingleQuestionValidator;

    let questionData;

    if (section === "reading" || section === "listening") {
      const questions = req.body.questions;
      const passage = req.body.passage;
      if (section === "listening") {
        const soundFile = req.file;
        if (!soundFile) {
          throw new BadRequestError("Sound file is required");
        }

        const filename = req.audioFilename;
        console.log("filename", filename);
        questionData = {
          passage: {
            ...passage,
            createdBy: user._id.toString(),
            soundFile: filename,
          },
          questions: questions.map((question) => ({
            ...question,
            createdBy: user._id.toString(),
          })),
        };
      } else {
        questionData = {
          passage: {
            ...passage,
            createdBy: user._id.toString(),
          },
          questions: questions.map((question) => ({
            ...question,
            createdBy: user._id.toString(),
          })),
        };
      }
    } else {
      // section is not in ["reading", "listening"]
      questionData = {
        question: {
          ...req.body.question,
          createdBy: user._id.toString(),
        },
      };
    }

    const validationResult = validator.safeParse(questionData);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      console.log("errorMessages", errorMessages);
      throw new BadRequestError(errorMessages);
    }
    try {
      let result;
      if (section === "reading" || section === "listening") {
        // Handle multiple questions for reading and listening sections
        const passageData = validationResult.data.passage;

        if (section === "listening") {
          const soundFile = req.file;
          if (!soundFile) {
            throw new BadRequestError("Sound file is required");
          }
          passageData.soundFile = req.audioFilename;
        }

        const passage = new BasePassage(passageData);
        const questions = await Promise.all(
          validationResult.data.questions.map(async (questionData) => {
            const question = this.createQuestionInstance.call(
              this,
              questionData
            );

            return await question.save();
          })
        );
        //add questions id to the passage
        passage.questions = questions.map((question) => question._id);
        await passage.save();
        result = {
          passage: (() => {
            const { __v, updatedAt, createdAt, createdBy, ...rest } =
              passage._doc;
            return rest;
          })(),
          questions: questions.map((q) => {
            const { _id, __v, updatedAt, createdAt, ...rest } = q._doc;
            return rest;
          }),
        };
      } else {
        // Handle single question for other sections
        const question = this.createQuestionInstance.call(
          this,
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
      console.log("error", error);
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map(
          (err) => err.message
        );
        throw new BadRequestError(validationErrors.join(", "));
      }
      throw new BadRequestError(error.message);
    }
  };
  searchQuestion = async (req, res) => {
    const { user } = req;
    const {
      type,
      section,
      text,
      createdBy,
      page = 1,
      order = "desc",
      sortBy = "createdAt",
    } = req.query;
    let { limit = 10 } = req.query;

    limit = parseInt(limit);
    if (limit > 10) {
      limit = 10;
    }

    const filter = {
      isPublic: true,
    };
    Object.assign(filter, {
      ...(createdBy === "me" && { createdBy: user._id.toString() }),
      ...(type && { type }),
      ...(section && { section }),
      ...(text && { questionText: { $regex: text, $options: "i" } }),
    });

    const validSortFields = [
      "createdAt",
      "type",
      "section",
      "questionText",
      "difficulty",
    ];

    const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    const options = {
      skip: (page - 1) * limit,
      limit: parseInt(limit),
      sort: { [sortField]: sortOrder },
    };

    const totalQuestions = await BaseQuestion.countDocuments(filter);
    const questions = await BaseQuestion.find(filter, {
      updatedAt: 0,
      __v: 0,
    })
      .skip(options.skip)
      .limit(options.limit)
      .sort(options.sort)
      .lean();

    const totalPages = Math.ceil(totalQuestions / limit);

    Response.sendSuccess(res, "Questions fetched successfully", {
      currentPage: page,
      totalPages,
      totalQuestions,
      questionsPerPage: limit,
      questions,
    });
  };

  searchPassage = async (req, res) => {
    const { user } = req;
    const { type, section, text, createdBy, page = 1 } = req.query;
    let { limit = 10 } = req.query;

    const filter = {
      isPublic: true,
    };
    Object.assign(filter, {
      ...(createdBy === "me" && { createdBy: user._id.toString() }),
      ...(type && { type }),
      ...(section && { section }),
      ...(text && { questionText: { $regex: text, $options: "i" } }),
    });

    const options = {
      skip: (page - 1) * limit,
      limit: parseInt(limit),
      sort: { createdAt: -1 }, // Sort by creation date, newest first
    };

    const totalPassages = await BasePassage.countDocuments(filter);
    const passages = await BasePassage.find(filter, {
      updatedAt: 0,
      __v: 0,
    })
      .skip(options.skip)
      .limit(options.limit)
      .sort(options.sort)
      .lean();
  };
  createQuestionInstance(questionData) {
    switch (questionData.type) {
      case "multiple_choice":
        return new MultipleChoiceQuestion(questionData);
      case "single_choice":
        return new SingleChoiceQuestion(questionData);
      case "true_false":
        return new TrueFalseQuestion(questionData);
      case "fill_in_the_blank":
        return new FillInTheBlankQuestion(questionData);
      case "matching":
        return new MatchingQuestion(questionData);
      case "ordering":
        return new OrderingQuestion(questionData);
      case "open_ended":
        return new OpenEndedQuestion(questionData);
      case "essay":
        return new EssayQuestion(questionData);
      default:
        throw new BadRequestError("Invalid question type");
    }
  }

  async insertQuestions(questions, user) {
    const newQuestions = questions.map((question) => ({
      ...question,
      createdBy: user._id.toString(),
    }));
    for (const question of newQuestions) {
      const validationResult = SingleQuestionValidator.safeParse(question);
      if (!validationResult.success) {
        throw new BadRequestError(validationResult.error.message);
      }
    }
    const result = await BaseQuestion.insertMany(newQuestions);
    return result;
  }

  getPassagesWithQuestions = async (req, res) => {
    const { user } = req;
    const { section } = req.params;
    const {
      createdBy,
      page = 1,
      orderBy = "desc",
      sortBy = "createdAt",
      limit = 10,
    } = req.query;
    console.log("section", section);
    if (section !== "reading" && section !== "listening") {
      throw new BadRequestError("Invalid section for passages");
    }

    const filter =
      createdBy === "all"
        ? {
            passageType: section,
            //isPublic: true,
            //...(title && { title: { $regex: title, $options: "i" } }),
          }
        : {
            passageType: section,
            ...(createdBy === "me" && { createdBy: user._id.toString() }),
            //isPublic: true,
          };
    console.log("filter", filter);
    const options = {
      skip: (page - 1) * limit,
      limit: parseInt(limit),
      sort: { [sortBy]: orderBy === "asc" ? 1 : -1 },
    };

    const totalPassages = await BasePassage.countDocuments(filter);
    const passages = await BasePassage.find(filter)
      .skip(options.skip)
      .limit(options.limit)
      .sort(options.sort)
      .select("-__v")
      .lean();

    const passagesWithQuestions = await Promise.all(
      passages.map(async (passage) => {
        const questions = await questionFunction.getQuestionsByIds(
          passage.questions,
          true,
          { unselect: ["__v", "updatedAt", "createdAt"] }
        );

        // Log the number of questions fetched for each passage
        console.log(
          `Passage ${passage._id}: ${questions.length} questions fetched`
        );

        return { ...passage, questions };
      })
    );

    // Log the total number of passages and questions
    console.log(`Total passages: ${passagesWithQuestions.length}`);
    console.log(
      `Total questions: ${passagesWithQuestions.reduce(
        (sum, p) => sum + p.questions.length,
        0
      )}`
    );

    return Response.sendSuccess(
      res,
      "Passages with questions fetched successfully",
      {
        passages: passagesWithQuestions,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalPassages / limit),
        totalPassages,
        passagesPerPage: limit,
      }
    );
  };

  getQuestionsBySection = async (req, res) => {
    const { user } = req;
    const { section } = req.params;
    console.log("section", section);
    const {
      type,
      text,
      createdBy,
      page = 1,
      orderBy = "desc",
      sortBy = "createdAt",
      limit = 10,
    } = req.query;

    if (["reading", "listening"].includes(section)) {
      throw new BadRequestError(
        "Use /passages endpoint for reading and listening sections"
      );
    }
    console.log("user", user);
    const filter =
      createdBy === "all"
        ? {
            section,
            ...(type && { type }),
            ...(text && { questionText: { $regex: text, $options: "i" } }),
          }
        : {
            section,
            ...(createdBy === "me" && { createdBy: user._id.toString() }),
            ...(type && { type }),
            ...(text && { questionText: { $regex: text, $options: "i" } }),
          };
    const validSortFields = ["createdAt", "type", "difficulty"];

    const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = orderBy === "asc" ? 1 : -1;
    const options = {
      skip: (page - 1) * limit,
      limit: parseInt(limit),
      sort: { [sortField]: sortOrder },
    };

    const totalQuestions = await BaseQuestion.countDocuments(filter);
    const questions = await BaseQuestion.find(filter)
      .skip(options.skip)
      .limit(options.limit)
      .sort(options.sort)
      .select("-__v")
      .lean();

    return Response.sendSuccess(res, "Questions fetched successfully", {
      questions,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalQuestions / limit),
      totalQuestions,
      questionsPerPage: limit,
    });
  };
}

module.exports = new QuestionsController();
