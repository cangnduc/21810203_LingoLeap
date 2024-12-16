import { z } from "zod";

// Helper schemas
const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

const BaseQuestionValidator = z.object({
  section: z.enum([
    "reading",
    "listening",
    "speaking",
    "writing",
    "general",
    "grammar",
    "vocabulary",
    "general",
  ]),
  questionText: z.string().max(1000).min(10),
  instruction: z.string().min(10).max(500),
  isPublic: z.boolean().default(true),
  difficulty: z.number().int().min(1).max(5),
});

// Multiple Choice Question Schema
const MultipleChoiceValidator = BaseQuestionValidator.extend({
  type: z.literal("multiple_choice"),
  answers: z.array(z.string()).min(2).max(6),
  correctAnswers: z.array(z.boolean()),
});

// Single Choice Question Schema
const SingleChoiceValidator = BaseQuestionValidator.extend({
  type: z.literal("single_choice"),
  answers: z.array(z.string()).min(2).max(6),
  correctAnswer: z.string(),
});

// Fill in the Blank Question Schema
const FillInTheBlankValidator = BaseQuestionValidator.extend({
  type: z.literal("fill_in_the_blank"),
  text: z.string().max(1000),
  blanks: z
    .array(
      z.object({
        index: z.number().int().nonnegative(),
        correctAnswer: z.string(),
        options: z
          .array(z.string().min(1, "Option cannot be empty"))
          .max(6, "Maximum 6 options allowed")
          .optional()
          .default([]),
      })
    )
    .min(1, "At least one blank is required"),
});

// Matching Question Schema
const MatchingValidator = BaseQuestionValidator.extend({
  type: z.literal("matching"),
  leftColumn: z.array(
    z.object({
      id: z.number().int().positive(),
      text: z.string(),
    })
  ),
  rightColumn: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    })
  ),
  correctPairs: z.array(
    z.object({
      left: z.number().int().positive(),
      right: z.string(),
    })
  ),
});

// True/False Question Schema
const TrueFalseValidator = BaseQuestionValidator.extend({
  type: z.literal("true_false"),
  statement: z.string().min(10).max(500),
  correctAnswer: z.boolean(),
});

// Open-Ended Question Schema
const OpenEndedValidator = BaseQuestionValidator.extend({
  type: z.literal("open_ended"),
  prompt: z.string().max(1000),
});

// Essay Question Schema
const EssayValidator = BaseQuestionValidator.extend({
  type: z.literal("essay"),
  minWords: z.number().int().positive(),
  maxWords: z.number().int().positive(),
  rubric: z.string().max(2000),
});

// Ordering Question Schema
const OrderingValidator = BaseQuestionValidator.extend({
  type: z.literal("ordering"),
  items: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    })
  ),
  correctOrder: z.array(z.string()),
});

// Union of all question types with refinements
const QuestionValidator = z
  .discriminatedUnion("type", [
    MultipleChoiceValidator,
    SingleChoiceValidator,
    FillInTheBlankValidator,
    MatchingValidator,
    TrueFalseValidator,
    OpenEndedValidator,
    EssayValidator,
    OrderingValidator,
  ])
  .superRefine((question, ctx) => {
    switch (question.type) {
      case "multiple_choice":
        if (question.correctAnswers.filter(Boolean).length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "At least two correct answers must be selected.",
            path: ["correctAnswers"],
          });
        }
        break;

      case "fill_in_the_blank":
        const blankCount = (question.text.match(/_____/g) || []).length;

        if (blankCount === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Text must contain at least one blank marked with '_____'",
            path: ["text"],
          });
        }
        if (
          blankCount !== question.blanks.length &&
          question.text.includes("_____") &&
          question.text !== ""
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Number of blanks must match the number of blanks provided.",
            path: ["blanks"],
          });
        }
        question.blanks.forEach((blank, index) => {
          if (
            blank.options.length > 0 &&
            !blank.options.includes(blank.correctAnswer)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `The correct answer must be in the options at index ${
                index + 1
              }`,
              path: ["blanks", index, "options"],
            });
          }
          if (blank.options.length > 6) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `At most 6 options are allowed per blank at index ${
                index + 1
              }`,
              path: ["blanks", index, "options"],
            });
          }
          if (blank.correctAnswer === "") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `The correct answer cannot be empty at index ${
                index + 1
              }`,
              path: ["blanks", index, "correctAnswer"],
            });
          }
        });

        break;
      case "single_choice":
        // remove empty string from answers
        question.answers = question.answers.filter((answer) => answer !== "");
        if (!question.answers.includes(question.correctAnswer)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "The correct answer must be one of the answer options.",
            path: ["correctAnswer"],
          });
        }
        if (question.answers.length < 4) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "At least 4 answer options must be provided.",
            path: ["answers"],
          });
        }
        break;
      case "essay":
        if (question.maxWords <= question.minWords) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Maximum word count must be greater than minimum word count.",
            path: ["maxWords"],
          });
        }
        break;
      case "matching":
        if (question.leftColumn.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "At least 2 items must be provided in the left column.",
            path: ["leftColumn"],
          });
        }
        if (question.rightColumn.length !== question.leftColumn.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Right column must have the same number of items as left column.",
            path: ["rightColumn"],
          });
        }
        //check if the correctPairs left is in the leftColumn
        if (
          !question.correctPairs.every((pair) =>
            question.leftColumn.some((item) => item.id === pair.left)
          )
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "All items in the correct order must exist in the items list.",
            path: ["correctPairs"],
          });
        }
        //check if the correctPairs right is in the rightColumn
        if (
          !question.correctPairs.every((pair) =>
            question.rightColumn.some((item) => item.id === pair.right)
          )
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "All items in the correct order must exist in the items list.",
            path: ["correctPairs"],
          });
        }

        break;
      case "ordering":
        if (
          !question.correctOrder.every((id) =>
            question.items.some((item) => item.id === id)
          )
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "All items in the correct order must exist in the items list.",
            path: ["correctOrder"],
          });
        }
        if (question.items.length < 3 || question.items.length > 8) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "At least 3 items must be provided and at most 8 items.",
            path: ["items"],
          });
        }
        if (question.correctOrder.length !== question.items.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "The correct order must have the same length as the items list.",
            path: ["correctOrder"],
          });
        }
        // check if the correctOrder has duplicates
        if (
          new Set(question.correctOrder).size !== question.correctOrder.length
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "The correct order must not have duplicates.",
            path: ["correctOrder"],
          });
        }
        break;
      case "true_false":
        //check if the correctAnswer is either true or false
        if (
          question.correctAnswer !== true &&
          question.correctAnswer !== false
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "The correct answer must be either true or false.",
            path: ["correctAnswer"],
          });
        }
        break;
      default:
        break;
    }
  });

// Base Passage Schema
const BasePassageValidator = z.object({
  title: z.string().min(10).max(200),
  text: z.string().min(10).max(5000),
  url: z.string().url().optional().or(z.literal("")),
});

// Reading Passage Schema
const ReadingPassageValidator = BasePassageValidator.extend({
  passageType: z.literal("reading"),
});

// Listening Passage Schema
const ListeningPassageValidator = BasePassageValidator.extend({
  passageType: z.literal("listening"),
  soundFile: z
    .instanceof(File)

    .refine((file) => file.size <= 1000000000, {
      message: "The sound file must be less than 10MB",
    })
    .refine(
      (file) => ["audio/mpeg", "audio/ogg", "audio/wav"].includes(file.type),
      {
        message: "The sound file must be an MP3, WAV, or OGG audio file",
      }
    ),
});

// Union of passage types
const PassageValidator = z.discriminatedUnion("passageType", [
  ReadingPassageValidator,
  ListeningPassageValidator,
]);
// Modify the CombinedQuestionPassageValidator
const CombinedQuestionPassageValidator = z.object({
  passage: PassageValidator,
  questions: z.array(QuestionValidator).min(1),
});

// Create a new validator for sections without passages
const SingleQuestionValidator = z.object({
  question: QuestionValidator,
});

// Create a discriminated union based on the section
const SectionBasedValidator = z.discriminatedUnion("section", [
  z.object({
    section: z.enum(["reading", "listening"]),
    data: CombinedQuestionPassageValidator,
  }),
  z.object({
    section: z.enum([
      "speaking",
      "writing",
      "general",
      "vocabulary",
      "grammar",
    ]),
    data: SingleQuestionValidator,
  }),
]);

export {
  QuestionValidator,
  PassageValidator,
  MultipleChoiceValidator,
  SingleChoiceValidator,
  FillInTheBlankValidator,
  MatchingValidator,
  TrueFalseValidator,
  OpenEndedValidator,
  EssayValidator,
  OrderingValidator,
  ReadingPassageValidator,
  ListeningPassageValidator,
  CombinedQuestionPassageValidator,
  SingleQuestionValidator,
  SectionBasedValidator,
};
