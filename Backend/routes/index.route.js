const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const TestAttempt = require("../model/testAttempt.model");
router.get("/", (req, res) => {
  res.send("Hello World");
});

router.use("/auth", require("./auth.route"));
router.use("/user", require("./user.route"));
router.use("/question", require("./question.route"));
router.use("/tests", require("./test.route"));
router.use("/review", require("./review.route"));
router.use("/test-attempt", require("./testAttempt.route"));
router.use("/test-result", require("./testResult.route"));
router.use(
  "/voice",
  asyncHandler(async (req, res, next) => {
    const route = await import("./voice.route.mjs");
    route.default(req, res, next);
  })
);
// Add the seed route
router.use("/seed", require("./seed.route"));
router.post(
  "/calculate-result",
  asyncHandler(async (req, res, next) => {
    const testAttemptId = "6753d786c3c964e72f8b354c";
    const testAttempt = await TestAttempt.findById(testAttemptId);
    const testResult = await testAttempt.calculateResult();
    res.json(testResult);
  })
);
module.exports = router;
