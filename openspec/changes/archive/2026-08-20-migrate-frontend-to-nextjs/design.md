# Design: Migrate Frontend to Next.js

## Technical Approach

Replace Angular with React 19.2 and Next.js 16.3 App Router on Node 24 LTS. `output: "export"` and `trailingSlash: true` produce `out/` for private S3. Spring remains the business API. Interactive features use TanStack Query v5 where state is remote.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|---|---|---|---|
| Runtime | Static App Router export | Vite SPA; Next.js ECS; Amplify | Meets the learning goal without a second production runtime, cold starts, or recurring compute. ECS is deferred. |
| Structure | `app/` routes plus `features/{access,inventory,sales,cash,printing}` and `lib/` | Layer-only folders | Business-oriented navigation preserves the modular-monolith vocabulary. |
| Components | Static layouts/pages by default; narrow `'use client'` providers and interactive features | Client-mark the whole tree | Static export can build server components, but runtime health, auth, POS, and printing require browser execution. |
| Server state | One client provider, feature query-key factories, typed transport | Raw effects; global client store | Query caching stays distinct from ticket, focus, modal, and print-dialog state. Queries retry once only for network/5xx failures; never retry 4xx. Mutations do not retry automatically. Successful mutations invalidate their feature keys; optimistic changes require rollback. |
| API boundary | Same-origin `/api/v1/**` directly to Spring | Next Route Handler BFF | Avoids CORS and duplicate domain rules. Transport preserves status, content type, and body in a typed `ApiError`. |
| Security seam | Future Spring-owned Secure, HttpOnly, SameSite session cookie and CSRF header contract | Browser-stored tokens | Keeps credentials unavailable to JavaScript. CloudFront forwards API cookies and required headers with API caching disabled. No auth is implemented here. |
| Printing seam | Browser-only `ReceiptPrinter` port with installed-driver adapter | Direct ESC/POS | Preserves Epson TM-T20II and 3nstar behavior without coupling UI to hardware. Implementation remains deferred. |

## Data Flow

```text
Static page -> Client feature -> Query/Mutation -> typed fetch('/api/v1/...')
                                             -> CloudFront /api/* -> Spring -> PostgreSQL
Browser print action -> ReceiptPrinter -> browser dialog -> Epson driver -> drawer
```

`app/providers.tsx` owns the browser `QueryClient`. Health renders `Comprobando conexión…`, then `Sistema disponible`, or an announced error with `Reintentar`. Remote responses remain authoritative.

## Experience Direction

The physical scene is a bright checkout counter under time pressure. Preserve a light theme with tinted warm neutrals, forest accent, high contrast, restrained hierarchy, varied spacing, and 65 to 75 character body measure. Keep status and recovery inline, not modal. Use one clear primary action, visible focus, keyboard-first order, reduced motion, and concise Spanish copy. Avoid nested cards, side stripes, gradients, glass effects, hero metrics, and repetitive card grids. `DESIGN.md` is missing, so design-system drift is a rollout risk; establish that register before expanding beyond the foundation.

## CloudFront and Delivery

The frontend-only viewer function appends `index.html` to `/` and `/index.html` to extensionless paths, matching `trailingSlash` output. It is not associated with `/api/*`; no distribution-level error fallback is added. Add a cacheable `/_next/static/*` behavior while HTML remains uncached or short-lived. CD syncs `frontend/out/` with deletion, then invalidates HTML.

## File Changes

| Path | Action | Description |
|---|---|---|
| `frontend/src/app/**`, Angular configs | Delete | Remove Angular implementation and tooling after reconciling the existing local `angular.json` change. |
| `frontend/app/**`, `features/**`, `lib/**` | Create | Routes, providers, UI, transport, query keys, and printing port. |
| `frontend/package*.json`, `next.config.ts`, test/lint/TS configs | Replace | Approved stack, static export, strict tooling. |
| `frontend/Dockerfile` | Modify | Copy `out/` into Nginx; root backend Dockerfile and `docker-compose.yml` stay unchanged. |
| `infra/main.tf`, workflows, README, OpenSpec | Modify | Routing, `out/` publication, JavaScript security analysis, and stack contracts. |

## Testing Strategy

| Layer | Approach |
|---|---|
| Unit/component | Vitest, React Testing Library, and user-event; fresh QueryClient per test with retries disabled. |
| Integration | Mock transport for loading, 4xx/5xx, timeout, invalidation, optimistic rollback, and Spanish recovery. |
| E2E | Playwright plus axe for direct/nested routes, preserved API errors, keyboard/focus, reduced motion, and health states. Future async Server Components belong here. |

## Migration / Rollout

Chain three autonomous slices: tooling/static scaffold; foundation UI and query integration; CloudFront, CI/CD, docs, and SDD reconciliation. Target `feat/mvp-foundation`, then base access/inventory on the migration. If a generated lockfile alone breaks the 400-line budget, record an explicit review exception. Rollback restores the Angular tree, prior S3 artifact, and prior frontend-only rewrite; backend and data remain untouched.

Next.js on ECS requires a new SDD change, a measured SSR/server-only need, approved cost, health checks, logs, traces, and a rule preventing BFF domain logic.

## Open Questions

- [ ] Confirm the workstation's Epson driver and drawer interface before printing implementation.
- [ ] Establish `DESIGN.md` before adding business screens; it is absent today.
