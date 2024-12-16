const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: [true, "Test reference is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Move middleware BEFORE model creation
reviewSchema.post("save", async function (doc) {
  const Test = mongoose.model("Test");
  const test = await Test.findById(doc.test);
  if (test) {
    await test.updateAverageRating();
    await test.save();
  }
});

// Indexing (if any)

// Create the model at the end
const Review = mongoose.model("Review_old", reviewSchema);

module.exports = Review;
