import { supabase } from '../config/supabase.js';
import { Cryptocurrency, cryptocurrencyResponseSchema } from '../models/Cryptocurrency.js';

export class CryptocurrencyRepository {
  async findAll() {
    const { data, error } = await supabase
      .from('cryptocurrencies')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return cryptocurrencyResponseSchema.array().parse(data);
  }
} 