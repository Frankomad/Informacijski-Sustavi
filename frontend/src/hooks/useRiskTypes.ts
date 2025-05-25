import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RiskType } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export const useRiskTypes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: riskTypes, isLoading, error } = useQuery({
    queryKey: ['riskTypes'],
    queryFn: async () => {
      console.log('Fetching risk types');
      const data = await api.riskTypes.getAll();
      console.log('Risk types fetched:', data);
      return data as RiskType[];
    },
  });

  const createRiskType = useMutation({
    mutationFn: async (riskType: Omit<RiskType, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating risk type:', riskType);
      const data = await api.riskTypes.create(riskType);
      console.log('Risk type created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riskTypes'] });
      toast({
        title: "Success",
        description: "Risk type created successfully",
      });
    },
    onError: (error) => {
      console.error('Error in createRiskType mutation:', error);
      toast({
        title: "Error",
        description: "Failed to create risk type",
        variant: "destructive",
      });
    },
  });

  const deleteRiskType = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting risk type:', id);
      await api.riskTypes.delete(id);
      console.log('Risk type deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riskTypes'] });
      toast({
        title: "Success",
        description: "Risk type deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error in deleteRiskType mutation:', error);
      let message = 'Failed to delete risk type';
      if (error instanceof Error && error.message.includes('it is used in one or more transactions')) {
        message = 'Cannot delete risk type: it is used in one or more transactions.';
      }
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const editRiskType = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Omit<RiskType, 'id' | 'created_at' | 'updated_at'>> }) => {
      console.log('Editing risk type:', id, data);
      const updated = await api.riskTypes.update(id, data);
      console.log('Risk type updated:', updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riskTypes'] });
      toast({
        title: 'Success',
        description: 'Risk type updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error in editRiskType mutation:', error);
      toast({
        title: 'Error',
        description: 'Failed to update risk type',
        variant: 'destructive',
      });
    },
  });

  return {
    riskTypes: riskTypes || [],
    isLoading,
    error,
    createRiskType,
    deleteRiskType,
    editRiskType,
  };
};
