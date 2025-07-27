import { createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

import { extractFrustrationsStep } from './steps/extract-frustrations';
import { findBaseMemeStep } from './steps/find-base-meme';
import { generateCaptionsStep } from './steps/generate-captions';
import { generateMemeStep } from './steps/generate-meme';

export const memeGenerationWorkflow = createWorkflow({
  id: 'meme-generation',
  description: 'Workflow lengkap untuk menghasilkan meme dari keluhan pekerjaan',
  inputSchema: z.object({
    userInput: z.string().describe('Input mentah pengguna tentang keluhan kerja'),
  }),
  outputSchema: z.object({
    shareableUrl: z.string(),
    pageUrl: z.string().optional(),
    analysis: z.object({
      message: z.string(),
    }),
  }),
  steps: [
    extractFrustrationsStep,
    findBaseMemeStep,
    generateCaptionsStep,
    generateMemeStep,
  ],
});

// Build the workflow chain with data mapping
memeGenerationWorkflow
  .then(extractFrustrationsStep)
  .then(findBaseMemeStep)
  .map({
    frustrations: {
      step: extractFrustrationsStep,
      path: '.',
    },
    baseTemplate: {
      step: findBaseMemeStep,
      path: 'templates.0',
    },
  })
  .then(generateCaptionsStep)
  .map({
    baseTemplate: {
      step: findBaseMemeStep,
      path: 'templates.0',
    },
    captions: {
      step: generateCaptionsStep,
      path: '.',
    },
  })
  .then(generateMemeStep)
  .map({
    shareableUrl: {
      step: generateMemeStep,
      path: 'imageUrl',
    },
    pageUrl: {
      step: generateMemeStep,
      path: 'pageUrl',
    },
    analysis: {
      step: generateMemeStep,
      path: 'analysis',
    },
  })
  .commit();