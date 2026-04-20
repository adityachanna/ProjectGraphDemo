export type EntityType =
  | "student"
  | "branch"
  | "year"
  | "interest"
  | "skill"
  | "goal"
  | "emotion"
  | "recommendation"
  | "rule";

export type ExtractedEntity = {
  id: string;
  label: string;
  type: EntityType;
};

export type GraphNode = {
  id: string;
  label: string;
  type: EntityType;
};

export type GraphEdge = {
  source: string;
  target: string;
  label: string;
};

export type KnowledgeGraph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type StudentProfile = {
  rawInput: string;
  tokens: string[];
  entities: ExtractedEntity[];
  branches: string[];
  years: string[];
  interests: string[];
  skills: string[];
  goals: string[];
  emotion: EmotionLabel;
};

export type EmotionLabel = "confused" | "stressed" | "confident" | "neutral";

export type RuleCondition = {
  branches?: string[];
  years?: string[];
  interests?: string[];
  skills?: string[];
  goals?: string[];
  emotion?: EmotionLabel[];
};

export type ExpertRule = {
  id: string;
  name: string;
  description: string;
  condition: RuleCondition;
  recommendation: string;
  category: string;
  weight: number;
};

export type FiredRule = {
  id: string;
  name: string;
  description: string;
  recommendation: string;
  category: string;
  score: number;
  matchedSignals: string[];
};

export type InferenceResult = {
  recommendation: string;
  category: string;
  confidence: number;
  rulesFired: FiredRule[];
  explanation: string[];
  nextSteps: string[];
};

export type ChatResponse = {
  answer: string;
  emotion: EmotionLabel;
  profile: StudentProfile;
  inference: InferenceResult;
  graph: KnowledgeGraph;
};
