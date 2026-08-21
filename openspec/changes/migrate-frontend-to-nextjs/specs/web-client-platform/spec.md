# Web Client Platform Specification

## Purpose

Define the replacement client's platform, delivery, state, accessibility, and quality contracts without changing POS behavior.

## Requirements

### Requirement: Approved Frontend Baseline

The client MUST use React 19.2, Next.js 16.3 App Router, TanStack Query v5, and Node 24 LTS, and MUST NOT retain Angular dependencies.

#### Scenario: Approved manifest

- GIVEN a repository checkout
- WHEN manifests and runtime policy are inspected
- THEN they MUST declare the approved lines and MUST NOT declare Angular.

### Requirement: Static Frontend Delivery

The MVP MUST run as static files without frontend compute. Runtime SSR, Server Actions, middleware, and runtime Route Handlers MUST NOT be required.

#### Scenario: Static-only hosting

- GIVEN generated files are published to the static origin
- WHEN a user opens the application
- THEN the foundation MUST load without a Next.js process.

### Requirement: Frontend and API Route Integrity

Delivery MUST resolve exported routes and preserve `/api/*` status, content type, and body without substituting frontend HTML.

#### Scenario: Direct nested navigation

- GIVEN an exported nested route
- WHEN its URL is opened directly or refreshed
- THEN its page MUST load.

#### Scenario: API authorization error

- GIVEN Spring returns a JSON `401` or `403` response
- WHEN delivery processes it
- THEN the client MUST receive that status and JSON.

#### Scenario: Missing API resource

- GIVEN Spring returns a non-success response for `/api/*`
- WHEN delivery routing processes it
- THEN it MUST NOT return the frontend index document.

### Requirement: Spring Domain Authority

Spring MUST own all business decisions. The frontend MUST NOT duplicate them in any intermediary.

#### Scenario: Rejected operation

- GIVEN Spring rejects an operation
- WHEN the frontend receives the rejection
- THEN it MUST show failure and MUST NOT show completion.

### Requirement: Client State Boundary

Remote Spring state needing synchronization MUST use the approved server-state layer. Transient composition, focus, modal, and print state MUST remain local.

#### Scenario: Remote refresh

- GIVEN cached data becomes stale after a mutation
- WHEN synchronization occurs
- THEN visible data MUST converge on Spring.

#### Scenario: Optimistic failure

- GIVEN a provisional client update
- WHEN Spring rejects the mutation
- THEN the result MUST roll back and show the error.

#### Scenario: Transient interaction

- GIVEN a user changes focus or dismisses a dialog
- WHEN no server operation is requested
- THEN the client MUST NOT mutate remote state.

### Requirement: Accessible Localized Foundation

User content MUST be Spanish for Costa Rica. The foundation MUST provide keyboard access, visible focus, status announcements, and WCAG 2.2 AA behavior.

#### Scenario: Available service

- GIVEN health is pending and later available
- WHEN the foundation renders each state
- THEN it MUST announce Spanish loading and available messages.

#### Scenario: Unavailable service

- GIVEN health times out, fails, or is unavailable
- WHEN the result is rendered
- THEN an accessible Spanish error MUST offer recovery.

#### Scenario: Keyboard and accessibility scan

- GIVEN the foundation is displayed
- WHEN keyboard and accessibility checks run
- THEN actions MUST be reachable with visible focus and zero configured serious violations.

### Requirement: Automated Quality Gates

Frontend changes MUST pass strict-TDD checks, production compilation, and Playwright accessibility journeys.

#### Scenario: Passing change

- GIVEN all required checks meet their assertions
- WHEN CI evaluates the change
- THEN the frontend gate SHALL pass.

#### Scenario: Regression detected

- GIVEN behavior, routing, localization, or accessibility violates this specification
- WHEN the relevant automated check runs
- THEN the frontend gate MUST fail and identify the violated expectation.
