const mongoose = require("mongoose");

// Base Question Schema
const baseQuestionSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: [
        "reading",
        "listening",
        "speaking",
        "writing",
        "general",
        "vocabulary",
        "grammar",
      ],
      required: [true, "section is required"],
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "Question text cannot exceed 1000 characters"],
    },
    instruction: {
      type: String,
      trim: true,
      maxlength: [500, "Instruction cannot exceed 500 characters"],
    },
    isDraft: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    points: {
      type: Number,
      required: [true, "Question points is required"],
      min: [0, "Points cannot be negative"],
      default: 1,
    },
    difficulty: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Difficulty level is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Question creator is required"],
    },
  },
  { timestamps: true, discriminatorKey: "type" }
);

const BaseQuestion = mongoose.model("Questions", baseQuestionSchema);

// Multiple Choice Question Schema
const multipleChoiceSchema = new mongoose.Schema({
  answers: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length >= 2 && v.length <= 6,
      message:
        "Multiple choice questions must have between 2 and 6 answer options.",
    },
  },
  correctAnswers: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.every((answer) => this.answers.includes(answer));
      },
      message: "correctAnswers must be included in the answers array",
    },
  },
});

const MultipleChoiceQuestion = BaseQuestion.discriminator(
  "multiple_choice",
  multipleChoiceSchema
);

// Single Choice Question Schema
const singleChoiceSchema = new mongoose.Schema({
  answers: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length >= 2 && v.length <= 6,
      message:
        "Single choice questions must have between 2 and 6 answer options.",
    },
  },
  correctAnswer: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return this.answers.includes(v);
      },
      message: "Correct answer must be one of the provided answer options.",
    },
  },
});

const SingleChoiceQuestion = BaseQuestion.discriminator(
  "single_choice",
  singleChoiceSchema
);

// true_false question types can be added similarly...
const trueFalseSchema = new mongoose.Schema({
  correctAnswer: {
    type: Boolean,
    required: true,
  },
});

const TrueFalseQuestion = BaseQuestion.discriminator(
  "true_false",
  trueFalseSchema
);

// Fill in the blank question types can be added similarly...
const fillInTheBlankSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: [1000, "Text cannot exceed 1000 characters"],
  },
  blanks: [
    {
      index: Number,
      correctAnswer: String,
    },
  ],
});

const FillInTheBlankQuestion = BaseQuestion.discriminator(
  "fill_in_the_blank",
  fillInTheBlankSchema
);
// Matching Question Schema
const matchingSchema = new mongoose.Schema({
  leftColumn: [
    {
      id: String,
      text: String,
      //   validate: {
      //     validator: function (v) {
      //       return this.rightColumn.some((right) => right.id === v.id);
      //     },
      //     message: "Left column text must match a text in the right column.",
      //   },
    },
  ],
  rightColumn: [
    {
      id: String,
      text: String,
      //   validate: {
      //     validator: function (v) {
      //       return this.leftColumn.some((left) => left.id === v.id);
      //     },
      //     message: "Right column text must match a text in the left column.",
      //   },
    },
  ],
  correctPairs: [
    {
      left: String,
      right: String,
    },
  ],
});

const MatchingQuestion = BaseQuestion.discriminator("matching", matchingSchema);
// Ordering Question Schema
const orderingSchema = new mongoose.Schema({
  items: [
    {
      id: String,
      text: String,
    },
  ],
  correctOrder: [String],
});

orderingSchema.path("correctOrder").validate(function (v) {
  return v.every((id) => this.items.some((item) => item.id === id));
}, "All items must be included in the provided list.");
const OrderingQuestion = BaseQuestion.discriminator("ordering", orderingSchema);
// Open-Ended Question Schema
const openEndedSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
    maxlength: [1000, "Sample answer cannot exceed 1000 characters"],
  },
});

const OpenEndedQuestion = BaseQuestion.discriminator(
  "open_ended",
  openEndedSchema
);
// Essay Question Schema
const essaySchema = new mongoose.Schema({
  minWords: {
    type: Number,
    required: [true, "Minimum word count is required"],
    min: 100,
    max: 1000,
  },
  maxWords: {
    type: Number,
    required: [true, "Maximum word count is required"],
    min: 100,
    max: 1000,
  },
  rubric: {
    type: String,
    required: [true, "Rubric is required"],
    maxlength: [5000, "Rubric cannot exceed 5000 characters"],
  },
});

const EssayQuestion = BaseQuestion.discriminator("essay", essaySchema);
// Passage Schema (for both Reading and Listening)
const passageSchema = new mongoose.Schema(
  {
    passageType: {
      type: String,
      enum: ["reading", "listening"],
      required: [true, "Passage type is required"],
    },
    title: {
      type: String,
      required: [true, "Passage title is required"],
      trim: true,
      maxlength: [200, "Passage title cannot exceed 200 characters"],
    },
    text: {
      type: String,
      required: [true, "Passage text is required"],
      trim: true,
      maxlength: [5000, "Passage text cannot exceed 5000 characters"],
    },
    url: {
      type: String,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Passage creator is required"],
    },
  },
  { timestamps: true, discriminatorKey: "passageType" }
);

const BasePassage = mongoose.model("BasePassage", passageSchema);
const ReadingPassage = BasePassage.discriminator(
  "reading",
  new mongoose.Schema({})
);
const ListeningPassage = BasePassage.discriminator(
  "listening",
  new mongoose.Schema({
    soundFile: {
      type: String,
      required: [true, "Sound file is required"],
    },
  })
);

module.exports = {
  BaseQuestion,
  MultipleChoiceQuestion,
  SingleChoiceQuestion,
  TrueFalseQuestion,
  FillInTheBlankQuestion,
  MatchingQuestion,
  OrderingQuestion,
  OpenEndedQuestion,
  EssayQuestion,
  BasePassage,
  ReadingPassage,
  ListeningPassage,
};
// Sample inputs for each question type

// 1. Multiple Choice Question
const multipleChoiceInput = {
  type: "multiple_choice",
  section: "reading",
  questionText: "Which of the following are primary colors?",
  instruction: "Select all that apply.",
  difficulty: 2,
  answers: ["Red", "Green", "Blue", "Yellow"],
  correctAnswers: ["Green", "Blue"],
  isPublic: true,
  points: 1,
  createdBy: "60a3e5b9f5e6a81234567890", // ObjectId of the user
};

// 2. Single Choice Question
const singleChoiceInput = {
  type: "single_choice",
  section: "general",
  questionText: "What is the capital of France?",
  instruction: "Choose the correct answer.",
  difficulty: 1,
  answers: ["London", "Berlin", "Paris", "Madrid"],
  correctAnswer: "Paris",
  isPublic: true,
  createdBy: "60a3e5b9f5e6a81234567890",
};

// 3. Fill in the Blank Question
const fillInTheBlankInput = {
  type: "fill_in_the_blank",
  section: "writing",
  questionText: "Complete the sentence with the correct form of the verb.",
  instruction: "Fill in the blanks with the appropriate words.",
  difficulty: 3,
  text: "If I _____ (know) about the party, I _____ (bring) a gift.",
  blanks: [
    { index: 0, correctAnswer: "had known" },
    { index: 1, correctAnswer: "would have brought" },
  ],
  isPublic: true,
  createdBy: "60a3e5b9f5e6a81234567890",
};

// 4. Matching Question
const matchingInput = {
  type: "matching",
  section: "vocabulary",
  questionText: "Match the words with their definitions.",
  instruction:
    "Drag the items from the right column to match the items in the left column.",
  difficulty: 3,
  leftColumn: [
    { id: 1, text: "Exuberant" },
    { id: 2, text: "Melancholy" },
    { id: 3, text: "Stoic" },
  ],
  rightColumn: [
    { id: "A", text: "Joyfully unrestrained" },
    { id: "B", text: "Sad or depressed" },
    { id: "C", text: "Showing little emotion" },
  ],
  correctPairs: [
    { left: 1, right: "A" },
    { left: 2, right: "B" },
    { left: 3, right: "C" },
  ],
  points: 1,
};

// 5. True/False Question
const trueFalseInput = {
  type: "true_false",
  section: "listening",
  questionText:
    "The speaker mentioned that climate change is a recent phenomenon.",
  instruction:
    "Indicate whether the statement is true or false based on the audio.",
  difficulty: 2,
  statement: "Climate change is a recent phenomenon.",
  correctAnswer: false,

  isPublic: true,
  createdBy: "60a3e5b9f5e6a81234567890",
};

// 6. Open-Ended Question
const openEndedInput = {
  type: "open_ended",
  section: "speaking",
  questionText: "Describe your favorite holiday tradition.",
  instruction:
    "Speak for no more than 1 minute about your favorite holiday tradition.",
  difficulty: 4,
  maxWords: 150,
  sampleAnswer:
    "One of my favorite holiday traditions is gathering with my family on Christmas Eve. We always prepare a special dinner together, sharing stories and laughter as we cook. After the meal, we exchange one small gift each, saving the rest for Christmas morning. This tradition brings us closer as a family and creates lasting memories.",
  isPublic: true,
  createdBy: "60a3e5b9f5e6a81234567890",
};

// 7. Essay Question
const essayInput = {
  type: "essay",
  section: "writing",
  questionText:
    "Do you think technology has had a positive or negative impact on interpersonal relationships? Explain your viewpoint with examples.",
  instruction:
    "Write an essay of 250-300 words discussing the impact of technology on interpersonal relationships.",
  difficulty: 5,
  minWords: 250,
  maxWords: 300,
  rubric:
    "1. Clarity of argument (0-5 points)\n2. Use of specific examples (0-5 points)\n3. Grammar and vocabulary usage (0-5 points)\n4. Organization and coherence (0-5 points)\n5. Adherence to word limit (0-5 points)",
  isPublic: true,
  createdBy: "60a3e5b9f5e6a81234567890",
};

// 8. Ordering Question
const orderingInput = {
  type: "ordering",
  section: "reading",
  questionText: "Arrange the following sentences to form a coherent paragraph.",
  instruction: "Drag and drop the sentences into the correct order.",
  difficulty: 4,
  items: [
    {
      id: "1",
      text: "However, with proper planning and execution, these challenges can be overcome.",
    },
    {
      id: "2",
      text: "Urban gardening is becoming increasingly popular in cities around the world.",
    },
    {
      id: "3",
      text: "It offers numerous benefits, including fresh produce and improved air quality.",
    },
    {
      id: "4",
      text: "Space constraints and pollution are common obstacles faced by urban gardeners.",
    },
  ],
  correctOrder: ["2", "3", "4", "1"],
  isPublic: true,
  createdBy: "60a3e5b9f5e6a81234567890",
};

// Sample input for a Reading Passage
const readingPassageInput = {
  passageType: "reading",
  title: "The Rise of Artificial Intelligence",
  text: "Artificial Intelligence (AI) has made significant strides in recent years, transforming various aspects of our daily lives. From virtual assistants like Siri and Alexa to advanced algorithms that power social media feeds, AI is becoming increasingly prevalent. While these advancements bring numerous benefits, they also raise important ethical questions about privacy, job displacement, and the future of human-machine interaction. As AI continues to evolve, it is crucial for society to engage in ongoing discussions about its implications and to establish guidelines for its responsible development and use.",
  url: "https://example.com/ai-article",
  questions: [],
  createdBy: "60a3e5b9f5e6a81234567890",
};

// Sample input for a Listening Passage
const listeningPassageInput = {
  passageType: "listening",
  title: "The Importance of Ocean Conservation",
  text: "This is a transcript of the audio passage about ocean conservation...",
  url: "https://example.com/ocean-conservation-article",
  audioUrl: "https://example.com/audio/ocean-conservation.mp3",
  questions: [],
  createdBy: "60a3e5b9f5e6a81234567890",
};

const typeList = [
  "multiple_choice",
  "single_choice",
  "true_false",
  "fill_in_the_blank",
  "matching",
  "ordering",
  "open_ended",
  "essay",
];
const sectionList = [
  "reading",
  "listening",
  "speaking",
  "writing",
  "general",
  "vocabulary",
  "grammar",
];
const sectionToTypeMap = {
  reading: [
    "single_choice",
    "multiple_choice",
    "fill_in_the_blank",
    "true_false",
    "matching",
  ],
  listening: [
    "single_choice",
    "multiple_choice",
    "fill_in_the_blank",
    "true_false",
    "matching",
  ],
  speaking: ["open_ended", "essay"],
  writing: ["essay", "fill_in_the_blank", "open_ended"],
  general: [
    "single_choice",
    "multiple_choice",
    "fill_in_the_blank",
    "true_false",
  ],
  vocabulary: ["multiple_choice", "fill_in_the_blank", "matching"],
  grammar: ["multiple_choice", "fill_in_the_blank", "true_false", "matching"],
};
