const { OpenEndedQuestion } = require("../question.model.v1");

const openEndedQuestions = [];

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
