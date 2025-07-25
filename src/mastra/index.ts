
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherAgent } from './agents/weather-agent';
import { simpleAgent } from './agents/1.simple-agents';
import { catAgents } from './agents/2.agents-with-tools';
import { stockAgent } from './agents/4.agents-with-tools';

export const mastra = new Mastra({
  agents: { simpleAgent, weatherAgent, catAgents, stockAgent },
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
      swaggerUI: true,
      apiReqLogs: true,
      openAPIDocs: true,
    },
  },
});
