const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const TestAttemptController = require("../controllers/testAttempt.controller");
const Response = require("../helpers/response");
const TestAttempt = require("../model/testAttempt.model");
const { asyncHandler } = require("../helpers/asyncHandler");

// router.get(
//   "/:id",
//   authMiddleware(["admin", "teacher", "user"]),
//   asyncHandler(TestAttemptController.getTestAttempt)
// );
router.get(
  "/",
  authMiddleware(["admin", "teacher", "user"]),
  asyncHandler(TestAttemptController.getAllTestAttemptsByUser)
);
router.post(
  "/:testAttemptId/initialize",
  authMiddleware(["admin", "teacher", "user"]),
  asyncHandler(TestAttemptController.initializeTestAttempt)
);

router.put(
  "/:testAttemptId/answer",
  authMiddleware(["admin", "teacher", "user"]),
  asyncHandler(TestAttemptController.updateAnswer)
);
router.post(
  "/:testAttemptId/answers",
  authMiddleware(["admin", "teacher", "user"]),
  asyncHandler(TestAttemptController.saveAnswer)
);
router.post(
  "/check",
  authMiddleware(["admin", "teacher", "user"]),
  asyncHandler(TestAttemptController.checkTestAttempt)
);
router.post(
  "/:testAttemptId/complete",
  authMiddleware(["admin", "teacher", "user"]),
  asyncHandler(TestAttemptController.completeTestAttempt)
);

// router.post(
//   "/:testAttemptId/result",
//   authMiddleware(["admin", "teacher", "user"]),
//   asyncHandler(async (req, res) => {
//     const { testAttemptId } = req.params;
//     const testAttempt = await TestAttempt.findById(testAttemptId);
//     const result = await testAttempt.calculateResult();
//     Response.sendSuccess(res, "Result calculated successfully", result);
//   })
// );
module.exports = router;
