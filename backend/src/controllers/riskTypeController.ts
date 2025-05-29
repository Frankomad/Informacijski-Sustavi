import { Request, Response } from 'express';
import { RiskTypeRepository } from '../repositories/riskTypeRepository.js';

const riskTypeRepository = new RiskTypeRepository();

// Get all risk types
export const getRiskTypes = async (_req: Request, res: Response) => {
  try {
    const riskTypes = await riskTypeRepository.findAll();
    res.json(riskTypes);
  } catch (error) {
    console.error('Error fetching risk types:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Create a new risk type
export const createRiskType = async (req: Request, res: Response) => {
  try {
    const riskType = await riskTypeRepository.create(req.body);
    res.status(201).json(riskType);
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
    await riskTypeRepository.delete(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting risk type:', error);
    if (error instanceof Error && error.message.includes('Cannot delete risk type')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
};

// Update a risk type
export const updateRiskType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const riskType = await riskTypeRepository.update(id, req.body);
    res.status(200).json(riskType);
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
    const riskType = await riskTypeRepository.findById(id);
    res.json(riskType);
  } catch (error) {
    console.error('Error fetching risk type:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}; 