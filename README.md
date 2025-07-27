# 🧠 Building AI Agents 101 (Mastra + Vercel AI SDK)

Build AI agents step by step by step in a simple way using Mastra

What you'll learn:
- Build simple AI agents using Mastra
- Create and integrate custom tools into agents
- Use RAG (Retrieval-Augmented Generation) as tool in agents
- What is the complex workflow like
- Build Multi-Agent Workflow
- Deploying agents to production using Mastra Cloud

---

## 🧰 Prerequisites
- Node.js v20.0 atau lebih tinggi
- pnpm (install via `npm install -g pnpm`)  
- API key from a model provider (e.g., Groq or Gemini)
- Postgresql database (for rag)

---

## 📦 Getting started

Start development:

```bash
git clone https://github.com/wahyudesu/building-ai-agents-101.git
cd building-ai-agents-101
pnpm i
```

Create your .env file:

```bash
# Fill in the required API keys and database URL.
cp .env.example .env
```

```
pnpm dev
```

Check di http://localhost:4111/agents
Access swagger-ui http://localhost:4111/swagger-ui

## Upsert data before running RAG Agents 
```
npx tsx src/mastra/rag.ts
```

## Deploy to production
- publish to github as fork 
- go to https://mastra.ai/cloud and login using github
- select repo and deploy

(Read more...)[https://mastra.ai/en/docs/deployment/overview]