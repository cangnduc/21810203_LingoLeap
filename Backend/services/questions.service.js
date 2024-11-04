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
const { BadRequestError } = require("../helpers/error");
const {
  SingleQuestionValidator,
  CombinedQuestionPassageValidator,
} = require("../validator/question.validator.v1");

class QuestionsService {
  getValidator(section) {
    return ["reading", "listening"].includes(section)
      ? CombinedQuestionPassageValidator
      : SingleQuestionValidator;
  }

  prepareQuestionData(reqBody, user, file) {
    const { section } = reqBody;

    if (["reading", "listening"].includes(section)) {
      return this.preparePassageQuestionData(reqBody, user, file);
    }

    return {
      question: {
        ...reqBody.question,
        createdBy: user._id.toString(),
      },
    };
  }

  preparePassageQuestionData(reqBody, user, file) {
    const { section, questions, passage } = reqBody;
    const baseData = {
      passage: {
        ...passage,
        createdBy: user._id.toString(),
      },
      questions: questions.map((question) => ({
        ...question,
        createdBy: user._id.toString(),
      })),
    };

    if (section === "listening") {
      if (!file) {
        throw new BadRequestError("Sound file is required");
      }
      baseData.passage.soundFile = file.filename;
    }

    return baseData;
  }

  validateData(validator, data) {
    const validationResult = validator.safeParse(data);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      throw new BadRequestError(errorMessages);
    }

    return validationResult;
  }

  async savePassageWithQuestions(section, validatedData, audioFilename) {
    const passageData = validatedData.data.passage;

    if (section === "listening") {
      if (!audioFilename) {
        throw new BadRequestError("Sound file is required");
      }
      passageData.soundFile = audioFilename;
    }

    const passage = new BasePassage(passageData);
    const questions = await Promise.all(
      validatedData.data.questions.map(async (questionData) => {
        const question = this.createQuestionInstance(questionData);
        return await question.save();
      })
    );

    passage.questions = questions.map((question) => question._id);
    await passage.save();

    return {
      passage: this.formatPassageResponse(passage),
      questions: questions.map(this.formatQuestionResponse),
    };
  }

  createQuestionInstance(questionData) {
    const QuestionModel = this.getQuestionModel(questionData.type);
    return new QuestionModel(questionData);
  }
  getQuestionModel(type) {
    return {
      multiple_choice: MultipleChoiceQuestion,
      single_choice: SingleChoiceQuestion,
      true_false: TrueFalseQuestion,
      fill_in_the_blank: FillInTheBlankQuestion,
      matching: MatchingQuestion,
      ordering: OrderingQuestion,
      open_ended: OpenEndedQuestion,
      essay: EssayQuestion,
    }[type];
  }
  formatPassageResponse(passage) {
    const { __v, updatedAt, createdAt, createdBy, ...rest } = passage._doc;
    return rest;
  }

  formatQuestionResponse(question) {
    const { _id, __v, updatedAt, createdAt, ...rest } = question._doc;
    return rest;
  }
}

module.exports = new QuestionsService();
