import { Agent } from "@mastra/core/agent";
import { google } from '@ai-sdk/google';
 
 
// Agent that generates multiple holiday options
// Returns a JSON array of locations and descriptions
export const summaryTravelAgent = new Agent({
  name: "summaryTravelAgent",
  model: google('gemini-2.5-flash-lite'),
  instructions: `
  You are a travel agent who is given a user prompt about what kind of holiday they want to go on.
  You then generate 3 different options for the holiday. Return the suggestions as a JSON array {"location": "string", "description": "string"}[]. Don't format as markdown.
  Make the options as different as possible from each other.
  Also make the plan very short and summarized.
  `,
});
 
// Agent that creates detailed travel plans
// Takes the selected option and generates a comprehensive itinerary
export const travelAgent = new Agent({
  name: "travelAgent",
  model: google('gemini-2.5-flash-lite'),
  instructions: `
  You are a travel agent who is given a user prompt about what kind of holiday they want to go on. A summary of the plan is provided as well as the location.
  You then generate a detailed travel plan for the holiday.
  `,
});