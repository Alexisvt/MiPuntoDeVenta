import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FoundationStatus } from './foundation-status';

function renderWithClient(children: ReactNode) {
  const client = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });

  return render(<QueryClientProvider client={client}>{children}</QueryClientProvider>);
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { 'content-type': 'application/json' },
    status,
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('FoundationStatus', () => {
  it('announces loading and then an available Spring service in Spanish', async () => {
    let resolveResponse: (response: Response) => void = () => undefined;
    const pendingResponse = new Promise<Response>((resolve) => {
      resolveResponse = resolve;
    });
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(pendingResponse));

    renderWithClient(<FoundationStatus />);
    expect(screen.getByRole('status')).toHaveTextContent('Comprobando conexión');

    resolveResponse(jsonResponse({ status: 'UP' }));
    await screen.findByText('Sistema disponible');
    expect(screen.getByRole('status')).toHaveTextContent('Sistema disponible');
  });

  it('shows a rejected operation as failure and never as completion', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ message: 'Register unavailable' }, 409)),
    );

    renderWithClient(<FoundationStatus />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No pudimos conectar con el sistema',
    );
    expect(screen.queryByText('Sistema disponible')).not.toBeInTheDocument();
  });

  it('refreshes remote state when the cashier retries after a failure', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ message: 'Unavailable' }, 503))
      .mockResolvedValueOnce(jsonResponse({ status: 'UP' }));
    vi.stubGlobal('fetch', fetcher);
    const user = userEvent.setup();

    renderWithClient(<FoundationStatus />);
    await user.click(await screen.findByRole('button', { name: 'Reintentar' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Sistema disponible');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('keeps transient details local without requesting remote state again', async () => {
    const fetcher = vi.fn().mockResolvedValue(jsonResponse({ status: 'UP' }));
    vi.stubGlobal('fetch', fetcher);
    const user = userEvent.setup();

    renderWithClient(<FoundationStatus />);
    await screen.findByText('Sistema disponible');
    await user.click(screen.getByRole('button', { name: 'Ver detalles' }));

    expect(screen.getByText('La conexión se verifica directamente con el sistema.')).toBeVisible();
    expect(fetcher).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Ocultar detalles' }));
    expect(
      screen.queryByText('La conexión se verifica directamente con el sistema.'),
    ).not.toBeInTheDocument();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
