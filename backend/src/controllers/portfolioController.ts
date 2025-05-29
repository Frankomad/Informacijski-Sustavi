import { Request, Response } from 'express';
import { PortfolioRepository } from '../repositories/portfolioRepository.js';

const portfolioRepository = new PortfolioRepository();

// Get all portfolios
export const getPortfolios = async (_req: Request, res: Response) => {
  try {
    const portfolios = await portfolioRepository.findAll();
    res.json(portfolios);
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Create a new portfolio
export const createPortfolio = async (req: Request, res: Response) => {
  try {
    const portfolio = await portfolioRepository.create(req.body);
    res.status(201).json(portfolio);
  } catch (error) {
    console.error('Error creating portfolio:', error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
};

// Delete a portfolio
export const deletePortfolio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await portfolioRepository.delete(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Get a single portfolio by id
export const getPortfolioById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const portfolio = await portfolioRepository.findById(id);
    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Update a portfolio
export const updatePortfolio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const portfolio = await portfolioRepository.update(id, req.body);
    res.status(200).json(portfolio);
  } catch (error) {
    console.error('Error updating portfolio:', error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
}; 