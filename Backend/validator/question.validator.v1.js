const z = require("zod");

// Helper schemas
const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

const BaseQuestionValidator = z.object({
  section: z.enum(["reading", "listening", "speaking", "writing", "general"]),
  questionText: z.string().max(1000),
  instruction: z.string().max(500).optional(),
  isPublic: z.boolean().default(true),
  difficulty: z.number().int().min(1).max(5),
  createdBy: ObjectIdSchema,
  points: z.number().int().min(0).default(1),
});

// Multiple Choice Question Schema
const MultipleChoiceValidator = BaseQuestionValidator.extend({
  type: z.literal("multiple_choice"),
  answers: z.array(z.string()).length(4),
  correctAnswers: z.array(z.string()),
});

// Single Choice Question Schema
const SingleChoiceValidator = BaseQuestionValidator.extend({
  type: z.literal("single_choice"),
  answers: z.array(z.string()).length(4),
  correctAnswer: z.string(),
});

// Fill in the Blank Question Schema
const FillInTheBlankValidator = BaseQuestionValidator.extend({
  type: z.literal("fill_in_the_blank"),
  text: z.string().max(1000),
  blanks: z.array(
    z.object({
      index: z.number().int().nonnegative(),
      correctAnswer: z.string().min(1),
      options: z.array(z.string()).optional(),
    })
  ),
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
  statement: z.string().max(500),
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
        if (question.correctAnswers.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "At least two correct answers must be selected.",
            path: ["correctAnswers"],
          });
        }
        if (
          !question.correctAnswers.every((answer) =>
            question.answers.includes(answer)
          )
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "All correct answers must be included in the answer options.",
            path: ["correctAnswers"],
          });
        }
        break;
      case "single_choice":
        if (!question.answers.includes(question.correctAnswer)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "The correct answer must be one of the answer options.",
            path: ["correctAnswer"],
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
        break;
      case "fill_in_the_blank":
        const blanksCount = question.blanks.length;

        // count the number of "_____" in the text
        const blankCount = question.text.split("_____").length - 1;
        if (blankCount !== blanksCount) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "The number of blanks must match the number of _____ in the text.",
            path: ["blanks"],
          });
        }

        break;

      default:
        break;
    }
  });

// Base Passage Schema
const BasePassageValidator = z.object({
  title: z.string().max(200),
  text: z.string().max(5000),
  url: z.string().url().optional().or(z.literal("")),

  createdBy: ObjectIdSchema,
});

// Reading Passage Schema
const ReadingPassageValidator = BasePassageValidator.extend({
  passageType: z.literal("reading"),
});

// Listening Passage Schema
const ListeningPassageValidator = BasePassageValidator.extend({
  passageType: z.literal("listening"),
  audioUrl: z.string().url().optional().or(z.literal("")),
});

// Union of passage types
const PassageValidator = z.discriminatedUnion("passageType", [
  ReadingPassageValidator,
  ListeningPassageValidator,
]);
const SingleQuestionValidator = z.object({
  question: QuestionValidator,
});
const CombinedQuestionPassageValidator = z.object({
  passage: PassageValidator,
  questions: z.array(QuestionValidator).min(1),
});

module.exports = {
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
  SingleQuestionValidator,
  CombinedQuestionPassageValidator,
};
