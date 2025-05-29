const API_BASE_URL = 'http://localhost:3001/api';

// Helper functions to map between frontend and backend transaction types
const mapToBackendType = (type: 'LONG' | 'SHORT'): 'BUY' | 'SELL' => {
  return type === 'LONG' ? 'BUY' : 'SELL';
};

const mapToFrontendType = (type: 'BUY' | 'SELL'): 'LONG' | 'SHORT' => {
  return type === 'BUY' ? 'LONG' : 'SHORT';
};

interface BackendTransaction {
  id: string;
  portfolio_id: string;
  cryptocurrency_id: string;
  tip_transakcije: 'BUY' | 'SELL';
  kolicina: number;
  cijena: number;
  datum: string;
  risk_type_id: string | null;
  created_at: string;
  updated_at: string;
  portfolio?: {
    id: string;
    naziv: string;
    strategija: string | null;
    datum_kreiranja: string;
    created_at: string;
    updated_at: string;
  };
  cryptocurrency?: {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    price_change_24h: number;
    last_updated: string;
    created_at: string;
    updated_at: string;
  };
  risk_type?: {
    id: string;
    name: string;
    description: string | null;
    color: string | null;
    created_at: string;
    updated_at: string;
  };
}

export const api = {
  // Portfolio endpoints
  portfolios: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/portfolios`);
      if (!response.ok) throw new Error('Failed to fetch portfolios');
      return response.json();
    },
    create: async (data: { naziv: string; strategija?: string }) => {
      const response = await fetch(`${API_BASE_URL}/portfolios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create portfolio');
      return response.json();
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/portfolios/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete portfolio');
    },
    update: async (id: string, data: Partial<{ naziv: string; strategija?: string }>) => {
      const response = await fetch(`${API_BASE_URL}/portfolios/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update portfolio');
      return response.json();
    },
  },

  // Transaction endpoints
  transactions: {
    getAll: async (portfolioId?: string) => {
      const url = portfolioId
        ? `${API_BASE_URL}/transactions?portfolioId=${portfolioId}`
        : `${API_BASE_URL}/transactions`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json() as BackendTransaction[];
      // Map backend BUY/SELL to frontend LONG/SHORT
      return data.map((transaction) => ({
        ...transaction,
        tip_transakcije: mapToFrontendType(transaction.tip_transakcije)
      }));
    },
    create: async (data: {
      portfolio_id: string;
      cryptocurrency_id: string;
      tip_transakcije: 'LONG' | 'SHORT';
      kolicina: number;
      cijena: number;
      datum: string;
      risk_type_id: string;
    }) => {
      // Map frontend LONG/SHORT to backend BUY/SELL
      const backendData = {
        ...data,
        tip_transakcije: mapToBackendType(data.tip_transakcije)
      };
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendData),
      });
      if (!response.ok) throw new Error('Failed to create position');
      const responseData = await response.json() as BackendTransaction;
      // Map response back to frontend format
      return {
        ...responseData,
        tip_transakcije: mapToFrontendType(responseData.tip_transakcije)
      };
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete position');
    },
    update: async (id: string, data: Partial<{
      portfolio_id: string;
      cryptocurrency_id: string;
      tip_transakcije: 'LONG' | 'SHORT';
      kolicina: number;
      cijena: number;
      datum: string;
      risk_type_id: string;
    }>) => {
      // Map frontend LONG/SHORT to backend BUY/SELL if tip_transakcije is present
      const backendData = {
        ...data,
        ...(data.tip_transakcije && { tip_transakcije: mapToBackendType(data.tip_transakcije) })
      };
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendData),
      });
      if (!response.ok) throw new Error('Failed to update position');
      const responseData = await response.json() as BackendTransaction;
      // Map response back to frontend format
      return {
        ...responseData,
        tip_transakcije: mapToFrontendType(responseData.tip_transakcije)
      };
    },
  },

  // Cryptocurrency endpoints
  cryptocurrencies: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/cryptocurrencies`);
      if (!response.ok) throw new Error('Failed to fetch cryptocurrencies');
      return response.json();
    },
  },

  // Risk type endpoints
  riskTypes: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/risk-types`);
      if (!response.ok) throw new Error('Failed to fetch risk types');
      return response.json();
    },
    create: async (data: { name: string; description?: string; color?: string }) => {
      const response = await fetch(`${API_BASE_URL}/risk-types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create risk type');
      return response.json();
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/risk-types/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete risk type');
    },
    update: async (id: string, data: Partial<{ name: string; description?: string; color?: string }>) => {
      const response = await fetch(`${API_BASE_URL}/risk-types/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update risk type');
      return response.json();
    },
  },
}; 