import { Request, Response } from 'express';
import { CryptocurrencyRepository } from '../repositories/cryptocurrencyRepository.js';

const cryptocurrencyRepository = new CryptocurrencyRepository();

// Get all cryptocurrencies
export const getCryptocurrencies = async (_req: Request, res: Response) => {
  try {
    const cryptocurrencies = await cryptocurrencyRepository.findAll();
    res.json(cryptocurrencies);
  } catch (error) {
    console.error('Error fetching cryptocurrencies:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}; 