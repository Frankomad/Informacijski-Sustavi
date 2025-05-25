import { Router } from 'express';
import { getPortfolios, createPortfolio, deletePortfolio, getPortfolioById, updatePortfolio } from '../controllers/portfolioController.js';

const router = Router();

router.get('/', getPortfolios);
router.get('/:id', getPortfolioById);
router.post('/', createPortfolio);
router.patch('/:id', updatePortfolio);
router.delete('/:id', deletePortfolio);

export default router; 