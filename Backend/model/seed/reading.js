const readingPassage = {
  section: "reading",
  passage: {
    passageType: "listening",
    title: "The Evolution of Artificial Intelligence",
    text: "Artificial Intelligence, or AI, has become an integral part of our daily lives, but its roots stretch back decades. The concept of AI was born in the 1950s, with early pioneers like Alan Turing laying the groundwork for what would become a revolutionary field. Initially, AI was limited to simple tasks and rule-based systems. However, as computing power increased and algorithms became more sophisticated, AI began to tackle more complex problems. Machine learning, a subset of AI, has been particularly transformative. It allows systems to learn from data, improving their performance over time without explicit programming. Today, AI applications range from voice assistants and recommendation systems to autonomous vehicles and advanced medical diagnostics. Despite these advancements, AI still faces challenges, including ethical concerns about privacy, bias, and the potential impact on employment. As we look to the future, the continued evolution of AI promises both exciting opportunities and important societal questions to address.",
    url: "https://example.com/ai-evolution-article",
    audioUrl: "https://example.com/audio/ai-evolution.mp3",

    createdBy: "66eda220f1577aa9a314ab30",
  },
  questions: [
    {
      type: "true_false",
      section: "listening",
      questionText:
        "According to the passage, AI was first conceptualized in the 1980s.",
      instruction:
        "Indicate whether the statement is true or false based on the audio.",
      difficulty: 2,
      statement: "AI was first conceptualized in the 1980s.",
      correctAnswer: false,
      isPublic: true,
      createdBy: "66eda220f1577aa9a314ab30",
    },
    {
      type: "true_false",
      section: "listening",
      questionText:
        "The passage states that Alan Turing was an early pioneer in AI.",
      instruction:
        "Indicate whether the statement is true or false based on the audio.",
      difficulty: 1,
      statement: "Alan Turing was an early pioneer in AI.",
      correctAnswer: true,
      isPublic: true,
      createdBy: "66eda220f1577aa9a314ab30",
    },
    {
      type: "true_false",
      section: "listening",
      questionText:
        "The speaker suggests that AI has not changed much since its inception.",
      instruction:
        "Indicate whether the statement is true or false based on the audio.",
      difficulty: 2,
      statement: "AI has not changed much since its inception.",
      correctAnswer: false,
      isPublic: true,
      createdBy: "66eda220f1577aa9a314ab30",
    },
    {
      type: "true_false",
      section: "listening",
      questionText:
        "Machine learning is described as a subset of AI in the passage.",
      instruction:
        "Indicate whether the statement is true or false based on the audio.",
      difficulty: 2,
      statement: "Machine learning is described as a subset of AI.",
      correctAnswer: true,
      isPublic: true,
      createdBy: "66eda220f1577aa9a314ab30",
    },
    {
      type: "true_false",
      section: "listening",
      questionText:
        "The passage states that AI applications are limited to voice assistants.",
      instruction:
        "Indicate whether the statement is true or false based on the audio.",
      difficulty: 1,
      statement: "AI applications are limited to voice assistants.",
      correctAnswer: false,
      isPublic: true,
      createdBy: "66eda220f1577aa9a314ab30",
    },
    {
      type: "multiple_choice",
      section: "listening",
      questionText:
        "Which of the following is mentioned as an application of AI in the passage?",
      instruction: "Select all that apply based on the audio.",
      difficulty: 2,
      answers: [
        "Voice assistants",
        "Cooking appliances",
        "Autonomous vehicles",
        "Medical diagnostics",
      ],
      correctAnswers: [true, false, true, true],
      isPublic: true,
      createdBy: "66eda220f1577aa9a314ab30",
    },
    {
      type: "multiple_choice",
      section: "listening",
      questionText: "What challenges does AI face according to the passage?",
      instruction: "Select all that apply based on the audio.",
      difficulty: 3,
      answers: [
        "Ethical concerns",
        "Lack of computing power",
        "Privacy issues",
        "Potential impact on employment",
      ],
      correctAnswers: [true, false, true, true],
      isPublic: true,
      createdBy: "66eda220f1577aa9a314ab30",
    },
    {
      type: "multiple_choice",
      section: "listening",
      questionText:
        "According to the passage, what allows AI systems to improve their performance over time?",
      instruction: "Choose the correct answer based on the audio.",
      difficulty: 2,
      answers: [
        "Explicit programming",
        "Machine learning",
        "Human intervention",
        "Increased storage capacity",
      ],
      correctAnswers: [false, true, false, false],
      isPublic: true,
      createdBy: "66eda220f1577aa9a314ab30",
    },
    {
      type: "fill_in_the_blank",
      section: "listening",
      questionText:
        "Complete the sentence based on the information in the passage.",
      instruction: "Fill in the blank with the appropriate word or phrase.",
      difficulty: 2,
      text: "Initially, AI was limited to _______ tasks and rule-based systems.",
      blanks: [{ index: 0, correctAnswer: "simple" }],
      isPublic: true,
      createdBy: "66eda220f1577aa9a314ab30",
    },
    {
      type: "fill_in_the_blank",
      section: "listening",
      questionText:
        "Complete the sentence based on the information in the passage.",
      instruction: "Fill in the blanks with the appropriate words or phrases.",
      difficulty: 3,
      text: "As computing power _______ and algorithms became more _______, AI began to tackle more complex problems.",
      blanks: [
        { index: 0, correctAnswer: "increased" },
        { index: 1, correctAnswer: "sophisticated" },
      ],
      isPublic: true,
      createdBy: "66eda220f1577aa9a314ab30",
    },
    {
      type: "true_false",
      section: "listening",
      questionText:
        "The passage suggests that the evolution of AI is complete and no further advancements are expected.",
      instruction:
        "Indicate whether the statement is true or false based on the audio.",
      difficulty: 2,
      statement:
        "The evolution of AI is complete and no further advancements are expected.",
      correctAnswer: false,
      isPublic: true,
      createdBy: "66eda220f1577aa9a314ab30",
    },
    {
      type: "multiple_choice",
      section: "listening",
      questionText:
        "When did the concept of AI originate, according to the passage?",
      instruction: "Choose the correct answer based on the audio.",
      difficulty: 1,
      answers: ["1930s", "1950s", "1970s", "1990s"],
      correctAnswers: [false, true, false, false],
      isPublic: true,
      createdBy: "66eda220f1577aa9a314ab30",
    },
    {
      type: "true_false",
      section: "listening",
      questionText:
        "The passage states that machine learning requires explicit programming for each task.",
      instruction:
        "Indicate whether the statement is true or false based on the audio.",
      difficulty: 2,
      statement:
        "Machine learning requires explicit programming for each task.",
      correctAnswer: false,
      isPublic: true,
      createdBy: "66eda220f1577aa9a314ab30",
    },
    {
      type: "multiple_choice",
      section: "listening",
      questionText:
        "Which of the following best describes the current state of AI according to the passage?",
      instruction: "Choose the correct answer based on the audio.",
      difficulty: 3,
      answers: [
        "A technology with limited practical applications",
        "A field facing numerous challenges with no clear future",
        "An integral part of daily life with both opportunities and challenges",
        "A concept still in its early stages of development",
      ],
      correctAnswers: [false, false, true, false],
      isPublic: true,
      createdBy: "66eda220f1577aa9a314ab30",
    },
    {
      type: "fill_in_the_blank",
      section: "listening",
      questionText:
        "Complete the sentence based on the information in the passage.",
      instruction: "Fill in the blank with the appropriate word or phrase.",
      difficulty: 2,
      text: "The continued evolution of AI promises both exciting _______ and important societal questions to address.",
      blanks: [{ index: 0, correctAnswer: "opportunities" }],
      isPublic: true,
      createdBy: "66eda220f1577aa9a314ab30",
    },
    {
      type: "true_false",
      section: "listening",
      questionText:
        "According to the passage, AI has no potential impact on employment.",
      instruction:
        "Indicate whether the statement is true or false based on the audio.",
      difficulty: 2,
      statement: "AI has no potential impact on employment.",
      correctAnswer: false,
      isPublic: true,
      createdBy: "66eda220f1577aa9a314ab30",
    },
    {
      type: "multiple_choice",
      section: "listening",
      questionText:
        "Which of the following is NOT mentioned as a challenge faced by AI in the passage?",
      instruction: "Choose the correct answer based on the audio.",
      difficulty: 2,
      answers: [
        "Ethical concerns",
        "Privacy issues",
        "Environmental impact",
        "Potential impact on employment",
      ],
      correctAnswers: [false, false, true, false],
      isPublic: true,
      createdBy: "66eda220f1577aa9a314ab30",
    },
    {
      type: "true_false",
      section: "listening",
      questionText:
        "The passage suggests that AI systems can learn and improve without any human intervention.",
      instruction:
        "Indicate whether the statement is true or false based on the audio.",
      difficulty: 3,
      statement:
        "AI systems can learn and improve without any human intervention.",
      correctAnswer: false,
      isPublic: true,
      createdBy: "66eda220f1577aa9a314ab30",
    },
    {
      type: "multiple_choice",
      section: "listening",
      questionText: "What does the passage imply about the future of AI?",
      instruction: "Choose the best answer based on the audio.",
      difficulty: 3,
      answers: [
        "It will solve all of humanity's problems",
        "It will become less relevant over time",
        "It will continue to evolve and raise important questions",
        "It will be replaced by a superior technology",
      ],
      correctAnswers: [false, false, true, false],
      isPublic: true,
      createdBy: "66eda220f1577aa9a314ab30",
    },
    {
      type: "fill_in_the_blank",
      section: "listening",
      questionText:
        "Complete the sentence based on the information in the passage.",
      instruction: "Fill in the blanks with the appropriate words or phrases.",
      difficulty: 3,
      text: "Machine learning allows systems to learn from _______, improving their performance over time without _______.",
      blanks: [
        { index: 0, correctAnswer: "data" },
        { index: 1, correctAnswer: "explicit programming" },
      ],
      isPublic: true,
      createdBy: "66eda220f1577aa9a314ab30",
    },
  ],
};
module.exports = readingPassage;
