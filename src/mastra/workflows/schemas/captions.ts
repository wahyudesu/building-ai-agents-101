import { z } from 'zod';

export const captionsSchema = z.object({
  topText: z.string().describe('Teks untuk bagian atas meme'),
  bottomText: z.string().describe('Teks untuk bagian bawah meme'),
  memeStyle: z
    .enum(['jenaka', 'sarkastik', 'relate', 'berlebihan', 'datar'])
    .describe('Gaya humor yang digunakan'),
  humorLevel: z
    .enum(['ringan', 'sedang', 'pedas'])
    .describe('Seberapa tajam humor yang diinginkan'),
});