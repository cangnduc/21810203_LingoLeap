const z = require("zod");

const sectionEnum = z.enum([
  "reading",
  "listening",
  "speaking",
  "writing",
  "general",
]);

const typeEnum = z.enum([
  "single_choice",
  "multiple_choice",
  "fill_in_the_blank",
  "matching",
  "true_false",
  "open_ended",
  "essay",
]);

const baseQuestionSchema = z.object({
  section: sectionEnum,
  type: typeEnum,
  questionText: z
    .string()
    .max(1000, "Question text cannot exceed 1000 characters"),
  instruction: z
    .string()
    .max(500, "Instruction cannot exceed 500 characters")
    .optional(),
  difficulty: z.number().int().min(1).max(5),
  createdBy: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
});

const answerOptionsSchema = z.object({
  answers: z
    .array(z.string())
    .min(3, "At least 3 answer options are required")
    .max(5, "At most 5 answer options are allowed"),
});

const singleChoiceSchema = baseQuestionSchema
  .merge(answerOptionsSchema)
  .extend({
    correctAnswer: z.string(),
  });

const multipleChoiceBaseSchema = answerOptionsSchema.extend({
  correctAnswers: z
    .array(z.string())
    .min(2, "At least 2 correct answers are required"),
});

const multipleChoiceSchema = baseQuestionSchema.merge(multipleChoiceBaseSchema);

const fillInTheBlankSchema = baseQuestionSchema
  .merge(answerOptionsSchema)
  .extend({
    correctAnswer: z.string(),
  });
const trueFalseSchema = baseQuestionSchema.extend({
  correctAnswer: z.boolean(),
});
const openEndedSchema = baseQuestionSchema.extend({
  prompt: z.string().max(1000, "Prompt cannot exceed 1000 characters"),
});

const essaySchema = openEndedSchema;

const questionValidator = z
  .discriminatedUnion("type", [
    singleChoiceSchema.extend({ type: z.literal("single_choice") }),
    multipleChoiceSchema.extend({ type: z.literal("multiple_choice") }),
    trueFalseSchema.extend({ type: z.literal("true_false") }),
    fillInTheBlankSchema.extend({ type: z.literal("fill_in_the_blank") }),
    openEndedSchema.extend({ type: z.literal("open_ended") }),
    essaySchema.extend({ type: z.literal("essay") }),
  ])
  .refine(
    (data) => {
      if (data.type === "multiple_choice") {
        return data.correctAnswers.every((answer) =>
          data.answers.includes(answer)
        );
      }
      return true;
    },
    {
      message: "All correct answers must be in the list of answer options",
      path: ["correctAnswers"],
    }
  );

const passageSchema = z.object({
  title: z.string().max(200, "Passage title cannot exceed 200 characters"),
  text: z.string().max(5000, "Passage text cannot exceed 5000 characters"),
  url: z.string().url("Invalid URL"),
  questions: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"))
    .optional(),
});

const readingPassageValidator = passageSchema;

const listeningPassageValidator = passageSchema;

module.exports = {
  questionValidator,
  readingPassageValidator,
  listeningPassageValidator,
};
