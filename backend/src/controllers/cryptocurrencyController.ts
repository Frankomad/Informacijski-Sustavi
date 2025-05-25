import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { Cryptocurrency, cryptocurrencyResponseSchema } from '../models/Cryptocurrency.js';

// Get all cryptocurrencies
export const getCryptocurrencies = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('cryptocurrencies')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    const validatedData = cryptocurrencyResponseSchema.array().parse(data);
    res.json(validatedData);
  } catch (error) {
    console.error('Error fetching cryptocurrencies:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}; 