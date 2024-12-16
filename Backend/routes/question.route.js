const express = require("express");
const router = express.Router();
const { questionSchema } = require("../validator/question.validator");
const { wrapAsyncRoutes, asyncHandler } = require("../helpers/asyncHandler");
const { BadRequestError } = require("../helpers/error");
const { authMiddleware } = require("../middleware/auth.middleware");
const QuestionsController = require("../controllers/questions.controller");
const LoginSession = require("../model/loginSession.model");
const upload = require("../middleware/audio.middleware");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const QuestionsControllerV1 = require("../controllers/questions.controller.v1");
const {
  Question,
  ReadingPassage,
  ListeningPassage,
  BasePassage,
  BaseQuestion,
} = require("../model/question.model.v1");

const questionExamples = require("../docs/swagger/examples/questionExamples");

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
router.get(
  "/my-questions",
  authMiddleware(["admin", "teacher"]),
  asyncHandler(QuestionsControllerV1.getAllUserContent)
);

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
  authMiddleware(["admin", "teacher"]),
  asyncHandler(QuestionsController.getAllQuestions)
);
router.get(
  "/id/:id",
  authMiddleware(["admin", "teacher"]),
  asyncHandler(QuestionsControllerV1.getQuestionById)
);
router.get(
  "/my-question/:id",
  authMiddleware(["admin", "teacher"]),
  asyncHandler(QuestionsControllerV1.getMyQuestionById)
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               section:
 *                 type: string
 *                 enum: [reading, listening, speaking, writing, general]
 *               passage:
 *                 type: string
 *                 format: json
 *               questions:
 *                 type: string
 *                 format: json
 *               soundFile:
 *                 type: string
 *                 format: binary
 *           encoding:
 *             passage:
 *               contentType: application/json
 *             questions:
 *               contentType: application/json
 *           examples:
 *             listeningSection:
 *               $ref: '#/components/examples/listeningSection'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createQuestionRequest'
 *           examples:
 *             readingSection:
 *               $ref: '#/components/examples/readingSection'
 *             writingSection:
 *               $ref: '#/components/examples/writingSection'
 *             speakingSection:
 *               $ref: '#/components/examples/speakingSection'
 *             generalSection:
 *               $ref: '#/components/examples/generalSection'
 *             fillInTheBlankOnGeneral:
 *               $ref: '#/components/examples/fillInTheBlankOnGeneral'
 *     responses:
 *       201:
 *         description: Question created successfully
 *       400:
 *         description: Invalid input
 */

// add question
router.post(
  "/add",
  authMiddleware(["admin", "user", "teacher"]),
  (req, res, next) => {
    try {
      const contentType = req.headers["content-type"];
      if (contentType && contentType.startsWith("multipart/form-data")) {
        upload.single("soundFile")(req, res, (err) => {
          if (req.body.section === "listening") {
            req.body.passage = JSON.parse(req.body.passage);
            req.body.questions = JSON.parse(req.body.questions);
          }
          if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: "File upload error" });
          } else if (err) {
            return res
              .status(500)
              .json({ error: "Unknown error during file upload" });
          }
          next();
        });
      } else {
        bodyParser.json()(req, res, (err) => {
          if (err) {
            return res.status(400).json({ error: "Invalid JSON" });
          }
          next();
        });
      }
    } catch (error) {
      next(error);
    }
  },
  asyncHandler(QuestionsControllerV1.addQuestion)
);
//search question by type and section
router.get(
  "/search",
  authMiddleware(["admin", "user", "teacher"]),
  asyncHandler(QuestionsController.searchQuestion)
);
// router.get(
//   "/section/:section",
//   authMiddleware,
//   asyncHandler(QuestionsController.getDataBySection)
// );

router.get(
  "/passages/:section",
  authMiddleware(["admin", "user", "teacher"]),
  asyncHandler(QuestionsController.getPassagesWithQuestions)
);
router.get(
  "/:section",
  authMiddleware(["admin", "user", "teacher"]),
  asyncHandler(QuestionsController.getQuestionsBySection)
);
router.post(
  "/upload/sound",
  authMiddleware(["admin", "user", "teacher"]),
  upload.single("soundFile"),
  (req, res) => {
    console.log(req.file.filename);
    res.status(200).json({ message: "File uploaded successfully" });
  }
);
router.delete(
  "/my-question/:id",
  authMiddleware(["admin", "teacher"]),
  asyncHandler(QuestionsControllerV1.deleteQuestionById)
);
router.delete(
  "/passage/:id",
  authMiddleware(["admin", "teacher"]),
  asyncHandler(QuestionsControllerV1.deletePassageById)
);
router.put(
  "/my-question/:id",
  authMiddleware(["admin", "teacher"]),
  asyncHandler(QuestionsControllerV1.editQuestionById)
);
module.exports = router;
