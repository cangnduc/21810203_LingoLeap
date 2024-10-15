const express = require("express");
const router = express.Router();
const { questionSchema } = require("../validator/question.validator");
const { wrapAsyncRoutes } = require("../helpers/asyncHandler");
const { BadRequestError } = require("../helpers/error");
const { authMiddleware } = require("../middleware/auth.middleware");
const QuestionsController = require("../controllers/questions.controller");
const LoginSession = require("../model/loginSession.model");
const simulateSlowUpload = require("../middleware/audio.middleware");

const {
  Question,
  ReadingPassage,
  ListeningPassage,
  BasePassage,
  BaseQuestion,
} = require("../model/question.model.v1");

const { asyncHandler } = require("../helpers/asyncHandler");
/**
 * @swagger
 * /question:
 *   get:
 *     summary: Get all questions
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Questions
 *     responses:
 *       200:
 *         description: A list of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 */
router.get(
  "/",
  authMiddleware(["admin", "user"]),
  QuestionsController.getAllQuestions
);

/**
 * @swagger
 * /question:
 *   post:
 *     summary: Create a new question
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Questions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createQuestionRequest'
 *     responses:
 *       201:
 *         description: Question created successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  "/",
  authMiddleware(["admin", "user"]),

  QuestionsController.addQuestion
);
//search question by type and section
router.get(
  "/search",
  authMiddleware(["admin", "user"]),
  asyncHandler(QuestionsController.searchQuestion)
);
// router.get(
//   "/section/:section",
//   authMiddleware,
//   asyncHandler(QuestionsController.getDataBySection)
// );

router.get(
  "/passages/:section",
  authMiddleware(["admin", "user"]),
  QuestionsController.getPassagesWithQuestions
);
router.get(
  "/:section",
  authMiddleware(["admin", "user"]),
  QuestionsController.getQuestionsBySection
);

router.get(
  "/delete",
  asyncHandler(async (req, res) => {
    if (Question) await Question.deleteMany({});
    if (ReadingPassage) await ReadingPassage.deleteMany({});
    if (ListeningPassage) await ListeningPassage.deleteMany({});
    if (BasePassage) await BasePassage.deleteMany({});
    if (BaseQuestion) await BaseQuestion.deleteMany({});
    res.status(200).json({ message: "Deleted" });
  })
);
module.exports = router;
