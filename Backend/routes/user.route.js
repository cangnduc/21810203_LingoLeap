const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const { wrapAsyncRoutes, asyncHandler } = require("../helpers/asyncHandler");
const dummyUser = [
  { name: "John Doe", email: "john@gmail.com", role: "user" },
  { name: "Jane Doe", email: "jane@gmail.com", role: "teacher" },
  { name: "John Smith", email: "johnsmith@gmail.com", role: "admin" },
];
router.get(
  "/",
  authMiddleware(["admin", "user"]),
  asyncHandler(async (req, res) => {
    res.status(200).json(dummyUser);
  })
);

module.exports = router;
