const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const TestAttemptController = require("../controllers/testAttempt.controller");
const { asyncHandler } = require("../helpers/asyncHandler");

// router.get(
//   "/:id",
//   authMiddleware(["admin", "teacher", "user"]),
//   asyncHandler(TestAttemptController.getTestAttempt)
// );
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
module.exports = router;
