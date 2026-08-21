## Exploration: Migrate the Frontend to React, Next.js, and TanStack Query

### Current State

- `frontend/` is a small Angular 22 SPA: one root component calls `/api/v1/health`, Vitest covers the component, and Playwright plus axe covers the accessible foundation screen. The production build is static and is published to private S3 behind CloudFront.
- CloudFront uses S3 as its default origin and sends `/api/*` to the Spring Boot ALB. The API behavior disables caching and forwards viewer data; this same-origin topology avoids browser CORS today. A viewer-request function rewrites every extensionless frontend route to `/index.html`.
- Spring Boot 4.1/Java 25 remains the system of record and REST boundary. PostgreSQL/RDS, ECS Fargate, Flyway, and the modular-monolith backend are unaffected by the framework preference.
- The current frontend is only a foundation, so migration is cheaper now than after access, inventory, sales, and cash workflows exist. However, `frontend/angular.json` already has an uncommitted local modification that implementation must inspect and preserve intentionally.
- As of 2026-08-20, the official current lines are React 19.2, Next.js 16.3, TanStack Query v5, and Node 24 LTS (Node 26 is Current, not LTS). Sources: [React versions](https://react.dev/versions), [Next.js releases](https://nextjs.org/blog), [TanStack Query v5](https://tanstack.com/query/v5/docs/framework/react/overview), and [Node releases](https://nodejs.org/en/about/previous-releases).
- React plus Next.js is defensible for career/FDE practice, conventions, routing, deployment evolution, and the broader React ecosystem. It is not required by the POS product: an authenticated, browser-heavy cashier application has little SEO need, and plain React with Vite would be the simpler static-client choice.

### Affected Areas

- `frontend/package.json`, lockfile, Angular/TypeScript/ESLint configuration — replace Angular tooling with Next.js App Router, React, TanStack Query, strict TypeScript, and compatible lint/test configuration.
- `frontend/src/**` — replace Angular bootstrap/components with `app/`, feature-oriented React components, providers, typed API transport, query-key factories, and Spanish user-facing copy.
- `frontend/src/app/app.spec.ts` and `frontend/e2e/**` — migrate unit/component tests to React Testing Library while preserving Vitest, Playwright, axe, keyboard coverage, and WCAG 2.2 AA.
- `frontend/Dockerfile` — static export changes the artifact path to `out/`; a later server-runtime option instead needs a Node 24 multi-stage standalone image.
- `compose.yaml` and root `Dockerfile` — the backend image can remain unchanged for static export; Compose may add an optional frontend development service. A Next.js server evolution would add a separate frontend service rather than merge Node into the Java image.
- `infra/main.tf` — retain S3/CloudFront for the recommended MVP, but change the viewer rewrite to Next static-route semantics (for example, `trailingSlash: true` and `/route/index.html`) instead of sending all routes to the SPA root. A server runtime would replace the S3 default origin with an ALB target for a Next service while retaining `/api/*` routing to Spring.
- `.github/workflows/ci.yml`, `cd.yml`, and `security.yml` — update commands, build artifact path, JavaScript CodeQL coverage if adopted, dependency scanning, caching, and deployment logic.
- `README.md`, `frontend/README.md`, `infra/README.md`, `PRODUCT.md`, `openspec/config.yaml`, and active `mvp-pos-simple` design/tasks/apply progress — replace Angular-specific contracts without changing Spanish product localization.
- Feature Branch Chain — insert a migration slice after `feat/mvp-foundation` and before `feat/mvp-access-inventory`; expect multiple reviewable work units because generated scaffold/config, UI migration, tests, infrastructure, and documentation will exceed 400 changed lines.

### Approaches

1. **React with Vite on existing S3/CloudFront** — use TanStack Query for Spring server state in a client-rendered SPA.
   - Pros: best fit for an authenticated POS, lowest cost and operational surface, simple browser printing, same-origin `/api`, no cold starts.
   - Cons: does not meet the explicit Next.js learning goal and provides no Server Components, streaming, or framework-runtime experience.
   - Effort: Medium.

2. **Next.js App Router static export on existing S3/CloudFront** — preserve the static AWS topology and use Next.js as a React framework without a runtime server. Next.js officially supports static export to S3, but server-required features are unavailable ([deployment modes](https://nextjs.org/docs/app/getting-started/deploying), [SPA/static export guide](https://nextjs.org/docs/app/guides/single-page-applications)).
   - Pros: fulfills React/Next learning with minimal infrastructure churn; cheapest and most reliable MVP; preserves same-origin authentication/API routing; no frontend cold starts; easy rollback to the previous S3 artifact.
   - Cons: dynamic authenticated Server Components, Server Actions, middleware, and runtime Route Handlers are unavailable. Runtime POS data must be fetched in Client Components, so Next.js adds less product value than Vite.
   - Effort: Medium.

3. **Next.js App Router standalone Node container on ECS Fargate** — deploy a second ECS service behind CloudFront/ALB using `output: "standalone"`, which Next.js documents as full-featured production Docker output ([official deployment guide](https://nextjs.org/docs/app/getting-started/deploying)).
   - Pros: full Server Components, streaming, runtime metadata, server-side session handling, OpenTelemetry/CloudWatch learning, container scaling, and a stronger FDE deployment exercise; no function cold starts when a task remains running.
   - Cons: another always-on task, health checks, scaling policy, logs, patches, target group, deployment, and failure mode; higher cost; authenticated CloudFront caching must remain conservative; server-to-Spring calls need private routing and correlation. Route Handlers can accidentally become a duplicate BFF and add latency.
   - Effort: High.

4. **Managed/serverless Next.js on AWS Amplify Hosting** — let AWS operate SSR/edge infrastructure.
   - Pros: managed deployments, CDN integration, scaling, and CloudWatch runtime logs.
   - Cons: AWS documentation currently guarantees native support only through Next.js 15, while the current target is Next.js 16.3 ([AWS support matrix](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-amplify-support.html)). It introduces a second deployment model beside Terraform/ECS, platform limits, possible serverless cold starts, and harder cross-runtime tracing. Using an adapter/OpenNext is viable later but is not simpler for this MVP.
   - Effort: Medium to High.

### Recommendation

Adopt **React 19.2 + Next.js 16.3 App Router + TanStack Query v5 on Node 24 LTS**, initially with `output: "export"` on the existing private S3/CloudFront foundation. This honors the explicit learning decision while keeping the small-business POS cheap, predictable, and supportable. If the objective were product simplicity alone, React/Vite would win; Next.js is selected because the user deliberately values FDE/career practice and wants a credible evolution path.

Use feature boundaries such as `app/(auth)`, `app/(pos)`, `features/{access,inventory,sales,cash,printing}`, and `lib/api`. Keep the Spring REST API authoritative. Do not create parallel business logic in Next.js Route Handlers.

Use TanStack Query deliberately, not universally:

- In the static MVP, use Client Components plus TanStack Query for runtime Spring data that benefits from caching, deduplication, invalidation, mutations, polling, retries, or optimistic updates: session/user, products, stock, sales, cash state, health, and receipt status.
- Keep transient ticket composition, modal state, keyboard focus, and print-dialog state in React/form state until they become server state.
- Printing remains a Client Component/browser capability because it depends on browser APIs and the installed Epson TM-T20II/3nstar driver.
- If the frontend later moves to an ECS runtime, use Server Components/native Next.js fetching for server-only initial reads and secrets, and hydrate TanStack Query only where client revalidation or mutation is needed. Official Next.js guidance explicitly reserves client libraries such as React Query for cases such as frequent polling, while Server Components fetch directly from the source rather than through internal Route Handlers ([Next.js data fetching](https://nextjs.org/docs/app/getting-started/fetching-data), [BFF guidance](https://nextjs.org/docs/app/guides/backend-for-frontend), [TanStack advanced SSR](https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr)).

Preserve the same public origin: browser requests use `/api/v1/**` through CloudFront to Spring, so CORS is unnecessary. When authentication is implemented, prefer a Secure, HttpOnly, SameSite cookie and explicit CSRF protection for state-changing requests; Next.js and TanStack Query do not remove that obligation. Keep API caching disabled and forward required cookies/CSRF/correlation headers.

Testing remains strict TDD: Vitest plus React Testing Library/user-event for synchronous components and hooks; a fresh `QueryClient` with retries disabled per test for query behavior; transport-level mocks for success, error, cancellation, invalidation, and optimistic rollback; Playwright plus axe for full cashier journeys, keyboard access, Spanish localization, and browser printing seams. Next.js notes that Vitest does not currently unit-test async Server Components well, so those belong in E2E tests ([official Vitest guidance](https://nextjs.org/docs/app/guides/testing/vitest)).

Evolution gate: move to a standalone ECS Next.js service only when a measured requirement needs runtime rendering/server-only orchestration, or as a separately scoped learning experiment with budget and observability acceptance. Then route default CloudFront traffic to Next, keep `/api/*` direct to Spring, add structured logs/traces and correlation IDs across both services, and prohibit domain logic in the frontend BFF.

Treat this as a **prerequisite migration change**, not an in-place implementation inside the remaining `mvp-pos-simple` tasks. Base `feat/mvp-nextjs-migration` on `feat/mvp-foundation`, target the foundation branch, and make `feat/mvp-access-inventory` depend on the migration. The migration proposal/design must also revise the active MVP artifacts so Angular does not remain an authoritative contradiction.

### Risks

- Static export can create the illusion that Server Components are available dynamically; in this mode they only contribute at build time, so runtime authenticated data is client-fetched.
- Blindly wrapping every fetch in TanStack Query would duplicate Next.js caching, inflate client boundaries, and confuse server state with UI state.
- Current CloudFront SPA rewriting is incompatible with route-specific Next static HTML and must be changed without reintroducing the prior bug that masked `/api` errors.
- A Next.js ECS service raises cost and operational burden before the POS has a proven runtime-server requirement; Amplify currently has a documented Next 16 support gap.
- Authentication design can diverge between browser, Next server, and Spring. Spring must remain authoritative, with one session/authorization contract and explicit CSRF handling.
- The migration is likely above the 400-line review budget. Scaffold/config, foundation UI and tests, then AWS/CD/docs should be separate chained slices with autonomous verification and rollback.
- Existing uncommitted `frontend/angular.json` work could be lost by destructive re-scaffolding.

### Ready for Proposal

Yes. The proposal should lock the static-export MVP, selective TanStack Query boundary, Node 24 LTS/current patched React and Next lines, strict-TDD migration acceptance criteria, CloudFront route rewrite, and prerequisite Feature Branch Chain. It should record ECS standalone as an explicit deferred evolution option rather than silently designing a second backend now.
