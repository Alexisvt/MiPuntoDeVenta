import { describe, expect, it, vi } from 'vitest';

import { ApiError, apiFetch } from './api-client';

describe('apiFetch', () => {
  it('returns the JSON body from an accepted Spring response', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ status: 'UP' }), {
        headers: { 'content-type': 'application/json' },
        status: 200,
      }),
    );

    await expect(apiFetch<{ status: string }>('/api/v1/health', { fetcher })).resolves.toEqual({
      status: 'UP',
    });
  });

  it('preserves a rejected Spring status, content type, and body', async () => {
    const body = { message: 'Register unavailable' };
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(body), {
        headers: { 'content-type': 'application/problem+json' },
        status: 409,
        statusText: 'Conflict',
      }),
    );

    const error = await apiFetch('/api/v1/register', { fetcher }).catch(
      (reason: unknown) => reason,
    );

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      body,
      contentType: 'application/problem+json',
      message: 'Register unavailable',
      status: 409,
    });
  });

  it('preserves a plain-text rejection when Spring does not return JSON', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response('Service unavailable', {
        headers: { 'content-type': 'text/plain;charset=UTF-8' },
        status: 503,
      }),
    );

    await expect(apiFetch('/api/v1/health', { fetcher })).rejects.toMatchObject({
      body: 'Service unavailable',
      contentType: 'text/plain;charset=UTF-8',
      status: 503,
    });
  });
});
