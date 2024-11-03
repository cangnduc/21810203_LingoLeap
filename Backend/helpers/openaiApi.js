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

async function generateCompletion(content, topic) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are an experienced English Essay Examiner to evaluate and assess student essay on topic ${topic}, providing constructive short feedbacks (strengths, weaknesses, and improvements) on content: stay relevant to the topic?, structure, grammar, vocabulary, style. The feedback should be concise and to the point, and the scoring should be fair, range between 0 and 10. return sample of feedback as json object:{"content": {"score": 1, "strengths": "Wide range of academic vocabulary, Appropriate word choice", "weaknesses": "irrelevant to the topic", "improvements": "Incorporate more field-specific terminology, Use more varied synonyms"}, "structure": {"score": 9, "strengths": "Correct sentence structure, Proper use of punctuation", "weaknesses": "Minor errors in subject-verb agreement", "improvements": "Review complex sentence formations, Check verb tenses for consistency"}}`,
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
    const jsonMatch = response.content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const jsonObject = JSON.parse(jsonMatch[1]);

        // Calculate and add mean score
        let totalScore = 0;
        let scoreCount = 0;

        for (const key in jsonObject) {
          if (jsonObject[key].score) {
            totalScore += jsonObject[key].score;
            scoreCount++;
          }
        }

        const meanScore = scoreCount > 0 ? totalScore / scoreCount : 0;

        // Add mean score to the object
        return {
          ...jsonObject,
          totalScore: parseFloat(meanScore.toFixed(2)),
        };
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return null;
      }
    }
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
