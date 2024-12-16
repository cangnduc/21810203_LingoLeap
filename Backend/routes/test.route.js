const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const TestController = require("../controllers/test.controller");
const { wrapAsyncRoutes, asyncHandler } = require("../helpers/asyncHandler");

router.get(
  "/",
  authMiddleware(["admin", "teacher", "user"]),
  asyncHandler(TestController.getTests)
);

router.get(
  "/:id",
  authMiddleware(["admin", "teacher", "user"]),
  asyncHandler(TestController.getTest)
);
router.get(
  "/edit/:id",
  authMiddleware(["admin", "teacher", "user"]),
  asyncHandler(TestController.getTestById)
);
router.get(
  "/:id/attempt",
  authMiddleware(["admin", "teacher", "user"]),
  asyncHandler(TestController.getTestForAttempt)
);

router.delete(
  "/:id",
  authMiddleware(["admin", "teacher"]),
  asyncHandler(TestController.deleteTest)
);
router.post(
  "/",
  authMiddleware(["admin", "teacher", "user"]),
  asyncHandler(TestController.addTest)
);
router.patch(
  "/:id/publish",
  authMiddleware(["admin", "teacher"]),
  asyncHandler(TestController.togglePublished)
);
router.put(
  "/:id",
  authMiddleware(["admin", "teacher"]),
  asyncHandler(TestController.updateTest)
);

module.exports = router;
