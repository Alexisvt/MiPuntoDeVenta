// @vitest-environment node

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function repositoryFile(path: string) {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

const documents = [
  'README.md',
  'frontend/README.md',
  'infra/README.md',
  'openspec/config.yaml',
  'openspec/changes/mvp-pos-simple/proposal.md',
  'openspec/changes/mvp-pos-simple/design.md',
  'openspec/changes/mvp-pos-simple/tasks.md',
].map((path) => ({ content: repositoryFile(path), path }));

describe('authoritative frontend documentation', () => {
  it.each(documents)('removes Angular authority from $path', ({ content }) => {
    expect(content).not.toMatch(/Angular/i);
  });

  it('documents the approved static Next.js and TanStack Query client', () => {
    const rootReadme = repositoryFile('README.md');
    const frontendReadme = repositoryFile('frontend/README.md');

    expect(rootReadme).toContain('Next.js 16.3');
    expect(frontendReadme).toContain('TanStack Query v5');
    expect(frontendReadme).toContain('frontend/out/');
  });

  it('keeps a frontend ECS runtime explicitly deferred', () => {
    const infrastructure = repositoryFile('infra/README.md');
    const mvpDesign = repositoryFile('openspec/changes/mvp-pos-simple/design.md');

    expect(infrastructure).toContain('frontend ECS runtime is deferred');
    expect(mvpDesign).toContain('frontend ECS runtime remains deferred');
  });

  it('records the migration as the prerequisite for access and inventory', () => {
    const state = repositoryFile('openspec/changes/mvp-pos-simple/state.yaml');

    expect(state).toContain('prerequisite: migrate-frontend-to-nextjs');
  });
});
