const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const UserController = require("../controllers/user.controller");
const { asyncHandler } = require("../helpers/asyncHandler");

// Get current user
router.get(
  "/me",
  authMiddleware(["admin", "teacher", "user"]),
  asyncHandler(UserController.getCurrentUser)
);

// Get full current user data
router.get(
  "/full/me",
  authMiddleware(["admin", "teacher", "user"]),
  asyncHandler(UserController.getFullCurrentUser)
);

// Keep these for admin routes
router.get(
  "/:id",
  authMiddleware(["admin"]),
  asyncHandler(UserController.getUserById)
);

router.get(
  "/full/:id",
  authMiddleware(["admin"]),
  asyncHandler(UserController.getFullUser)
);

router.patch(
  "/me",
  authMiddleware(["admin", "teacher", "user"]),
  asyncHandler(UserController.updateCurrentUser)
);

router.get(
  "/profile/me",
  authMiddleware(["admin", "teacher", "user"]),
  asyncHandler(UserController.getCurrentUserProfile)
);

router.get(
  "/profile/:id",
  authMiddleware(["admin"]),
  asyncHandler(UserController.getProfileByUserId)
);
module.exports = router;
