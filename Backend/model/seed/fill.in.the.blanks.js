const mongoose = require("mongoose");
const { FillInTheBlankQuestion } = require("../question.model.v1");
const instanceMongodb = require("../../config/mongoose.db");

const fillInTheBlankQuestions = [
  {
    type: "fill_in_the_blank",
    section: "general",
    questionText: "Complete the paragraph with the correct form of the verbs.",
    instruction: "Fill in the blanks with the appropriate words.",
    difficulty: 3,
    text: "If I (1) (know) about the party last week, I (2) (bring) a gift. Unfortunately, I (3) (be) unaware of the celebration, so I (4) (not prepare) anything special. Next time, I hope someone (5) (inform) me in advance so I can participate fully.",
    blanks: [
      { index: 0, correctAnswer: "had known" },
      { index: 1, correctAnswer: "would have brought" },
      { index: 2, correctAnswer: "was" },
      { index: 3, correctAnswer: "didn't prepare" },
      { index: 4, correctAnswer: "will inform" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "general",
    questionText: "Complete the paragraph with the correct phrasal verbs.",
    instruction: "Fill in the blanks with the appropriate words.",
    difficulty: 2,
    text: "The teacher asked the students to (1) their homework before leaving the classroom. She also reminded them to (2) the assignment details in their planners and to (3) any questions they might have. Finally, she encouraged them to (4) the extra credit work if they wanted to improve their grades, and to (5) their projects next week.",
    blanks: [
      { index: 0, correctAnswer: "hand in" },
      { index: 1, correctAnswer: "write down" },
      { index: 2, correctAnswer: "speak up" },
      { index: 3, correctAnswer: "take on" },
      { index: 4, correctAnswer: "turn in" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "general",
    questionText: "Complete the paragraph with the correct prepositions.",
    instruction: "Fill in the blanks with the appropriate words.",
    difficulty: 2,
    text: "The curious cat jumped (1) the kitchen table and knocked (2) the expensive vase. It then darted (3) the living room, hiding (4) the couch. When the owner came home, she looked (5) the mess with dismay.",
    blanks: [
      { index: 0, correctAnswer: "onto" },
      { index: 1, correctAnswer: "over" },
      { index: 2, correctAnswer: "into" },
      { index: 3, correctAnswer: "behind" },
      { index: 4, correctAnswer: "at" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "general",
    questionText: "Complete the paragraph with the correct articles.",
    instruction:
      "Fill in the blanks with the appropriate articles (a, an, the) or leave blank if no article is needed.",
    difficulty: 2,
    text: "On (1) sunny afternoon, we decided to explore (2) local park. As we entered, (3) group of children were playing near (4) fountain. We found (5) quiet spot under (6) old oak tree to have our picnic. Suddenly, we saw (7) ice cream vendor pushing his cart along (8) path, and couldn't resist buying (9) delicious treat to enjoy in (10) warm sunshine.",
    blanks: [
      { index: 0, correctAnswer: "a" },
      { index: 1, correctAnswer: "the" },
      { index: 2, correctAnswer: "a" },
      { index: 3, correctAnswer: "the" },
      { index: 4, correctAnswer: "a" },
      { index: 5, correctAnswer: "an" },
      { index: 6, correctAnswer: "an" },
      { index: 7, correctAnswer: "the" },
      { index: 8, correctAnswer: "a" },
      { index: 9, correctAnswer: "the" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "general",
    questionText:
      "Complete the paragraph with the correct form of the adjectives.",
    instruction:
      "Fill in the blanks with the appropriate comparative or superlative form of the adjectives given in parentheses.",
    difficulty: 2,
    text: "My trip to New York was one of the (1) (exciting) experiences of my life. The city was even (2) (busy) than I had imagined, with streets that seemed (3) (crowded) during rush hour than our entire town. The buildings were (4) (tall) than any I had ever seen, making me feel (5) (small) than a ant. Despite the chaos, I found the city (6) (fascinating) than I expected, and the people were much (7) (friendly) than their reputation suggested.",
    blanks: [
      { index: 0, correctAnswer: "most exciting" },
      { index: 1, correctAnswer: "busier" },
      { index: 2, correctAnswer: "more crowded" },
      { index: 3, correctAnswer: "taller" },
      { index: 4, correctAnswer: "smaller" },
      { index: 5, correctAnswer: "more fascinating" },
      { index: 6, correctAnswer: "friendlier" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "general",
    questionText:
      "Complete the paragraph with the correct relative pronouns and adverbs.",
    instruction:
      "Fill in the blanks with the appropriate relative pronouns (who, whom, whose, which, that) or relative adverbs (when, where, why).",
    difficulty: 3,
    text: "The old mansion, (1) had stood abandoned for years, was finally being renovated by a couple (2) dream was to turn it into a bed and breakfast. They hired a contractor (3) reputation for restoring historic buildings was well-known. The day (4) the renovation began was exciting for the whole town. Many locals gathered to watch, curious about the secrets (5) the old house might reveal. The attic, (6) the previous owners had left many antiques, turned out to be a treasure trove of historical artifacts.",
    blanks: [
      { index: 0, correctAnswer: "which" },
      { index: 1, correctAnswer: "whose" },
      { index: 2, correctAnswer: "whose" },
      { index: 3, correctAnswer: "when" },
      { index: 4, correctAnswer: "that" },
      { index: 5, correctAnswer: "where" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "general",
    questionText: "Complete the paragraph with the correct modal verbs.",
    instruction: "Fill in the blanks with the appropriate words.",
    difficulty: 2,
    text: "When planning a trip, you (1) consider various factors. First, you (2) decide on a destination that fits your budget and interests. You (3) book your accommodations in advance, especially during peak seasons. If you're traveling internationally, you (4) check if you need a visa. Lastly, you (5) always have a backup plan in case of unexpected changes.",
    blanks: [
      { index: 0, correctAnswer: "should" },
      { index: 1, correctAnswer: "must" },
      { index: 2, correctAnswer: "might" },
      { index: 3, correctAnswer: "may" },
      { index: 4, correctAnswer: "should" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "general",
    questionText:
      "Complete the paragraph with the correct form of the verb in passive voice.",
    instruction: "Fill in the blanks with the appropriate words.",
    difficulty: 3,
    text: "The new company policy (1) (implement) next month, and all employees (2) (inform) about the changes via email. Training sessions (3) (conduct) to ensure everyone understands the new procedures. Any concerns or questions (4) (address) during these sessions. After the implementation, the policy's effectiveness (5) (review) quarterly.",
    blanks: [
      { index: 0, correctAnswer: "will be implemented" },
      { index: 1, correctAnswer: "will be informed" },
      { index: 2, correctAnswer: "will be conducted" },
      { index: 3, correctAnswer: "will be addressed" },
      { index: 4, correctAnswer: "will be reviewed" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "general",
    questionText: "Complete the paragraph with the correct linking words.",
    instruction: "Fill in the blanks with the appropriate words.",
    difficulty: 2,
    text: "The movie had its strengths and weaknesses. (1), the cinematography was stunning and the acting was superb. (2), the plot was somewhat predictable and the pacing was slow at times. (3), the film's message was powerful and thought-provoking. (4), despite its flaws, it was a worthwhile watch. (5), I would recommend it to fans of the genre.",
    blanks: [
      { index: 0, correctAnswer: "On one hand" },
      { index: 1, correctAnswer: "However" },
      { index: 2, correctAnswer: "Nevertheless" },
      { index: 3, correctAnswer: "Overall" },
      { index: 4, correctAnswer: "Therefore" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "general",
    questionText:
      "Complete the paragraph with the correct form of the verbs in reported speech.",
    instruction: "Fill in the blanks with the appropriate words.",
    difficulty: 3,
    text: "During the interview, Sarah recounted her experience at the conference. She said that she (1) (arrive) early on the first day and (2) (be) impressed by the organization. She mentioned that she (3) (attend) several workshops where she (4) (learn) new techniques. Sarah also reported that she (5) (meet) many interesting people and (6) (exchange) contact information with them.",
    blanks: [
      { index: 0, correctAnswer: "had arrived" },
      { index: 1, correctAnswer: "had been" },
      { index: 2, correctAnswer: "had attended" },
      { index: 3, correctAnswer: "had learned" },
      { index: 4, correctAnswer: "had met" },
      { index: 5, correctAnswer: "had exchanged" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "general",
    questionText: "Complete the paragraph with the correct form of the words.",
    instruction: "Fill in the blanks with the appropriate words.",
    difficulty: 3,
    text: "In today's rapidly changing world, adaptability is crucial. The (1) (important) skill one can possess is the ability to learn continuously. By (2) (maintain) an open mind, we can (3) (embrace) new ideas and technologies. This (4) (flexible) approach allows us to (5) (overcome) challenges and seize opportunities in both our personal and professional lives.",
    blanks: [
      { index: 0, correctAnswer: "most important" },
      { index: 1, correctAnswer: "maintaining" },
      { index: 2, correctAnswer: "embrace" },
      { index: 3, correctAnswer: "flexible" },
      { index: 4, correctAnswer: "overcome" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "grammar",
    questionText:
      "Complete the sentences with the correct tense of the verbs in parentheses.",
    instruction:
      "Fill in the blanks with the appropriate form of the verbs given in parentheses.",
    difficulty: 2,
    text: "1. By the time we (1) (arrive) at the party, most of the guests (2) (leave) already.\n2. I (3) (study) English for five years before I (4) (move) to London.\n3. If I (5) (know) about the exam, I (6) (prepare) better.",
    blanks: [
      { index: 0, correctAnswer: "arrived" },
      { index: 1, correctAnswer: "had left" },
      { index: 2, correctAnswer: "had been studying" },
      { index: 3, correctAnswer: "moved" },
      { index: 4, correctAnswer: "had known" },
      { index: 5, correctAnswer: "would have prepared" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "grammar",
    questionText: "Complete the sentences with the correct modal verbs.",
    instruction:
      "Fill in the blanks with the appropriate modal verbs (can, could, may, might, must, should, would).",
    difficulty: 2,
    text: "1. You (1) be more careful when driving in bad weather.\n2. (2) you please help me with this heavy box?\n3. I'm not sure, but it (3) rain later today.\n4. You (4) have told me earlier about the change in plans.\n5. Children under 12 (5) be accompanied by an adult.",
    blanks: [
      { index: 0, correctAnswer: "should" },
      { index: 1, correctAnswer: "could" },
      { index: 2, correctAnswer: "might" },
      { index: 3, correctAnswer: "could" },
      { index: 4, correctAnswer: "must" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "grammar",
    questionText: "Complete the sentences with the correct relative pronouns.",
    instruction:
      "Fill in the blanks with the appropriate relative pronouns (who, whom, whose, which, that).",
    difficulty: 2,
    text: "1. The woman (1) car was stolen reported it to the police.\n2. The book (2) I borrowed from the library is very interesting.\n3. The scientist (3) discovery changed the field won a Nobel Prize.\n4. The hotel (4) we stayed at last summer has been renovated.\n5. The person (5) you met yesterday is my cousin.",
    blanks: [
      { index: 0, correctAnswer: "whose" },
      { index: 1, correctAnswer: "that" },
      { index: 2, correctAnswer: "whose" },
      { index: 3, correctAnswer: "which" },
      { index: 4, correctAnswer: "whom" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "grammar",
    questionText: "Complete the sentences with the correct conditional forms.",
    instruction:
      "Fill in the blanks with the appropriate conditional forms of the verbs in parentheses.",
    difficulty: 3,
    text: "1. If it (1) (rain) tomorrow, we (2) (cancel) the picnic.\n2. If I (3) (be) you, I (4) (accept) the job offer.\n3. If we (5) (leave) earlier, we (6) (not miss) the train.",
    blanks: [
      { index: 0, correctAnswer: "rains" },
      { index: 1, correctAnswer: "will cancel" },
      { index: 2, correctAnswer: "were" },
      { index: 3, correctAnswer: "would accept" },
      { index: 4, correctAnswer: "had left" },
      { index: 5, correctAnswer: "would not have missed" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "grammar",
    questionText:
      "Complete the sentences with the correct passive voice forms.",
    instruction:
      "Fill in the blanks with the appropriate passive voice forms of the verbs in parentheses.",
    difficulty: 3,
    text: "1. The new bridge (1) (construct) last year.\n2. By the time we arrived, dinner (2) (serve) already.\n3. The project (3) (complete) by next month.\n4. Many lives (4) (save) if the warning (5) (issue) earlier.",
    blanks: [
      { index: 0, correctAnswer: "was constructed" },
      { index: 1, correctAnswer: "had been served" },
      { index: 2, correctAnswer: "will be completed" },
      { index: 3, correctAnswer: "would have been saved" },
      { index: 4, correctAnswer: "had been issued" },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "vocabulary",
    questionText: "Complete the sentences with the correct vocabulary words.",
    instruction:
      "Fill in the blanks with the appropriate words from the given options.",
    difficulty: 2,
    text: "1. The scientist made a groundbreaking (1) in cancer research.\n2. The company's new policy aims to (2) workplace efficiency.\n3. The novel's (3) kept readers guessing until the very end.\n4. The politician's speech was filled with (4) promises that were unlikely to be fulfilled.\n5. The (5) beauty of the landscape left the tourists in awe.",
    blanks: [
      {
        index: 0,
        correctAnswer: "discovery",
        options: ["discovery", "invention", "creation", "finding"],
      },
      {
        index: 1,
        correctAnswer: "enhance",
        options: ["enhance", "reduce", "maintain", "ignore"],
      },
      {
        index: 2,
        correctAnswer: "plot",
        options: ["plot", "setting", "characters", "theme"],
      },
      {
        index: 3,
        correctAnswer: "grandiose",
        options: ["grandiose", "humble", "realistic", "modest"],
      },
      {
        index: 4,
        correctAnswer: "breathtaking",
        options: ["breathtaking", "ordinary", "dull", "unremarkable"],
      },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "vocabulary",
    questionText: "Choose the correct synonyms for the underlined words.",
    instruction:
      "Fill in the blanks with the most appropriate synonym for the underlined word.",
    difficulty: 3,
    text: "1. The detective's astute (1) observations led to solving the case.\n2. The company's innovative (2) approach set them apart from competitors.\n3. The politician's speech was filled with superfluous (3) details.\n4. The mountain climbers showed incredible fortitude (4) in face of adversity.\n5. The artist's eccentric (5) behavior often puzzled his fans.",
    blanks: [
      {
        index: 0,
        correctAnswer: "perceptive",
        options: ["perceptive", "dull", "careless", "hasty"],
      },
      {
        index: 1,
        correctAnswer: "creative",
        options: ["creative", "traditional", "outdated", "common"],
      },
      {
        index: 2,
        correctAnswer: "unnecessary",
        options: ["unnecessary", "essential", "crucial", "vital"],
      },
      {
        index: 3,
        correctAnswer: "resilience",
        options: ["resilience", "weakness", "cowardice", "fragility"],
      },
      {
        index: 4,
        correctAnswer: "unconventional",
        options: ["unconventional", "normal", "typical", "ordinary"],
      },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "vocabulary",
    questionText:
      "Complete the sentences with the correct idiomatic expressions.",
    instruction:
      "Fill in the blanks with the appropriate idiomatic expression from the given options.",
    difficulty: 3,
    text: "1. After the argument, Tom and Jerry decided to (1) and start over.\n2. The new employee was eager to learn and (2) at work.\n3. Sarah was (3) when she heard she got the job.\n4. The project was difficult, but the team (4) and completed it on time.\n5. John tends to (5) during important meetings, which annoys his boss.",
    blanks: [
      {
        index: 0,
        correctAnswer: "bury the hatchet",
        options: [
          "bury the hatchet",
          "break the ice",
          "bite the bullet",
          "beat around the bush",
        ],
      },
      {
        index: 1,
        correctAnswer: "hit the ground running",
        options: [
          "hit the ground running",
          "break a leg",
          "pull someone's leg",
          "get cold feet",
        ],
      },
      {
        index: 2,
        correctAnswer: "over the moon",
        options: [
          "over the moon",
          "under the weather",
          "down to earth",
          "out of this world",
        ],
      },
      {
        index: 3,
        correctAnswer: "pulled through",
        options: ["pulled through", "pushed over", "ran around", "jumped in"],
      },
      {
        index: 4,
        correctAnswer: "zone out",
        options: ["zone out", "zero in", "zoom out", "zip up"],
      },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "vocabulary",
    questionText:
      "Complete the sentences with the correct academic vocabulary.",
    instruction:
      "Fill in the blanks with the most appropriate academic word from the given options.",
    difficulty: 4,
    text: "1. The researcher's (1) approach to the problem yielded unexpected results.\n2. The study's findings (2) previous theories about climate change.\n3. The author's argument lacks (3) and fails to convince the reader.\n4. The experiment's results were (4) across multiple trials, lending credibility to the hypothesis.\n5. The professor's lecture provided a (5) overview of the complex topic.",
    blanks: [
      {
        index: 0,
        correctAnswer: "empirical",
        options: ["empirical", "theoretical", "anecdotal", "hypothetical"],
      },
      {
        index: 1,
        correctAnswer: "corroborate",
        options: ["corroborate", "contradict", "negate", "undermine"],
      },
      {
        index: 2,
        correctAnswer: "coherence",
        options: ["coherence", "verbosity", "simplicity", "ambiguity"],
      },
      {
        index: 3,
        correctAnswer: "reproducible",
        options: ["reproducible", "unique", "anomalous", "inconsistent"],
      },
      {
        index: 4,
        correctAnswer: "comprehensive",
        options: ["comprehensive", "superficial", "biased", "ambiguous"],
      },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "fill_in_the_blank",
    section: "vocabulary",
    questionText:
      "Complete the sentences with the correct business terminology.",
    instruction:
      "Fill in the blanks with the most appropriate business term from the given options.",
    difficulty: 3,
    text: "1. The company's (1) increased by 15% in the last quarter.\n2. The new product line is expected to (2) the company's market share.\n3. The CEO presented the annual (3) to the board of directors.\n4. The firm hired a consultant to improve its (5) and reduce unnecessary spending.\n5. The merger resulted in significant (5) for both companies.",
    blanks: [
      {
        index: 0,
        correctAnswer: "revenue",
        options: ["revenue", "expenditure", "profit", "loss"],
      },
      {
        index: 1,
        correctAnswer: "expand",
        options: ["expand", "contract", "maintain", "eliminate"],
      },
      {
        index: 2,
        correctAnswer: "financial statement",
        options: [
          "financial statement",
          "business plan",
          "marketing strategy",
          "operational report",
        ],
      },
      {
        index: 3,
        correctAnswer: "operational efficiency",
        options: [
          "operational efficiency",
          "customer satisfaction",
          "product quality",
          "employee morale",
        ],
      },
      {
        index: 4,
        correctAnswer: "synergies",
        options: ["synergies", "conflicts", "redundancies", "liabilities"],
      },
    ],
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
];

async function seedFillInTheBlankQuestions() {
  try {
    const insertedQuestions = await FillInTheBlankQuestion.insertMany(
      fillInTheBlankQuestions
    );

    console.log(
      `${insertedQuestions.length} fill-in-the-blank questions have been added to the database.`
    );

    return insertedQuestions.length;
  } catch (error) {
    console.error("Error seeding fill-in-the-blank questions:", error);
    throw error;
  }
}

module.exports = { seedFillInTheBlankQuestions };
