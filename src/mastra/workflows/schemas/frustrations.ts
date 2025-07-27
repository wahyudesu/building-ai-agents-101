import { z } from 'zod';

// Schema untuk ekstraksi keluhan/frustrasi
export const frustrationsSchema = z.object({
  frustrations: z.array(
    z.object({
      text: z.string().describe('Keluhan spesifik yang disebutkan'),
      category: z
        .enum([
          'pemerintah',
          'teknologi',
          'dark jokes',
          'drama atis',
          'beban-kerja',
          'lainnya',
        ])
        .describe('Kategori keluhan'),
      severity: z
        .enum(['ringan', 'sedang', 'berat'])
        .describe('Seberapa parah keluhan ini'),
      keywords: z
        .array(z.string())
        .describe('Kata kunci yang bisa digunakan untuk pencarian meme'),
    }),
  ),
  overallMood: z
    .enum([
      'frustrasi',
      'kesal',
      'malas',
      'marah',
      'sarkastik',
    ])
    .describe('Nada emosional secara keseluruhan'),
  suggestedMemeStyle: z.enum([
      'klasik',           // Classic top & bottom text
      'impact',           // Impact font meme
      'deep-fried',       // Deep-fried meme
      'before-after',     // Two-part meme
      'dialog',           // Dialogue style
      'caption-only',     // Caption-only meme
      'tweet',            // Relatable tweet style
      'labeling',         // Image labeling
      'top-text',         // Top text only
      'object-labeling',  // Object labeling (e.g. distracted boyfriend)
    ])
    .describe('Style meme yang disarankan berdasarkan masalah'),
});