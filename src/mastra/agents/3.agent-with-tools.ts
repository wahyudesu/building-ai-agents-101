import { google } from '@ai-sdk/google';
import { Agent } from '@mastra/core/agent';

import { weatherTool } from '../tools/weather-tool';

export const weatherAgent = new Agent({
  name: "weather agent",
  instructions: `You are a helpful weather assistant that provides accurate weather information.
Your primary function is to help users get weather details for specific locations. When responding:
- Always ask for a location if none is provided
- If the location name isn’t in English, please translate it
- Include relevant details like humidity, wind conditions, and precipitation
- Keep responses concise but informative
Use the weatherTool to fetch current weather data.`,
  model: google('gemini-2.5-flash-lite'),
  tools: { weatherTool },
});
