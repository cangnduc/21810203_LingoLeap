const TestAttempt = require("../testAttempt.model");
const TestResult = require("../testResult.model");
const { BaseQuestion } = require("../question.model.v1");
const Test = require("../test.model.v1");
const { generateCompletion } = require("../../helpers/openaiApi");
class TestAttemptFunction {
  async calculateResult(testAttempt) {
    // Load the test with populated sections and questions
    const test = await Test.findById(testAttempt.test)
      .select("sections totalPossibleScore testType")
      .populate({
        path: "sections.passages._id",
        model: "BasePassage",
        select: "questions points -_id",
      })
      .lean();

    // Load all questions in test.sections.questions and test.sections.passages.questions
    const questionIds = [
      ...test.sections.flatMap((section) =>
        section.questions?.map((question) => question._id)
      ),
      ...test.sections.flatMap((section) =>
        section.passages?.flatMap((passage) =>
          passage._id.questions?.map((questionId) => questionId)
        )
      ),
    ].filter(Boolean); // Filter out any undefined values
    //console.log("questionIds", questionIds);
    const questions = await BaseQuestion.find({
      _id: { $in: questionIds },
    }).select(
      "_id type correctAnswer correctAnswers correctOrder correctPairs questionText type blanks"
    );
    // Create a map for quick access to questions
    const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));
    //console.log("questionMap", questionMap);
    // Create a map for passage questions points
    const questionPointsMap = new Map();

    // Calculate points for regular questions
    test.sections.forEach((section) => {
      section.questions?.forEach((question) => {
        questionPointsMap.set(question._id.toString(), question.points || 1);
      });
    });

    // Calculate points for passage questions
    test.sections.forEach((section) => {
      section.passages?.forEach((passage) => {
        const questionsCount = passage._id.questions.length;
        const pointsPerQuestion = passage.points / questionsCount;

        passage._id.questions.forEach((questionId) => {
          questionPointsMap.set(questionId.toString(), pointsPerQuestion);
        });
      });
    });

    const testResult = new TestResult();
    testResult.writingQuestionResults = [];
    let totalScore = 0;
    let totalQuestions = 0;
    const sectionScores = [];
    const questionScores = [];

    for (const section of test.sections) {
      let sectionScore = 0;
      let sectionQuestions = 0;

      // Process regular questions
      if (section.questions) {
        for (const question of section.questions) {
          const answer = testAttempt.answers.find(
            (a) => a.question.toString() === question._id.toString()
          );
          const points = questionPointsMap.get(question._id.toString());
          let score = 0;

          if (answer) {
            const questionData = questionMap.get(question._id.toString());
            score = await this.calculateScore(
              questionData,
              answer,
              points,
              test.testType
            );

            // Store writing question results if it's an essay
            if (questionData.type === "essay" && answer.evaluation) {
              testResult.writingQuestionResults.push({
                question: question._id,
                ...answer.evaluation,
              });
            }

            questionScores.push({
              question: question._id,
              score: score,
            });
            sectionScore += score;
          } else {
            questionScores.push({
              question: question._id,
              score: 0,
            });
          }

          sectionQuestions++;
          totalQuestions++;
        }
      }

      // Process passage questions
      if (section.passages) {
        for (const passage of section.passages) {
          for (const questionId of passage._id.questions) {
            const answer = testAttempt.answers.find(
              (a) => a.question.toString() === questionId.toString()
            );
            const points = questionPointsMap.get(questionId.toString());
            let score = 0;

            if (answer) {
              const questionData = questionMap.get(questionId.toString());
              score = await this.calculateScore(questionData, answer, points);

              questionScores.push({
                _id: questionId,
                score: score,
              });
              sectionScore += score;
            } else {
              questionScores.push({
                _id: questionId,
                score: 0,
              });
            }

            sectionQuestions++;
            totalQuestions++;
          }
        }
      }

      sectionScores.push({
        sectionType: section.name,
        score: sectionScore,
        totalQuestions: sectionQuestions,
      });

      totalScore += sectionScore;
    }

    console.log("saving test result");
    testResult.testAttempt = testAttempt._id;
    testResult.user = testAttempt.user;
    testResult.test = testAttempt.test;
    // Round total score to 2 decimal places
    testResult.totalScore = totalScore.toFixed(2);
    testResult.maxTotalScore = test.totalPossibleScore;
    testResult.scorePercentage = (
      (totalScore / test.totalPossibleScore) *
      100
    ).toFixed(2);
    testResult.totalQuestions = totalQuestions;
    testResult.sectionScores = sectionScores;
    testResult.questionScores = questionScores;

    await testResult.save();

    testAttempt.result = testResult._id;
    testAttempt.totalScore = totalScore;
    await testAttempt.save();

    return testResult;
  }

  async calculateScore(questionData, answer, point, testType) {
    switch (questionData.type) {
      case "single_choice":
        return answer.answer === questionData.correctAnswer ? point : 0;
      case "true_false":
        return answer.answer === questionData.correctAnswer ? point : 0;
      case "multiple_choice":
        const correctAnswers = new Set(questionData.correctAnswers);
        const answers = new Set(answer.answer);
        const correctCount = [...correctAnswers].filter((a) =>
          answers.has(a)
        ).length;
        const incorrectCount = answers.size - correctCount;
        const multipleChoiceScore =
          Math.max(0, (correctCount - incorrectCount) / correctAnswers.size) *
          point;
        return Math.round(multipleChoiceScore * 100) / 100;

      case "matching":
        const correctPairs = questionData.correctPairs;
        const userPairs = answer.answer;
        let matchingCorrectCount = 0;

        for (const correctPair of correctPairs) {
          const userPair = userPairs.find(
            (pair) => pair.left === correctPair.left
          );
          if (userPair && userPair.right === correctPair.right) {
            matchingCorrectCount++;
          }
        }

        const matchingScore =
          (matchingCorrectCount / correctPairs.length) * point;
        return Math.round(matchingScore * 100) / 100;

      case "ordering":
        const correctOrder = questionData.correctOrder;
        const userOrder = answer.answer;

        if (
          !Array.isArray(userOrder) ||
          userOrder.length !== correctOrder.length
        ) {
          return 0;
        }

        let correctPositions = 0;
        for (let i = 0; i < correctOrder.length; i++) {
          if (correctOrder[i] === userOrder[i]) {
            correctPositions++;
          }
        }

        const orderingScore = (correctPositions / correctOrder.length) * point;
        return Math.round(orderingScore * 100) / 100;
      case "essay":
        console.log("test type", testType);
        // const essayEvaluation = await generateCompletion(
        //   "essay",
        //   questionData.questionText,
        //   answer.answer,
        //   testType
        // );
        // const essayEvaluationJson = JSON.parse(essayEvaluation);
        const essayEvaluationJson = {
          aspects: [
            {
              aspect: "Content & Relevance",
              score: 1,
              feedback:
                "The essay does not address the prompt about the impact of technology on interpersonal relationships, focusing instead on marine biology and electroreception.",
            },
            {
              aspect: "Structure & Organization",
              score: 3,
              feedback:
                "While the essay has a clear opening and a focused subject, it does not follow the structure relevant to the prompt provided. It is well-organized for a different topic.",
            },
            {
              aspect: "Language Use & Grammar",
              score: 4,
              feedback:
                "The language use demonstrates good control of grammar and a varied vocabulary, fitting for a scientific discussion.",
            },
            {
              aspect: "Clarity & Cohesion",
              score: 2,
              feedback:
                "The essay presents a coherent discussion on electroreception, but lacks relevance and cohesion with the assigned topic, making it confusing in this context.",
            },
            {
              aspect: "Creativity & Originality",
              score: 2,
              feedback:
                "The topic of electroreception is intriguing and potentially creative, but its application is misplaced given the prompt's focus.",
            },
          ],
          summary_feedback:
            "The essay is well-written regarding grammar and language but fails to address the provided prompt about technology's impact on interpersonal relationships. The content is significantly off-topic, and restructuring is required to meet the assignment objectives. Interesting scientific discussion, but inappropriately focused for this task.",
        };
        console.log("essayEvaluationJson", essayEvaluationJson);
        if (!essayEvaluationJson || !essayEvaluationJson.aspects) {
          return 0;
        }

        // Calculate score
        let totalScore = 0;
        let scoreCount = 0;

        for (const aspect of essayEvaluationJson.aspects) {
          if (aspect.score) {
            totalScore += aspect.score;
            scoreCount++;
          }
        }

        const finalScore = scoreCount > 0 ? totalScore / scoreCount : 0;

        // Store the evaluation data in the answer object
        answer.evaluation = {
          aspects: essayEvaluationJson.aspects,
          summary_feedback: essayEvaluationJson.summary_feedback,
          totalScore: finalScore,
        };

        return finalScore;
      default:
        return 0;
    }
  }

  async start(testAttempt, test) {
    testAttempt.startTime = new Date();
    testAttempt.maxEndTime = new Date(
      testAttempt.startTime.getTime() + test.duration * 60000
    );
    return testAttempt.save();
  }

  isTimeUp(testAttempt) {
    return new Date() >= testAttempt.maxEndTime;
  }

  async complete(testAttempt) {
    testAttempt.status = "completed";
    testAttempt.endTime = new Date();
    await testAttempt.save();
    return testAttempt;
  }
}

module.exports = new TestAttemptFunction();
