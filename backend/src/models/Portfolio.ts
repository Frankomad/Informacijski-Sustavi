import { z } from 'zod';
import { BaseModel } from './BaseModel.js';

export interface Portfolio extends BaseModel {
  naziv: string;
  strategija: string | null;
  datum_kreiranja: string;
}

export const portfolioSchema = z.object({
  naziv: z.string().min(1, 'Portfolio name is required'),
  strategija: z.string().nullable().optional(),
});

export type CreatePortfolioInput = z.infer<typeof portfolioSchema>;

export const portfolioResponseSchema = z.object({
  id: z.string(),
  naziv: z.string(),
  strategija: z.string().nullable(),
  datum_kreiranja: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
}); 