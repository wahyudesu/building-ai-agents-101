import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
 
// Step that generates multiple holiday options based on user's vacation description
// Uses the summaryTravelAgent to create diverse travel suggestions
const generateSuggestionsStep = createStep({
  id: "generate-suggestions",
  inputSchema: z.object({
    vacationDescription: z.string().describe("The description of the vacation"),
  }),
  outputSchema: z.object({
    suggestions: z.array(z.string()),
    vacationDescription: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    if (!mastra) {
      throw new Error("Mastra is not initialized");
    }
 
    const { vacationDescription } = inputData;
    const result = await mastra.getAgent("summaryTravelAgent").generate([
      {
        role: "user",
        content: vacationDescription,
      },
    ]);
    console.log(result.text);
    return { suggestions: JSON.parse(result.text), vacationDescription };
  },
});
 
// Step that pauses the workflow to get user input
// Allows the user to select their preferred holiday option from the suggestions
// Uses suspend/resume mechanism to handle the interaction
const humanInputStep = createStep({
  id: "human-input",
  inputSchema: z.object({
    suggestions: z.array(z.string()),
    vacationDescription: z.string(),
  }),
  outputSchema: z.object({
    selection: z.string().describe("The selection of the user"),
    vacationDescription: z.string(),
  }),
  resumeSchema: z.object({
    selection: z.string().describe("The selection of the user"),
  }),
  suspendSchema: z.object({
    suggestions: z.array(z.string()),
  }),
  execute: async ({ inputData, resumeData, suspend, getInitData }) => {
    if (!resumeData?.selection) {
      return suspend({ suggestions: inputData?.suggestions });
    }
 
    return {
      selection: resumeData?.selection,
      vacationDescription: inputData?.vacationDescription,
    };
  },
});
 
// Step that creates a detailed travel plan based on the user's selection
// Uses the travelAgent to generate comprehensive holiday details
const travelPlannerStep = createStep({
  id: "travel-planner",
  inputSchema: z.object({
    selection: z.string().describe("The selection of the user"),
    vacationDescription: z.string(),
  }),
  outputSchema: z.object({
    travelPlan: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const travelAgent = mastra?.getAgent("travelAgent");
    if (!travelAgent) {
      throw new Error("Travel agent is not initialized");
    }
 
    const { selection, vacationDescription } = inputData;
    const result = await travelAgent.generate([
      { role: "assistant", content: vacationDescription },
      { role: "user", content: selection || "" },
    ]);
    console.log(result.text);
    return { travelPlan: result.text };
  },
});
 
// Main workflow that orchestrates the holiday planning process:
// 1. Generates multiple options
// 2. Gets user input
// 3. Creates detailed plan
const travelAgentWorkflow = createWorkflow({
  id: "travel-agent-workflow",
  inputSchema: z.object({
    vacationDescription: z.string().describe("The description of the vacation"),
  }),
  outputSchema: z.object({
    travelPlan: z.string(),
  }),
})
  .then(generateSuggestionsStep)
  .then(humanInputStep)
  .then(travelPlannerStep);
 
travelAgentWorkflow.commit();
 
export { travelAgentWorkflow, humanInputStep };