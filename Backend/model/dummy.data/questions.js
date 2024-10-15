const {
  Question,
  ReadingPassage,
  ListeningPassage,
} = require("../question.model");
const { Types } = require("mongoose");

const dummyUserId = new Types.ObjectId("66eda220f1577aa9a314ab30");
const dummyReadingPassage = new ReadingPassage({
  title: "The History of the Internet",
  text: "The Internet began as a US Department of Defense project in the 1960s...",
  url: "https://example.com/reading/history-of-internet",
  questions: [],
});

// Dummy Listening Passage
const dummyListeningPassage = new ListeningPassage({
  title: "A Conversation About Climate Change",
  text: "Interviewer: Today, we're talking with Dr. Jane Smith about climate change...",
  url: "https://example.com/listening/climate-change-interview",
  questions: [],
});

// Dummy Questions
const dummyQuestions = [
  new Question({
    section: "reading",
    type: "single_choice",
    questionText: "When did the Internet project begin?",
    instruction: "Choose the best answer.",
    answers: ["1950s", "1960s", "1970s", "1980s"],
    correctAnswer: "1960s",
    difficulty: 2,
    createdBy: dummyUserId,
    readingPassage: dummyReadingPassage._id,
  }),
  new Question({
    section: "reading",
    type: "multiple_choice",
    questionText:
      "Which of the following were mentioned as early purposes of the Internet?",
    instruction: "Select all that apply.",
    answers: [
      "Military communication",
      "Research collaboration",
      "Online shopping",
      "Social networking",
    ],
    correctAnswers: ["Military communication", "Research collaboration"],
    difficulty: 3,
    createdBy: dummyUserId,
    readingPassage: dummyReadingPassage._id,
  }),
  new Question({
    section: "listening",
    type: "true_false",
    questionText:
      "According to Dr. Smith, climate change is a natural phenomenon.",
    instruction: "Decide if the statement is true or false.",
    // Added answers for true_false type
    correctAnswer: false, // Changed to boolean
    difficulty: 2,
    createdBy: dummyUserId,
    listeningPassage: dummyListeningPassage._id, // Added association with listening passage
  }),
  new Question({
    section: "speaking",
    type: "open_ended",
    questionText: "Describe the impact of technology on modern education.",
    instruction: "Speak for 2 minutes on this topic.",
    difficulty: 4,
    createdBy: dummyUserId,
    prompt:
      "Consider both positive and negative effects of technology in the classroom.",
  }),
  new Question({
    section: "writing",
    type: "essay",
    questionText:
      "Do you think social media has more positive or negative effects on society? Explain your viewpoint.",
    instruction: "Write an essay of at least 250 words.",
    difficulty: 5,
    createdBy: dummyUserId,
    prompt: "Include examples to support your argument.",
  }),
  // Adding a fill_in_the_blank question as an example
  new Question({
    section: "reading",
    type: "fill_in_the_blank",
    questionText: "The Internet was initially developed for _______ purposes.",
    instruction: "Fill in the blank with the correct word.",
    answers: ["military", "commercial", "educational", "entertainment"],
    correctAnswer: "military",
    difficulty: 2,
    createdBy: dummyUserId,
    readingPassage: dummyReadingPassage._id,
  }),
];

// Associate questions with passages
dummyReadingPassage.questions = dummyQuestions
  .filter((q) => q.section === "reading")
  .map((q) => q._id);
dummyListeningPassage.questions = dummyQuestions
  .filter((q) => q.section === "listening")
  .map((q) => q._id);

// Function to save dummy data
async function saveDummyData() {
  try {
    // Save passages first
    const savedReadingPassage = await dummyReadingPassage.save();
    const savedListeningPassage = await dummyListeningPassage.save();

    // Update question references with saved passage IDs
    dummyQuestions.forEach((q) => {
      if (q.section === "reading") {
        q.readingPassage = savedReadingPassage._id;
      } else if (q.section === "listening") {
        q.listeningPassage = savedListeningPassage._id;
      }
    });

    // Save questions
    const savedQuestions = await Promise.all(
      dummyQuestions.map((q) => q.save())
    );

    // Update passages with question IDs
    savedReadingPassage.questions = savedQuestions
      .filter((q) => q.section === "reading")
      .map((q) => q._id);
    savedListeningPassage.questions = savedQuestions
      .filter((q) => q.section === "listening")
      .map((q) => q._id);

    // Save updated passages
    await savedReadingPassage.save();
    await savedListeningPassage.save();

    console.log("Dummy data saved successfully!");
  } catch (error) {
    console.error("Error saving dummy data:", error);
  }
}

module.exports = saveDummyData;
