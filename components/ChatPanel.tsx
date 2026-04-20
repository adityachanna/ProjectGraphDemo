"use client";

import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatPanelProps = {
  messages: Message[];
  isLoading: boolean;
  onSend: (message: string) => Promise<void>;
};

export function ChatPanel({ messages, isLoading, onSend }: ChatPanelProps) {
  const [draft, setDraft] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || isLoading) {
      return;
    }

    setDraft("");
    await onSend(message);
  }

  return (
    <section className="panel chat-panel" aria-label="Chat panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Natural language input</p>
          <h2>Career Advisor Chat</h2>
        </div>
      </div>

      <div className="message-list">
        {messages.map((message, index) => (
          <article className={`message ${message.role}`} key={`${message.role}-${index}`}>
            <span>{message.role === "user" ? "You" : "Expert System"}</span>
            <p>{message.content}</p>
          </article>
        ))}
        {isLoading ? (
          <article className="message assistant">
            <span>Expert System</span>
          <p>Extracting entities, firing rules, updating the graph, and preparing the explanation...</p>
          </article>
        ) : null}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <textarea
          aria-label="Student message"
          placeholder="Write your year, branch, interests, skills, and goal."
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={4}
        />
        <button disabled={isLoading || !draft.trim()} type="submit">
          Analyze
        </button>
      </form>
    </section>
  );
}
