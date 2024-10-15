const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Test title is required"],
      trim: true,
      maxlength: [100, "Test title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Test description cannot exceed 500 characters"],
    },
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
            enum: [
              "reading",
              "listening",
              "writing",
              "speaking",
              "grammar",
              "vocabulary",
              "general",
            ],
            required: true,
          },
          questions: {
            type: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Questions",
              },
            ],
            required: function () {
              return this.name !== "reading" && this.name !== "listening";
            },
            default: undefined,
          },
          duration: { type: Number, min: 1, required: true },
          passages: {
            type: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "BasePassage",
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

    difficulty: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      required: [true, "Difficulty level is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Test creator is required"],
    },
    isPublished: { type: Boolean, default: false },
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
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing
testSchema.index({ createdBy: 1 });
testSchema.index({ isPublished: 1 });

// Methods
testSchema.methods.publish = function () {
  this.isPublished = true;
  return this.save();
};

testSchema.methods.unpublish = function () {
  this.isPublished = false;
  return this.save();
};

// New method to add a review
testSchema.methods.addReview = async function () {
  await this.updateAverageRating();
  return this.save();
};

// New method to update average rating
testSchema.methods.updateAverageRating = async function () {
  const Review = mongoose.model("Review");
  const result = await Review.aggregate([
    { $match: { test: this._id } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    this.averageRating = result[0].averageRating;
    this.reviewCount = result[0].count;
  } else {
    this.averageRating = 0;
    this.reviewCount = 0;
  }
};

// Virtuals
testSchema.virtual("questionCount").get(function () {
  return this.sections.reduce(
    (total, section) => total + section.questions.length,
    0
  );
});

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
// generate an example of test
// Example of creating a test
const exampleTest = new Test({
  title: "IELTS Practice Test",
  description:
    "A comprehensive IELTS practice test covering all four sections.",
  duration: 180,
  sections: [
    {
      name: "reading",
      duration: 60,
      passage: "66fc13b0932c5cd5f7e99c9a",
    },
    {
      name: "listening",
      duration: 40,
      passage: "66fc13b0932c5cd5f7e99c9a",
    },
    {
      name: "writing",
      questions: ["66fbfa3f48a5ce363b3e9860", "66fbfa3f48a5ce363b3e986a"],
      duration: 60,
    },
    {
      name: "general",
      questions: ["66fbfa3f48a5ce363b3e9860", "66fbfa3f48a5ce363b3e986a"],
      duration: 20,
    },
  ],
  difficulty: "B2",
  isPublished: false,
  attemptsAllowed: 1,
  availableFrom: "2024-10-09",
  availableUntil: "2024-10-10",
});
