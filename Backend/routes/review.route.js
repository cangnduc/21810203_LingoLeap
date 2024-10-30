const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const ReviewController = require("../controllers/review.controller");
const { asyncHandler } = require("../helpers/asyncHandler");

router.get(
  "/test/:testId",
  authMiddleware(["admin", "teacher", "user"]),
  asyncHandler(ReviewController.getReviewsByTestId)
);

module.exports = router;
