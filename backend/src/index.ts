import './loadEnv.js';
import express from 'express';
import cors from 'cors';
import portfolioRoutes from './routes/portfolioRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import cryptocurrencyRoutes from './routes/cryptocurrencyRoutes.js';
import riskTypeRoutes from './routes/riskTypeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

export const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Logging middleware (mora biti odmah nakon app inicijalizacije)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Routes
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/cryptocurrencies', cryptocurrencyRoutes);
app.use('/api/risk-types', riskTypeRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 