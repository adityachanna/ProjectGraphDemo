# Conversational Expert System

A student career guidance expert system built with Next.js, React, TypeScript, D3.js, OpenRouter, and a standalone Python expert-engine variant.

The app accepts natural language student input, extracts profile signals, builds a knowledge graph, fires symbolic rules, computes confidence, and returns explainable recommendations.

This repository contains two complementary versions of the same idea:

- the Next.js web app for a polished interactive experience
- the Python expert system for explainable symbolic AI and NLP demonstration

## Core Features

- Natural-language preprocessing in both TypeScript and Python
- Student-focused knowledge base for AI, full stack, ML, app development, cybersecurity, cloud, UI/UX, data science, blockchain, and IoT
- Rule-based inference with transparent rule IDs
- Confidence scoring derived from matched rules
- Emotion detection (confused, stressed, confident, neutral)
- OpenRouter integration for polished conversational responses
- D3.js knowledge graph visualization
- Vercel-ready Next.js deployment

## What The App Does

The system is designed to help a student turn vague career goals into a concrete project or learning track.

Typical inputs include branch, year, interest area, skills, and a goal such as project, internship, or placement. The engine then combines those signals with rule logic to produce a recommendation that is explainable rather than hidden inside a black box.

## Architecture Overview

The app is split into three layers:

1. UI layer: the chat interface, explanation panel, and knowledge graph.
2. Reasoning layer: NLP extraction, rule matching, scoring, and graph-building helpers.
3. Response layer: optional OpenRouter polishing plus local fallback output.

That separation keeps the app easy to present, test, and extend.

## Tech Stack

- Next.js App Router
- React + TypeScript
- D3.js
- OpenAI SDK (used with OpenRouter)
- Python 3.10+
- NLTK (for Python NLP preprocessing)

## End-to-End Project Flow

```text
Student Input
  -> Text preprocessing (normalization + NLP signals)
  -> Entity and intent extraction
  -> Rule matching against expert knowledge base
  -> Confidence aggregation
  -> Explanation chain generation (rules fired + matched signals)
  -> Optional LLM polishing (OpenRouter)
  -> UI response + reasoning transparency + graph
```

## Folder Guide

- app/page.tsx - main page and layout composition
- app/api/chat/route.ts - server endpoint for chat requests
- components/ChatPanel.tsx - input and conversation UI
- components/ExplanationPanel.tsx - rule explanations and reasoning summary
- components/KnowledgeGraph.tsx - D3 graph rendering
- lib/knowledgeBase.ts - canonical career domains, aliases, and expert rules
- lib/nlp.ts - lightweight text preprocessing and signal extraction in TypeScript
- lib/inference.ts - rule matching, scoring, and confidence logic
- lib/graph.ts - graph nodes and edges used by D3
- lib/openrouter.ts - OpenRouter client and fallback response generation
- lib/types.ts - shared types for recommendations, rules, and graph data

## Request Flow

When a user sends a message, the app follows this sequence:

1. The text is normalized and parsed into useful signals.
2. The inference layer checks which symbolic rules match.
3. The explanation chain is assembled from fired rules and matched signals.
4. The graph layer converts the recommendation into a visual knowledge graph.
5. If OpenRouter is available, the response is polished for readability.
6. The UI renders the final chat reply plus supporting reasoning.

This lets the app feel conversational while still exposing the actual decision path.

## Run Web App Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## OpenRouter Setup

Create .env.local in project root:

```env
OPENROUTER_API_KEY=your_openrouter_key_here
```

If the key is missing, the app falls back to local response generation.

### Environment Notes

- OPENROUTER_API_KEY is optional for local development.
- The repository is usable even without external model access.
- If you deploy to Vercel, set the same variable in project settings.

## Recommendation Logic

The recommendation engine is intentionally symbolic.

It looks for patterns such as:

- AI interest plus project goal
- web development plus full-stack project intent
- confused emotion plus a need for decision support
- branch and placement intent for placement-oriented tracks

Rules are easier to explain than raw model output, which makes the system suitable for academic demos and interviews.

## Output Format

The system usually returns three things together:

1. a recommendation title
2. an explanation chain showing which rules fired
3. a graph or structured view of the extracted signals

That combination is more useful than a single sentence answer because it shows both the suggestion and the reason behind it.

## Local Development Tips

- Run npm run dev for the web app.
- Use a short, natural sentence when testing the chat flow.
- Try inputs with different combinations of branch, year, interest, and goal to see how the rules change.
- If OpenRouter is unavailable, validate the local fallback path first.

## Troubleshooting

### Build or type errors

If the project stops during build, check the TypeScript or OpenRouter payload types first. The app relies on a typed request/response flow, so a mismatch usually surfaces there.

### Empty or weak recommendations

If the response looks generic, the input probably does not contain enough signals. Add:

- your branch
- your academic year
- one or two interests
- your target goal

### Graph not visible

If the knowledge graph does not render, check whether the extracted recommendation data is present and whether the browser blocks the D3 mount step.

## Python Expert System (In-Depth)

The Python module is intentionally standalone so you can demonstrate symbolic AI, rule explainability, and NLP preprocessing independently of the web layer.

Location:

```text
python_expert_system/expert_system.py
```

### Why Use the Python Version

- Works as a clean academic demonstration of expert systems
- Shows deterministic rule reasoning without LLM dependence
- Produces explainable outputs suitable for viva/demo
- Uses NLTK preprocessing to improve profile extraction quality

### What Makes It Different From The Web App

The Python version is not a UI copy of the Next.js app. It is a focused symbolic AI engine meant to show the reasoning mechanics more directly.

Use it when you want to explain:

- how rules fire
- how canonical keywords are normalized
- why lemmatization helps matching
- how confidence can be computed from symbolic matches

The web app is better for presentation. The Python version is better for proof of logic.

### Python Setup

1. Create and activate a virtual environment.
2. Install NLTK.
3. Run the script.

Windows (PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install nltk
python python_expert_system\expert_system.py
```

macOS/Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install nltk
python python_expert_system/expert_system.py
```

### NLTK Resources

On first run, the script auto-checks and downloads required corpora when available:

- stopwords
- wordnet
- omw-1.4

If download is not possible (offline environment), the engine safely falls back to normalized text matching, so inference still works.

### Python NLP Pipeline

The Python engine combines two parallel representations of user text:

1. Raw normalized text
2. NLTK-enriched normalized text

NLTK processing steps:

1. Lowercasing + punctuation cleanup
2. Tokenization with wordpunct_tokenize
3. Stopword removal
4. Lemmatization using WordNetLemmatizer

Both representations are searched for keyword aliases so matching remains robust for phrasing variations.

### Example Signals The Engine Understands

- second year, third year, final year
- ai, machine learning, full stack, flutter, cybersecurity, cloud
- internship, project, placement, higher studies
- confused, stressed, confident

This is why a student can type a sentence in natural language instead of filling a form.

### Rule Engine Behavior

Each rule contains:

- rule_id
- conditions (fields and required canonical values)
- recommendation text
- category label
- base weight

Scoring behavior:

- A rule fires only if all required condition values are present
- Rule score increases with number of matched signals
- Final confidence is aggregated from fired rule scores and capped for stability

### Interpreting Rule IDs

The rule identifiers are there for explainability.

- R1 / R3: AI-oriented tracks
- R2: web and full-stack direction
- R5 / R10 / R15: year or placement-based guidance
- R9: decision support when the user sounds confused

Those labels are useful during a viva because you can point to exactly why a recommendation was produced.

### Example Input

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

### Suggested Viva/Presentation Narrative

1. Explain keyword ontology (branch, year, interests, skills, goals, emotions).
2. Show NLTK preprocessing and why lemmatization improves matching recall.
3. Demonstrate deterministic rule firing and explanation chain.
4. Compare symbolic output with UI + OpenRouter polished output.
5. Emphasize explainable AI over black-box-only behavior.

## Vercel Deployment

1. Push project to GitHub.
2. Import repo in Vercel.
3. Add OPENROUTER_API_KEY in Vercel environment settings.
4. Deploy.

## Why This Repository Is Structured This Way

This project is intentionally split into a modern frontend and a deterministic Python backend example so it can serve multiple purposes:

- an interactive product demo
- an explainable AI case study
- a symbolic reasoning assignment
- a practical portfolio project

That makes the repository more useful than a single-model chatbot because it demonstrates both engineering and reasoning.

## Important Files

- app/page.tsx - main UI
- app/api/chat/route.ts - chat API endpoint
- lib/knowledgeBase.ts - facts and expert rules
- lib/inference.ts - rule firing and confidence scoring
- lib/nlp.ts - TypeScript-side NLP extraction
- lib/graph.ts - graph data builder
- components/KnowledgeGraph.tsx - D3 visualization
- python_expert_system/expert_system.py - standalone Python expert system with NLTK preprocessing
- PYTHON_README.md - deep Python-specific guide

## Sample Inputs

```text
I want to build a machine learning app using Python and ML for my final year project.
```

```text
I like app development and Flutter. Suggest a project for internship.
```

```text
I am interested in cybersecurity and cloud, and I need a portfolio project.
```

## Rule IDs (Interpretability)

Rule labels such as R2, R3, and R9 map directly to explicit expert rules.

- R2: Full-stack project rule fired
- R3: AI + web combination rule fired
- R9: Confusion-support guidance fired

This makes recommendations explainable and presentation-friendly.

## Suggested Demo Script

If you are presenting the project, a simple flow works well:

1. Enter a student profile with branch, year, interest, and goal.
2. Show the fired rules and explain why each one matched.
3. Highlight the confidence score and what it means.
4. Open the Python version and explain how NLTK improves preprocessing.
5. Compare the symbolic explanation with the polished web UI.
