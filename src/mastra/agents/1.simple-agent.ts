import { google } from '@ai-sdk/google';
import { Agent } from '@mastra/core/agent';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// const google = createGoogleGenerativeAI({
//   baseURL: process.env.GOOGLE_GENERATIVE_AI_BASE_URL, // tracing, spesific provider
//   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
// });

export const simpleAgent = new Agent({
  name: 'simple agent',
  instructions: `You are a helpful assistant`,
  model: google('gemini-2.5-flash-lite'),
});