type ApiBody = unknown;

interface ApiFetchOptions extends RequestInit {
  fetcher?: typeof fetch;
}

function errorMessage(status: number, body: ApiBody) {
  if (
    typeof body === 'object' &&
    body !== null &&
    'message' in body &&
    typeof body.message === 'string'
  ) {
    return body.message;
  }

  return `Spring request failed with status ${status}.`;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly contentType: string,
    public readonly body: ApiBody,
  ) {
    super(errorMessage(status, body));
    this.name = 'ApiError';
  }
}

async function readBody(response: Response): Promise<ApiBody> {
  const contentType = response.headers.get('content-type') ?? '';

  if (response.status === 204) {
    return undefined;
  }

  return contentType.includes('json') ? response.json() : response.text();
}

export async function apiFetch<T>(url: string, options: ApiFetchOptions = {}): Promise<T> {
  const { fetcher = fetch, ...requestOptions } = options;
  const headers = new Headers(requestOptions.headers);
  if (!headers.has('accept')) {
    headers.set('accept', 'application/json');
  }
  const response = await fetcher(url, {
    ...requestOptions,
    headers,
  });
  const body = await readBody(response);

  if (!response.ok) {
    throw new ApiError(response.status, response.headers.get('content-type') ?? '', body);
  }

  return body as T;
}
