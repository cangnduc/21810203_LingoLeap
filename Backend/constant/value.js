const accessTokenTime = 6 * 60 * 60 * 1000; // 6 hours
const refreshTokenTime = 7 * 24 * 60 * 60 * 1000; // 7 days
const sections = [
  "reading",
  "listening",
  "writing",
  "general",
  "speaking",
  "grammar",
  "vocabulary",
];

const questionTypes = [
  "multiple_choice",
  "single_choice",
  "true_false",
  "fill_in_the_blank",
  "matching",
  "ordering",
  "open_ended",
  "essay",
];
const difficultyLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
module.exports = {
  accessTokenTime,
  refreshTokenTime,
  sections,
  questionTypes,
  difficultyLevels,
};
