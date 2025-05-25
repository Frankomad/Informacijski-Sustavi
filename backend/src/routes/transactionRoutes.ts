import { Router } from 'express';
import { getTransactions, createTransaction, deleteTransaction, getTransactionById, updateTransaction } from '../controllers/transactionController.js';

const router = Router();

router.get('/', getTransactions);
router.get('/:id', getTransactionById);
router.post('/', createTransaction);
router.patch('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router; 