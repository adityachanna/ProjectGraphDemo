import { expertRules } from "./knowledgeBase";
import type { ExpertRule, FiredRule, InferenceResult, StudentProfile } from "./types";

function matchesAll(required: string[] | undefined, actual: string[]) {
  if (!required || required.length === 0) {
    return { matched: true, signals: [] };
  }

  const signals = required.filter((item) => actual.includes(item));
  return { matched: signals.length === required.length, signals };
}

function evaluateRule(rule: ExpertRule, profile: StudentProfile): FiredRule | null {
  const branch = matchesAll(rule.condition.branches, profile.branches);
  const year = matchesAll(rule.condition.years, profile.years);
  const interest = matchesAll(rule.condition.interests, profile.interests);
  const skill = matchesAll(rule.condition.skills, profile.skills);
  const goal = matchesAll(rule.condition.goals, profile.goals);
  const emotionMatched =
    !rule.condition.emotion || rule.condition.emotion.includes(profile.emotion);

  if (!branch.matched || !year.matched || !interest.matched || !skill.matched || !goal.matched || !emotionMatched) {
    return null;
  }

  const matchedSignals = [
    ...branch.signals,
    ...year.signals,
    ...interest.signals,
    ...skill.signals,
    ...goal.signals,
    ...(rule.condition.emotion ? [profile.emotion] : []),
  ];

  const coverageBonus = Math.min(matchedSignals.length * 0.04, 0.18);

  return {
    id: rule.id,
    name: rule.name,
    description: rule.description,
    recommendation: rule.recommendation,
    category: rule.category,
    score: Math.min(rule.weight + coverageBonus, 0.98),
    matchedSignals,
  };
}

function fallbackResult(profile: StudentProfile): InferenceResult {
  const hasAnySignal =
    profile.interests.length > 0 || profile.goals.length > 0 || profile.skills.length > 0 || profile.branches.length > 0;

  return {
    recommendation: hasAnySignal
      ? "Start with a focused student portfolio roadmap based on your strongest interest."
      : "Share your branch, year, interests, and goal so the expert system can recommend a better path.",
    category: hasAnySignal ? "General Student Roadmap" : "More Information Needed",
    confidence: hasAnySignal ? 48 : 25,
    rulesFired: [],
    explanation: hasAnySignal
      ? ["No exact rule fired, so the system used the available signals to suggest a general roadmap."]
      : ["No branch, year, interest, skill, or goal was detected from the message."],
    nextSteps: [
      "Mention your current year and branch.",
      "Add one or two interests such as AI, web development, data science, or cybersecurity.",
      "State your goal: project, internship, placement, higher studies, or startup.",
    ],
  };
}

function nextStepsFor(category: string) {
  const steps: Record<string, string[]> = {
    "AI + Full Stack Project Track": [
      "Build the expert-system chatbot with deterministic rules first.",
      "Add OpenRouter only for tone and explanation polishing.",
      "Deploy the Next.js app on Vercel and present the graph animation live.",
    ],
    "AI Project Track": [
      "Choose a narrow student problem like career advice, study planning, or project selection.",
      "Create 8-10 transparent rules with confidence weights.",
      "Show the explanation chain beside every recommendation.",
    ],
    "Full Stack Project Track": [
      "Create a clean Next.js interface with chat and API routes.",
      "Store domain rules in TypeScript objects.",
      "Deploy on Vercel and add screenshots to your resume.",
    ],
    "Data Science Placement Track": [
      "Strengthen Python, SQL, statistics, and basic ML.",
      "Build one dashboard and one predictive analysis project.",
      "Practice explaining insights clearly for interviews.",
    ],
    "Internship Preparation Track": [
      "Pick one core stack and build a small project in one week.",
      "Clean your GitHub README files and resume.",
      "Apply to internships with a short project-based pitch.",
    ],
    "Frontend/UI UX Portfolio Track": [
      "Design three case-study screens in Figma.",
      "Implement them in React with responsive layouts.",
      "Write short notes explaining your design decisions.",
    ],
    "Cybersecurity Project Track": [
      "Build only safe educational features.",
      "Add password scoring, phishing awareness, and security checklists.",
      "Avoid exploit automation or harmful scanning.",
    ],
    "Software Placement Track": [
      "Practice DSA consistently with topic-wise problems.",
      "Revise DBMS, OS, OOP, and networking basics.",
      "Use two strong projects to support resume discussion.",
    ],
    "Mobile App Development Track": [
      "Choose one campus problem such as attendance, events, or study reminders.",
      "Build the first version with Flutter or React Native.",
      "Add screenshots, a short video, and a clear README for your portfolio.",
    ],
    "Machine Learning App Track": [
      "Use a small clean dataset and define the prediction task clearly.",
      "Show model confidence and simple evaluation metrics.",
      "Wrap the model in a simple web or mobile interface.",
    ],
    "Blockchain Academic Track": [
      "Keep the use case safe and academic, such as certificate verification.",
      "Show blocks, hashes, and verification status visually.",
      "Explain that it is a prototype, not a financial product.",
    ],
    "IoT Campus Project Track": [
      "Choose one sensor-based campus problem.",
      "Create a dashboard that shows device data and alerts.",
      "Document the hardware, data flow, and graph clearly.",
    ],
    "Final Year Project Track": [
      "Pick a project with visible UI and measurable output.",
      "Prepare documentation with problem statement, architecture, and results.",
      "Deploy or record the working project before the review.",
    ],
    "App Development Internship Track": [
      "Build one polished Flutter or React Native app.",
      "Add authentication mock screens, local storage, and clean navigation.",
      "Publish screenshots, source code, and a short project explanation.",
    ],
  };

  return (
    steps[category] ?? [
      "Choose the strongest matching track.",
      "Build one project that proves the skill.",
      "Prepare a short explanation for viva or interview discussion.",
    ]
  );
}

export function inferRecommendation(profile: StudentProfile): InferenceResult {
  const firedRules = expertRules
    .map((rule) => evaluateRule(rule, profile))
    .filter((rule): rule is FiredRule => Boolean(rule))
    .sort((a, b) => b.score - a.score);

  if (firedRules.length === 0) {
    return fallbackResult(profile);
  }

  const best = firedRules[0];
  const aggregateScore =
    firedRules.reduce((total, rule, index) => total + rule.score / (index + 1), 0) /
    firedRules.reduce((total, _rule, index) => total + 1 / (index + 1), 0);
  const confidence = Math.round(Math.min(aggregateScore * 100, 96));

  return {
    recommendation: best.recommendation,
    category: best.category,
    confidence,
    rulesFired: firedRules,
    explanation: firedRules.map(
      (rule) =>
        `Rule ${rule.id} - ${rule.name} matched ${rule.matchedSignals.join(", ")}: ${rule.description}`,
    ),
    nextSteps: nextStepsFor(best.category),
  };
}
