import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { memeTemplateSchema } from '../schemas/meme-template';
import { captionsSchema } from '../schemas/captions';

export const generateMemeStep = createStep({
  id: 'generate-meme',
  description: "Buat meme menggunakan API Imgflip",
  inputSchema: z.object({
    baseTemplate: memeTemplateSchema,
    captions: captionsSchema,
  }),
  outputSchema: z.object({
    imageUrl: z.string(),
    pageUrl: z.string().optional(),
    captions: z.object({
      topText: z.string(),
      bottomText: z.string(),
    }),
    baseTemplate: z.string(),
    memeStyle: z.string(),
    humorLevel: z.string(),
    analysis: z.object({
      message: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    try {
      console.log('🎨 Membuat meme Anda...');

      const username = process.env.IMGFLIP_USERNAME || 'wahyudesu';
      const password = process.env.IMGFLIP_PASSWORD || '**M@j4U_T@kMundur123!**';

      const formData = new URLSearchParams();
      formData.append('template_id', inputData.baseTemplate.id);
      formData.append('username', username);
      formData.append('password', password);
      formData.append('text0', inputData.captions.topText);
      formData.append('text1', inputData.captions.bottomText);

      const response = await fetch('https://api.imgflip.com/caption_image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const result = await response.json() as {
        success: boolean;
        error_message?: string;
        data: {
          url: string;
          page_url?: string;
        };
      };

      if (!result.success) {
        throw new Error(`Error API Imgflip: ${result.error_message}`);
      }

      console.log('✅ Meme berhasil dibuat!');

      return {
        imageUrl: result.data.url,
        pageUrl: result.data.page_url,
        captions: {
          topText: inputData.captions.topText,
          bottomText: inputData.captions.bottomText,
        },
        baseTemplate: inputData.baseTemplate.name,
        memeStyle: inputData.captions.memeStyle,
        humorLevel: inputData.captions.humorLevel,
        analysis: {
          message: `Meme ${inputData.captions.memeStyle} dibuat dengan level humor ${inputData.captions.humorLevel}`,
        },
      };
    } catch (error) {
      console.error('Error generating meme:', error);
      throw new Error('Gagal membuat meme');
    }
  },
});