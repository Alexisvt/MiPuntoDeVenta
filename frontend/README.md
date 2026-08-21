# Next.js frontend

The MiPuntoDeVenta client uses React 19.2, Next.js 16.3 App Router, TanStack Query v5, strict TypeScript, ESLint, Vitest, React Testing Library, Playwright, and axe. Production is a static export in `frontend/out/`; it does not require a frontend Node.js server.

## Quick start

```bash
nvm use
npm ci
npm start
```

The client calls same-origin `/api/v1/**`, with Spring Boot authoritative for business behavior. CloudFront provides that split in AWS. Plain `npm start` exercises the UI locally; integrated local API testing requires a reverse proxy that forwards `/api/*` to Spring Boot at `localhost:8080` without replacing backend errors with frontend HTML.

Use `npm run test:ci`, `npm run typecheck`, `npm run lint`, and `npm run test:e2e` before review. Production export compilation runs in CI, not as a required post-edit local step. See the [root README](../README.md) for the internal non-fiscal receipt boundary.
