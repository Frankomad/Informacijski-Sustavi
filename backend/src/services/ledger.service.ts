import { TransactionRepository } from '../models/transaction.repository.js';

export class LedgerService {
  constructor(private repository: TransactionRepository) {}

  async createTransaction(transaction: { amount: number; description: string; type: string }) {
    if (transaction.amount <= 0) {
      throw new Error('Invalid amount');
    }
    return this.repository.create(transaction);
  }
} 