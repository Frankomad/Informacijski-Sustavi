import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import PortfolioForm from '../PortfolioForm';

describe('PortfolioForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders create portfolio form correctly', () => {
    render(<PortfolioForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByLabelText(/portfolio name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/strategy/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create portfolio/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('renders update portfolio form correctly', () => {
    const initialValues = {
      naziv: 'Existing Portfolio',
      strategija: 'Existing Strategy'
    };

    render(<PortfolioForm initialValues={initialValues} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByLabelText(/portfolio name/i)).toHaveValue('Existing Portfolio');
    expect(screen.getByLabelText(/strategy/i)).toHaveValue('Existing Strategy');
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('handles form input changes', () => {
    render(<PortfolioForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nazivInput = screen.getByLabelText(/portfolio name/i);
    const strategijaInput = screen.getByLabelText(/strategy/i);

    fireEvent.change(nazivInput, { target: { value: 'New Portfolio' } });
    fireEvent.change(strategijaInput, { target: { value: 'New Strategy' } });

    expect(nazivInput).toHaveValue('New Portfolio');
    expect(strategijaInput).toHaveValue('New Strategy');
  });

  it('handles form submission', async () => {
    render(<PortfolioForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nazivInput = screen.getByLabelText(/portfolio name/i);
    const strategijaInput = screen.getByLabelText(/strategy/i);
    const submitButton = screen.getByRole('button', { name: /create portfolio/i });

    fireEvent.change(nazivInput, { target: { value: 'Test Portfolio' } });
    fireEvent.change(strategijaInput, { target: { value: 'Test Strategy' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        naziv: 'Test Portfolio',
        strategija: 'Test Strategy'
      });
    });
  });

  it('handles cancel button click', () => {
    render(<PortfolioForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('disables submit button when loading', () => {
    render(<PortfolioForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isLoading={true} />);
    
    expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled();
  });

  it('disables submit button when naziv is empty', () => {
    render(<PortfolioForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const submitButton = screen.getByRole('button', { name: /create portfolio/i });
    expect(submitButton).toBeDisabled();
  });

  it('validates required fields', async () => {
    render(<PortfolioForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const submitButton = screen.getByRole('button', { name: /create portfolio/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/portfolio name/i)).toBeInvalid();
    });
  });
}); 