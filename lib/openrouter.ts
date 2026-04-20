import { OpenRouter } from "@openrouter/sdk";
import type { EmotionLabel, InferenceResult, StudentProfile } from "./types";

function fallbackAnswer(profile: StudentProfile, inference: InferenceResult) {
  const toneIntro: Record<EmotionLabel, string> = {
    confused: "You seem unsure, so here is the clearest path.",
    stressed: "Keep this manageable. Start with the smallest useful version.",
    confident: "Your direction is clear. Here is the direct action plan.",
    neutral: "Here is the best matching recommendation.",
  };

  return `${toneIntro[profile.emotion]}\n\nRecommendation: ${inference.category}\n\n${inference.recommendation}\n\nConfidence: ${inference.confidence}%\n\nWhat the rule IDs mean:\nEach ID is one expert-system rule from the knowledge base. For example, R2 is the full-stack project rule and R9 is the confusion-support rule.\n\nWhy:\n${inference.explanation
    .map((item) => `- ${item}`)
    .join("\n")}\n\nNext steps:\n${inference.nextSteps.map((item, index) => `${index + 1}. ${item}`).join("\n")}`;
}

export async function polishWithOpenRouter(profile: StudentProfile, inference: InferenceResult) {
  if (!process.env.OPENROUTER_API_KEY) {
    return fallbackAnswer(profile, inference);
  }

  try {
    const openrouter = new OpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const userMessage = JSON.stringify({
      userInput: profile.rawInput,
      detectedEmotion: profile.emotion,
      extractedEntities: profile.entities,
      inference,
    });

    const stream = await openrouter.chat.send({
      chatRequest: {
        model: "google/gemma-4-31b-it:free",
        messages: [
          {
            role: "system",
            content:
              "You are a college career guidance assistant. Use only the provided expert-system result. Do not invent new recommendations. Adjust tone based on emotion. Keep the answer practical and clear for a student project presentation.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        stream: true,
      },
    });

    let response = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        response += content;
      }

      const reasoningTokens = chunk.usage?.completionTokensDetails?.reasoningTokens;
      if (reasoningTokens) {
        console.log("Reasoning tokens:", reasoningTokens);
      }
    }

    return response.trim() || fallbackAnswer(profile, inference);
  } catch (error) {
    console.error("OpenRouter request failed", error);
    return fallbackAnswer(profile, inference);
  }
}
