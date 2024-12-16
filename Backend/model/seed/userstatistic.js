const mongoose = require("mongoose");
const UserStatistic = require("../userStatistic.model"); // Direct import, not destructured

const userStatistics = [
  {
    user: "66f16412037a55d2e24c26e2",
    testsCompleted: {
      total: 15,
      byDifficulty: {
        easy: 6,
        medium: 7,
        hard: 2,
      },
      byType: {
        practice: 12,
        exam: 3,
      },
    },
    averageScores: {
      overall: 85.5,
      bySection: {
        reading: 88.0,
        listening: 82.5,
        writing: 84.0,
        speaking: 87.5,
      },
    },
    questionStats: {
      totalAttempted: 300,
      correctAnswers: 255,
      byType: {
        single_choice: {
          attempted: 150,
          correct: 130,
        },
        multiple_choice: {
          attempted: 100,
          correct: 85,
        },
        fill_in_the_blank: {
          attempted: 50,
          correct: 40,
        },
      },
    },
    timeStats: {
      totalTimeSpent: 1800, // 30 hours in minutes
      averageTestDuration: 45, // 45 minutes per test
      averageQuestionTime: 90, // 90 seconds per question
    },
    progressOverTime: [
      {
        date: "2024-03-01T00:00:00Z",
        score: 82,
        testId: "66f16412037a55d2e24c26f1",
      },
      {
        date: "2024-03-05T00:00:00Z",
        score: 85,
        testId: "66f16412037a55d2e24c26f2",
      },
      {
        date: "2024-03-08T00:00:00Z",
        score: 88,
        testId: "66f16412037a55d2e24c26f3",
      },
    ],
    lastUpdated: "2024-03-08T16:00:00Z",
  },
];

async function seedUserStatistic() {
  try {
    // Clear existing data first (optional)
    await UserStatistic.deleteMany({});

    const result = await UserStatistic.create(userStatistics);
    console.log("UserStatistic seed completed");
    return result;
  } catch (error) {
    console.error("Error seeding user statistics:", error);
    throw error;
  }
}

module.exports = { userStatistics, seedUserStatistic };
