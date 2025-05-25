import { useQuery } from "@tanstack/react-query";
import { Cryptocurrency } from "@/types/database";
import { api } from "@/lib/api";

export const useCryptocurrencies = () => {
  const { data: cryptocurrencies, isLoading, error } = useQuery({
    queryKey: ['cryptocurrencies'],
    queryFn: async () => {
      console.log('Fetching cryptocurrencies...');
      const data = await api.cryptocurrencies.getAll();
      console.log('Cryptocurrencies fetched:', data);
      return data as Cryptocurrency[];
    },
  });

  return {
    cryptocurrencies: cryptocurrencies || [],
    isLoading,
    error,
  };
};
