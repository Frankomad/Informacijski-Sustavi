import { Request, Response } from 'express';
import { RiskTypeRepository } from '../repositories/riskTypeRepository.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

const riskTypeRepository = new RiskTypeRepository();

// Get all risk types
export const getRiskTypes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const riskTypes = await riskTypeRepository.findAllByUser(userId!);
    res.json(riskTypes);
  } catch (error) {
    console.error('Error fetching risk types:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Create a new risk type
export const createRiskType = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const riskType = await riskTypeRepository.create({ ...req.body, user_id: userId });
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
export const deleteRiskType = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    await riskTypeRepository.deleteByUser(id, userId!);
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
export const updateRiskType = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const riskType = await riskTypeRepository.updateByUser(id, req.body, userId!);
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
export const getRiskTypeById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const riskType = await riskTypeRepository.findByIdAndUser(id, userId!);
    res.json(riskType);
  } catch (error) {
    console.error('Error fetching risk type:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}; 