import { CreateTransactionInput } from './Transaction.js';
import { supabase } from '../config/supabase.js';

export class TransactionRepository {
  async createTransaction(transaction: CreateTransactionInput) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getTransactions(portfolioId: string, cryptocurrencyId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .eq('cryptocurrency_id', cryptocurrencyId)
      .order('datum', { ascending: false });

    if (error) throw error;
    return data;
  }

  async deleteTransaction(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
} 