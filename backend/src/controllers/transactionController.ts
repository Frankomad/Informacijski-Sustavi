import { Request, Response } from 'express';
import { TransactionRepository } from '../repositories/transactionRepository.js';

const transactionRepository = new TransactionRepository();

// Get all transactions
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { portfolioId } = req.query;
    const transactions = await transactionRepository.findAll(portfolioId as string);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Create a new transaction
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await transactionRepository.create(req.body);
    res.status(201).json(transaction);
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
    await transactionRepository.delete(id);
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
    const transaction = await transactionRepository.findById(id);
    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Update a transaction
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transaction = await transactionRepository.update(id, req.body);
    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
}; 