# Proposal: Migrate Frontend to Next.js

## Intent

Replace Angular before business workflows expand, enabling hands-on FDE growth while preserving an accessible, low-cognitive-load POS for Costa Rican operators.

## Scope

### In Scope

- Adopt React 19.2, Next.js 16.3 App Router, TanStack Query v5, and Node 24 LTS as a static S3/CloudFront export.
- Recreate the foundation UI, health integration, strict-TDD, Playwright, and axe coverage.
- Adapt CloudFront routing without rewriting `/api` responses.
- Reconcile CI/CD, Docker, documentation, and active SDD artifacts.

### Out of Scope

- Next.js SSR, Server Actions, runtime Route Handlers, or an ECS frontend service.
- Spring Boot domain, database, authentication, or printing changes.

## Capabilities

### New Capabilities

- `web-client-platform`: Next.js static delivery, selective Spring server-state access, accessibility, and testing.

### Modified Capabilities

None. Existing business behavior remains unchanged.

## Approach

Build feature-oriented App Router boundaries with Spanish UI copy. Spring remains authoritative. TanStack Query manages remote state needing caching, invalidation, mutations, polling, or optimistic recovery; React/form state owns transient UI state. Route Handlers MUST NOT duplicate domain logic. Insert this prerequisite between `feat/mvp-foundation` and `feat/mvp-access-inventory`.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `frontend/` | Replaced | Tested Next.js static client. |
| `infra/main.tf` | Modified | Serve route-specific static HTML; preserve `/api/*` semantics. |
| `.github/workflows/` | Modified | Update frontend CI, security analysis, and S3 publication. |
| Docs/OpenSpec | Modified | Replace Angular contracts. |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Static export mistaken for runtime Next.js | Medium | Specify boundaries; prohibit unsupported features. |
| CloudFront masks API errors | Medium | Scope rewrites to frontend routes and test non-2xx API behavior. |
| Oversized review | High | Use autonomous chained slices. |
| Local Angular work is lost | Medium | Inspect and intentionally reconcile the existing `angular.json` modification. |

## Rollback Plan

Redeploy the previous Angular artifact, restore its frontend-only CloudFront rewrite, and revert the migration chain. Backend and database remain independently rollbackable.

## Dependencies

- `feat/mvp-foundation`, `/api/v1/health`, Node 24 LTS, npm, existing S3/CloudFront.
- Resolution of the unrelated local `frontend/angular.json` modification before scaffold removal.

## Success Criteria

- [ ] No Angular tooling remains; manifests use approved React, Next.js, TanStack Query, and Node lines.
- [ ] Static output deploys to S3 and direct/nested routes resolve while `/api` status and bodies remain unchanged.
- [ ] Strict-TDD checks and Playwright/axe pass with zero detectable accessibility violations.
- [ ] Health server state uses TanStack Query; transient UI state does not.
- [ ] ECS-hosted Next.js remains explicitly deferred and Spring owns all domain rules.
