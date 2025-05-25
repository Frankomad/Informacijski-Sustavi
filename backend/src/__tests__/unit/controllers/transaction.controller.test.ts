import { jest } from '@jest/globals';
import { TransactionController } from '../../../controllers/transaction.controller.js';
import { TransactionService } from '../../../services/transaction.service.js';
import { CreateTransactionInput } from '../../../models/Transaction.js';

describe('TransactionController Unit Tests', () => {
  let transactionController: TransactionController;
  let mockTransactionService: jest.Mocked<TransactionService>;

  beforeEach(() => {
    mockTransactionService = {
      validateTransactionBalance: jest.fn(),
      calculateTransactionValue: jest.fn(),
      getTransactionHistory: jest.fn(),
      calculatePortfolioValue: jest.fn()
    } as any;

    transactionController = new TransactionController(mockTransactionService);
  });

  describe('createTransaction', () => {
    it('should validate and create a transaction', async () => {
      const transaction: CreateTransactionInput = {
        portfolio_id: '1',
        cryptocurrency_id: '1',
        tip_transakcije: 'BUY',
        kolicina: 1.0,
        cijena: 100,
        datum: new Date().toISOString().split('T')[0],
        risk_type_id: '1'
      };

      mockTransactionService.validateTransactionBalance.mockResolvedValue(true);
      mockTransactionService.calculateTransactionValue.mockResolvedValue(100);

      const result = await transactionController.createTransaction(transaction);
      expect(result).toBeDefined();
      expect(mockTransactionService.validateTransactionBalance).toHaveBeenCalledWith(transaction);
    });

    it('should reject invalid transactions', async () => {
      const transaction: CreateTransactionInput = {
        portfolio_id: '1',
        cryptocurrency_id: '1',
        tip_transakcije: 'SELL',
        kolicina: 1000,
        cijena: 100,
        datum: new Date().toISOString().split('T')[0],
        risk_type_id: '1'
      };

      mockTransactionService.validateTransactionBalance.mockResolvedValue(false);

      await expect(transactionController.createTransaction(transaction))
        .rejects
        .toThrow('Invalid transaction');
    });
  });
}); 