# Product Design System

## Experience North Star

A rotating cashier uses the checkout computer beneath bright Costa Rican shop lighting while a customer waits. The interface must stay legible, calm, and obvious under time pressure.

The design serves the task. It uses a light theme, restrained color, familiar controls, concise Spanish copy, and inline recovery. The next action is more prominent than secondary information.

## Foundations

### Color

Use tinted warm neutrals instead of pure black or white. Forest green is reserved for primary actions, focus, and positive status.

| Token | Value | Purpose |
|---|---|---|
| `--surface-canvas` | `oklch(97% 0.008 85)` | Warm page background |
| `--surface-raised` | `oklch(99% 0.006 85)` | Primary work surface |
| `--surface-muted` | `oklch(94% 0.01 85)` | Secondary information |
| `--ink-strong` | `oklch(24% 0.018 150)` | Headings and controls |
| `--ink-muted` | `oklch(43% 0.018 150)` | Supporting text |
| `--border-default` | `oklch(84% 0.014 105)` | Boundaries |
| `--accent` | `oklch(42% 0.105 150)` | Primary action and focus |
| `--accent-hover` | `oklch(36% 0.095 150)` | Primary hover |
| `--success-surface` | `oklch(93% 0.035 145)` | Available status |
| `--danger` | `oklch(48% 0.15 28)` | Error text and focus-safe alerts |
| `--danger-surface` | `oklch(95% 0.035 28)` | Error recovery surface |

Status never relies on color alone. Pair color with direct text and an appropriate live-region role.

### Typography

Use `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`. Body text is 1rem with 1.55 line height. Page headings use 1.75rem and 700 weight; section headings use 1.125rem and 650 weight. Prose is capped at 70ch.

### Spacing and Shape

Use a varied rhythm based on `0.375rem`, `0.625rem`, `1rem`, `1.5rem`, `2.5rem`, and `4rem`. Controls have a minimum 44px target. Corners use 8px for controls and 12px for the single primary work surface. Avoid nested cards and repetitive grids.

## Interaction Rules

- Keyboard order follows the visible reading order.
- Focus uses a 3px forest outline with 3px offset and never depends on color alone.
- Primary buttons provide hover, active, disabled, loading, and visible focus states.
- Status changes are announced without moving focus unexpectedly.
- Errors remain inline beside recovery. Do not open a modal for service failure.
- Loading uses stable reserved space and plain status copy. Do not animate decorative elements.
- Respect `prefers-reduced-motion: reduce`; remove nonessential transitions and scrolling motion.
- Transient disclosure, focus, and print state remain local to the component. Remote Spring state uses the query layer.

## Foundation Pattern

The foundation page uses one work surface with:

1. Product identity and a short operational heading.
2. A concise Spring service status: `Comprobando conexión`, `Sistema disponible`, or `No pudimos conectar con el sistema`.
3. An inline `Reintentar` action only when recovery is possible.
4. A small local details disclosure that never contacts or mutates the server.

Spring responses remain authoritative. A rejected operation must show failure and must never imply completion. Optimistic remote updates must restore the prior value when Spring rejects them.

## Content Rules

User-facing copy is concise Costa Rican Spanish. Technical documentation, code, comments, tests, commits, and collaboration text are English. Avoid em dashes, unexplained jargon, blame, and redundant descriptions.

## Prohibited Patterns

- Side-stripe accents, gradients, decorative glass effects, and hero metrics
- Pure `#000` or `#fff`
- Modal-first recovery
- Nested cards or identical card grids
- Decorative motion or display fonts in controls
- Dense navigation that exposes modules unrelated to the current role

## Accessibility Acceptance

The interface targets WCAG 2.2 AA. Every release verifies semantic landmarks, Spanish status announcements, keyboard reachability, visible focus, minimum target sizes, reduced-motion behavior, readable contrast, and zero configured serious Playwright/axe violations.
