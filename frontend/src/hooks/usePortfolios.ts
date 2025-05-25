import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Portfolio } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export const usePortfolios = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: portfolios, isLoading, error } = useQuery({
    queryKey: ['portfolios'],
    queryFn: async () => {
      console.log('Fetching portfolios...');
      const data = await api.portfolios.getAll();
      console.log('Portfolios fetched:', data);
      return data as Portfolio[];
    },
  });

  const createPortfolio = useMutation({
    mutationFn: async (portfolio: Omit<Portfolio, 'id' | 'created_at' | 'updated_at' | 'datum_kreiranja'>) => {
      console.log('Creating portfolio:', portfolio);
      const data = await api.portfolios.create(portfolio);
      console.log('Portfolio created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      toast({
        title: "Success",
        description: "Portfolio created successfully",
      });
    },
    onError: (error) => {
      console.error('Error in createPortfolio mutation:', error);
      toast({
        title: "Error",
        description: "Failed to create portfolio",
        variant: "destructive",
      });
    },
  });

  const deletePortfolio = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting portfolio:', id);
      await api.portfolios.delete(id);
      console.log('Portfolio deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Success",
        description: "Portfolio deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error in deletePortfolio mutation:', error);
      toast({
        title: "Error",
        description: "Failed to delete portfolio",
        variant: "destructive",
      });
    },
  });

  const editPortfolio = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Omit<Portfolio, 'id' | 'created_at' | 'updated_at' | 'datum_kreiranja'>> }) => {
      console.log('Editing portfolio:', id, data);
      const updated = await api.portfolios.update(id, data);
      console.log('Portfolio updated:', updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      toast({
        title: 'Success',
        description: 'Portfolio updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error in editPortfolio mutation:', error);
      toast({
        title: 'Error',
        description: 'Failed to update portfolio',
        variant: 'destructive',
      });
    },
  });

  return {
    portfolios: portfolios || [],
    isLoading,
    error,
    createPortfolio,
    deletePortfolio,
    editPortfolio,
  };
};
