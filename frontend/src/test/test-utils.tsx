import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function TestWrapper({ children }: { children: ReactNode }) {
  const testQueryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
} 