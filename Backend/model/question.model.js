const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: ["reading", "listening", "speaking", "writing", "general"],
      required: [true, "section is required"],
    },
    type: {
      type: String,
      enum: [
        "single_choice",
        "multiple_choice",
        "fill_in_the_blank",
        "matching",
        "true_false",
        "open_ended", // New type for speaking and writing questions
        "essay", // Add "essay" type
      ],
      required: [true, "Question type is required"],
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
    //default answers
    isPublic: {
      type: Boolean,
      default: true,
    },
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: function () {
        return (
          this.type === "single_choice" ||
          this.type === "true_false" ||
          this.type === "fill_in_the_blank"
        );
      },
      validate: {
        validator: function (v) {
          if (this.type === "true_false") {
            return typeof v === "boolean";
          } else {
            return this.answers.includes(v);
          }
        },
        message: (props) => {
          if (props.this.type === "true_false") {
            return "Correct answer must be a boolean for true_false questions.";
          }
          return "Correct answer must be one of the provided answer options.";
        },
      },
    },
    correctAnswers: {
      type: [String],
      required: function () {
        return this.type === "multiple_choice";
      },
      validate: {
        validator: function (v) {
          //only validate if the type is multiple_choice
          if (this.type !== "multiple_choice") return true;
          if (!Array.isArray(v)) return false;
          if (v.length === 0) return false;
          return v.every((answer) => this.answers.includes(answer));
        },
        message:
          "All correct answers must be included in the provided answer options.",
      },
    },

    answers: {
      type: [String],
      min: 3,
      max: 6,
      required: function () {
        return (
          this.type === "single_choice" ||
          this.type === "multiple_choice" ||
          this.type === "fill_in_the_blank"
        );
      },
      validate: {
        validator: function (v) {
          // Only check length if answers are required
          if (
            this.type === "single_choice" ||
            this.type === "multiple_choice" ||
            this.type === "fill_in_the_blank"
          ) {
            return v.length >= 2;
          }
          // For other question types, always return true
          return true;
        },
        message:
          "At least 2 answer options are required for single_choice or multiple_choice questions.",
      },
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
    readingPassage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReadingPassage",
      required: function () {
        return this.section === "reading";
      },
    },
    prompt: {
      type: String,
      required: function () {
        return this.section === "speaking" || this.section === "writing";
      },
      maxlength: [1000, "Prompt cannot exceed 1000 characters"],
    },
    listeningPassage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ListeningPassage",
      required: function () {
        return this.section === "listening";
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexing
questionSchema.index({ type: 1 });
questionSchema.index({ section: 1 });
questionSchema.index({ createdBy: 1 });

// Methods
questionSchema.methods.isMultipleChoice = function () {
  return this.type === "multiple_choice";
};

// Add a new method for single choice
questionSchema.methods.isSingleChoice = function () {
  return this.type === "single_choice";
};

// Add a method to the Question schema to associate it with a reading passage
questionSchema.methods.setReadingPassage = async function (passageId) {
  this.readingPassage = passageId;
  await this.save();

  const passage = await ReadingPassage.findById(passageId);

  if (passage && !passage.questions?.includes(this._id)) {
    passage.questions.push(this._id);
  }
  await passage.save();
};

const Question = mongoose.model("Question", questionSchema);

// Base schema for passages
const passageSchema = new mongoose.Schema(
  {
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
      required: [true, "Passage url is required"],
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
  { timestamps: true }
); // Add timestamps to passageSchema

// Add methods to the passage schema
passageSchema.methods.addQuestion = function (questionId) {
  if (!this.questions.includes(questionId)) {
    this.questions.push(questionId);
  }
};

passageSchema.methods.removeQuestion = function (questionId) {
  this.questions = this.questions.filter((q) => !q.equals(questionId));
};

// Create ReadingPassage model
const ReadingPassage = mongoose.model("ReadingPassage", passageSchema);

// Create ListeningPassage model with an additional discriminator
const ListeningPassage = mongoose.model("ListeningPassage", passageSchema);
// Export both models
module.exports = { Question, ReadingPassage, ListeningPassage };
