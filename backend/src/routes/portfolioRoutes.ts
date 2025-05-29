import { Router } from 'express';
import { getPortfolios, createPortfolio, deletePortfolio, getPortfolioById, updatePortfolio } from '../controllers/portfolioController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, getPortfolios);
router.get('/:id', authenticate, getPortfolioById);
router.post('/', authenticate, createPortfolio);
router.patch('/:id', authenticate, updatePortfolio);
router.delete('/:id', authenticate, deletePortfolio);

export default router; 