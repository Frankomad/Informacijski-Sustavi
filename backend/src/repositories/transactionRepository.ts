import { supabase } from '../config/supabase.js';
import { Transaction, transactionSchema, transactionResponseSchema } from '../models/Transaction.js';

export class TransactionRepository {
  async findAll(portfolioId?: string) {
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
    return transactionResponseSchema.array().parse(data);
  }

  async findById(id: string) {
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
    return transactionResponseSchema.parse(data);
  }

  async create(transactionData: Transaction) {
    const validatedData = transactionSchema.parse(transactionData);
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
    return transactionResponseSchema.parse(data);
  }

  async update(id: string, transactionData: Partial<Transaction>) {
    const validatedData = transactionSchema.partial().parse(transactionData);
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
    return transactionResponseSchema.parse(data);
  }

  async delete(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
} 