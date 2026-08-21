type Dependencies = Record<string, string | undefined>;

interface PlatformPolicyInput {
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
  nodeEngine?: string;
  nextConfig?: {
    output?: string;
    trailingSlash?: boolean;
  };
}

const angularPackagePrefix = '@angular/';
const requiredScaffoldFiles = [
  'app/layout.tsx',
  'app/page.tsx',
  'features/README.md',
  'lib/README.md',
];

function matchesVersionLine(version: string | undefined, line: string) {
  return new RegExp(`^[~^]?${line.replace('.', '\\.')}(?:\\.|$)`, 'u').test(
    version ?? '',
  );
}

export function evaluatePlatformPolicy({
  dependencies,
  devDependencies,
  nodeEngine,
  nextConfig,
}: PlatformPolicyInput) {
  const violations: string[] = [];
  const packageNames = [
    ...Object.keys(dependencies ?? {}),
    ...Object.keys(devDependencies ?? {}),
  ];

  if (packageNames.some((name) => name.startsWith(angularPackagePrefix))) {
    violations.push('Angular dependencies are not allowed.');
  }

  if (!matchesVersionLine(dependencies?.next, '16.3')) {
    violations.push('Next.js 16.3 is required.');
  }

  if (
    !matchesVersionLine(dependencies?.react, '19.2') ||
    !matchesVersionLine(dependencies?.['react-dom'], '19.2')
  ) {
    violations.push('React 19.2 and React DOM 19.2 are required.');
  }

  if (!matchesVersionLine(dependencies?.['@tanstack/react-query'], '5')) {
    violations.push('TanStack Query v5 is required.');
  }

  if (!/^\^24(?:\.|$)/u.test(nodeEngine ?? '')) {
    violations.push('Node.js 24 LTS must be the only supported runtime line.');
  }

  if (nextConfig?.output !== 'export') {
    violations.push('Next.js output must be a static export.');
  }

  if (nextConfig?.trailingSlash !== true) {
    violations.push('Static routes must use trailing-slash output.');
  }

  return violations;
}

export function evaluateRepositoryStructure(paths: string[]) {
  const pathSet = new Set(paths);
  const violations = requiredScaffoldFiles
    .filter((path) => !pathSet.has(path))
    .map((path) => `Required scaffold file is missing: ${path}.`);

  if (
    paths.some(
      (path) =>
        path === 'angular.json' ||
        path.startsWith('src/app/') ||
        path === 'src/main.ts',
    )
  ) {
    violations.push('Angular source and configuration are not allowed.');
  }

  if (paths.some((path) => /^app\/.+\/route\.[jt]sx?$/u.test(path))) {
    violations.push(
      'Next.js runtime Route Handlers are not allowed in the static MVP.',
    );
  }

  return violations;
}
