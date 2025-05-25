import { TransactionService } from '../services/transaction.service.js';
import { CreateTransactionInput } from '../models/Transaction.js';

export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  async createTransaction(transaction: CreateTransactionInput) {
    const isValid = await this.transactionService.validateTransactionBalance(transaction);
    if (!isValid) {
      throw new Error('Invalid transaction');
    }
    return this.transactionService.calculateTransactionValue(transaction);
  }
} 