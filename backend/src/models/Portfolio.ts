import { z } from 'zod';
import { BaseModel } from './BaseModel.js';

export interface Portfolio extends BaseModel {
  naziv: string;
  strategija: string | null;
  datum_kreiranja: string;
  user_id: string;
}

export const portfolioSchema = z.object({
  naziv: z.string().min(1, 'Portfolio name is required'),
  strategija: z.string().nullable().optional(),
  user_id: z.string().min(1, 'User ID is required'),
});

export type CreatePortfolioInput = z.infer<typeof portfolioSchema>;

export const portfolioResponseSchema = z.object({
  id: z.string(),
  naziv: z.string(),
  strategija: z.string().nullable(),
  datum_kreiranja: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  user_id: z.string(),
}); 