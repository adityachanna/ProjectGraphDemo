import OpenAI from "openai";
import type { EmotionLabel, InferenceResult, StudentProfile } from "./types";

type ORChatMessage = OpenAI.Chat.Completions.ChatCompletionMessage & {
  reasoning_details?: unknown;
};

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
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const userMessage = JSON.stringify({
      userInput: profile.rawInput,
      detectedEmotion: profile.emotion,
      extractedEntities: profile.entities,
      inference,
    });

    const requestBody = {
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
      reasoning: { enabled: true },
    } as const;

    const apiResponse = await client.chat.completions.create(requestBody as any);

    const response = apiResponse.choices[0]?.message as ORChatMessage | undefined;

    const messages = [
      {
        role: "system" as const,
        content:
          "You are a college career guidance assistant. Use only the provided expert-system result. Do not invent new recommendations. Adjust tone based on emotion. Keep the answer practical and clear for a student project presentation.",
      },
      {
        role: "user" as const,
        content: userMessage,
      },
      {
        role: "assistant" as const,
        content: response?.content,
        reasoning_details: response?.reasoning_details,
      },
      {
        role: "user" as const,
        content: "Are you sure? Think carefully.",
      },
    ];

    const response2 = await client.chat.completions.create(
      {
        model: "google/gemma-4-31b-it:free",
        messages,
        reasoning: { enabled: true },
      } as any,
    );

    const finalResponse = response2.choices[0]?.message as ORChatMessage | undefined;
    return finalResponse?.content?.trim() || response?.content?.trim() || fallbackAnswer(profile, inference);
  } catch (error) {
    console.error("OpenRouter request failed", error);
    return fallbackAnswer(profile, inference);
  }
}
