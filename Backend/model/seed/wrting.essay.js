const { EssayQuestion } = require("../../model/question.model.v1");
const writingEssayQuestions = [
  {
    type: "essay",
    section: "writing",
    questionText:
      "Do you think technology has had a positive or negative impact on interpersonal relationships? Explain your viewpoint with examples.",
    instruction:
      "Write an essay of 250-300 words discussing the impact of technology on interpersonal relationships.",
    difficulty: 5,
    minWords: 250,
    maxWords: 300,
    rubric:
      "1. Clarity of argument (0-5 points)\n2. Use of specific examples (0-5 points)\n3. Grammar and vocabulary usage (0-5 points)\n4. Organization and coherence (0-5 points)\n5. Adherence to word limit (0-5 points)",
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "essay",
    section: "writing",
    questionText:
      "Should higher education be free for all citizens? Discuss the potential benefits and drawbacks of such a policy.",
    instruction:
      "Write an essay of 300-350 words examining the pros and cons of free higher education.",
    difficulty: 4,
    minWords: 300,
    maxWords: 350,
    rubric:
      "1. Balanced argument (0-5 points)\n2. Depth of analysis (0-5 points)\n3. Use of relevant examples (0-5 points)\n4. Logical flow of ideas (0-5 points)\n5. Language precision and clarity (0-5 points)",
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "essay",
    section: "writing",
    questionText:
      "How has social media changed the way we consume and share information? Discuss its impact on society and individual behavior.",
    instruction:
      "Compose an essay of 275-325 words analyzing the effects of social media on information consumption and sharing.",
    difficulty: 4,
    minWords: 275,
    maxWords: 325,
    rubric:
      "1. Insightful analysis (0-5 points)\n2. Relevant examples (0-5 points)\n3. Coherent structure (0-5 points)\n4. Vocabulary range (0-5 points)\n5. Critical thinking (0-5 points)",
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "essay",
    section: "writing",
    questionText:
      "Is it ethical to use animals for scientific research? Present arguments for and against this practice.",
    instruction:
      "Write a balanced essay of 200-250 words discussing the ethics of using animals in scientific research.",
    difficulty: 3,
    minWords: 200,
    maxWords: 250,
    rubric:
      "1. Balanced perspective (0-5 points)\n2. Ethical considerations (0-5 points)\n3. Clarity of expression (0-5 points)\n4. Logical reasoning (0-5 points)\n5. Conciseness (0-5 points)",
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "essay",
    section: "writing",
    questionText:
      "What role should governments play in addressing climate change? Discuss potential policies and their implications.",
    instruction:
      "Compose an essay of 350-400 words exploring government responsibilities and potential actions regarding climate change.",
    difficulty: 5,
    minWords: 350,
    maxWords: 400,
    rubric:
      "1. Understanding of the issue (0-5 points)\n2. Policy analysis (0-5 points)\n3. Global perspective (0-5 points)\n4. Argument development (0-5 points)\n5. Use of evidence (0-5 points)",
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "essay",
    section: "writing",
    questionText:
      "How has the concept of privacy changed in the digital age? Discuss the implications for individuals and society.",
    instruction:
      "Write an essay of 275-325 words examining the evolution of privacy in the context of digital technology.",
    difficulty: 4,
    minWords: 275,
    maxWords: 325,
    rubric:
      "1. Historical context (0-5 points)\n2. Analysis of current trends (0-5 points)\n3. Societal implications (0-5 points)\n4. Personal reflections (0-5 points)\n5. Coherence and flow (0-5 points)",
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "essay",
    section: "writing",
    questionText:
      "Should art and music education be mandatory in schools? Explain your position with supporting arguments.",
    instruction:
      "Compose an essay of 225-275 words arguing for or against mandatory art and music education in schools.",
    difficulty: 3,
    minWords: 225,
    maxWords: 275,
    rubric:
      "1. Clarity of position (0-5 points)\n2. Supporting evidence (0-5 points)\n3. Consideration of counterarguments (0-5 points)\n4. Persuasive writing style (0-5 points)\n5. Conclusion strength (0-5 points)",
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "essay",
    section: "writing",
    questionText:
      "How has globalization affected cultural diversity? Discuss both positive and negative impacts.",
    instruction:
      "Write an essay of 300-350 words analyzing the effects of globalization on cultural diversity worldwide.",
    difficulty: 4,
    minWords: 300,
    maxWords: 350,
    rubric:
      "1. Understanding of globalization (0-5 points)\n2. Cultural insights (0-5 points)\n3. Balanced perspective (0-5 points)\n4. Use of specific examples (0-5 points)\n5. Clarity of expression (0-5 points)",
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "essay",
    section: "writing",
    questionText:
      "What are the advantages and disadvantages of a cashless society? Discuss the potential impacts on different societal groups.",
    instruction:
      "Compose an essay of 250-300 words examining the implications of transitioning to a cashless society.",
    difficulty: 4,
    minWords: 250,
    maxWords: 300,
    rubric:
      "1. Comprehensive analysis (0-5 points)\n2. Consideration of various perspectives (0-5 points)\n3. Logical organization (0-5 points)\n4. Use of relevant examples (0-5 points)\n5. Clarity and coherence (0-5 points)",
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "essay",
    section: "writing",
    questionText:
      "Should genetically modified organisms (GMOs) be labeled in food products? Discuss the pros and cons of mandatory labeling.",
    instruction:
      "Write an essay of 275-325 words exploring the debate surrounding GMO labeling in food products.",
    difficulty: 4,
    minWords: 275,
    maxWords: 325,
    rubric:
      "1. Understanding of GMOs (0-5 points)\n2. Analysis of labeling impact (0-5 points)\n3. Consideration of stakeholder perspectives (0-5 points)\n4. Use of evidence (0-5 points)\n5. Argument coherence (0-5 points)",
    isPublic: true,
    createdBy: "60a3e5b9f5e6a81234567899",
  },
  {
    type: "essay",
    section: "writing",
    questionText:
      "How has the rise of e-books affected the publishing industry and reading habits? Discuss the implications for authors, publishers, and readers.",
    instruction:
      "Compose an essay of 300-350 words analyzing the impact of e-books on the literary landscape.",
    difficulty: 4,
    minWords: 300,
    maxWords: 350,
    rubric:
      "1. Industry knowledge (0-5 points)\n2. Analysis of trends (0-5 points)\n3. Consideration of multiple perspectives (0-5 points)\n4. Use of specific examples (0-5 points)\n5. Logical flow of ideas (0-5 points)",
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "essay",
    section: "writing",
    questionText:
      "Should voting be mandatory for all eligible citizens? Discuss the potential benefits and drawbacks of compulsory voting.",
    instruction:
      "Write an essay of 250-300 words examining the pros and cons of mandatory voting in democratic societies.",
    difficulty: 4,
    minWords: 250,
    maxWords: 300,
    rubric:
      "1. Understanding of democratic principles (0-5 points)\n2. Analysis of potential impacts (0-5 points)\n3. Consideration of individual rights (0-5 points)\n4. Use of relevant examples (0-5 points)\n5. Argument clarity (0-5 points)",
    isPublic: true,
    createdBy: "60a3e5b9f5e6a81234567901",
  },
  {
    type: "essay",
    section: "writing",
    questionText:
      "How has social media influenced political discourse and election campaigns? Discuss its impact on democracy and public opinion.",
    instruction:
      "Compose an essay of 325-375 words analyzing the role of social media in modern politics.",
    difficulty: 5,
    minWords: 325,
    maxWords: 375,
    rubric:
      "1. Understanding of social media dynamics (0-5 points)\n2. Analysis of political impacts (0-5 points)\n3. Use of specific examples or case studies (0-5 points)\n4. Consideration of ethical implications (0-5 points)\n5. Coherence and structure (0-5 points)",
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "essay",
    section: "writing",
    questionText:
      "Is space exploration a worthwhile investment of public resources? Discuss the potential benefits and drawbacks for society.",
    instruction:
      "Write an essay of 275-325 words evaluating the merits and costs of space exploration programs.",
    difficulty: 4,
    minWords: 275,
    maxWords: 325,
    rubric:
      "1. Understanding of space exploration (0-5 points)\n2. Cost-benefit analysis (0-5 points)\n3. Long-term perspective (0-5 points)\n4. Use of specific examples (0-5 points)\n5. Argument development (0-5 points)",
    isPublic: true,
    createdBy: "60a3e5b9f5e6a81234567903",
  },
  {
    type: "essay",
    section: "writing",
    questionText:
      "How has the gig economy changed the nature of work? Discuss its impact on workers, businesses, and the broader economy.",
    instruction:
      "Compose an essay of 300-350 words analyzing the effects of the gig economy on employment and economic structures.",
    difficulty: 4,
    minWords: 300,
    maxWords: 350,
    rubric:
      "1. Understanding of the gig economy (0-5 points)\n2. Analysis of impacts on various stakeholders (0-5 points)\n3. Use of relevant statistics or examples (0-5 points)\n4. Consideration of future trends (0-5 points)\n5. Clarity and coherence (0-5 points)",
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "essay",
    section: "writing",
    questionText:
      "Should governments implement a universal basic income? Discuss the potential benefits and challenges of such a policy.",
    instruction:
      "Write an essay of 350-400 words examining the concept of universal basic income and its potential implications.",
    difficulty: 5,
    minWords: 350,
    maxWords: 400,
    rubric:
      "1. Understanding of UBI concept (0-5 points)\n2. Analysis of economic impacts (0-5 points)\n3. Consideration of social implications (0-5 points)\n4. Evaluation of implementation challenges (0-5 points)\n5. Argument structure and coherence (0-5 points)",
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "essay",
    section: "writing",
    questionText:
      "How has the rise of streaming services affected the film and television industry? Discuss the implications for content creators, distributors, and consumers.",
    instruction:
      "Compose an essay of 275-325 words analyzing the impact of streaming platforms on the entertainment landscape.",
    difficulty: 4,
    minWords: 275,
    maxWords: 325,
    rubric:
      "1. Industry knowledge (0-5 points)\n2. Analysis of market trends (0-5 points)\n3. Consideration of multiple stakeholders (0-5 points)\n4. Use of specific examples (0-5 points)\n5. Logical flow of ideas (0-5 points)",
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
  {
    type: "essay",
    section: "writing",
    questionText:
      "Should schools prioritize STEM education over humanities? Discuss the potential benefits and drawbacks of emphasizing one over the other.",
    instruction:
      "Write an essay of 300-350 words examining the balance between STEM and humanities education in schools.",
    difficulty: 4,
    minWords: 300,
    maxWords: 350,
    rubric:
      "1. Understanding of education systems (0-5 points)\n2. Analysis of societal needs (0-5 points)\n3. Consideration of student development (0-5 points)\n4. Use of relevant examples (0-5 points)\n5. Balanced argument (0-5 points)",
    isPublic: true,
    createdBy: "66eda220f1577aa9a314ab30",
  },
];

async function seedWritingEssayQuestions() {
  try {
    const insertedQuestions = await EssayQuestion.insertMany(
      writingEssayQuestions
    );
    return insertedQuestions;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { writingEssayQuestions, seedWritingEssayQuestions };
