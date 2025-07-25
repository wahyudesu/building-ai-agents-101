import { MDocument } from "@mastra/rag";
import { embedMany } from "ai";
import { mastra } from "./index";
import { PgVector } from "@mastra/pg";

import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Load the paper
const paperUrl = "https://arxiv.org/html/1706.03762";
const response = await fetch(paperUrl);
const paperText = await response.text();
 
// Create document and chunk it
const doc = MDocument.fromText(paperText);
const chunks = await doc.chunk({
  strategy: "recursive",
  size: 6000,
  overlap: 100,
  separator: "\n",
});
 
console.log("Number of chunks:", chunks.length);
// Number of chunks: 893

// Generate embeddings
const { embeddings } = await embedMany({
  values: chunks.map((chunk) => chunk.text),
  model: google.textEmbeddingModel('text-embedding-004', {
    outputDimensionality: 768 //optional, default is 768
  })
});
 
// Get the vector store instance from Mastra
// const pgVector = new PgVector({ connectionString: "postgresql://neondb_owner:npg_OdHP37TWgpwS@ep-broad-waterfall-a1oyt1oy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" });
const pgVector = mastra.getVector("pgVector");

// Create an index for our paper chunks
await pgVector.createIndex({
  indexName: "papers",
  dimension: 768,
});

// Store embeddings
await pgVector.upsert({
  indexName: "papers",
  vectors: embeddings,
  metadata: chunks.map((chunk: any) => ({
    text: chunk.text,
  })),
});