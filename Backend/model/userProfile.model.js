const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    testTaken: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test" }],
    testScore: [
      {
        type: Number,
        min: [0, "Test score cannot be negative"],
        max: [100, "Test score cannot exceed 100"],
      },
    ],
    achievements: [{ type: String }],
    preferences: {
      notificationSettings: { type: Boolean, default: true },
      studyReminders: { type: Boolean, default: true },
    },
    learningGoals: [
      {
        type: String,
        maxlength: [200, "Learning goal cannot exceed 200 characters"],
      },
    ],
    targetExams: [{ type: String }],
    studyPlan: { type: mongoose.Schema.Types.ObjectId, ref: "StudyPlan" },
    progressTracking: {
      vocabularyMastered: { type: Number, default: 0, min: 0 },
      grammarPointsLearned: { type: Number, default: 0, min: 0 },
      listeningHoursPracticed: { type: Number, default: 0, min: 0 },
      speakingSessionsCompleted: { type: Number, default: 0, min: 0 },
      writingAssignmentsSubmitted: { type: Number, default: 0, min: 0 },
    },
    deviceInfo: [
      {
        deviceType: { type: String, required: true },
        lastUsed: { type: Date, default: Date.now },
      },
    ],
    socialConnections: {
      studyBuddies: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    feedbackProvided: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Feedback" },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexing
userProfileSchema.index({ user: 1 }, { unique: true });
userProfileSchema.index({ "socialConnections.studyBuddies": 1 });

// Methods
userProfileSchema.methods.addTestScore = function (score) {
  this.testScore.push(score);
  return this.save();
};

userProfileSchema.methods.updateProgressTracking = function (field, value) {
  if (this.progressTracking.hasOwnProperty(field)) {
    this.progressTracking[field] += value;
    return this.save();
  }
  throw new Error("Invalid progress tracking field");
};

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = UserProfile;
