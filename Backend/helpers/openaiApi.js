const OpenAI = require("openai");
const { zodResponseFormat } = require("openai/helpers/zod");
const dotenv = require("dotenv");
const path = require("path");
const z = require("zod");

const current_dir = __dirname;
const env_path = path.join(current_dir, "..", ".env");
dotenv.config({ path: env_path });
const zod = require("zod");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});
const EssayEvaluationSchema = z.object({
  aspects: z.array(
    z.object({
      aspect: z.string(),
      score: z.number().int(),
      feedback: z.string(),
    })
  ),
  summary_feedback: z.string(),
});
async function generateCompletion(content, topic, point, testType) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [
      {
        role: "system",
        content: `You are an experienced English Essay Examiner to Evaluate the essay task of ${testType} test on a scale of 0 to ${point} for each aspect: Content & Relevance (addresses the prompt and stays on topic of ${topic}), Structure & Organization (clear introduction, body, conclusion, logical flow), Language Use & Grammar (accurate grammar, varied vocabulary), Clarity & Cohesion (ease of understanding, smooth transitions), and Creativity & Originality (unique ideas or perspectives). Provide brief feedback for each aspect, along with a summary. remember, only return json object`,
      },
      {
        role: "user",
        content: content,
      },
    ],
    response_format: zodResponseFormat(
      EssayEvaluationSchema,
      "essay_evaluation"
    ),
  });
  return preprocessResponse(completion.choices[0].message);
}

function preprocessResponse(response) {
  if (response.content) {
    console.log("result", JSON.parse(response.content));
    return JSON.parse(response.content);
  }
  console.error("Unexpected response format");
  return null;
}

// Example usage
const content = `The Impact of Social Media on Modern Communication

In the past two decades, social media has fundamentally transformed how humans interact, share information, and maintain relationships. This digital revolution has brought both unprecedented opportunities for global connectivity and significant challenges to traditional communication patterns. While social media platforms have made it easier than ever to stay connected with friends and family across vast distances, they have also raised important questions about the quality and authenticity of these digital interactions.`;

// const result = generateCompletion(content, "Social Media", 10, "essay");
// console.log("result", result);

module.exports = { generateCompletion };
