export interface Portfolio {
  id: string;
  naziv: string;
  strategija: string | null;
  datum_kreiranja: string;
  created_at: string;
  updated_at: string;
}

export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  last_updated: string;
  created_at: string;
  updated_at: string;
}

export interface RiskType {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  portfolio_id: string;
  cryptocurrency_id: string;
  tip_transakcije: 'LONG' | 'SHORT';
  kolicina: number;
  cijena: number;
  datum: string;
  risk_type_id: string;
  created_at: string;
  updated_at: string;
  portfolios?: Portfolio[];
  cryptocurrencies?: Cryptocurrency[];
  risk_types?: RiskType[];
  portfolio?: Portfolio;
  cryptocurrency?: Cryptocurrency;
  risk_type?: RiskType;
}

export interface PortfolioPerformance {
  portfolio_id: string;
  portfolio_name: string;
  strategija: string | null;
  total_transactions: number;
  total_holdings: number;
  total_invested: number;
  current_value: number;
  profit_loss: number;
}
