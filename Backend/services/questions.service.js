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
  QuestionValidator,
  MultipleChoiceValidator,
  SingleChoiceValidator,
  FillInTheBlankValidator,
  MatchingValidator,
  TrueFalseValidator,
  OpenEndedValidator,
  EssayValidator,
  OrderingValidator,
} = require("../validator/question.validator.v1");

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
  getValidatorByType(type) {
    const validators = {
      multiple_choice: MultipleChoiceValidator,
      single_choice: SingleChoiceValidator,
      true_false: TrueFalseValidator,
      fill_in_the_blank: FillInTheBlankValidator,
      matching: MatchingValidator,
      ordering: OrderingValidator,
      open_ended: OpenEndedValidator,
      essay: EssayValidator,
    };
    return validators[type] || QuestionValidator;
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

  async updateQuestion(type, id, data) {
    const updateMethod = this.getUpdateMethod(type);
    if (!updateMethod) {
      throw new BadRequestError(`Unsupported question type: ${type}`);
    }
    return await updateMethod.call(this, id, data);
  }

  getUpdateMethod(type) {
    const updateMethods = {
      fill_in_the_blank: this.updateFillInBlankQuestion,
      multiple_choice: this.updateMultipleChoiceQuestion,
      single_choice: this.updateSingleChoiceQuestion,
      true_false: this.updateTrueFalseQuestion,
      matching: this.updateMatchingQuestion,
      ordering: this.updateOrderingQuestion,
      open_ended: this.updateOpenEndedQuestion,
      essay: this.updateEssayQuestion,
    };
    return updateMethods[type];
  }

  async updateFillInBlankQuestion(id, data) {
    const updateData = {
      questionText: data.questionText,
      instruction: data.instruction,
      difficulty: data.difficulty,
      text: data.text,
      isPublic: data.isPublic,
      section: data.section,
      points: data.points,
      blanks: data.blanks.map((blank) => ({
        index: blank.index,
        correctAnswer: blank.correctAnswer,
        options: blank.options || [],
      })),
    };

    return await FillInTheBlankQuestion.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
  }

  async updateMultipleChoiceQuestion(id, data) {
    const updateData = {
      questionText: data.questionText,
      instruction: data.instruction,
      difficulty: data.difficulty,
      isPublic: data.isPublic,
      section: data.section,
      points: data.points,
      answers: data.answers,
      correctAnswers: data.correctAnswers,
    };

    return await MultipleChoiceQuestion.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
  }

  async updateSingleChoiceQuestion(id, data) {
    const updateData = {
      questionText: data.questionText,
      instruction: data.instruction,
      difficulty: data.difficulty,
      isPublic: data.isPublic,
      section: data.section,
      points: data.points,
      answers: data.answers,
      correctAnswer: data.correctAnswer,
    };

    return await SingleChoiceQuestion.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
  }

  async updateTrueFalseQuestion(id, data) {
    const updateData = {
      questionText: data.questionText,
      instruction: data.instruction,
      difficulty: data.difficulty,
      isPublic: data.isPublic,
      section: data.section,
      points: data.points,
      statement: data.statement,
      correctAnswer: data.correctAnswer,
    };

    return await TrueFalseQuestion.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
  }

  async updateMatchingQuestion(id, data) {
    const updateData = {
      questionText: data.questionText,
      instruction: data.instruction,
      difficulty: data.difficulty,
      isPublic: data.isPublic,
      section: data.section,
      points: data.points,
      leftColumn: data.leftColumn,
      rightColumn: data.rightColumn,
      correctPairs: data.correctPairs,
    };

    return await MatchingQuestion.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
  }

  async updateOrderingQuestion(id, data) {
    const updateData = {
      questionText: data.questionText,
      instruction: data.instruction,
      difficulty: data.difficulty,
      isPublic: data.isPublic,
      section: data.section,
      points: data.points,
      items: data.items,
      correctOrder: data.correctOrder,
    };

    return await OrderingQuestion.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
  }

  async updateOpenEndedQuestion(id, data) {
    const updateData = {
      questionText: data.questionText,
      instruction: data.instruction,
      difficulty: data.difficulty,
      isPublic: data.isPublic,
      section: data.section,
      points: data.points,
      prompt: data.prompt,
    };

    return await OpenEndedQuestion.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
  }

  async updateEssayQuestion(id, data) {
    const updateData = {
      questionText: data.questionText,
      instruction: data.instruction,
      difficulty: data.difficulty,
      isPublic: data.isPublic,
      section: data.section,
      points: data.points,
      minWords: data.minWords,
      maxWords: data.maxWords,
      rubric: data.rubric,
    };

    return await EssayQuestion.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
  }
}

module.exports = new QuestionsService();
