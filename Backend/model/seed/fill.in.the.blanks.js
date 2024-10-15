const mongoose = require("mongoose");
const { FillInTheBlankQuestion } = require("../question.model.v1");
const instanceMongodb = require("../../config/mongoose.db");

const fillInTheBlankQuestions = [
  {
    type: "fill_in_the_blank",
    section: "writing",
    questionText: "Complete the sentence with the correct form of the verb.",
    instruction: "Fill in the blanks with the appropriate words.",
    difficulty: 3,
    text: "If I (1) (know) about the party, I (2) (bring) a gift.",
    blanks: [
      { index: 0, correctAnswer: "had known" },
      { index: 1, correctAnswer: "would have brought" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "writing",
    questionText: "Complete the sentence with the correct phrasal verb.",
    instruction: "Fill in the blanks with the appropriate words.",
    difficulty: 2,
    text: "The teacher asked the students to (1) their homework before leaving the classroom.",
    blanks: [{ index: 0, correctAnswer: "hand in" }],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "writing",
    questionText: "Complete the sentence with the correct prepositions.",
    instruction: "Fill in the blanks with the appropriate words.",
    difficulty: 2,
    text: "The cat jumped (1) the table and knocked (2) the vase.",
    blanks: [
      { index: 0, correctAnswer: "onto" },
      { index: 1, correctAnswer: "over" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "writing",
    questionText: "Complete the sentence with the correct articles.",
    instruction: "Fill in the blanks with the appropriate words.",
    difficulty: 2,
    text: "(1) sun was shining brightly in (2) sky when we went for (3) walk in (4) park.",
    blanks: [
      { index: 0, correctAnswer: "The" },
      { index: 1, correctAnswer: "the" },
      { index: 2, correctAnswer: "a" },
      { index: 3, correctAnswer: "the" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "writing",
    questionText:
      "Complete the sentence with the correct form of the adjective.",
    instruction: "Fill in the blanks with the appropriate words.",
    difficulty: 2,
    text: "This is the (1) (interesting) book I've ever read. It's even (2) (good) than the last one.",
    blanks: [
      { index: 0, correctAnswer: "most interesting" },
      { index: 1, correctAnswer: "better" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "writing",
    questionText: "Complete the sentence with the correct relative pronouns.",
    instruction: "Fill in the blanks with the appropriate words.",
    difficulty: 3,
    text: "The woman (1) car was stolen reported it to the police, (2) quickly caught the thief.",
    blanks: [
      { index: 0, correctAnswer: "whose" },
      { index: 1, correctAnswer: "who" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "writing",
    questionText: "Complete the sentence with the correct modal verbs.",
    instruction: "Fill in the blanks with the appropriate words.",
    difficulty: 2,
    text: "You (1) leave now if you want, but you (2) stay a bit longer if you'd like.",
    blanks: [
      { index: 0, correctAnswer: "can" },
      { index: 1, correctAnswer: "could" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "writing",
    questionText:
      "Complete the sentence with the correct form of the verb in passive voice.",
    instruction: "Fill in the blanks with the appropriate words.",
    difficulty: 3,
    text: "The new policy (1) (implement) next month, and all employees (2) (inform) about the changes.",
    blanks: [
      { index: 0, correctAnswer: "will be implemented" },
      { index: 1, correctAnswer: "will be informed" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "writing",
    questionText: "Complete the sentence with the correct linking words.",
    instruction: "Fill in the blanks with the appropriate words.",
    difficulty: 2,
    text: "The movie was entertaining; (1), it was too long. (2), I enjoyed watching it.",
    blanks: [
      { index: 0, correctAnswer: "however" },
      { index: 1, correctAnswer: "nevertheless" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "writing",
    questionText:
      "Complete the sentence with the correct form of the verb in reported speech.",
    instruction: "Fill in the blanks with the appropriate words.",
    difficulty: 3,
    text: "She said that she (1) (be) busy and (2) (can) not attend the meeting.",
    blanks: [
      { index: 0, correctAnswer: "was" },
      { index: 1, correctAnswer: "could" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "writing",
    questionText: "Complete the sentence with the correct form of the verb.",
    instruction: "Fill in the blanks with the appropriate words.",
    difficulty: 3,
    text: "The (1) (important) thing is to (2) (keep) an open mind.",
    blanks: [
      { index: 0, correctAnswer: "most" },
      { index: 1, correctAnswer: "keep" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
];

async function seedFillInTheBlankQuestions() {
  try {
    // Connect to the database

    // Clear existing fill-in-the-blank questions

    // Insert new fill-in-the-blank questions
    const insertedQuestions = await FillInTheBlankQuestion.insertMany(
      fillInTheBlankQuestions
    );

    console.log(
      `${insertedQuestions.length} fill-in-the-blank questions have been added to the database.`
    );

    return insertedQuestions.length;
  } catch (error) {
    console.error("Error seeding fill-in-the-blank questions:", error);
    throw error;
  }
}

module.exports = { seedFillInTheBlankQuestions };
