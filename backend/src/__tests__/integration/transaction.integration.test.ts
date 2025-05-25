import dotenv from 'dotenv';
import { jest } from '@jest/globals';
dotenv.config({ path: '.env.local' });

import { TransactionService } from '../../services/transaction.service.js';
import { supabase } from '../../config/supabase.js';
import { CreateTransactionInput } from '../../models/Transaction.js';

describe('TransactionService Integration Tests', () => {
  let transactionService: TransactionService;
  let testTransactionId: string | null = null;

  beforeEach(() => {
    transactionService = new TransactionService();
  });

  afterEach(async () => {
    // Clean up test data after each test
    if (testTransactionId) {
      await supabase
        .from('transactions')
        .delete()
        .eq('id', testTransactionId);
      testTransactionId = null;
    }
  });

  afterAll(async () => {
    // Clean up any remaining test data
    await supabase
      .from('transactions')
      .delete()
      .eq('portfolio_id', '1')
      .eq('cryptocurrency_id', '1');
  });

  // Test 1: Create and validate a BUY transaction
  it('should create and validate a BUY transaction', async () => {
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

    // Store transaction ID for cleanup
    const { data } = await supabase
      .from('transactions')
      .insert(transaction)
      .select('id')
      .single();
    
    if (data) {
      testTransactionId = data.id;
    }
  });

  // Test 2: Create a transaction and calculate its value
  it('should create a transaction and calculate its value', async () => {
    const transaction: CreateTransactionInput = {
      portfolio_id: '1',
      cryptocurrency_id: '1',
      tip_transakcije: 'BUY',
      kolicina: 2.0,
      cijena: 150,
      datum: new Date().toISOString().split('T')[0],
      risk_type_id: '1'
    };

    const value = await transactionService.calculateTransactionValue(transaction);
    expect(value).toBe(300); // 2.0 * 150

    // Store transaction ID for cleanup
    const { data } = await supabase
      .from('transactions')
      .insert(transaction)
      .select('id')
      .single();
    
    if (data) {
      testTransactionId = data.id;
    }
  });

  // Test 3: Get transaction history for a portfolio
  it('should get transaction history for a portfolio', async () => {
    const portfolioId = '1';
    const cryptocurrencyId = '1';

    const history = await transactionService.getTransactionHistory(portfolioId, cryptocurrencyId);
    expect(Array.isArray(history)).toBe(true);
  });

  // Test 4: Calculate portfolio value
  it('should calculate portfolio value', async () => {
    const portfolioId = '1';
    const value = await transactionService.calculatePortfolioValue(portfolioId);
    expect(typeof value).toBe('number');
    expect(value).toBeGreaterThanOrEqual(0);
  });
}); 