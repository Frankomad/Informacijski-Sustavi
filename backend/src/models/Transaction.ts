import { z } from 'zod';
import { BaseModel } from './BaseModel.js';
import { Portfolio } from './Portfolio.js';
import { Cryptocurrency } from './Cryptocurrency.js';
import { RiskType } from './RiskType.js';

export interface Transaction extends BaseModel {
  portfolio_id: string;
  cryptocurrency_id: string;
  tip_transakcije: 'buy' | 'sell';
  kolicina: number;
  cijena: number;
  datum: string;
  risk_type_id: string | null;
  portfolio?: Portfolio;
  cryptocurrency?: Cryptocurrency;
  risk_type?: RiskType;
}

export const transactionSchema = z.object({
  portfolio_id: z.string().min(1, 'Portfolio ID is required'),
  cryptocurrency_id: z.string().min(1, 'Cryptocurrency ID is required'),
  tip_transakcije: z.enum(['BUY', 'SELL']),
  kolicina: z.number().positive('Quantity must be positive'),
  cijena: z.number().positive('Price must be positive'),
  datum: z.string().min(1, 'Date is required'),
  risk_type_id: z.string().nullable().optional(),
});

export type CreateTransactionInput = z.infer<typeof transactionSchema>;

export const transactionResponseSchema = z.object({
  id: z.string(),
  portfolio_id: z.string(),
  cryptocurrency_id: z.string(),
  tip_transakcije: z.enum(['BUY', 'SELL']),
  kolicina: z.number(),
  cijena: z.number(),
  datum: z.string(),
  risk_type_id: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  portfolio: z.object({
    id: z.string(),
    naziv: z.string(),
    strategija: z.string().nullable(),
    datum_kreiranja: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
  }).optional(),
  cryptocurrency: z.object({
    id: z.string(),
    name: z.string(),
    symbol: z.string(),
    current_price: z.number(),
    price_change_24h: z.number(),
    last_updated: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
  }).optional(),
  risk_type: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    color: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
  }).optional(),
}); 