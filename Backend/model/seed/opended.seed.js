const { OpenEndedQuestion } = require("../question.model.v1");

const openEndedQuestions = [
  {
    type: "open-ended",
    section: "speaking",
    questionText: "What is the main theme of the novel?",
    instruction: "Answer the question based on the provided text.",
    difficulty: 3,
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "open-ended",
    section: "writing",
    questionText:
      "How does the author develop the protagonist's character throughout the story?",
    instruction:
      "Analyze the character development with specific examples from the text.",
    difficulty: 4,
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "open-ended",
    section: "reading",
    questionText:
      "What are the key arguments presented in the article supporting environmental conservation?",
    instruction: "Identify and explain the main points made by the author.",
    difficulty: 3,
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "open-ended",
    section: "speaking",
    questionText:
      "Describe a significant challenge you've overcome and what you learned from it.",
    instruction:
      "Provide specific details about the situation and its impact on you.",
    difficulty: 2,
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "open-ended",
    section: "writing",
    questionText: "What role does technology play in modern education?",
    instruction:
      "Discuss both advantages and disadvantages with relevant examples.",
    difficulty: 4,
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "open-ended",
    section: "reading",
    questionText:
      "How does the author use literary devices to convey the mood of the passage?",
    instruction:
      "Identify specific literary techniques and explain their effects.",
    difficulty: 5,
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "open-ended",
    section: "speaking",
    questionText:
      "What measures can cities take to become more environmentally sustainable?",
    instruction:
      "Propose and explain specific solutions with potential impacts.",
    difficulty: 3,
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "open-ended",
    section: "writing",
    questionText: "How has social media influenced modern communication?",
    instruction:
      "Examine both positive and negative effects on personal and professional communication.",
    difficulty: 4,
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "open-ended",
    section: "reading",
    questionText:
      "What are the implications of the scientific findings discussed in the text?",
    instruction: "Analyze the potential impact on both science and society.",
    difficulty: 5,
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "open-ended",
    section: "speaking",
    questionText:
      "How can traditional and modern medicine complement each other?",
    instruction:
      "Discuss the potential benefits and challenges of integration.",
    difficulty: 4,
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "open-ended",
    section: "writing",
    questionText:
      "What factors contribute to successful cultural integration in diverse societies?",
    instruction: "Examine key elements and provide real-world examples.",
    difficulty: 4,
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
];

async function seedOpenEndedQuestions() {
  try {
    const insertedQuestions = await OpenEndedQuestion.insertMany(
      openEndedQuestions
    );
    console.log(
      `${insertedQuestions.length} open-ended questions have been added to the database.`
    );
    return insertedQuestions.length;
  } catch (error) {
    console.error("Error seeding open-ended questions:", error);
    throw error;
  }
}

module.exports = { openEndedQuestions, seedOpenEndedQuestions };
