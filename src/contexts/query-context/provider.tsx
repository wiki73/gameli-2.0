import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { TIME } from '@/consts';
import { queryClient } from './queryClient';
import { persister } from './persist';
import type { PropsWithChildren } from 'react';

export const QueryProvider = ({ children }: PropsWithChildren) => (
  <PersistQueryClientProvider
    client={queryClient}
    onSuccess={() => {
      queryClient.resumePausedMutations();
    }}
    persistOptions={{
      persister,
      maxAge: TIME.DAY,
      buster: 'v1',
    }}
  >
    {children}
  </PersistQueryClientProvider>
);
