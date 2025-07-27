import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { generateObject } from 'ai';
// import { openai } from '@ai-sdk/openai';
import { groq } from '@ai-sdk/groq';
import { frustrationsSchema } from '../schemas/frustrations';
import { memeTemplateSchema } from '../schemas/meme-template';
import { captionsSchema } from '../schemas/captions';

export const generateCaptionsStep = createStep({
  id: 'generate-captions',
  description: 'Generate caption lucu berdasarkan keluhan dan template meme',
  inputSchema: z.object({
    frustrations: frustrationsSchema,
    baseTemplate: memeTemplateSchema,
  }),
  outputSchema: captionsSchema,
  execute: async ({ inputData }) => {
    try {
      console.log(
        `🎨 Membuat caption untuk meme ${inputData.baseTemplate.name}...`
      );

      const mainFrustration = inputData.frustrations.frustrations[0];
      const mood = inputData.frustrations.overallMood;

      const result = await generateObject({
        model: groq('llama-3.3-70b-versatile'),
        schema: captionsSchema,
        prompt: `
          Buatlah caption meme untuk template "${inputData.baseTemplate.name}".
          
          Konteks:
          - Keluhan: ${mainFrustration.text}
          - Kategori: ${mainFrustration.category}
          - Mood: ${mood}
          - Meme memiliki ${inputData.baseTemplate.box_count} kotak teks
          
          Buatlah yang lucu dan relate untuk pekerja kantoran. Humor harus sesuai dengan mood ${mood}.
          Jaga teks tetap ringkas untuk format meme. Kreatif tapi tetap pantas untuk tempat kerja.
          
          PENTING: Buatlah caption dalam bahasa Indonesia yang natural dan lucu.
        `,
      });

      console.log('✅ Caption berhasil dibuat');
      return result.object;
    } catch (error) {
      console.error('Error generating captions:', error);
      throw new Error('Gagal membuat caption');
    }
  },
});