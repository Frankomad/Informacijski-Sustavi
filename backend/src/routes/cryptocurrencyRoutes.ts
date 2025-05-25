import { Router } from 'express';
import { getCryptocurrencies } from '../controllers/cryptocurrencyController.js';

const router = Router();

router.get('/', getCryptocurrencies);

export default router; 