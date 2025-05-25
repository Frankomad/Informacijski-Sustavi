import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { Transaction, transactionSchema, transactionResponseSchema } from '../models/Transaction.js';

// Get all transactions
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { portfolioId } = req.query;
    let query = supabase
      .from('transactions')
      .select(`
        *,
        portfolio:portfolios(*),
        cryptocurrency:cryptocurrencies(*),
        risk_type:risk_types(*)
      `)
      .order('datum', { ascending: false });

    if (portfolioId) {
      query = query.eq('portfolio_id', portfolioId);
    }

    const { data, error } = await query;

    if (error) throw error;

    const validatedData = transactionResponseSchema.array().parse(data);
    res.json(validatedData);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Create a new transaction
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const validatedData = transactionSchema.parse(req.body);
    const { data, error } = await supabase
      .from('transactions')
      .insert([validatedData])
      .select(`
        *,
        portfolio:portfolios(*),
        cryptocurrency:cryptocurrencies(*),
        risk_type:risk_types(*)
      `)
      .single();

    if (error) throw error;

    const validatedResponse = transactionResponseSchema.parse(data);
    res.status(201).json(validatedResponse);
  } catch (error) {
    console.error('Error creating transaction:', error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
};

// Delete a transaction
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Get a single transaction by id
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        portfolio:portfolios(*),
        cryptocurrency:cryptocurrencies(*),
        risk_type:risk_types(*)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    const validatedData = transactionResponseSchema.parse(data);
    res.json(validatedData);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Update a transaction
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = transactionSchema.partial().parse(req.body);
    const { data, error } = await supabase
      .from('transactions')
      .update(validatedData)
      .eq('id', id)
      .select(`
        *,
        portfolio:portfolios(*),
        cryptocurrency:cryptocurrencies(*),
        risk_type:risk_types(*)
      `)
      .single();
    if (error) throw error;
    const validatedResponse = transactionResponseSchema.parse(data);
    res.status(200).json(validatedResponse);
  } catch (error) {
    console.error('Error updating transaction:', error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
}; 