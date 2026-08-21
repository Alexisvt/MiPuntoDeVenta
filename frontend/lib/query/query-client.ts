import { QueryClient, type QueryKey } from '@tanstack/react-query';

import { ApiError } from '../api/api-client';

export function shouldRetryQuery(failureCount: number, error: unknown) {
  if (error instanceof ApiError && error.status < 500) {
    return false;
  }

  return failureCount < 1;
}

export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: {
        refetchOnWindowFocus: false,
        retry: shouldRetryQuery,
        staleTime: 30_000,
      },
    },
  });
}

export function refreshRemoteState(client: QueryClient, queryKey: QueryKey) {
  return client.invalidateQueries({ queryKey, refetchType: 'all' });
}

export interface OptimisticContext<T> {
  previous: T | undefined;
}

export async function beginOptimisticUpdate<T>(
  client: QueryClient,
  queryKey: QueryKey,
  update: (previous: T | undefined) => T,
): Promise<OptimisticContext<T>> {
  await client.cancelQueries({ exact: true, queryKey });
  const previous = client.getQueryData<T>(queryKey);
  client.setQueryData<T>(queryKey, update(previous));
  return { previous };
}

export function rollbackOptimisticUpdate<T>(
  client: QueryClient,
  queryKey: QueryKey,
  context: OptimisticContext<T>,
) {
  if (context.previous === undefined) {
    client.removeQueries({ exact: true, queryKey });
    return;
  }

  client.setQueryData(queryKey, context.previous);
}
