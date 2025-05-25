import { Transaction, CreateTransactionInput } from '../models/Transaction.js';
import { supabase } from '../config/supabase.js';

interface TransactionWithPrice {
  kolicina: number;
  cijena: number;
  cryptocurrency: {
    current_price: number;
  } | null;
}

export class TransactionService {
  async calculateTransactionValue(transaction: CreateTransactionInput): Promise<number> {
    return transaction.kolicina * transaction.cijena;
  }

  async validateTransactionBalance(transaction: CreateTransactionInput): Promise<boolean> {
    if (transaction.tip_transakcije === 'SELL') {
      const { data: existingTransactions } = await supabase
        .from('transactions')
        .select('kolicina, tip_transakcije')
        .eq('portfolio_id', transaction.portfolio_id)
        .eq('cryptocurrency_id', transaction.cryptocurrency_id);

      if (!existingTransactions) return false;

      const totalBalance = existingTransactions.reduce((acc, t) => {
        return acc + (t.tip_transakcije === 'BUY' ? t.kolicina : -t.kolicina);
      }, 0);

      return totalBalance >= transaction.kolicina;
    }
    return true;
  }

  async calculatePortfolioValue(portfolioId: string): Promise<number> {
    const { data: transactions } = await supabase
      .from('transactions')
      .select(`
        kolicina,
        cijena,
        cryptocurrency:cryptocurrencies(current_price)
      `)
      .eq('portfolio_id', portfolioId);

    if (!transactions) return 0;

    return (transactions as unknown as TransactionWithPrice[]).reduce((acc, t) => {
      const currentPrice = t.cryptocurrency?.current_price || t.cijena;
      return acc + (t.kolicina * currentPrice);
    }, 0);
  }

  async getTransactionHistory(portfolioId: string, cryptocurrencyId: string): Promise<Transaction[]> {
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .eq('cryptocurrency_id', cryptocurrencyId)
      .order('datum', { ascending: false });

    return transactions || [];
  }
} 