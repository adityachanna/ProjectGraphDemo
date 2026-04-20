import type { FiredRule, GraphEdge, GraphNode, InferenceResult, KnowledgeGraph, StudentProfile } from "./types";

function uniqueById<T extends { id: string }>(items: T[]) {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

function ruleNode(rule: FiredRule): GraphNode {
  return {
    id: `rule:${rule.id}`,
    label: rule.id,
    type: "rule",
  };
}

export function buildKnowledgeGraph(profile: StudentProfile, inference: InferenceResult): KnowledgeGraph {
  const recommendationNode: GraphNode = {
    id: `recommendation:${inference.category.toLowerCase().replace(/\s+/g, "-")}`,
    label: inference.category,
    type: "recommendation",
  };

  const nodes: GraphNode[] = uniqueById([
    ...profile.entities.map((entity) => ({
      id: entity.id,
      label: entity.label,
      type: entity.type,
    })),
    ...inference.rulesFired.map(ruleNode),
    recommendationNode,
  ]);

  const entityEdges: GraphEdge[] = profile.entities
    .filter((entity) => entity.type !== "student")
    .map((entity) => ({
      source: "student:user",
      target: entity.id,
      label: entity.type === "emotion" ? "feels" : `has_${entity.type}`,
    }));

  const ruleEdges: GraphEdge[] = inference.rulesFired.flatMap((rule) => [
    ...rule.matchedSignals.map((signal) => {
      const matchingEntity = profile.entities.find((entity) => entity.label === signal);
      return {
        source: matchingEntity?.id ?? "student:user",
        target: `rule:${rule.id}`,
        label: "matches",
      };
    }),
    {
      source: `rule:${rule.id}`,
      target: recommendationNode.id,
      label: "supports",
    },
  ]);

  return {
    nodes,
    edges: [...entityEdges, ...ruleEdges],
  };
}
