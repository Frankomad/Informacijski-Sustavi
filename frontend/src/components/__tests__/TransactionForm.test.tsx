import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TransactionForm from '../TransactionForm';
import { TestWrapper } from '../../test/test-utils';

// Mock the hooks
vi.mock('../../hooks/useCryptocurrencies', () => ({
  useCryptocurrencies: () => ({
    data: [
      { id: '1', name: 'Bitcoin', symbol: 'BTC' },
      { id: '2', name: 'Ethereum', symbol: 'ETH' }
    ],
    isLoading: false,
    error: null
  })
}));

vi.mock('../../hooks/useLivePrices', () => ({
  useLivePrices: () => ({
    getCurrentPrice: (symbol: string) => {
      const prices: Record<string, number> = {
        'BTC': 50000,
        'ETH': 3000
      };
      return prices[symbol] || 0;
    },
    isConnected: true
  })
}));

describe('TransactionForm', () => {
  const mockProps = {
    portfolios: [
      {
        id: '1',
        naziv: 'Portfolio 1',
        strategija: 'Conservative',
        datum_kreiranja: '2024-01-01',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        naziv: 'Portfolio 2',
        strategija: 'Aggressive',
        datum_kreiranja: '2024-01-02',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z'
      }
    ],
    cryptocurrencies: [
      {
        id: '1',
        name: 'Bitcoin',
        symbol: 'BTC',
        current_price: 50000,
        price_change_24h: 2.5,
        last_updated: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'Ethereum',
        symbol: 'ETH',
        current_price: 3000,
        price_change_24h: 1.5,
        last_updated: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ],
    riskTypes: [
      {
        id: '1',
        name: 'Low',
        description: 'Low risk investment',
        color: '#4CAF50',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'Medium',
        description: 'Medium risk investment',
        color: '#FFC107',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '3',
        name: 'High',
        description: 'High risk investment',
        color: '#F44336',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ],
    onSubmit: vi.fn(),
    onCancel: vi.fn()
  };

  const renderWithWrapper = (ui: React.ReactElement) => {
    return render(
      <TestWrapper>
        {ui}
      </TestWrapper>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    renderWithWrapper(<TransactionForm {...mockProps} />);
    
    expect(screen.getByText('Select Portfolio *')).toBeInTheDocument();
    expect(screen.getByText('Select Cryptocurrency *')).toBeInTheDocument();
    expect(screen.getByText('Transaction Type *')).toBeInTheDocument();
    expect(screen.getByText('Quantity *')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithWrapper(<TransactionForm {...mockProps} />);
    
    const submitButton = screen.getByRole('button', { name: 'Create Transaction' });
    fireEvent.click(submitButton);

    // The submit button should be disabled when required fields are empty
    expect(submitButton).toBeDisabled();
  });

  it('submits form with valid data', async () => {
    renderWithWrapper(<TransactionForm {...mockProps} />);
    
    // Click on portfolio
    fireEvent.click(screen.getByText('Portfolio 1'));
    
    // Click on cryptocurrency
    fireEvent.click(screen.getByText('Bitcoin'));
    
    // Click on transaction type
    fireEvent.click(screen.getByText('BUY'));
    
    // Select risk type
    const riskTypeSelect = screen.getByRole('combobox');
    fireEvent.click(riskTypeSelect);
    // Find and click the Low risk type option
    const riskTypeOption = screen.getByRole('option', { name: /Low/i });
    fireEvent.click(riskTypeOption);
    
    // Enter amount
    const amountInput = screen.getByLabelText('Quantity *');
    fireEvent.change(amountInput, { target: { value: '1.5' } });

    const submitButton = screen.getByRole('button', { name: 'Create Transaction' });
    fireEvent.click(submitButton);

    // Wait for form submission
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        portfolio_id: '1',
        cryptocurrency_id: '1',
        tip_transakcije: 'BUY',
        kolicina: 1.5,
        cijena: 50000,
        datum: expect.any(String),
        risk_type_id: '1'
      });
    });
  });

  it('validates amount is positive', async () => {
    renderWithWrapper(<TransactionForm {...mockProps} />);
    
    // Click on portfolio
    fireEvent.click(screen.getByText('Portfolio 1'));
    
    // Click on cryptocurrency
    fireEvent.click(screen.getByText('Bitcoin'));
    
    // Click on transaction type
    fireEvent.click(screen.getByText('BUY'));
    
    // Select risk type
    const riskTypeSelect = screen.getByRole('combobox');
    fireEvent.click(riskTypeSelect);
    // Find and click the Low risk type option
    const riskTypeOption = screen.getByRole('option', { name: /Low/i });
    fireEvent.click(riskTypeOption);
    
    const amountInput = screen.getByLabelText('Quantity *');
    fireEvent.change(amountInput, { target: { value: '-1' } });
    
    const submitButton = screen.getByRole('button', { name: 'Create Transaction' });
    fireEvent.click(submitButton);

    // The form should not submit with a negative amount
    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });
}); 