import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { RiskType, riskTypeSchema, riskTypeResponseSchema } from '../models/RiskType.js';

// Get all risk types
export const getRiskTypes = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('risk_types')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    const validatedData = riskTypeResponseSchema.array().parse(data);
    res.json(validatedData);
  } catch (error) {
    console.error('Error fetching risk types:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Create a new risk type
export const createRiskType = async (req: Request, res: Response) => {
  try {
    const validatedData = riskTypeSchema.parse(req.body);
    const { data, error } = await supabase
      .from('risk_types')
      .insert([validatedData])
      .select()
      .single();

    if (error) throw error;

    const validatedResponse = riskTypeResponseSchema.parse(data);
    res.status(201).json(validatedResponse);
  } catch (error) {
    console.error('Error creating risk type:', error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
};

// Delete a risk type
export const deleteRiskType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
        return res.status(400).json({ error: 'Cannot delete risk type: it is used in one or more transactions.' });
      }
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting risk type:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Update a risk type
export const updateRiskType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = riskTypeSchema.partial().parse(req.body);
    const { data, error } = await supabase
      .from('risk_types')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const validatedResponse = riskTypeResponseSchema.parse(data);
    res.status(200).json(validatedResponse);
  } catch (error) {
    console.error('Error updating risk type:', error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
};

// Get a single risk type by id
export const getRiskTypeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('risk_types')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    const validatedData = riskTypeResponseSchema.parse(data);
    res.json(validatedData);
  } catch (error) {
    console.error('Error fetching risk type:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}; 