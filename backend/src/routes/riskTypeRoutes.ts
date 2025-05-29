import { Router } from 'express';
import { getRiskTypes, createRiskType, deleteRiskType, updateRiskType, getRiskTypeById } from '../controllers/riskTypeController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, getRiskTypes);
router.get('/:id', authenticate, getRiskTypeById);
router.post('/', authenticate, createRiskType);
router.delete('/:id', authenticate, deleteRiskType);
router.patch('/:id', authenticate, updateRiskType);

export default router; 