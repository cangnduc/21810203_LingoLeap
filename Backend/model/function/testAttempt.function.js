const TestAttempt = require("../testAttempt.model");
const TestResult = require("../testResult.model");
const { BaseQuestion } = require("../question.model.v1");
const Test = require("../test.model.v1");
const { generateCompletion } = require("../../helpers/openaiApi");

class TestAttemptFunction {
  sanitizeJsonString(jsonString) {
    if (typeof jsonString !== "string") {
      return "{}";
    }

    try {
      // First attempt to detect if it's already a valid JSON
      JSON.parse(jsonString);
      return jsonString;
    } catch (e) {
      // If it's not valid JSON, proceed with cleaning
      const cleaned = jsonString
        .replace(/^\uFEFF/, "")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
        // Additional safety replacements
        .replace(/\\/g, "\\\\") // Escape backslashes
        .replace(/\b/g, "\\b") // Replace word boundaries
        .replace(/\f/g, "\\f") // Replace form feeds
        .trim();

      // Ensure the string starts and ends with curly braces
      if (!cleaned.startsWith("{")) {
        const firstBrace = cleaned.indexOf("{");
        if (firstBrace !== -1) {
          return cleaned.slice(firstBrace);
        }
        return "{}";
      }

      return cleaned;
    }
  }

  async calculateResult(testAttempt) {
    // Load the test with populated sections and questions
    const test = await Test.findById(testAttempt.test)
      .select("sections totalPossibleScore testType participantCount")
      .populate({
        path: "sections.passages._id",
        model: "BasePassage",
        select: "questions points -_id",
      });

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

    let testResult = await TestResult.findOne({ testAttempt: testAttempt._id });
    if (!testResult) {
      testResult = new TestResult({
        speakingResult: {
          fluency: 0,
          pronunciation: 0,
          vocabulary: 0,
          overallCommunication: 0,
          totalScore: 0,
          feedback: "",
        },
      });
    }
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
          const questionData = questionMap.get(question._id.toString());

          if (answer) {
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
            if (questionData.type === "open_ended") {
              console.log("points", points);
              const tempScore =
                (testResult.speakingResult.fluency +
                  testResult.speakingResult.pronunciation +
                  testResult.speakingResult.vocabulary +
                  testResult.speakingResult.overallCommunication) /
                4;
              score = (tempScore / 100) * points;
            }

            questionScores.push({
              _id: question._id,
              score: score,
            });
            sectionScore += score;
          } else {
            questionScores.push({
              _id: question._id,
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
    testResult.totalScore = Number(totalScore || 0).toFixed(2);
    testResult.maxTotalScore = test.totalPossibleScore || 0;
    // Add safety check for division by zero
    const scorePercentage =
      test.totalPossibleScore > 0
        ? ((totalScore || 0) / test.totalPossibleScore) * 100
        : 0;
    testResult.scorePercentage = scorePercentage.toFixed(2);
    testResult.totalQuestions = totalQuestions;
    testResult.sectionScores = sectionScores.map((section) => ({
      ...section,
      score: Number(section.score || 0),
      totalQuestions: Number(section.totalQuestions || 0),
    }));
    testResult.questionScores = questionScores.map((question) => ({
      _id: question._id,
      score: Number(question.score || 0),
    }));

    await testResult.save();

    testAttempt.result = testResult._id;
    testAttempt.totalScore = Number(totalScore || 0);
    await testAttempt.save();
    //update the test.participantCount

    test.participantCount = (test.participantCount || 0) + 1;
    await test.save();
    return testResult;
  }

  async calculateScore(questionData, answer, point, testType) {
    // Add safety check for point parameter
    point = Number(point || 0);

    switch (questionData.type) {
      case "fill_in_the_blank":
        console.log("answer", answer);
        console.log("questionData", questionData);
        const pointPerBlank = point / questionData.blanks.length;
        let totalPoints = 0;
        for (let i = 0; i < questionData.blanks.length; i++) {
          const blank = questionData.blanks[i];
          const userAnswer = answer.answer[i];
          if (blank.correctAnswer === userAnswer) {
            totalPoints += pointPerBlank;
          }
        }
        return Math.round(totalPoints * 100) / 100;
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
        const essayEvaluation = await generateCompletion(
          answer.answer,
          questionData.questionText,
          point,
          testType
        );
        let essayEvaluationJson = null;
        try {
          const sanitizedJson = this.sanitizeJsonString(essayEvaluation);
          essayEvaluationJson = JSON.parse(sanitizedJson);

          // Check if we got an empty object
          if (Object.keys(essayEvaluationJson).length === 0) {
            console.error("Received empty JSON after sanitization");
            return 0;
          }
        } catch (error) {
          console.error("Error parsing essayEvaluation", error);
          console.error("Original string:", essayEvaluation);
          console.error(
            "Sanitized string:",
            this.sanitizeJsonString(essayEvaluation)
          );
          return 0;
        }
        const sampleEssayEvaluationJson = {
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
      case "open_ended":
        // Ensure we return a valid number for open_ended questions
        return 0;
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
