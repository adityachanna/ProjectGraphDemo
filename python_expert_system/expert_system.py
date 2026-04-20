import re
from dataclasses import dataclass
from typing import Dict, List


KEYWORDS: Dict[str, Dict[str, List[str]]] = {
    "branches": {
        "cse": ["cse", "computer science", "cs", "computer engineering"],
        "it": ["it", "information technology"],
        "ece": ["ece", "electronics", "communication"],
        "mechanical": ["mechanical", "mech"],
        "civil": ["civil"],
    },
    "years": {
        "first year": ["first year", "1st year", "fy", "freshman"],
        "second year": ["second year", "2nd year", "sophomore"],
        "third year": ["third year", "3rd year", "pre final"],
        "final year": ["final year", "4th year", "last year"],
    },
    "interests": {
        "ai": ["ai", "a.i", "a i", "al", "artificial intelligence", "machine learning", "ml", "genai", "llm"],
        "web development": ["web", "web development", "frontend", "backend", "full stack", "fullstack", "nextjs", "react"],
        "app development": ["app development", "mobile app", "android", "ios", "flutter", "react native"],
        "data science": ["data science", "analytics", "data analysis", "visualization"],
        "cybersecurity": ["cybersecurity", "security", "ethical hacking", "network security"],
        "cloud": ["cloud", "aws", "azure", "devops", "deployment"],
        "ui ux": ["ui", "ux", "ui ux", "figma", "design"],
        "blockchain": ["blockchain", "web3", "smart contract"],
        "iot": ["iot", "internet of things", "arduino", "sensors"],
    },
    "skills": {
        "python": ["python"],
        "javascript": ["javascript", "js", "typescript", "ts"],
        "react": ["react", "nextjs", "next.js"],
        "flutter": ["flutter", "dart"],
        "java": ["java", "kotlin"],
        "sql": ["sql", "database", "mysql", "postgres"],
        "dsa": ["dsa", "data structures", "algorithms"],
        "ml": ["ml", "machine learning", "scikit", "tensorflow", "pytorch"],
    },
    "goals": {
        "project": ["project", "mini project", "major project", "build", "prototype"],
        "internship": ["internship", "intern", "industrial training"],
        "placement": ["placement", "job", "career", "package"],
        "higher studies": ["higher studies", "masters", "gate", "gre"],
        "startup": ["startup", "business", "entrepreneurship"],
    },
    "emotions": {
        "confused": ["confused", "not sure", "unsure", "doubt", "stuck", "lost", "what should"],
        "stressed": ["stress", "stressed", "worried", "pressure", "anxious", "panic", "scared"],
        "confident": ["confident", "ready", "sure", "clear", "decided"],
    },
}


@dataclass
class Rule:
    rule_id: str
    name: str
    conditions: Dict[str, List[str]]
    recommendation: str
    category: str
    weight: float


RULES = [
    Rule("R1", "AI project fit", {"interests": ["ai"], "goals": ["project"]}, "Build an AI-powered student assistant with a rule engine and visual explanation graph.", "AI Project Track", 0.86),
    Rule("R2", "Full-stack project fit", {"interests": ["web development"], "goals": ["project"]}, "Build a full-stack portfolio project using Next.js, API routes, and a clean interactive UI.", "Full Stack Project Track", 0.80),
    Rule("R3", "AI plus web combination", {"interests": ["ai", "web development"]}, "Build an AI + full-stack expert system that demonstrates NLP, rules, confidence, and graph reasoning.", "AI + Full Stack Project Track", 0.94),
    Rule("R4", "Placement data track", {"interests": ["data science"], "goals": ["placement"]}, "Follow a Data Science Placement Track with Python, SQL, dashboards, and case-study projects.", "Data Science Placement Track", 0.84),
    Rule("R5", "Internship starter roadmap", {"years": ["first year", "second year"], "goals": ["internship"]}, "Prepare for internships with one core skill, one small project, GitHub cleanup, and a concise resume.", "Internship Preparation Track", 0.78),
    Rule("R6", "Frontend design portfolio", {"interests": ["ui ux", "web development"]}, "Create a UI/UX-focused frontend portfolio with three polished case-study pages.", "Frontend/UI UX Portfolio Track", 0.82),
    Rule("R7", "Cybersecurity project fit", {"interests": ["cybersecurity"], "goals": ["project"]}, "Build a cybersecurity awareness dashboard with phishing checks, password scoring, and learning modules.", "Cybersecurity Project Track", 0.79),
    Rule("R8", "Cloud deployment boost", {"interests": ["cloud"]}, "Add deployment, monitoring, and documentation to make your project portfolio-ready.", "Cloud Portfolio Add-on", 0.62),
    Rule("R9", "Confusion support", {"emotions": ["confused"]}, "Choose one primary track now and use a three-step plan instead of comparing every option.", "Decision Support", 0.56),
    Rule("R10", "Placement fundamentals", {"branches": ["cse", "it"], "goals": ["placement"]}, "Prioritize DSA, core CS basics, resume projects, and mock interviews for placement readiness.", "Software Placement Track", 0.81),
    Rule("R11", "Mobile app project fit", {"interests": ["app development"], "goals": ["project"]}, "Build a student utility mobile app such as attendance tracking, campus events, or study reminders.", "Mobile App Development Track", 0.82),
    Rule("R12", "ML skill project fit", {"interests": ["ai"], "skills": ["ml"]}, "Build a machine-learning mini app with a clean UI, a small dataset, and visible model confidence.", "Machine Learning App Track", 0.85),
    Rule("R13", "Blockchain academic fit", {"interests": ["blockchain"], "goals": ["project"]}, "Build a certificate verification or student achievement ledger using a simple blockchain concept.", "Blockchain Academic Track", 0.74),
    Rule("R14", "IoT campus fit", {"interests": ["iot"], "goals": ["project"]}, "Build an IoT campus monitoring dashboard for room occupancy, energy use, or smart lab alerts.", "IoT Campus Project Track", 0.77),
    Rule("R15", "Final-year project pressure", {"years": ["final year"], "goals": ["project"]}, "Pick a project with visible UI, explanation, deployment, and a clear report structure.", "Final Year Project Track", 0.76),
    Rule("R16", "App internship fit", {"interests": ["app development"], "goals": ["internship"]}, "Prepare an app-development internship portfolio with one polished Flutter or React Native project.", "App Development Internship Track", 0.80),
]


def contains_phrase(text: str, phrase: str) -> bool:
    escaped = re.escape(phrase)
    return bool(re.search(rf"(^|\s){escaped}(\s|$)", text))


def collect_matches(group: Dict[str, List[str]], text: str) -> List[str]:
    return [canonical for canonical, aliases in group.items() if any(contains_phrase(text, alias) for alias in aliases)]


def extract_profile(text: str) -> Dict[str, List[str] | str]:
    normalized = text.lower()
    emotion = "neutral"
    for label, aliases in KEYWORDS["emotions"].items():
        if any(contains_phrase(normalized, alias) for alias in aliases):
            emotion = label
            break

    return {
        "branches": collect_matches(KEYWORDS["branches"], normalized),
        "years": collect_matches(KEYWORDS["years"], normalized),
        "interests": collect_matches(KEYWORDS["interests"], normalized),
        "skills": collect_matches(KEYWORDS["skills"], normalized),
        "goals": collect_matches(KEYWORDS["goals"], normalized),
        "emotions": [emotion],
    }


def match_rule(rule: Rule, profile: Dict[str, List[str] | str]):
    matched_signals: List[str] = []
    for field, required_values in rule.conditions.items():
        actual_values = profile.get(field, [])
        if not isinstance(actual_values, list):
            actual_values = [str(actual_values)]
        if not all(value in actual_values for value in required_values):
            return None
        matched_signals.extend(required_values)

    score = min(rule.weight + len(matched_signals) * 0.04, 0.98)
    return {
        "id": rule.rule_id,
        "name": rule.name,
        "category": rule.category,
        "recommendation": rule.recommendation,
        "score": score,
        "matched_signals": matched_signals,
    }


def infer(text: str):
    profile = extract_profile(text)
    fired = [result for rule in RULES if (result := match_rule(rule, profile))]
    fired.sort(key=lambda item: item["score"], reverse=True)

    if not fired:
        return {
            "profile": profile,
            "recommendation": "Share your branch, year, interests, skills, and goal for a stronger recommendation.",
            "category": "More Information Needed",
            "confidence": 25,
            "rules": [],
        }

    best = fired[0]
    confidence = round(min(sum(item["score"] for item in fired) / len(fired) * 100, 96))
    return {
        "profile": profile,
        "recommendation": best["recommendation"],
        "category": best["category"],
        "confidence": confidence,
        "rules": fired,
    }


if __name__ == "__main__":
    print("Student Career Expert System")
    print("Type 'exit' to stop.")
    while True:
        user_input = input("\nStudent: ").strip()
        if user_input.lower() in {"exit", "quit"}:
            break
        result = infer(user_input)
        print(f"\nRecommendation: {result['category']}")
        print(result["recommendation"])
        print(f"Confidence: {result['confidence']}%")
        print("Rules fired:")
        for rule in result["rules"]:
            print(f"- Rule {rule['id']} - {rule['name']} matched {', '.join(rule['matched_signals'])}")
