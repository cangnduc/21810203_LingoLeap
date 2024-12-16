const Review = require("../model/review.model.v1");
const Response = require("../helpers/response");
const { NotFoundError, BadRequestError } = require("../helpers/error");
const ReviewFunctions = require("../model/function/review.function");
const {
  createReviewSchema,
  addCommentSchema,
  updateRatingSchema,
} = require("../validator/review.validator");

class ReviewController {
  async createReview(req, res) {
    const { testId } = req.params;
    const { data, error } = createReviewSchema.safeParse({
      test: testId,
      user: req.user._id.toString(),
      ...req.body,
    });
    if (error) {
      throw new BadRequestError(error.message);
    }

    const review = await ReviewFunctions.createReview(data);
    Response.sendSuccess(res, "Review created successfully", review);
  }

  async updateRating(req, res) {
    const { testId } = req.params;
    const { data, error } = updateRatingSchema.safeParse({
      test: testId,
      user: req.user._id.toString(),
      rating: req.body.rating,
    });
    if (error) {
      throw new BadRequestError(error.message);
    }

    const review = await ReviewFunctions.updateRating(data);
    Response.sendSuccess(res, "Rating updated successfully", review);
  }

  async addComment(req, res) {
    const { testId } = req.params;
    const { data, error } = addCommentSchema.safeParse({
      test: testId,
      user: req.user._id.toString(),
      comment: req.body.comment,
    });
    if (error) {
      throw new BadRequestError(error.message);
    }

    const review = await ReviewFunctions.addComment(data);
    Response.sendSuccess(res, "Comment added successfully", review);
  }

  async getReviewsByTestId(req, res) {
    const { testId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ test: testId })
        .populate("user", "username avatar")
        .sort({ createdAt: -1 })
        .lean(),
      Review.countDocuments({ test: testId }),
    ]);

    if (!reviews) {
      throw new NotFoundError("No reviews found");
    }

    // Flatten and transform comments
    let allComments = reviews.flatMap((review) =>
      review.comments.map((comment) => ({
        text: comment.text,
        createdAt: comment.createdAt,
        user: {
          username: review.user.username,
          avatar: review.user.avatar,
        },
      }))
    );

    // Sort comments by date (newest first)
    allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination to comments
    const paginatedComments = allComments.slice(skip, skip + limit);

    // Group ratings separately
    const ratings = reviews
      .map((review) => ({
        _id: review._id,
        rating: review.rating,
        user: review.user,
        createdAt: review.createdAt,
      }))
      .filter((r) => r.rating && r.rating.value);

    const hasMore = skip + paginatedComments.length < allComments.length;

    Response.sendSuccess(res, "Reviews fetched successfully", {
      data: {
        comments: paginatedComments,
        ratings: ratings,
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(allComments.length / limit),
        totalComments: allComments.length,
        hasMore,
      },
    });
  }

  async getTestRatings(req, res) {
    const { testId } = req.params;

    const reviews = await Review.find({ test: testId })
      .populate("user", "username avatar")
      .select("rating user createdAt")
      .lean();

    const ratings = reviews
      .filter((review) => review.rating && review.rating.value)
      .map(({ _id, rating, user, createdAt }) => ({
        _id,
        rating,
        user,
        createdAt,
      }));

    Response.sendSuccess(res, "Ratings fetched successfully", { ratings });
  }

  async getReviewComments(req, res) {
    const { testId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ test: testId })
        .populate("user", "username avatar")
        .sort({ createdAt: -1 })
        .lean(),
      Review.countDocuments({ test: testId }),
    ]);

    if (!reviews) {
      throw new NotFoundError("No reviews found");
    }

    // Flatten and transform comments
    let allComments = reviews.flatMap((review) =>
      review.comments.map((comment) => ({
        _id: comment._id,
        text: comment.text,
        createdAt: comment.createdAt,
        user: {
          username: review.user.username,
          avatar: review.user.avatar,
        },
      }))
    );

    // Sort comments by date (newest first)
    allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination to comments
    const paginatedComments = allComments.slice(skip, skip + limit);
    const hasMore = skip + paginatedComments.length < allComments.length;

    Response.sendSuccess(res, "Comments fetched successfully", {
      data: {
        comments: paginatedComments,
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(allComments.length / limit),
        totalComments: allComments.length,
        hasMore,
      },
    });
  }
}

module.exports = new ReviewController();
