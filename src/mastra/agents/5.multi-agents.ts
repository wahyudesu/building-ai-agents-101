import { google } from '@ai-sdk/google';
import { Agent } from '@mastra/core/agent';
import { groq } from '@ai-sdk/groq';
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const copywriterAgent = new Agent({
  name: "Copywriter",
  instructions: "You are a copywriter agent that writes blog post copy.",
  model: google('gemini-2.5-flash-lite'),
});
 
const copywriterTool = createTool({
  id: "copywriter-agent",
  description: "Calls the copywriter agent to write blog post copy.",
  inputSchema: z.object({
    topic: z.string().describe("Blog post topic"),
  }),
  outputSchema: z.object({
    copy: z.string().describe("Blog post copy"),
  }),
  execute: async ({ context }) => {
    const result = await copywriterAgent.generate(
      `Create a blog post about ${context.topic}`,
    );
    return { copy: result.text };
  },
});

const editorAgent = new Agent({
  name: "Editor",
  instructions: "You are an editor agent that edits blog post copy.",
  model: groq("llama-3.1-8b-instant"),
});
 
const editorTool = createTool({
  id: "editor-agent",
  description: "Calls the editor agent to edit blog post copy.",
  inputSchema: z.object({
    copy: z.string().describe("Blog post copy"),
  }),
  outputSchema: z.object({
    copy: z.string().describe("Edited blog post copy"),
  }),
  execute: async ({ context }) => {
    const result = await editorAgent.generate(
      `Edit the following blog post only returning the edited copy: ${context.copy}`,
    );
    return { copy: result.text };
  },
});

export const publisherAgent = new Agent({
  name: "publisherAgent",
  instructions:
    "You are a publisher agent that first calls the copywriter agent to write blog post copy about a specific topic and then calls the editor agent to edit the copy. Just return the final edited copy.",
  model: groq("llama-3.1-8b-instant"),
  tools: { copywriterTool, editorTool },
});