"use client";

import { useMemo, useState } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { KnowledgeGraph } from "@/components/KnowledgeGraph";
import type { ChatResponse, KnowledgeGraph as KnowledgeGraphData } from "@/lib/types";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const starterGraph: KnowledgeGraphData = {
  nodes: [{ id: "student:user", label: "Student", type: "student" }],
  edges: [],
};

const examples = [
  "I am a second year CSE student interested in AI and web development, but I am confused about project ideas.",
  "I want to build a machine learning app using Python and ML for my final year project.",
  "I like app development and Flutter. Suggest a project for internship.",
  "I am interested in cybersecurity and cloud, and I need a portfolio project.",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Tell me your year, branch, interests, skills, and goal. Example: I am a second year CSE student interested in AI and web development, and I need a project idea.",
    },
  ]);
  const [latestResponse, setLatestResponse] = useState<ChatResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const graph = useMemo(() => latestResponse?.graph ?? starterGraph, [latestResponse]);

  async function sendMessage(content: string) {
    const userMessage: Message = { role: "user", content };
    setMessages((current) => [...current, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = (await response.json()) as ChatResponse;
      setLatestResponse(data);
      setMessages((current) => [...current, { role: "assistant", content: data.answer }]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "I could not process that message. Check the API route and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="intro-band">
        <div>
          <p className="eyebrow">AI syllabus project</p>
          <h1>Conversational Expert System</h1>
          <p>
            Student career guidance with NLP-style extraction, symbolic rules, confidence scoring,
            emotion-aware tone, and a live knowledge graph.
          </p>
          <div className="feature-strip" aria-label="Project modules">
            <span>NLP Extraction</span>
            <span>Rule Inference</span>
            <span>Knowledge Graph</span>
            <span>Confidence Score</span>
            <span>OpenRouter Agent</span>
          </div>
        </div>
      </section>

      <section className="examples-band" aria-label="Example prompts">
        <div>
          <p className="eyebrow">Try a prompt</p>
          <div className="example-list">
            {examples.map((example) => (
              <button disabled={isLoading} key={example} onClick={() => sendMessage(example)} type="button">
                {example}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="workspace">
        <ChatPanel messages={messages} isLoading={isLoading} onSend={sendMessage} />
        <KnowledgeGraph graph={graph} />
      </section>

      <ExplanationPanel response={latestResponse} />
    </main>
  );
}
