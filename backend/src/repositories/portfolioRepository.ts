import { supabase } from '../config/supabase.js';
import { Portfolio, portfolioSchema, portfolioResponseSchema } from '../models/Portfolio.js';

export class PortfolioRepository {
  async findAll() {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return portfolioResponseSchema.array().parse(data);
  }

  async findById(id: string) {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return portfolioResponseSchema.parse(data);
  }

  async create(portfolioData: Portfolio) {
    const validatedData = portfolioSchema.parse(portfolioData);
    const { data, error } = await supabase
      .from('portfolios')
      .insert([validatedData])
      .select()
      .single();

    if (error) throw error;
    return portfolioResponseSchema.parse(data);
  }

  async update(id: string, portfolioData: Partial<Portfolio>) {
    const validatedData = portfolioSchema.partial().parse(portfolioData);
    const { data, error } = await supabase
      .from('portfolios')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return portfolioResponseSchema.parse(data);
  }

  async delete(id: string) {
    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
} 