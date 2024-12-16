const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const ReviewController = require("../controllers/review.controller");
const { asyncHandler } = require("../helpers/asyncHandler");

// router.get(
//   "/test/:testId",
//   authMiddleware(["admin", "teacher", "user"]),
//   asyncHandler(ReviewController.getReviewsByTestId)
// );
// router.post(
//   "/test/:testId",
//   authMiddleware(["admin", "teacher", "user"]),
//   asyncHandler(ReviewController.createReview)
// );
router.put(
  "/test/:testId/rating",
  authMiddleware(["admin", "teacher", "user"]),
  asyncHandler(ReviewController.updateRating)
);
router.post(
  "/test/:testId/comment",
  authMiddleware(["admin", "teacher", "user"]),
  asyncHandler(ReviewController.addComment)
);
router.get("/test/:testId/ratings", ReviewController.getTestRatings);
router.get("/test/:testId/comments", ReviewController.getReviewComments);
module.exports = router;
