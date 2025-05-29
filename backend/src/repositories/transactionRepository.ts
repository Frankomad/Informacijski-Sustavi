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

  async findAllByUser(userId: string, portfolioId?: string) {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        portfolio:portfolios(*),
        cryptocurrency:cryptocurrencies(*),
        risk_type:risk_types(*)
      `)
      .eq('user_id', userId)
      .order('datum', { ascending: false });

    if (portfolioId) {
      query = query.eq('portfolio_id', portfolioId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return transactionResponseSchema.array().parse(data);
  }

  async findByIdAndUser(id: string, userId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        portfolio:portfolios(*),
        cryptocurrency:cryptocurrencies(*),
        risk_type:risk_types(*)
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    if (error) throw error;
    return transactionResponseSchema.parse(data);
  }

  async updateByUser(id: string, transactionData: Partial<Transaction>, userId: string) {
    const validatedData = transactionSchema.partial().parse(transactionData);
    const { data, error } = await supabase
      .from('transactions')
      .update(validatedData)
      .eq('id', id)
      .eq('user_id', userId)
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

  async deleteByUser(id: string, userId: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw error;
  }
} 