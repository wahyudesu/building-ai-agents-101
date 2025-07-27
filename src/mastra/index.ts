
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { simpleAgent } from './agents/1.simple-agent';
import { catAgents } from './agents/2.agent-with-tools';
import { weatherAgent } from './agents/3.agent-with-tools';
import { stockAgent } from './agents/4.agent-with-tools';
import { publisherAgent } from './agents/5.multi-agents';
import { ragAgent } from './agents/6.rag-agent';
import { memeGeneratorAgent } from './agents/7.meme-agents';
import { summaryTravelAgent, travelAgent } from "./agents/8.travel-agent";
import { travelAgentWorkflow } from './workflows/human-in-the-loop';
import { memeGenerationWorkflow } from './workflows/meme-generation';

import { PgVector } from "@mastra/pg";

const pgVector = new PgVector({
  connectionString: process.env.DATABASE_URL!,
});

export const mastra = new Mastra({
  agents: { 
    simpleAgent, weatherAgent, catAgents, stockAgent, publisherAgent, ragAgent, summaryTravelAgent, travelAgent, memeGeneratorAgent
  },
  workflows: {
    travelAgentWorkflow, memeGenerationWorkflow
  },
  vectors: { pgVector},
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  server: {
    build: {
      swaggerUI: true, //swagger UI for API docs
      apiReqLogs: true, // API request logs
      openAPIDocs: true, // OpenAPI docs for API
    },
  },
});
