const mongoose = require("mongoose");

// Base Question Schema
const baseQuestionSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: [
        "reading",
        "listening",
        "speaking",
        "writing",
        "general",
        "vocabulary",
        "grammar",
      ],
      required: [true, "section is required"],
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "Question text cannot exceed 1000 characters"],
    },
    instruction: {
      type: String,
      trim: true,
      maxlength: [500, "Instruction cannot exceed 500 characters"],
    },
    isDraft: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    points: {
      type: Number,
      required: [true, "Question points is required"],
      min: [0, "Points cannot be negative"],
      default: 1,
    },
    difficulty: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Difficulty level is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Question creator is required"],
    },
  },
  { timestamps: true, discriminatorKey: "type" }
);

const BaseQuestion = mongoose.model("Questions", baseQuestionSchema);

// Multiple Choice Question Schema
const multipleChoiceSchema = new mongoose.Schema({
  answers: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length >= 2 && v.length <= 6,
      message:
        "Multiple choice questions must have between 2 and 6 answer options.",
    },
  },
  correctAnswers: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.every((answer) => this.answers.includes(answer));
      },
      message: "correctAnswers must be included in the answers array",
    },
  },
});

const MultipleChoiceQuestion = BaseQuestion.discriminator(
  "multiple_choice",
  multipleChoiceSchema
);

// Single Choice Question Schema
const singleChoiceSchema = new mongoose.Schema({
  answers: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length >= 2 && v.length <= 6,
      message:
        "Single choice questions must have between 2 and 6 answer options.",
    },
  },
  correctAnswer: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return this.answers.includes(v);
      },
      message: "Correct answer must be one of the provided answer options.",
    },
  },
});

const SingleChoiceQuestion = BaseQuestion.discriminator(
  "single_choice",
  singleChoiceSchema
);

// true_false question types can be added similarly...
const trueFalseSchema = new mongoose.Schema({
  correctAnswer: {
    type: Boolean,
    required: true,
  },
  statement: {
    type: String,
    required: true,
    maxlength: [1000, "Statement cannot exceed 1000 characters"],
  },
});

const TrueFalseQuestion = BaseQuestion.discriminator(
  "true_false",
  trueFalseSchema
);

// Fill in the blank question types can be added similarly...
const fillInTheBlankSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: [1000, "Text cannot exceed 1000 characters"],
  },
  blanks: [
    {
      index: Number,
      correctAnswer: String,
      options: {
        type: [String],
        optional: true,
        validate: {
          validator: function (v) {
            if (v.options) {
              return v.length >= 2 && v.length <= 6;
            }
            return true;
          },
          message: "Options must have between 2 and 5 answer options.",
        },
      },
    },
  ],
});

const FillInTheBlankQuestion = BaseQuestion.discriminator(
  "fill_in_the_blank",
  fillInTheBlankSchema
);
// Matching Question Schema
const matchingSchema = new mongoose.Schema({
  leftColumn: [
    {
      id: String,
      text: String,
      //   validate: {
      //     validator: function (v) {
      //       return this.rightColumn.some((right) => right.id === v.id);
      //     },
      //     message: "Left column text must match a text in the right column.",
      //   },
    },
  ],
  rightColumn: [
    {
      id: String,
      text: String,
      //   validate: {
      //     validator: function (v) {
      //       return this.leftColumn.some((left) => left.id === v.id);
      //     },
      //     message: "Right column text must match a text in the left column.",
      //   },
    },
  ],
  correctPairs: [
    {
      left: String,
      right: String,
    },
  ],
});

const MatchingQuestion = BaseQuestion.discriminator("matching", matchingSchema);
// Ordering Question Schema
const orderingSchema = new mongoose.Schema({
  items: [
    {
      id: String,
      text: String,
    },
  ],
  correctOrder: [String],
});

const OrderingQuestion = BaseQuestion.discriminator("ordering", orderingSchema);
// Open-Ended Question Schema
const openEndedSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
    maxlength: [1000, "Sample answer cannot exceed 1000 characters"],
  },
});

const OpenEndedQuestion = BaseQuestion.discriminator(
  "open_ended",
  openEndedSchema
);
// Essay Question Schema
const essaySchema = new mongoose.Schema({
  minWords: {
    type: Number,
    required: [true, "Minimum word count is required"],
    min: 100,
    max: 1000,
  },
  maxWords: {
    type: Number,
    required: [true, "Maximum word count is required"],
    min: 100,
    max: 1000,
  },
  rubric: {
    type: String,
    required: [true, "Rubric is required"],
    maxlength: [5000, "Rubric cannot exceed 5000 characters"],
  },
});

const EssayQuestion = BaseQuestion.discriminator("essay", essaySchema);
// Passage Schema (for both Reading and Listening)
const passageSchema = new mongoose.Schema(
  {
    passageType: {
      type: String,
      enum: ["reading", "listening"],
      required: [true, "Passage type is required"],
    },
    title: {
      type: String,
      required: [true, "Passage title is required"],
      trim: true,
      maxlength: [200, "Passage title cannot exceed 200 characters"],
    },
    text: {
      type: String,
      required: [true, "Passage text is required"],
      trim: true,
      maxlength: [5000, "Passage text cannot exceed 5000 characters"],
    },
    url: {
      type: String,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Passage creator is required"],
    },
  },
  { timestamps: true, discriminatorKey: "passageType" }
);

const BasePassage = mongoose.model("BasePassage", passageSchema);
const ReadingPassage = BasePassage.discriminator(
  "reading",
  new mongoose.Schema({})
);
const ListeningPassage = BasePassage.discriminator(
  "listening",
  new mongoose.Schema({
    soundFile: {
      type: String,
      required: [true, "Sound file is required"],
    },
  })
);

module.exports = {
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
};
// Sample inputs for each question type
