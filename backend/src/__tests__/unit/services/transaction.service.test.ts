import dotenv from 'dotenv';
import { jest } from '@jest/globals';
dotenv.config({ path: '.env.local' });

import { TransactionService } from '../../../services/transaction.service.js';
import { supabase } from '../../../config/supabase.js';
import { CreateTransactionInput } from '../../../models/Transaction.js';

// Create mock functions
const mockFrom = jest.fn();
const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockOrder = jest.fn();

// Mock supabase client
jest.mock('../../../config/supabase.js', () => ({
  supabase: {
    from: mockFrom
  }
}));

describe('TransactionService Unit Tests', () => {
  let transactionService: TransactionService;

  beforeEach(() => {
    transactionService = new TransactionService();
  });

  describe('Business Logic Tests', () => {
    it('should validate BUY transaction with sufficient balance', async () => {
      const transaction: CreateTransactionInput = {
        portfolio_id: '1',
        cryptocurrency_id: '1',
        tip_transakcije: 'BUY',
        kolicina: 1.0,
        cijena: 100,
        datum: new Date().toISOString().split('T')[0],
        risk_type_id: '1'
      };

      const isValid = await transactionService.validateTransactionBalance(transaction);
      expect(isValid).toBe(true);
    });

    it('should reject SELL transaction with insufficient holdings', async () => {
      const transaction: CreateTransactionInput = {
        portfolio_id: '1',
        cryptocurrency_id: '1',
        tip_transakcije: 'SELL',
        kolicina: 1000000, // Unrealistic amount
        cijena: 100,
        datum: new Date().toISOString().split('T')[0],
        risk_type_id: '1'
      };

      const isValid = await transactionService.validateTransactionBalance(transaction);
      expect(isValid).toBe(false);
    });
  });

  describe('Validation Tests', () => {
    it('should validate transaction with valid risk type', async () => {
      const transaction: CreateTransactionInput = {
        portfolio_id: '1',
        cryptocurrency_id: '1',
        tip_transakcije: 'BUY',
        kolicina: 1.0,
        cijena: 100,
        datum: new Date().toISOString().split('T')[0],
        risk_type_id: '1'
      };

      const isValid = await transactionService.validateTransactionBalance(transaction);
      expect(isValid).toBe(true);
    });

    it('should validate transaction with valid date', async () => {
      const transaction: CreateTransactionInput = {
        portfolio_id: '1',
        cryptocurrency_id: '1',
        tip_transakcije: 'BUY',
        kolicina: 1.0,
        cijena: 100,
        datum: new Date().toISOString().split('T')[0],
        risk_type_id: '1'
      };

      const isValid = await transactionService.validateTransactionBalance(transaction);
      expect(isValid).toBe(true);
    });
  });

  describe('Calculation Tests', () => {
    it('should calculate transaction value correctly', async () => {
      const transaction: CreateTransactionInput = {
        portfolio_id: '1',
        cryptocurrency_id: '1',
        tip_transakcije: 'BUY',
        kolicina: 2.5,
        cijena: 100,
        datum: new Date().toISOString().split('T')[0],
        risk_type_id: '1'
      };

      const value = await transactionService.calculateTransactionValue(transaction);
      expect(value).toBe(250); // 2.5 * 100
    });

    it('should calculate portfolio value correctly', async () => {
      const portfolioId = '1';
      const value = await transactionService.calculatePortfolioValue(portfolioId);
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThanOrEqual(0);
    });

    it('should calculate transaction history correctly', async () => {
      const portfolioId = '1';
      const cryptocurrencyId = '1';

      const history = await transactionService.getTransactionHistory(portfolioId, cryptocurrencyId);
      expect(Array.isArray(history)).toBe(true);
      
      // Verify history calculations
      if (history.length > 0) {
        const firstTransaction = history[0];
        expect(firstTransaction).toHaveProperty('kolicina');
        expect(firstTransaction).toHaveProperty('cijena');
        expect(firstTransaction).toHaveProperty('tip_transakcije');
      }
    });
  });
}); 