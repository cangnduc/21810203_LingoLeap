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
/**
 * @swagger
 * /seed:
 *   get:
 *     summary: Seed questions
 */

router.get(
  "/",
  asyncHandler(async (req, res) => {
    // await seedMultipleChoiceQuestions();
    // await seedSingleChoiceQuestions();
    //await seedWritingEssayQuestions();
    await seedReviews();
    // await seedFillInTheBlankQuestions();
    //await seedMatchingQuestions();
    res.status(200).json({ message: "seeded successfully" });
  })
);

module.exports = router;
