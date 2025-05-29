import { z } from 'zod';
import { BaseModel } from './BaseModel.js';

export interface RiskType extends BaseModel {
  name: string;
  description: string | null;
  color: string | null;
  user_id: string;
}

export const riskTypeSchema = z.object({
  name: z.string().min(1, 'Risk type name is required'),
  description: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  user_id: z.string().min(1, 'User ID is required'),
});

export type CreateRiskTypeInput = z.infer<typeof riskTypeSchema>;

export const riskTypeResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  color: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  user_id: z.string(),
}); 