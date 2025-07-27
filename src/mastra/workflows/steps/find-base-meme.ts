import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { frustrationsSchema } from '../schemas/frustrations';
import { memeTemplateSchema } from '../schemas/meme-template';

export const findBaseMemeStep = createStep({
  id: 'find-base-meme',
  description: "Dapatkan template meme dari API Imgflip",
  inputSchema: frustrationsSchema.extend({
    analysis: z.object({
      message: z.string(),
    }),
  }),
  outputSchema: z.object({
    templates: z.array(memeTemplateSchema),
    searchCriteria: z.object({
      primaryMood: z.string(),
      style: z.string(),
    }),
    analysis: z.object({
      message: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    try {
      console.log('🔍 Mencari template meme yang sesuai...');

      const response = await fetch('https://api.imgflip.com/get_memes');
      const data = await response.json();

      if (!data.success) {
        throw new Error('Gagal mengambil meme dari Imgflip');
      }

      // Dapatkan pilihan meme populer yang beragam
      const popularMemes = data.data.memes.slice(0, 100);
      const shuffled = popularMemes.sort(() => Math.random() - 0.5);
      const selectedMemes = shuffled.slice(0, 10);

      console.log(`✅ Ditemukan ${selectedMemes.length} template meme yang cocok`);

      return {
        templates: selectedMemes,
        searchCriteria: {
          primaryMood: inputData.overallMood,
          style: inputData.suggestedMemeStyle,
        },
        analysis: {
          message: `Ditemukan ${selectedMemes.length} template meme yang sesuai dengan mood ${inputData.overallMood}`,
        },
      };
    } catch (error) {
      console.error('Error finding meme templates:', error);
      throw new Error('Gagal menemukan template meme');
    }
  },
});