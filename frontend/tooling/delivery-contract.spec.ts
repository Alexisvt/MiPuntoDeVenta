// @vitest-environment node

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const terraform = readFileSync(new URL('../../infra/main.tf', import.meta.url), 'utf8');
const dockerfile = readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8');
const cdWorkflow = readFileSync(
  new URL('../../.github/workflows/cd.yml', import.meta.url),
  'utf8',
);

function cacheBehavior(pathPattern: string) {
  const marker = terraform.indexOf(`"${pathPattern}"`);
  if (marker < 0) return '';
  const start = terraform.lastIndexOf('ordered_cache_behavior {', marker);
  const nextBehavior = terraform.indexOf('ordered_cache_behavior {', marker);
  return terraform.slice(start, nextBehavior < 0 ? undefined : nextBehavior);
}

describe('static frontend delivery contract', () => {
  it('keeps API authorization and missing-resource responses on the backend', () => {
    const apiBehavior = cacheBehavior('/api/*');

    expect(apiBehavior).toContain('target_origin_id         = "backend"');
    expect(apiBehavior).toContain('cache_policy_id          = data.aws_cloudfront_cache_policy.caching_disabled.id');
    expect(apiBehavior).not.toContain('function_association');
    expect(terraform).not.toContain('custom_error_response');
  });

  it('caches immutable Next.js assets separately from uncached HTML', () => {
    const assetsBehavior = cacheBehavior('/_next/static/*');

    expect(assetsBehavior).toContain('target_origin_id       = "frontend"');
    expect(assetsBehavior).toContain(
      'cache_policy_id        = data.aws_cloudfront_cache_policy.caching_optimized.id',
    );
    expect(terraform).toMatch(
      /default_cache_behavior[\s\S]*cache_policy_id\s*=\s*data\.aws_cloudfront_cache_policy\.caching_disabled\.id/,
    );
  });

  it('packages and publishes the Next.js static export directory', () => {
    expect(dockerfile).toContain('COPY --from=build /app/out /usr/share/nginx/html');
    expect(dockerfile).not.toContain('dist/frontend/browser');
    expect(cdWorkflow).toContain('aws s3 sync out ');
    expect(cdWorkflow).toContain('out/_next/static');
    expect(cdWorkflow).not.toContain('dist/frontend/browser');
  });
});
