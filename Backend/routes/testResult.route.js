const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const TestResultController = require("../controllers/testResult.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

router.get(
  "/",
  authMiddleware(["admin", "user", "teacher"]),
  asyncHandler(TestResultController.getTestResultsByUser)
);

// get test result by id
router.get(
  "/:attemptId",
  authMiddleware(["admin", "user", "teacher"]),
  asyncHandler(TestResultController.getTestResultByAttemptId)
);

module.exports = router;
