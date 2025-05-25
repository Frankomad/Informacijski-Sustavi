import { z } from 'zod';
import { BaseModel } from './BaseModel.js';

export interface Cryptocurrency extends BaseModel {
  name: string;
  symbol: string;
  current_price: number;
  price_change_24h: number;
  last_updated: string;
}

export const cryptocurrencyResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  current_price: z.number(),
  price_change_24h: z.number(),
  last_updated: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
}); 