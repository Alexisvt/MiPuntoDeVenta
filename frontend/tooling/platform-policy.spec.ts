import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';

import nextConfig from '../next.config';
import {
  evaluatePlatformPolicy,
  evaluateRepositoryStructure,
} from './platform-policy';

function repositoryPaths(directory: URL, prefix = ''): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (['.angular', '.next', 'node_modules', 'out'].includes(entry.name)) {
      return [];
    }

    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    return entry.isDirectory()
      ? repositoryPaths(new URL(`${entry.name}/`, directory), path)
      : [path];
  });
}

const approvedInput = {
  dependencies: {
    '@tanstack/react-query': '^5.0.0',
    next: '^16.3.0',
    react: '^19.2.0',
    'react-dom': '^19.2.0',
  },
  devDependencies: {},
  nodeEngine: '^24.0.0',
  nextConfig: {
    output: 'export',
    trailingSlash: true,
  },
};

describe('frontend platform policy', () => {
  it('keeps the repository on the approved platform policy', () => {
    const manifest = JSON.parse(
      readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
    ) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
      engines: { node: string };
    };

    expect(
      evaluatePlatformPolicy({
        dependencies: manifest.dependencies,
        devDependencies: manifest.devDependencies,
        nodeEngine: manifest.engines.node,
        nextConfig,
      }),
    ).toEqual([]);
  });

  it('accepts the approved static Next.js baseline', () => {
    expect(evaluatePlatformPolicy(approvedInput)).toEqual([]);
  });

  it('rejects Angular dependencies and an unsupported Node runtime', () => {
    const violations = evaluatePlatformPolicy({
      ...approvedInput,
      dependencies: {
        ...approvedInput.dependencies,
        '@angular/core': '^22.1.0',
      },
      nodeEngine: '^25.0.0',
    });

    expect(violations).toEqual([
      'Angular dependencies are not allowed.',
      'Node.js 24 LTS must be the only supported runtime line.',
    ]);
  });

  it('rejects dependencies outside the approved frontend lines', () => {
    expect(
      evaluatePlatformPolicy({
        ...approvedInput,
        dependencies: {
          '@tanstack/react-query': '^4.0.0',
          next: '^15.0.0',
          react: '^18.0.0',
        },
      }),
    ).toEqual([
      'Next.js 16.3 is required.',
      'React 19.2 and React DOM 19.2 are required.',
      'TanStack Query v5 is required.',
    ]);
  });

  it('rejects a frontend that requires a Next.js runtime server', () => {
    expect(
      evaluatePlatformPolicy({
        ...approvedInput,
        nextConfig: { output: 'standalone', trailingSlash: false },
      }),
    ).toEqual([
      'Next.js output must be a static export.',
      'Static routes must use trailing-slash output.',
    ]);
  });

  it('keeps feature boundaries without Angular or Route Handlers', () => {
    expect(
      evaluateRepositoryStructure(repositoryPaths(new URL('../', import.meta.url))),
    ).toEqual([]);
  });

  it('reports missing boundaries and forbidden framework files', () => {
    expect(
      evaluateRepositoryStructure([
        'angular.json',
        'app/api/route.ts',
        'src/main.ts',
      ]),
    ).toEqual([
      'Required scaffold file is missing: app/layout.tsx.',
      'Required scaffold file is missing: app/page.tsx.',
      'Required scaffold file is missing: features/README.md.',
      'Required scaffold file is missing: lib/README.md.',
      'Angular source and configuration are not allowed.',
      'Next.js runtime Route Handlers are not allowed in the static MVP.',
    ]);
  });
});
