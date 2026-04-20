# Python Expert System (NLTK-Enhanced)

This module is a standalone, explainable AI engine for student career guidance.

It demonstrates core expert-system concepts in a clean Python implementation:

- fact representation via canonical keyword groups
- symbolic rule matching
- deterministic inference
- confidence estimation
- rule-level explanation chain
- NLTK preprocessing for stronger natural-language matching

It is meant to be readable enough for coursework and expressive enough to demonstrate real symbolic reasoning.

## File Location

```text
python_expert_system/expert_system.py
```

## Python Requirements

- Python 3.10+
- nltk

The module uses only standard library code plus NLTK, so the dependency surface stays small and easy to explain.

Install dependencies:

```bash
pip install nltk
```

Recommended virtual environment setup:

Windows (PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install nltk
```

macOS/Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install nltk
```

## NLTK Integration Details

The script checks for required NLTK resources at startup:

- stopwords
- wordnet
- omw-1.4

If these corpora are missing, the script attempts to download them automatically.

If download fails (for example in offline environments), inference still runs using normalized text fallback, so the system remains usable.

### Why NLTK Is Used Here

NLTK helps the engine handle natural student phrasing better than raw substring checks alone.

It adds three practical improvements:

- tokenization of free-form input
- stopword removal so noisy words do not dominate matching
- lemmatization so word variants are easier to recognize

This is especially helpful when a student types slightly different forms of the same idea, such as project, projects, or building a project.

## Run the Expert System

```bash
python python_expert_system/expert_system.py
```

Exit with:

```text
exit
```

or

```text
quit
```

## Inference Pipeline

```text
Student Input
  -> Whitespace and punctuation normalization
  -> NLTK tokenization
  -> Stopword removal
  -> Lemmatization
  -> Profile extraction (branch, year, interests, skills, goals, emotion)
  -> Rule matching
  -> Rule scoring and confidence aggregation
  -> Recommendation + explanation chain
```

## Internal Design

The implementation is intentionally compact, but it still separates concerns:

- keyword tables define the domain vocabulary
- extraction builds a profile from the input sentence
- rules describe what combinations should fire
- inference selects the strongest recommendation
- presentation prints a readable result for the console

That separation makes the code easy to modify without turning it into a tangled script.

## Core Data Structures

### KEYWORDS

Maps each domain field to canonical labels and alias phrases.

Main fields:

- branches
- years
- interests
- skills
- goals
- emotions

Example idea:

- canonical value: ai
- aliases: ai, artificial intelligence, machine learning, ml, llm

This design keeps user text flexible while preserving deterministic internal labels.

### PROFILE EXTRACTION

The profile produced by the extractor usually includes:

- branches
- years
- interests
- skills
- goals
- emotions

The current design gives emotions a single canonical value because the system is meant to choose the most dominant tone rather than build a sentiment spectrum.

### RULES

Rules are modeled as dataclass objects with:

- rule_id
- name
- conditions
- recommendation
- category
- weight

Condition matching requires all required canonical values to be present for each field listed in the rule.

Example rule patterns:

- AI interest + project goal -> AI project guidance
- full-stack interest + project goal -> web project guidance
- confused emotion -> decision support guidance
- branch + placement goal -> placement-focused advice

## How Confidence Is Computed

1. Each fired rule starts from its base weight.
2. Additional matched signals increase rule score.
3. Fired rules are sorted by score.
4. Final confidence is computed from average fired-rule strength and bounded for stability.

This keeps confidence interpretable and avoids unstable extreme values.

## Why This Is Explainable

The system does not hide its reasoning.

For each recommendation, it can show:

- which rule fired
- what signals were matched
- which category was selected
- what confidence level was assigned

That is the main reason this style is useful in AI coursework and project evaluations.

## Example Session

Input:

```text
I am a second year CSE student interested in AI and web development, but I am confused about project ideas.
```

Output style:

```text
Recommendation: AI + Full Stack Project Track
Build an AI + full-stack expert system that demonstrates NLP, rules, confidence, and graph reasoning.
Confidence: 89%
Rules fired:
- Rule R3 - AI plus web combination matched ai, web development
- Rule R1 - AI project fit matched ai, project
- Rule R2 - Full-stack project fit matched web development, project
- Rule R9 - Confusion support matched confused
```

### Another Example

Input:

```text
I am in final year and I want a cybersecurity project for internship.
```

Likely output direction:

```text
Recommendation: Cybersecurity Project Track
Build a cybersecurity awareness dashboard with phishing checks, password scoring, and learning modules.
```

This shows how the same engine can adapt to different student goals without changing the code structure.

## Extending the System

### Add new synonyms/aliases

Update the appropriate KEYWORDS group. Prefer canonical labels that are short and unambiguous.

### Add a new rule

Append a Rule object to RULES with clear conditions and recommendation text.

### Add domain-specific signals

You can add new groups (for example certifications, preferred company type, or learning style) and include them in profile extraction plus rule conditions.

### Add more sophisticated NLP later

If you want to extend the project, good next steps would be:

- stemming or a custom tokenizer
- synonym expansion
- phrase-based ranking
- lightweight intent classification

The current version keeps things simple on purpose, which is better for explainability.

## Testing Suggestions

There is no formal test suite in this module yet, but you can still validate behavior with a few quick console inputs:

- an AI + web input should fire the combined track
- an app development input should prefer mobile app recommendations
- a confused input should always surface decision support
- a placement-focused CSE or IT input should move toward placement guidance

If you add tests later, focus on extract_profile, match_rule, and infer because those are the core reasoning functions.

## Troubleshooting

### NLTK lookup errors

If your environment blocks auto-download, install resources manually:

```bash
python -m nltk.downloader stopwords wordnet omw-1.4
```

### No rules fired

Provide more explicit profile details in input:

- branch
- current year
- interest area
- skill stack
- goal (project/internship/placement)

### Unexpected matching

If a sentence matches the wrong track, review the alias list first. In this engine, alias quality matters more than model complexity.

### Missing NLTK corpora

If auto-download is blocked, the fallback still works, but lemmatization quality will be lower. Install the corpora manually if possible.

## Limitations

The current engine is intentionally deterministic, so it has a few limits:

- it does not understand deep context or long conversation history
- it does not score multiple competing tracks with a learned model
- it depends on curated keyword aliases and rules
- it is optimized for transparency, not broad language generalization

Those limits are acceptable here because the goal is explainability and academic clarity.

## Why This Module Matters

This Python implementation is ideal for:

- explainable AI demos
- expert-system coursework
- viva presentations
- algorithm walkthroughs without frontend complexity

It complements the Next.js interface while preserving transparent, deterministic reasoning.

## Good Demo Talking Points

If you are explaining the module to someone, these points are usually enough:

1. The engine starts with raw student text.
2. NLTK cleans and normalizes the text.
3. Canonical keywords are extracted into a profile.
4. Expert rules fire only when conditions are satisfied.
5. Confidence is derived from rule strength, not random output.
6. The final recommendation is explainable and repeatable.
