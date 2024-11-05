const z = require("zod");
const { difficultyLevels, sections, testTypes } = require("../constant/value");
const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);
const QuestionSchema = z.object({
  _id: ObjectIdSchema,
  points: z.number().int().min(0),
});

const PassageSchema = z.object({
  _id: ObjectIdSchema,
  points: z.number().int().min(0),
});

const SectionSchema = z
  .object({
    name: z.enum(sections),
    sectionScore: z.number().int().min(0),
    instructions: z.string().max(500).optional(),
    duration: z.number().int().min(1),
    questions: z.array(QuestionSchema).optional(),
    passages: z.array(PassageSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.name === "reading" || data.name === "listening") {
        return data.passages && data.passages.length > 0;
      }
      return data.questions && data.questions.length > 0;
    },
    {
      message:
        "Reading and Listening sections must have passages, other sections must have questions",
    }
  );

const TestValidator = z
  .object({
    title: z.string().max(100),
    description: z.string().max(500).optional(),
    duration: z.number().int().min(1),
    sections: z.array(SectionSchema).min(1),
    totalPossibleScore: z.number().int().min(0),
    passingScore: z.number().int().min(0),
    difficulty: z.enum(difficultyLevels),
    testType: z.enum(testTypes),
    //createdBy: ObjectIdSchema,
    isPublished: z.boolean().optional().default(false),
    attemptsAllowed: z.number().int().min(1).optional().default(1),
    availableFrom: z.string().transform((str, ctx) => {
      const date = new Date(str);
      if (isNaN(date.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid date for availableFrom",
        });
        return z.NEVER;
      }
      return date;
    }),
    availableUntil: z.string().transform((str, ctx) => {
      const date = new Date(str);
      if (isNaN(date.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid date for availableUntil",
        });
        return z.NEVER;
      }
      return date;
    }),
  })

  .refine(
    (data) => {
      console.log("passagescore", data.passingScore, data.totalPossibleScore);
      return data.passingScore <= data.totalPossibleScore;
    },
    {
      message: "Passing score cannot exceed total possible score",
      path: ["passingScore"],
    }
  )
  .refine(
    (data) => {
      const calculatedDuration = data.sections.reduce(
        (total, section) => total + section.duration,
        0
      );
      return data.duration === calculatedDuration;
    },
    {
      message: "Test duration must equal the sum of all section durations",
      path: ["duration"],
    }
  )
  .refine(
    (data) => {
      const calculatedTotalScore = data.sections.reduce(
        (total, section) => total + section.sectionScore,
        0
      );
      return data.totalPossibleScore === calculatedTotalScore;
    },
    {
      message: "Total possible score must equal the sum of all section scores",
      path: ["totalPossibleScore"],
    }
  );

module.exports = { TestValidator };

// // Sample test object
// const sampleTest = {
//   title: "IELTS General Training Practice Test",
//   description:
//     "A comprehensive practice test for IELTS General Training, covering all four sections.",
//   duration: 170, // 2 hours and 50 minutes
//   sections: [
//     {
//       name: "listening",
//       sectionScore: 40,
//       instruction:
//         "Listen to four recordings and answer questions based on what you hear.",
//       duration: 30,
//       passages: [
//         { _id: "60d5ec9f1c9d440000d9e1a1", points: 10 },
//         { _id: "60d5ec9f1c9d440000d9e1a2", points: 10 },
//         { _id: "60d5ec9f1c9d440000d9e1a3", points: 10 },
//         { _id: "60d5ec9f1c9d440000d9e1a4", points: 10 },
//       ],
//     },
//     {
//       name: "reading",
//       sectionScore: 40,
//       instruction:
//         "Read three passages and answer questions to demonstrate your understanding.",
//       duration: 60,
//       passages: [
//         { _id: "60d5ec9f1c9d440000d9e1a5", points: 13 },
//         { _id: "60d5ec9f1c9d440000d9e1a6", points: 13 },
//         { _id: "60d5ec9f1c9d440000d9e1a7", points: 14 },
//       ],
//     },
//     {
//       name: "writing",
//       sectionScore: 20,
//       instruction: "Complete two writing tasks within the given time.",
//       duration: 60,
//       questions: [
//         { _id: "60d5ec9f1c9d440000d9e1a8", points: 10 },
//         { _id: "60d5ec9f1c9d440000d9e1a9", points: 10 },
//       ],
//     },
//     {
//       name: "speaking",
//       sectionScore: 20,
//       instruction:
//         "Participate in a recorded spoken interview covering various topics.",
//       duration: 20,
//       questions: [
//         { _id: "60d5ec9f1c9d440000d9e1aa", points: 5 },
//         { _id: "60d5ec9f1c9d440000d9e1ab", points: 5 },
//         { _id: "60d5ec9f1c9d440000d9e1ac", points: 5 },
//         { _id: "60d5ec9f1c9d440000d9e1ad", points: 5 },
//       ],
//     },
//   ],
//   totalPossibleScore: 120,
//   passingScore: 65,
//   difficulty: "intermediate",
//   isPublished: false,
//   attemptsAllowed: 2,
//   availableFrom: new Date("2023-07-01T00:00:00Z"),
//   availableUntil: new Date("2023-12-31T23:59:59Z"),
// };

// // You can use this to test the validator
// try {
//   const validatedTest = TestValidator.parse(sampleTest);
//   console.log("Sample test is valid:", validatedTest);
// } catch (error) {
//   console.error("Sample test validation failed:", error.errors);
// }
