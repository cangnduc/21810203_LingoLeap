const mongoose = require("mongoose");
const baseSchema = require("./base.model");
const { difficultyLevels, sections, testTypes } = require("../constant/value");

const testSchema = new mongoose.Schema(
  {
    duration: {
      type: Number,
      required: true,
      min: [1, "Test duration must be at least 1 minute"],
      default: function () {
        return this.sections.reduce(
          (total, section) => total + section.duration,
          0
        );
      },
      validate: {
        validator: function (value) {
          const calculatedDuration = this.sections.reduce(
            (total, section) => total + section.duration,
            0
          );
          return value === calculatedDuration;
        },
        message: "Test duration must equal the sum of all section durations",
      },
    },
    sections: {
      type: [
        {
          name: {
            type: String,
            enum: sections,
            required: true,
          },
          instructions: {
            type: String,
            maxlength: [
              500,
              "Section instruction cannot exceed 500 characters",
            ],
          },
          sectionScore: {
            type: Number,
            required: [true, "Section score is required"],
            min: [0, "Section score cannot be negative"],
          },
          questions: {
            type: [
              {
                points: {
                  type: Number,
                  required: true,
                  min: [0, "Points cannot be negative"],
                },
              },
            ],
            required: function () {
              return this.name !== "reading" && this.name !== "listening";
            },
            default: undefined,
            validate: {
              validator: function (questions) {
                return questions.every((q) => q._id && q.points !== undefined);
              },
              message:
                "Each question must have both a question reference and points.",
            },
          },
          duration: {
            type: Number,
            required: true,
            min: [1, "Section duration must be at least 1 minute"],
          },
          passages: {
            type: [
              {
                _id: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "BasePassage",
                },
                points: {
                  type: Number,
                  required: true,
                  min: [0, "Points cannot be negative"],
                },
              },
            ],
            required: function () {
              return this.name === "reading" || this.name === "listening";
            },
            default: undefined,
          },
        },
      ],
      validate: {
        validator: function (sections) {
          return sections.every((section) => {
            if (section.name === "reading" || section.name === "listening") {
              return section.passages != null;
            }
            return true;
          });
        },
        message:
          "Reading and Listening sections must have an associated passage.",
      },
    },
    totalPossibleScore: {
      type: Number,
      required: [true, "Total possible score is required"],
      min: [0, "Total possible score cannot be negative"],
      default: 0,
    },
    passingScore: {
      type: Number,
      required: [true, "Passing score is required"],
      min: [0, "Passing score cannot be negative"],
      validate: {
        validator: function (value) {
          return value <= this.totalPossibleScore;
        },
        message: "Passing score cannot exceed total possible score",
      },
    },
    difficulty: {
      type: String,
      enum: difficultyLevels,
      required: [true, "Difficulty level is required"],
    },
    testType: {
      type: String,
      enum: testTypes,
      required: [true, "Test type is required"],
    },
    isPublished: { type: Boolean, default: true },
    attemptsAllowed: {
      type: Number,
      default: 1,
      min: [1, "At least one attempt must be allowed"],
    },
    availableFrom: {
      type: Date,
      required: [true, "Test availability start date is required"],
      default: Date.now(), // 0 days from now
    },
    availableUntil: {
      type: Date,
      required: [true, "Test availability end date is required"],
      default: Date.now() + 365 * 24 * 60 * 60 * 1000, // 100 days from now
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    participantCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Define methods BEFORE creating the model
testSchema.methods.updateAverageRating = async function () {
  const Review = mongoose.model("Review");
  const result = await Review.aggregate([
    { $match: { test: this._id } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating.value" },
        count: {
          $sum: {
            $cond: [{ $ifNull: ["$rating.value", false] }, 1, 0],
          },
        },
      },
    },
  ]);

  if (result.length > 0) {
    this.averageRating = result[0].averageRating;
    this.totalReviews = result[0].count;
  } else {
    this.averageRating = 0;
    this.totalReviews = 0;
  }
  return this.save();
};

// Other methods
testSchema.methods.publish = function () {
  this.isPublished = true;
  return this.save();
};

testSchema.methods.unpublish = function () {
  this.isPublished = false;
  return this.save();
};

// Indexing
testSchema.index({ createdBy: 1 });
testSchema.index({ isPublished: 1 });

// Create the model AFTER defining all methods
const BaseModel = mongoose.model("Base", baseSchema);
const Test = BaseModel.discriminator("Test", testSchema);

module.exports = Test;
