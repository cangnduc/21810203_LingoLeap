const dummyUserId = "66eda220f1577aa9a314ab30";
const speakingQuestions = [
  {
    section: "speaking",
    type: "open_ended",
    questionText: "Describe the impact of technology on modern education.",
    instruction: "Speak for 2 minutes on this topic.",
    difficulty: 4,
    createdBy: dummyUserId,
    prompt:
      "Consider both positive and negative effects of technology in the classroom.",
  },
  {
    section: "speaking",
    type: "open_ended",
    questionText: "What are the benefits of learning a second language?",
    instruction: "Speak for 2 minutes on this topic.",
    difficulty: 3,
    createdBy: dummyUserId,
    prompt: "Consider both personal and professional benefits.",
  },
];
const { OpenEndedQuestion } = require("../question.model.v1");
async function seedSpeakingQuestions() {
  try {
    const result = await OpenEndedQuestion.insertMany(speakingQuestions);
    return result;
  } catch (error) {
    console.error(error);
  }
}
module.exports = { speakingQuestions, seedSpeakingQuestions };
