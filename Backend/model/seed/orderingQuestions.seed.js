const { OrderingQuestion } = require("../question.model.v1");

const orderingQuestions = [
  {
    section: "general",
    questionText: "Arrange the steps of the scientific method in order.",
    items: [
      { id: "1", text: "Ask a question" },
      { id: "2", text: "Do background research" },
      { id: "3", text: "Construct a hypothesis" },
      { id: "4", text: "Test with an experiment" },
      { id: "5", text: "Analyze data and draw a conclusion" },
      { id: "6", text: "Communicate results" },
    ],
    correctOrder: ["1", "2", "3", "4", "5", "6"],
    difficulty: 3,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    section: "vocabulary",
    questionText: "Order the following words alphabetically.",
    items: [
      { id: "1", text: "Banana" },
      { id: "2", text: "Apple" },
      { id: "3", text: "Cherry" },
      { id: "4", text: "Date" },
    ],
    correctOrder: ["2", "1", "3", "4"],
    difficulty: 2,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    section: "grammar",
    questionText:
      "Arrange the following sentences to form a coherent paragraph.",
    items: [
      { id: "1", text: "The sun was setting." },
      { id: "2", text: "The sky turned orange." },
      { id: "3", text: "Birds were flying home." },
      { id: "4", text: "It was a beautiful evening." },
    ],
    correctOrder: ["1", "2", "3", "4"],
    difficulty: 3,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    section: "general",
    questionText: "Order the following historical events chronologically.",
    items: [
      { id: "1", text: "World War I" },
      { id: "2", text: "American Revolution" },
      { id: "3", text: "French Revolution" },
      { id: "4", text: "World War II" },
    ],
    correctOrder: ["2", "3", "1", "4"],
    difficulty: 4,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    section: "general",
    questionText: "Order the planets from the sun.",
    items: [
      { id: "1", text: "Earth" },
      { id: "2", text: "Mars" },
      { id: "3", text: "Venus" },
      { id: "4", text: "Mercury" },
    ],
    correctOrder: ["4", "3", "1", "2"],
    difficulty: 2,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    section: "general",
    questionText: "Order the following numbers from smallest to largest.",
    items: [
      { id: "1", text: "15" },
      { id: "2", text: "3" },
      { id: "3", text: "8" },
      { id: "4", text: "22" },
    ],
    correctOrder: ["2", "3", "1", "4"],
    difficulty: 1,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    section: "general",
    questionText: "Order the continents by size, largest to smallest.",
    items: [
      { id: "1", text: "Africa" },
      { id: "2", text: "Asia" },
      { id: "3", text: "Europe" },
      { id: "4", text: "Australia" },
    ],
    correctOrder: ["2", "1", "3", "4"],
    difficulty: 3,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    section: "general",
    questionText: "Order the following books by publication date.",
    items: [
      { id: "1", text: "1984" },
      { id: "2", text: "Pride and Prejudice" },
      { id: "3", text: "To Kill a Mockingbird" },
      { id: "4", text: "The Great Gatsby" },
    ],
    correctOrder: ["2", "4", "3", "1"],
    difficulty: 4,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    section: "general",
    questionText: "Order the following inventions chronologically.",
    items: [
      { id: "1", text: "Telephone" },
      { id: "2", text: "Internet" },
      { id: "3", text: "Television" },
      { id: "4", text: "Radio" },
    ],
    correctOrder: ["1", "4", "3", "2"],
    difficulty: 3,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    section: "general",
    questionText: "Order the following musical periods chronologically.",
    items: [
      { id: "1", text: "Baroque" },
      { id: "2", text: "Classical" },
      { id: "3", text: "Romantic" },
      { id: "4", text: "Modern" },
    ],
    correctOrder: ["1", "2", "3", "4"],
    difficulty: 3,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    section: "general",
    questionText: "Order the following art movements chronologically.",
    items: [
      { id: "1", text: "Renaissance" },
      { id: "2", text: "Impressionism" },
      { id: "3", text: "Cubism" },
      { id: "4", text: "Surrealism" },
    ],
    correctOrder: ["1", "2", "3", "4"],
    difficulty: 3,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    section: "general",
    questionText: "Order the following Olympic Games by year.",
    items: [
      { id: "1", text: "Sydney 2000" },
      { id: "2", text: "Athens 2004" },
      { id: "3", text: "Beijing 2008" },
      { id: "4", text: "London 2012" },
    ],
    correctOrder: ["1", "2", "3", "4"],
    difficulty: 2,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    section: "general",
    questionText: "Order the stages of mitosis.",
    items: [
      { id: "1", text: "Prophase" },
      { id: "2", text: "Metaphase" },
      { id: "3", text: "Anaphase" },
      { id: "4", text: "Telophase" },
    ],
    correctOrder: ["1", "2", "3", "4"],
    difficulty: 4,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    section: "general",
    questionText: "Order the following elements by atomic number.",
    items: [
      { id: "1", text: "Hydrogen" },
      { id: "2", text: "Helium" },
      { id: "3", text: "Lithium" },
      { id: "4", text: "Beryllium" },
    ],
    correctOrder: ["1", "2", "3", "4"],
    difficulty: 2,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    section: "general",
    questionText: "Order the following laws of motion.",
    items: [
      { id: "1", text: "First Law" },
      { id: "2", text: "Second Law" },
      { id: "3", text: "Third Law" },
    ],
    correctOrder: ["1", "2", "3"],
    difficulty: 2,
    createdBy: "66eda220f1577aa9a314ab30",
  },
];

async function seedOrderingQuestions() {
  try {
    const insertedQuestions = await OrderingQuestion.insertMany(
      orderingQuestions
    );
    console.log(
      `${insertedQuestions.length} ordering questions have been added to the database.`
    );
    return insertedQuestions.length;
  } catch (error) {
    console.error("Error seeding ordering questions:", error);
    throw error;
  }
}

module.exports = { orderingQuestions, seedOrderingQuestions };
