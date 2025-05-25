import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { Portfolio, portfolioSchema, portfolioResponseSchema } from '../models/Portfolio.js';

// Get all portfolios
export const getPortfolios = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const validatedData = portfolioResponseSchema.array().parse(data);
    res.json(validatedData);
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Create a new portfolio
export const createPortfolio = async (req: Request, res: Response) => {
  try {
    const validatedData = portfolioSchema.parse(req.body);
    const { data, error } = await supabase
      .from('portfolios')
      .insert([validatedData])
      .select()
      .single();

    if (error) throw error;

    const validatedResponse = portfolioResponseSchema.parse(data);
    res.status(201).json(validatedResponse);
  } catch (error) {
    console.error('Error creating portfolio:', error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
};

// Delete a portfolio
export const deletePortfolio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Get a single portfolio by id
export const getPortfolioById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    const validatedData = portfolioResponseSchema.parse(data);
    res.json(validatedData);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Update a portfolio
export const updatePortfolio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = portfolioSchema.partial().parse(req.body);
    const { data, error } = await supabase
      .from('portfolios')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    const validatedResponse = portfolioResponseSchema.parse(data);
    res.status(200).json(validatedResponse);
  } catch (error) {
    console.error('Error updating portfolio:', error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
}; 