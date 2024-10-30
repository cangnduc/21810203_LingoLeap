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

module.exports = router;
