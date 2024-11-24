const testStatisticsSchema = new mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
      unique: true,
    },
    totalAttempts: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }, // percentage
    averageScore: { type: Number, default: 0 },
    scoreDistribution: {
      0_20: { type: Number, default: 0 },
      21_40: { type: Number, default: 0 },
      41_60: { type: Number, default: 0 },
      61_80: { type: Number, default: 0 },
      81_100: { type: Number, default: 0 },
    },
    questionStats: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        correctAnswerRate: { type: Number, default: 0 },
        averageTimeSpent: { type: Number, default: 0 },
        difficultyRating: { type: Number, default: 0 },
      },
    ],
    averageCompletionTime: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
