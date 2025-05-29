import { Request, Response } from 'express';
import { TransactionRepository } from '../repositories/transactionRepository.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

const transactionRepository = new TransactionRepository();

// Get all transactions
export const getTransactions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { portfolioId } = req.query;
    const userId = req.user?.id;
    const transactions = await transactionRepository.findAllByUser(userId!, portfolioId as string);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Create a new transaction
export const createTransaction = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const transaction = await transactionRepository.create({ ...req.body, user_id: userId });
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
export const deleteTransaction = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    await transactionRepository.deleteByUser(id, userId!);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Get a single transaction by id
export const getTransactionById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const transaction = await transactionRepository.findByIdAndUser(id, userId!);
    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Update a transaction
export const updateTransaction = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const transaction = await transactionRepository.updateByUser(id, req.body, userId!);
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