import { Router } from 'express';
import { getRiskTypes, createRiskType, deleteRiskType, updateRiskType, getRiskTypeById } from '../controllers/riskTypeController.js';

const router = Router();

router.get('/', getRiskTypes);
router.get('/:id', getRiskTypeById);
router.post('/', createRiskType);
router.delete('/:id', deleteRiskType);
router.patch('/:id', updateRiskType);

export default router; 