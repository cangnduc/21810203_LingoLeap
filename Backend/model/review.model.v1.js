// review.model.js
const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      value: {
        type: Number,
        min: 1,
        max: 5,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
    comments: [
      {
        text: {
          type: String,
          maxLength: 500,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Add a virtual to check if review has rating
reviewSchema.virtual("hasRating").get(function () {
  return this.rating && this.rating.value !== undefined;
});

// Enforce one review per user per test
reviewSchema.index({ test: 1, user: 1 }, { unique: true });

// Middleware to update test rating only if rating exists
reviewSchema.post("save", async function () {
  if (this.hasRating) {
    const Test = mongoose.model("Test");
    const test = await Test.findById(this.test);
    if (test) {
      await test.updateAverageRating();
    }
  }
});

module.exports = mongoose.model("Review", reviewSchema);
