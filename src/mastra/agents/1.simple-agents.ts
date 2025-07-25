import { google } from '@ai-sdk/google';
import { Agent } from '@mastra/core/agent';

export const simpleAgent = new Agent({
  name: 'simple-agent',
  instructions: `You are a helpful assistant`,
  model: google('gemini-2.5-flash-lite'),
});