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
const difficultyLevels = [
  "beginner",
  "elementary",
  "intermediate",
  "upper_intermediate",
  "advanced",
  "expert",
  "master",
];
const testTypes = [
  "ielts",
  "toefl",
  "toeic",
  "cambridge",
  "pte",
  "vstep",
  "vnu_ept",
  "toefl_itp",
  "ielts_life_skills",
  "a1",
  "a2",
  "b1",
  "b2",
  "c1",
  "c2",
];
module.exports = {
  accessTokenTime,
  refreshTokenTime,
  sections,
  questionTypes,
  difficultyLevels,
  testTypes,
};
