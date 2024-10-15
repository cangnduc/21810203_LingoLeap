const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const {
  seedFillInTheBlankQuestions,
} = require("../model/seed/fill.in.the.blanks");
const {
  seedMultipleChoiceQuestions,
} = require("../model/seed/multiple.choice");
const { seedReadingPassages } = require("../model/seed/reading");
router.get(
  "/",
  asyncHandler(async (req, res) => {
    //await seedFillInTheBlankQuestions();
    await seedMultipleChoiceQuestions();
    res.status(200).json({ message: "Questions seeded successfully" });
  })
);

module.exports = router;
