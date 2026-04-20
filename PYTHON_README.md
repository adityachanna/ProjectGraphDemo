# Python Expert System Version

This is a standalone Python version of the student career guidance expert system.

It is useful for explaining the core AI syllabus concepts without the web interface:

- facts
- predicates
- rule matching
- symbolic reasoning
- confidence scoring
- explanation chain

## File

```text
python_expert_system/expert_system.py
```

## Run

```bash
python python_expert_system/expert_system.py
```

## Example

Input:

```text
I am a second year CSE student interested in AI and web development, but I am confused about project ideas.
```

Expected style of output:

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

## How It Works

The Python script follows this pipeline:

```text
User Input
  -> lowercase normalization
  -> keyword and entity extraction
  -> rule matching
  -> confidence calculation
  -> recommendation and explanation
```

## Knowledge Base

The knowledge base is stored directly inside the Python file:

- `KEYWORDS` stores domain facts and aliases.
- `RULES` stores expert-system rules.
- `extract_profile()` extracts student signals.
- `match_rule()` checks whether a rule should fire.
- `infer()` returns the final result.

## Why This Helps in Presentation

The Python version proves the reasoning engine is not dependent on the LLM.

The Next.js version is the presentable deployed app.

Together, they show:

- symbolic AI
- NLP preprocessing
- expert-system rules
- confidence scoring
- explanation chain
- practical web deployment
