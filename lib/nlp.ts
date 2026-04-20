import { keywordMap } from "./knowledgeBase";
import type { EmotionLabel, ExtractedEntity, StudentProfile } from "./types";

const stopwords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "but",
  "for",
  "i",
  "in",
  "is",
  "me",
  "my",
  "of",
  "on",
  "or",
  "the",
  "to",
  "what",
  "with",
]);

function tokenize(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9+#. ]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token && !stopwords.has(token));
}

function includesPhrase(input: string, phrase: string) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|\\s)${escaped}(\\s|$)`, "i").test(input);
}

function collectMatches(group: Record<string, readonly string[]>, normalizedInput: string) {
  return Object.entries(group)
    .filter(([, aliases]) => aliases.some((alias) => includesPhrase(normalizedInput, alias)))
    .map(([canonical]) => canonical);
}

function detectEmotion(normalizedInput: string): EmotionLabel {
  const scores = Object.entries(keywordMap.emotions).map(([emotion, aliases]) => ({
    emotion: emotion as EmotionLabel,
    score: aliases.filter((alias) => includesPhrase(normalizedInput, alias)).length,
  }));
  const best = scores.sort((a, b) => b.score - a.score)[0];
  return best && best.score > 0 ? best.emotion : "neutral";
}

function entityId(type: string, label: string) {
  return `${type}:${label.toLowerCase().replace(/\s+/g, "-")}`;
}

function toEntities(type: ExtractedEntity["type"], values: string[]): ExtractedEntity[] {
  return values.map((value) => ({
    id: entityId(type, value),
    label: value,
    type,
  }));
}

export function extractStudentProfile(input: string): StudentProfile {
  const normalizedInput = input.toLowerCase();
  const tokens = tokenize(input);
  const branches = collectMatches(keywordMap.branches, normalizedInput);
  const years = collectMatches(keywordMap.years, normalizedInput);
  const interests = collectMatches(keywordMap.interests, normalizedInput);
  const skills = collectMatches(keywordMap.skills, normalizedInput);
  const goals = collectMatches(keywordMap.goals, normalizedInput);
  const emotion = detectEmotion(normalizedInput);

  const entities: ExtractedEntity[] = [
    { id: "student:user", label: "Student", type: "student" },
    ...toEntities("branch", branches),
    ...toEntities("year", years),
    ...toEntities("interest", interests),
    ...toEntities("skill", skills),
    ...toEntities("goal", goals),
    { id: entityId("emotion", emotion), label: emotion, type: "emotion" },
  ];

  return {
    rawInput: input,
    tokens,
    entities,
    branches,
    years,
    interests,
    skills,
    goals,
    emotion,
  };
}
