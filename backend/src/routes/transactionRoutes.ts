import { Router } from 'express';
import { getTransactions, createTransaction, deleteTransaction, getTransactionById, updateTransaction } from '../controllers/transactionController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, getTransactions);
router.get('/:id', authenticate, getTransactionById);
router.post('/', authenticate, createTransaction);
router.patch('/:id', authenticate, updateTransaction);
router.delete('/:id', authenticate, deleteTransaction);

export default router; 