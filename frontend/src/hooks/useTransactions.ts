import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Transaction } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export const useTransactions = (portfolioId?: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['transactions', portfolioId],
    queryFn: async () => {
      console.log('Fetching transactions for portfolio:', portfolioId);
      const data = await api.transactions.getAll(portfolioId || undefined);
      console.log('Transactions fetched:', data);
      return data as Transaction[];
    },
  });

  const createTransaction = useMutation({
    mutationFn: async (transaction: {
      portfolio_id: string;
      cryptocurrency_id: string;
      tip_transakcije: 'LONG' | 'SHORT';
      kolicina: number;
      cijena: number;
      datum: string;
      risk_type_id: string;
    }) => {
      console.log('Creating transaction:', transaction);
      const data = await api.transactions.create(transaction);
      console.log('Transaction created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Success",
        description: "Position created successfully",
      });
    },
    onError: (error) => {
      console.error('Error in createTransaction mutation:', error);
      toast({
        title: "Error",
        description: "Failed to create position",
        variant: "destructive",
      });
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting transaction:', id);
      await api.transactions.delete(id);
      console.log('Transaction deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Success",
        description: "Position deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error in deleteTransaction mutation:', error);
      toast({
        title: "Error",
        description: "Failed to delete position",
        variant: "destructive",
      });
    },
  });

  const editTransaction = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<{
      portfolio_id: string;
      cryptocurrency_id: string;
      tip_transakcije: 'LONG' | 'SHORT';
      kolicina: number;
      cijena: number;
      datum: string;
      risk_type_id: string;
    }> }) => {
      console.log('Editing transaction:', id, data);
      const updated = await api.transactions.update(id, data);
      console.log('Transaction updated:', updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: 'Success',
        description: 'Position updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error in editTransaction mutation:', error);
      toast({
        title: 'Error',
        description: 'Failed to update position',
        variant: 'destructive',
      });
    },
  });

  return {
    transactions: transactions || [],
    isLoading,
    error,
    createTransaction,
    deleteTransaction,
    editTransaction,
  };
};
