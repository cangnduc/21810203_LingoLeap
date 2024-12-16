const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const {
  seedFillInTheBlankQuestions,
} = require("../model/seed/fill.in.the.blanks");
const {
  seedMultipleChoiceQuestions,
} = require("../model/seed/multiple.choice");
const { seedWritingEssayQuestions } = require("../model/seed/wrting.essay");
const {
  singleChoiceQuestions,
  seedSingleChoiceQuestions,
} = require("../model/seed/single.choice");
const { seedMatchingQuestions } = require("../model/seed/matching");
const { seedReadingPassages } = require("../model/seed/reading");
const { seedReviews } = require("../model/seed/review");
const { seedSpeakingQuestions } = require("../model/seed/speaking.seed");
const { seedUserProfile } = require("../model/seed/userprofile");
const { seedUserStatistic } = require("../model/seed/userstatistic");
const Test = require("../model/test.model");
/**
 * @swagger
 * /seed:
 *   get:
 *     summary: Seed questions
 */

router.get(
  "/",
  asyncHandler(async (req, res) => {
    await seedMultipleChoiceQuestions();
    await seedSingleChoiceQuestions();
    await seedFillInTheBlankQuestions();
    await seedWritingEssayQuestions();
    await seedSpeakingQuestions();
    await seedMatchingQuestions();

    res.status(200).json({ message: "seeded successfully" });
  })
);

module.exports = router;
