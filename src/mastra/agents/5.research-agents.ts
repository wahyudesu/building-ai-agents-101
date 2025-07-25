import { Agent } from "@mastra/core/agent";
import { createVectorQueryTool, createGraphRAGTool } from "@mastra/rag";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { PgVector } from "@mastra/pg";
import { Mastra } from "@mastra/core";

const google = createGoogleGenerativeAI({
  apiKey: "AIzaSyD9xkywZ7I3cFC8I2-41gtk42jxxZoDYNo",
});

// Create a tool for semantic search over our paper embeddings
const pineconeQueryTool = createVectorQueryTool({
  vectorStoreName: "pinecone",
  indexName: "mycollection",
  model: google.textEmbeddingModel('text-embedding-004'),
});

 
export const ragAgent = new Agent({
  name: "RAG Agent",
  instructions:
    "You are a helpful assistant that answers questions based on the provided context. Keep your answers concise and relevant.",
  model: google('gemini-2.5-flash-lite'),
  tools: {
    pineconeQueryTool,
  },
});

const pgVector = new PgVector({
  connectionString: "postgresql://neondb_owner:npg_OdHP37TWgpwS@ep-broad-waterfall-a1oyt1oy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

export const mastra = new Mastra({
  agents: { ragAgent },
  vectors: { pgVector },
});
 
const agent = mastra.getAgent("ragAgent");

const prompt = `dimana alamat wahyu?`;
 
const completion = await agent.generate(prompt);
console.log(completion.text);