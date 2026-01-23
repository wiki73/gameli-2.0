import { QueryClient } from '@tanstack/react-query';
import { TIME } from '@/consts';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: TIME.DAY,
      retry: 0,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      networkMode: 'offlineFirst',
    },
    mutations: {
      gcTime: TIME.DAY,
      retry: 0,
      networkMode: 'offlineFirst',
    },
  },
});

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient;
  }
}

if (process.env.NODE_ENV === 'development') {
  window.__TANSTACK_QUERY_CLIENT__ = queryClient;
}
