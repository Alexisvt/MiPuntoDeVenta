import { queryOptions } from '@tanstack/react-query';

import { ApiError, apiFetch } from '../../lib/api/api-client';

interface HealthResponse {
  status: string;
}

export const healthKeys = {
  all: ['health'] as const,
  status: () => [...healthKeys.all, 'status'] as const,
};

async function fetchHealth() {
  const response = await apiFetch<HealthResponse>('/api/v1/health');

  if (response.status !== 'UP') {
    throw new ApiError(503, 'application/json', response);
  }

  return response;
}

export function healthQueryOptions() {
  return queryOptions({
    queryFn: fetchHealth,
    queryKey: healthKeys.status(),
  });
}
