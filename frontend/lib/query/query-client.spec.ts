import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import { ApiError } from '../api/api-client';
import {
  beginOptimisticUpdate,
  createAppQueryClient,
  refreshRemoteState,
  rollbackOptimisticUpdate,
  shouldRetryQuery,
} from './query-client';

describe('query client policy', () => {
  it('retries a network failure once and then stops', () => {
    const networkError = new TypeError('Network request failed');

    expect(shouldRetryQuery(0, networkError)).toBe(true);
    expect(shouldRetryQuery(1, networkError)).toBe(false);
  });

  it('retries a 5xx response once but never retries a 4xx rejection', () => {
    expect(shouldRetryQuery(0, new ApiError(503, 'application/json', {}))).toBe(true);
    expect(shouldRetryQuery(0, new ApiError(409, 'application/json', {}))).toBe(false);
  });

  it('does not retry mutations automatically', () => {
    const client = createAppQueryClient();

    expect(client.getDefaultOptions().mutations?.retry).toBe(false);
  });
});

describe('remote synchronization', () => {
  it('refetches stale cached data and converges on the latest Spring value', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const key = ['inventory', 'summary'] as const;
    let springValue = { products: 4 };
    const queryFn = async () => springValue;

    await client.fetchQuery({ queryFn, queryKey: key });
    expect(client.getQueryData(key)).toEqual({ products: 4 });

    springValue = { products: 5 };
    await refreshRemoteState(client, key);
    expect(client.getQueryData(key)).toEqual({ products: 5 });
  });
});

describe('optimistic updates', () => {
  it('restores the authoritative cached value after a rejection', async () => {
    const client = new QueryClient();
    const key = ['register', 'status'] as const;
    client.setQueryData(key, { open: true });

    const context = await beginOptimisticUpdate(client, key, () => ({ open: false }));
    expect(client.getQueryData(key)).toEqual({ open: false });

    rollbackOptimisticUpdate(client, key, context);
    expect(client.getQueryData(key)).toEqual({ open: true });
  });

  it('removes a provisional value when no authoritative cache existed', async () => {
    const client = new QueryClient();
    const key = ['sale', 'draft'] as const;

    const context = await beginOptimisticUpdate(client, key, () => ({ total: 1200 }));
    expect(client.getQueryData(key)).toEqual({ total: 1200 });

    rollbackOptimisticUpdate(client, key, context);
    expect(client.getQueryData(key)).toBeUndefined();
  });
});
