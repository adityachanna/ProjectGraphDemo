import type { ChatResponse } from "@/lib/types";

type ExplanationPanelProps = {
  response: ChatResponse | null;
};

export function ExplanationPanel({ response }: ExplanationPanelProps) {
  if (!response) {
    return (
      <section className="explanation-band">
        <div className="metric">
          <span>Confidence</span>
          <strong>Waiting</strong>
        </div>
        <p>Send a student query to see fired rules, extracted entities, and the recommendation chain.</p>
      </section>
    );
  }

  return (
    <section className="explanation-band">
      <div className="metric">
        <span>Confidence</span>
        <strong>{response.inference.confidence}%</strong>
      </div>
      <div className="metric">
        <span>Emotion</span>
        <strong>{response.emotion}</strong>
      </div>
      <div className="metric">
        <span>Track</span>
        <strong>{response.inference.category}</strong>
      </div>

      <div className="explanation-content">
        <h2>Explanation Chain</h2>
        <ul>
          {response.inference.explanation.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="explanation-content">
        <h2>Extracted Entities</h2>
        <div className="entity-list">
          {response.profile.entities.map((entity) => (
            <span key={entity.id}>
              {entity.label} <small>{entity.type}</small>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
