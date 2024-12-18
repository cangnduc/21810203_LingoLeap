const OpenAI = require("openai");

const dotenv = require("dotenv");
const path = require("path");

const current_dir = __dirname;
const env_path = path.join(current_dir, "..", ".env");
dotenv.config({ path: env_path });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

async function generateCompletion(content, topic, point, testType) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are an experienced English Essay Examiner to Evaluate the essay task of ${testType} test on a scale of 0 to ${point} for each aspect: Content & Relevance (addresses the prompt and stays on topic of ${topic}), Structure & Organization (clear introduction, body, conclusion, logical flow), Language Use & Grammar (accurate grammar, varied vocabulary), Clarity & Cohesion (ease of understanding, smooth transitions), and Creativity & Originality (unique ideas or perspectives). Provide brief feedback for each aspect, along with a summary. remember, only return json object as this example: {"aspects":[{"aspect":"Content & Relevance","score":8,"feedback":"The essay addresses the prompt well, with mostly relevant ideas."},{"aspect":"Structure & Organization","score":7,"feedback":"Clear structure, but some paragraphs could flow better."},{"aspect":"Language Use & Grammar","score":9,"feedback":"Strong grammar and vocabulary with varied sentence structures."},{"aspect":"Clarity & Cohesion","score":8,"feedback":"Generally clear with smooth transitions, minor rephrasing needed."},{"aspect":"Creativity & Originality","score":6,"feedback":"Some original ideas, but lacks unique insights."}],"summary_feedback":"Well-written with strong grammar. Improvement areas: deepen content and add unique insights."}`,
      },
      {
        role: "user",
        content: content,
      },
    ],
  });

  return preprocessResponse(completion.choices[0].message);
}

function preprocessResponse(response) {
  if (response.role === "assistant" && response.content) {
    return response.content;
  }
  console.error("Unexpected response format");
  return null;
}

// Example usage
const content = `The Impact of Social Media on Modern Communication

In the past two decades, social media has fundamentally transformed how humans interact, share information, and maintain relationships. This digital revolution has brought both unprecedented opportunities for global connectivity and significant challenges to traditional communication patterns. While social media platforms have made it easier than ever to stay connected with friends and family across vast distances, they have also raised important questions about the quality and authenticity of these digital interactions.

The most immediate benefit of social media has been its ability to bridge geographical gaps. Platforms like Facebook, Instagram, and Twitter have made it possible for people to maintain relationships regardless of physical distance. A grandmother in Tokyo can watch her grandchildren grow up in New York through daily photo updates, while a student studying abroad can instantly share their experiences with friends back home. This unprecedented level of connectivity has created a global community where ideas, cultures, and experiences can be shared instantaneously.

In conclusion, social media has revolutionized modern communication in ways that were unimaginable just a few decades ago. While it has created unprecedented opportunities for connection and information sharing, it has also introduced new challenges to meaningful communication and social cohesion. Understanding and addressing these impacts is crucial for ensuring that social media serves as a tool for enhancing human connection rather than diminishing it. The future of communication will depend on our ability to strike a balance between digital convenience and authentic human interaction.`;

// generateCompletion(
//   content,
//   "The Impact of Social Media on Modern Communication"
// ).then((processedResponse) => {
//   if (processedResponse) {
//     console.log("Processed response:", processedResponse);
//     // Here you can store the processedResponse in your database
//   } else {
//     console.log("Failed to process the response");
//   }
// });

module.exports = { generateCompletion };
