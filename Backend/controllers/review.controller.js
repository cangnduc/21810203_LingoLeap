const Review = require("../model/review.model");
const Response = require("../helpers/response");
const { NotFoundError } = require("../helpers/error");

class ReviewController {
  async getReviewsByTestId(req, res) {
    const { testId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ test: testId })
        .populate("user", "username")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(["rating", "comment", "user", "createdAt", "avatar"])
        .lean(),
      Review.countDocuments({ test: testId }),
    ]);

    if (!reviews) {
      throw new NotFoundError("No reviews found");
    }

    const hasMore = skip + reviews.length < total;

    Response.sendSuccess(res, "Reviews fetched successfully", {
      data: reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasMore,
      },
    });
  }
}

module.exports = new ReviewController();
