const mongoose = require("mongoose");
const { difficultyLevels, sections } = require("../constant/value");
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
            enum: sections,
            required: true,
          },
          totalSectionScore: {
            type: Number,
            required: [true, "Section points is required"],
            min: [0, "Points cannot be negative"],
            default: function () {
              if (this.name === "reading" || this.name === "listening") {
                return this.passages.reduce(
                  (total, passage) => total + passage.points,
                  0
                );
              }
              return this.questions.reduce(
                (total, question) => total + question.points,
                0
              );
            },
          },
          questions: {
            type: [
              {
                _id: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Questions",
                  required: true,
                },
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
                return questions.every(
                  (q) => q.question && q.points !== undefined
                );
              },
              message: "Each question must have both a question ID and points.",
            },
          },
          duration: { type: Number, min: 1, required: true },
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
    totalScore: {
      type: Number,
      required: [true, "Total possible score is required"],
      min: [0, "Total possible score cannot be negative"],
      default: function () {
        return this.sections.reduce(
          (total, section) => total + section.totalSectionScore,
          0
        );
      },
    },
    passingScore: {
      type: Number,
      required: [true, "Passing score is required"],
      min: [0, "Passing score cannot be negative"],

      validate: {
        validator: function (value) {
          return value <= this.totalScore;
        },
        message: "Passing score cannot exceed total possible score",
      },
    },
    difficulty: {
      type: String,
      enum: difficultyLevels,
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
//sample test data
const sampleTest = new Test({
  title: "IELTS General Training Practice Test",
  description:
    "A comprehensive practice test for IELTS General Training, covering all four sections.",
  duration: 170, // 2 hours and 50 minutes
  sections: [
    {
      name: "listening",
      totalSectionScore: 40,
      duration: 30,
      passages: [
        { id: new mongoose.Types.ObjectId(), points: 10 },
        { id: new mongoose.Types.ObjectId(), points: 10 },
        { id: new mongoose.Types.ObjectId(), points: 10 },
        { id: new mongoose.Types.ObjectId(), points: 10 },
      ],
    },
    {
      name: "reading",
      totalSectionScore: 40,
      duration: 60,
      passages: [
        { id: new mongoose.Types.ObjectId(), points: 13 },
        { id: new mongoose.Types.ObjectId(), points: 13 },
        { id: new mongoose.Types.ObjectId(), points: 14 },
      ],
    },
    {
      name: "writing",
      totalSectionScore: 20,
      duration: 60,
      questions: [
        { id: new mongoose.Types.ObjectId(), points: 10 },
        { id: new mongoose.Types.ObjectId(), points: 10 },
      ],
    },
    {
      name: "speaking",
      totalSectionScore: 20,
      duration: 20,
      questions: [
        { id: new mongoose.Types.ObjectId(), points: 5 },
        { id: new mongoose.Types.ObjectId(), points: 5 },
        { id: new mongoose.Types.ObjectId(), points: 5 },
        { id: new mongoose.Types.ObjectId(), points: 5 },
      ],
    },
  ],
  totalScore: 120,
  passingScore: 65,
  difficulty: "intermediate",
  createdBy: new mongoose.Types.ObjectId(),
  isPublished: true,
  attemptsAllowed: 2,
  availableFrom: new Date(),
  availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Available for 30 days
  averageRating: 4.5,
  reviewCount: 10,
});

// You can use this to save the sample test to the database
// sampleTest.save()
//   .then(savedTest => console.log('Sample test saved:', savedTest))
//   .catch(error => console.error('Error saving sample test:', error));

module.exports = Test;

testSchema.methods.getResults = async function () {
  const TestResult = mongoose.model("TestResult");
  return TestResult.find({ test: this._id }).populate("user");
};
