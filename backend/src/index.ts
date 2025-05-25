import './loadEnv.js';
import express from 'express';
import cors from 'cors';
import portfolioRoutes from './routes/portfolioRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import cryptocurrencyRoutes from './routes/cryptocurrencyRoutes.js';
import riskTypeRoutes from './routes/riskTypeRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

export const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/cryptocurrencies', cryptocurrencyRoutes);
app.use('/api/risk-types', riskTypeRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 