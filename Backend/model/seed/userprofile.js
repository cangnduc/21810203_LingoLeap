const mongoose = require("mongoose");
const UserProfile = require("../userProfile.model"); // Direct import, not destructured

const userProfiles = [
  {
    user: "66f16412037a55d2e24c26e2",

    testTaken: [], // Will be populated as user takes tests
    testScore: [85, 92, 78, 88],
    achievements: [
      "First Test Completed",
      "Perfect Score in Grammar",
      "10-Day Streak",
    ],
    preferences: {
      notificationSettings: true,
      studyReminders: true,
    },
    learningGoals: [
      "Achieve IELTS band 8",
      "Master business English",
      "Improve speaking fluency",
    ],
    targetExams: ["IELTS", "TOEFL", "Business English Certificate"],
    progressTracking: {
      vocabularyMastered: 250,
      grammarPointsLearned: 45,
      listeningHoursPracticed: 25,
      speakingSessionsCompleted: 12,
      writingAssignmentsSubmitted: 8,
    },
    deviceInfo: [
      {
        deviceType: "Desktop",
        lastUsed: "2024-03-08T10:00:00Z",
      },
      {
        deviceType: "Mobile",
        lastUsed: "2024-03-08T15:30:00Z",
      },
    ],
    socialConnections: {
      studyBuddies: [],
      following: [],
      followers: [],
    },
    feedbackProvided: [],
    bio: "Software developer with a passion for open-source projects.",
    website: "https://example.com",
    socialLinks: {
      twitter: "https://twitter.com/example",
      linkedin: "https://linkedin.com/in/example",
      github: "https://github.com/example",
    },
  },
];

async function seedUserProfile() {
  try {
    // Clear existing data first (optional)
    await UserProfile.deleteMany({});

    const result = await UserProfile.create(userProfiles);
    console.log("UserProfile seed completed");
    return result;
  } catch (error) {
    console.error("Error seeding user profiles:", error);
    throw error;
  }
}

module.exports = { userProfiles, seedUserProfile };
