// @vitest-environment node

import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

interface CloudFrontRequest {
  uri: string;
}

type Handler = (event: { request: CloudFrontRequest }) => CloudFrontRequest;

function loadHandler(): Handler {
  const source = readFileSync(
    new URL('../../infra/cloudfront/frontend-rewrite.js', import.meta.url),
    'utf8',
  );
  const context: { handler?: Handler } = {};
  runInNewContext(`${source}\nthis.handler = handler;`, context);

  if (!context.handler) {
    throw new Error('CloudFront handler was not defined.');
  }

  return context.handler;
}

function rewrite(uri: string) {
  return loadHandler()({ request: { uri } }).uri;
}

describe('CloudFront frontend route transformation', () => {
  it('maps the root document to the exported root HTML', () => {
    expect(rewrite('/')).toBe('/index.html');
  });

  it.each([
    ['/inventario', '/inventario/index.html'],
    ['/inventario/', '/inventario/index.html'],
    ['/ventas/nueva', '/ventas/nueva/index.html'],
  ])('maps extensionless route %s to its route-specific HTML', (uri, expected) => {
    expect(rewrite(uri)).toBe(expected);
  });

  it.each(['/_next/static/chunks/app.js', '/favicon.ico', '/images/logo.svg'])(
    'leaves static asset %s unchanged',
    (uri) => {
      expect(rewrite(uri)).toBe(uri);
    },
  );

  it.each(['/api/v1/health', '/api/v1/users/missing'])(
    'leaves API request %s unchanged for backend status handling',
    (uri) => {
      expect(rewrite(uri)).toBe(uri);
    },
  );
});
