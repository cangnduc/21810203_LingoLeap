module.exports = {
  readingSection: {
    summary: "Example of a reading question",
    value: {
      passage: {
        passageType: "reading",
        title: "The Solar System",
        text: "The solar system consists of the Sun and the objects that orbit it",
      },
      section: "reading",
      questions: [
        {
          type: "multiple_choice",
          questionText: "What is the center of the solar system?",
          answers: ["Earth", "Sun", "Moon", "Mars"],
          correctAnswers: ["Sun", "Mars"],
          difficulty: 3,
          section: "reading",
        },
        {
          type: "single_choice",
          questionText: "Which of the following are planets?",
          answers: ["Mars", "Venus", "Pluto", "Saturn"],
          correctAnswer: "Mars",
          difficulty: 2,
          section: "reading",
        },
        {
          type: "true_false",
          statement: "The Sun is a planet.",
          questionText: "The Sun is a planet.",
          correctAnswer: false,
          difficulty: 1,
          section: "reading",
        },
        {
          type: "fill_in_the_blank",
          section: "reading",
          questionText:
            "Complete the sentence with the correct form of the verb.",
          instruction: "Fill in the blanks with the appropriate words.",
          difficulty: 3,
          text: "If I _____ (know) about the party, I _____ (bring) a gift.",
          blanks: [
            { index: 0, correctAnswer: "had known" },
            { index: 1, correctAnswer: "would have brought" },
          ],
        },
        {
          type: "ordering",
          section: "reading",
          questionText: "Put the following events in the correct order.",
          instruction: "conect the sentences into the correct order.",
          difficulty: 3,
          items: [
            { id: "1", text: "The Sun rises." },
            { id: "2", text: "The Sun sets." },
            { id: "3", text: "The Moon appears." },
            { id: "4", text: "The stars come out." },
          ],
          correctOrder: ["1", "3", "4", "2"],
        },
        {
          type: "matching",
          section: "reading",
          questionText: "Match the words with their definitions.",
          instruction: "Drag and drop the words to their correct definitions.",
          difficulty: 4,
          leftColumn: [
            {
              id: 1,
              text: "Astronomy",
            },
            {
              id: 2,
              text: "Galaxy",
            },
            {
              id: 3,
              text: "Orbit",
            },
            {
              id: 4,
              text: "Constellation",
            },
          ],
          rightColumn: [
            {
              id: "A",
              text: "The study of celestial objects.",
            },
            {
              id: "B",
              text: "A system of stars, dust, and gas bound together by gravity.",
            },
            {
              id: "C",
              text: "The path an object takes around another object.",
            },
            {
              id: "D",
              text: "A group of stars that form a pattern or shape.",
            },
          ],
          correctPairs: [
            { left: 1, right: "A" },
            { left: 2, right: "B" },
            { left: 3, right: "C" },
            { left: 4, right: "D" },
          ],
        },
      ],
    },
  },
  listeningSection: {
    summary: "Example of a listening question",
    value: {
      section: "listening",
      passage: JSON.stringify({
        passageType: "listening",
        title: "A Conversation About Climate Change",
        text: "This is a transcript of the audio...",
      }),
      questions: JSON.stringify([
        {
          type: "true_false",
          statement: "The speaker believes climate change is not real.",
          questionText: "The speaker believes climate change is not real.",
          correctAnswer: false,
          difficulty: 2,
          section: "listening",
        },
        // ... other questions ...
      ]),
      soundFile: "(binary)",
    },
  },
  writingSection: {
    summary: "Example of a writing question",
    value: {},
  },
  speakingSection: {
    summary: "Example of a speaking question",
    value: {},
  },
  generalSection: {
    summary: "Example of a general question",
    value: {
      question: {
        type: "multiple_choice",
        section: "general",
        questionText:
          "Which of the following are examples of rhetorical devices?",
        instruction: "Select all that apply.",
        difficulty: 3,
        answers: ["Ethos", "Pathos", "Logos", "Mythos"],
        correctAnswers: ["Ethos", "Pathos", "Logos"],
      },
    },
  },
  fillInTheBlankOnGeneral: {
    summary: "Example of a fill in the blank question on general section",
    value: {
      question: {
        type: "fill_in_the_blank",
        section: "general",
        questionText: "Complete the paragraph with the correct words.",
        instruction:
          "Fill in the blanks with the appropriate words to complete the story.",
        difficulty: 3,
        text: "On a bright (1) morning, Sarah decided to go for a walk in the park. She put on her comfortable shoes and set out. As she strolled along the path, she noticed a group of children (2) on the playground. Suddenly, a small dog ran past her, chasing after a (3) ball. Sarah couldn't help but smile at the playful scene. She continued her walk, enjoying the fresh air and the sound of birds (4) in the trees. After about an hour, she felt refreshed and decided to head home, feeling (5) by her peaceful morning adventure.",
        blanks: [
          { index: 0, correctAnswer: "sunny" },
          { index: 1, correctAnswer: "playing" },
          { index: 2, correctAnswer: "colorful" },
          { index: 3, correctAnswer: "singing" },
          { index: 4, correctAnswer: "rejuvenated" },
        ],
      },
    },
  },
};
