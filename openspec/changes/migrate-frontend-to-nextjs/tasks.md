# Tasks: Migrate Frontend to Next.js

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 9,000-15,000 including generated lockfile; 900-1,600 hand-authored |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | tooling -> foundation UI -> delivery |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

Draft tracker `feat/mvp-nextjs-migration` targets `feat/mvp-foundation`, stays no-merge until complete, and uses `size:exception` only as an aggregate map.

### Suggested Work Units

| Unit | Start -> End | Branch / Base | Verify, rollback, budget |
|---|---|---|---|
| 1. Tooling | Angular -> static Next scaffold | `feat/mvp-nextjs-tooling` / `feat/mvp-nextjs-migration` | Policy/lint/CI; revert scaffold; lockfile exception, manual diff under 400. |
| 2. UI | Scaffold -> accessible health UI | `feat/mvp-nextjs-foundation-ui` / `feat/mvp-nextjs-tooling` | Vitest/RTL/axe; revert UI/query; under 400 or split. |
| 3. Delivery | Local client -> AWS-ready | `feat/mvp-nextjs-delivery` / `feat/mvp-nextjs-foundation-ui` | Route/Terraform/CI; restore S3 routing; under 400 or split. |

Polluted child diffs MUST be retargeted or rebased. Access/inventory waits for the integrated tracker.

## Phase 1: PR 1, Tooling and Static Scaffold

- [ ] 1.1 Record the `frontend/angular.json` analytics diff as Angular-only telemetry; intentionally retire it in PR notes.
- [ ] 1.2 RED: add frontend policy tests for the Approved manifest and Static-only hosting scenarios, including unsupported Node failure.
- [ ] 1.3 GREEN: replace manifests/configs with React 19.2, Next.js 16.3, TanStack Query v5, Node 24, strict TS/ESLint/Vitest, and static export.
- [ ] 1.4 REFACTOR: create `frontend/app`, `features`, and `lib`; remove Angular-only source/config; keep root `Dockerfile` and `docker-compose.yml` unchanged.
- [ ] 1.5 Verify policy/lint and CI `out/`; document rollback and lockfile review scope.

## Phase 2: PR 2, Foundation UI and State

- [ ] 2.1 Before UI code, create `DESIGN.md` from `PRODUCT.md` and Impeccable decisions: tokens, focus, spacing, Spanish copy, anti-patterns.
- [ ] 2.2 RED: add RTL/user-event tests for Available service, Unavailable service, Rejected operation, Remote refresh, Optimistic failure, and Transient interaction scenarios using a fresh no-retry QueryClient.
- [ ] 2.3 GREEN: implement providers, typed API/errors, health query keys, and Spanish loading/error/retry UI with Spring authoritative.
- [ ] 2.4 REFACTOR: isolate feature boundaries and local UI state; add the browser-only `ReceiptPrinter` port without hardware behavior or Route Handler BFF.
- [ ] 2.5 RED -> GREEN -> REFACTOR: migrate E2E for keyboard, focus, reduced motion, Spanish states, and zero configured axe violations; verify unit/E2E/lint.

## Phase 3: PR 3, Delivery and Reconciliation

- [ ] 3.1 RED: add route-function tests for root, nested, asset, API authorization, and missing API scenarios.
- [ ] 3.2 GREEN: update `infra/main.tf` routing/cache, `frontend/Dockerfile`, and CD to publish `frontend/out/`.
- [ ] 3.3 REFACTOR: update CI/security workflows for Next/Vitest/Playwright and JavaScript analysis while retaining all existing gates.
- [ ] 3.4 Reconcile README/frontend/infra docs, `openspec/config.yaml`, and MVP design/tasks; remove Angular authority and defer ECS Next runtime.
- [ ] 3.5 Verify route tests, Terraform/workflow syntax, lint/tests, and CI production export; record S3/CloudFront rollback and tracker integration evidence.
