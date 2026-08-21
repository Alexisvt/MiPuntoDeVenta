'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { createAppQueryClient } from '../lib/query/query-client';

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  const [queryClient] = useState(createAppQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
