const Review = require("../review.model.v1");

class ReviewFunctions {
  async createReview(data) {
    const { test, user, rating, comment } = data;
    const reviewData = {
      test,
      user,
      ...(rating && { rating: { value: rating.value } }),
      ...(comment && { comments: [{ text: comment }] }),
    };
    return await Review.create(reviewData);
  }

  async updateRating(data) {
    const { test, user, rating } = data;
    const review = await Review.findOne({ test, user });
    if (!review) {
      throw new Error("Review not found");
    }
    review.rating = { value: rating.value };
    review.rating.lastUpdated = new Date();
    return await review.save();
  }

  async addComment(data) {
    const { test, user, comment } = data;
    let review = await Review.findOne({ test, user });
    if (!review) {
      // Create new review with just a comment
      review = new Review({ test, user });
    }
    review.comments.push({ text: comment });
    return await review.save();
  }

  // ... other methods remain the same ...
}

module.exports = new ReviewFunctions();
