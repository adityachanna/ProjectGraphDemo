# Conversational Expert System

A student career guidance expert system built with Next.js, React, TypeScript, D3.js, and OpenRouter.

The app accepts natural language input from a student, extracts useful terms, builds a knowledge graph, fires symbolic expert-system rules, calculates confidence, and returns a recommendation with an explanation chain.

## Features

- Natural language style preprocessing in TypeScript
- Student-focused knowledge base for AI, full stack, ML, app development, cybersecurity, cloud, UI/UX, data science, blockchain, and IoT
- Rule-based inference engine with visible rule IDs
- Confidence score based on matched rules
- Emotion detection for confused, stressed, confident, and neutral tone
- OpenRouter integration for polished responses
- D3.js live knowledge graph visualization
- Vercel-ready Next.js deployment

## Tech Stack

- Next.js App Router
- React
- TypeScript
- D3.js
- OpenAI SDK with OpenRouter

## Project Flow

```text
Student Input
  -> NLP-style keyword extraction
  -> Entity detection
  -> Knowledge graph generation
  -> Rule-based inference
  -> Confidence calculation
  -> OpenRouter response polishing
  -> Chat response + graph + explanation chain
```

## Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## OpenRouter Setup

Create `.env.local`:

```env
OPENROUTER_API_KEY=your_openrouter_key_here
```

The app still works without the key because it has a local fallback response generator.

## Vercel Deployment

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Add the environment variable:

```env
OPENROUTER_API_KEY=your_openrouter_key_here
```

4. Deploy.

## Important Files

- `app/page.tsx` - main UI
- `app/api/chat/route.ts` - chat API endpoint
- `lib/knowledgeBase.ts` - facts, keywords, and expert rules
- `lib/inference.ts` - rule firing and confidence scoring
- `lib/nlp.ts` - lightweight extraction
- `lib/graph.ts` - graph data builder
- `components/KnowledgeGraph.tsx` - D3 graph

## Sample Inputs

```text
I am a second year CSE student interested in AI and web development, but I am confused about project ideas.
```

```text
I want to build a machine learning app using Python and ML for my final year project.
```

```text
I like app development and Flutter. Suggest a project for internship.
```

```text
I am interested in cybersecurity and cloud, and I need a portfolio project.
```

## Rule IDs

The labels such as `R2`, `R3`, and `R9` are expert-system rules from the knowledge base.

Example:

- `R2` means the full-stack project rule fired.
- `R3` means the AI plus web combination rule fired.
- `R9` means the system detected confusion and added decision-support guidance.

This is useful for explaining symbolic reasoning during a project presentation.
