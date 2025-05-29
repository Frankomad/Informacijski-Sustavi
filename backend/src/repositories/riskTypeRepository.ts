import { supabase } from '../config/supabase.js';
import { RiskType, riskTypeSchema, riskTypeResponseSchema } from '../models/RiskType.js';

export class RiskTypeRepository {
  async findAll() {
    const { data, error } = await supabase
      .from('risk_types')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return riskTypeResponseSchema.array().parse(data);
  }

  async findById(id: string) {
    const { data, error } = await supabase
      .from('risk_types')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return riskTypeResponseSchema.parse(data);
  }

  async create(riskTypeData: RiskType) {
    const validatedData = riskTypeSchema.parse(riskTypeData);
    const { data, error } = await supabase
      .from('risk_types')
      .insert([validatedData])
      .select()
      .single();

    if (error) throw error;
    return riskTypeResponseSchema.parse(data);
  }

  async update(id: string, riskTypeData: Partial<RiskType>) {
    const validatedData = riskTypeSchema.partial().parse(riskTypeData);
    const { data, error } = await supabase
      .from('risk_types')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return riskTypeResponseSchema.parse(data);
  }

  async delete(id: string) {
    const { error } = await supabase
      .from('risk_types')
      .delete()
      .eq('id', id);

    if (error) {
      // Check for foreign key violation (risk type in use)
      if (
        error.code === '23503' || // Postgres foreign key violation
        (error.details && error.details.includes('violates foreign key constraint'))
      ) {
        throw new Error('Cannot delete risk type: it is used in one or more transactions.');
      }
      throw error;
    }
  }
} 