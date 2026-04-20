import { NextResponse } from "next/server";
import { buildKnowledgeGraph } from "@/lib/graph";
import { inferRecommendation } from "@/lib/inference";
import { extractStudentProfile } from "@/lib/nlp";
import { polishWithOpenRouter } from "@/lib/openrouter";
import type { ChatResponse } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { message?: unknown };
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const profile = extractStudentProfile(message);
    const inference = inferRecommendation(profile);
    const graph = buildKnowledgeGraph(profile, inference);
    const answer = await polishWithOpenRouter(profile, inference);

    const response: ChatResponse = {
      answer,
      emotion: profile.emotion,
      profile,
      inference,
      graph,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat route failed", error);
    return NextResponse.json({ error: "Unable to process the message." }, { status: 500 });
  }
}
