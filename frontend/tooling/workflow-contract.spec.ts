// @vitest-environment node

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const ci = readFileSync(new URL('../../.github/workflows/ci.yml', import.meta.url), 'utf8');
const security = readFileSync(
  new URL('../../.github/workflows/security.yml', import.meta.url),
  'utf8',
);

describe('frontend automation contract', () => {
  it('runs static Next.js quality and export checks on Node 24', () => {
    expect(ci).toContain("node-version: '24'");
    expect(ci).toContain('npm run lint');
    expect(ci).toContain('npm run typecheck');
    expect(ci).toContain('npm run test:ci');
    expect(ci).toContain('npm run build');
    expect(ci).toContain('test -f out/index.html');
  });

  it('retains the Playwright journey and infrastructure gates', () => {
    expect(ci).toContain('npm run test:e2e');
    expect(ci).toContain('docker/build-push-action@v6');
    expect(ci).toContain('terraform validate');
    expect(ci).not.toMatch(/Angular/i);
  });

  it('retains dependency, secret, CodeQL, and filesystem security gates', () => {
    expect(security).toContain('actions/dependency-review-action@v4');
    expect(security).toContain('gitleaks/gitleaks-action@v2');
    expect(security).toContain('languages: java,javascript-typescript');
    expect(security).toContain('aquasecurity/trivy-action@');
    expect(security).toContain("severity: 'HIGH,CRITICAL'");
    expect(security).toContain("exit-code: '1'");
  });
});
