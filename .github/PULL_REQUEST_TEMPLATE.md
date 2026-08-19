<!--
Purpose: help a reviewer understand the change, its risk, and how to validate it
without reconstructing the story from commits or external conversations.

Complete every relevant section and write N/A when a section does not apply.
Do not remove the issue, type, testing, security, deployment, or rollback controls.
-->

## Outcome

<!-- In 2–4 lines: what changes, who benefits, and why it matters. -->

## Related work

Closes #<!-- approved issue -->

| Delivery chain | Link |
|---|---|
| Previous PR | N/A |
| Next PR | N/A |
| Spec / ADR / design | N/A |

## Review path

<!-- Explain where to start and which files or decisions deserve the most attention. -->

1.
2.
3.

### Out of scope

<!-- Prevent the review from expanding into intentionally deferred work. -->

-

## Change type

<!-- Select exactly one. The PR must have the equivalent type:* label. -->

- [ ] `type:feature` — new functionality
- [ ] `type:bug` — defect correction
- [ ] `type:refactor` — internal change without altered behavior
- [ ] `type:docs` — documentation
- [ ] `type:chore` — maintenance, platform, or dependencies
- [ ] `type:breaking-change` — incompatible change

## Technical scope

| Area | Change | Impact |
|---|---|---|
| Frontend | N/A | N/A |
| Backend / API | N/A | N/A |
| Data / migrations | N/A | N/A |
| Infrastructure / cloud | N/A | N/A |
| CI/CD / observability | N/A | N/A |

### Decisions and contracts

<!-- Relevant APIs, events, models, configuration, compatibility, or tradeoffs. -->

-

## Risk

**Level:** <!-- Low / Medium / High -->

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
|  |  |  |  |

## Security, privacy, and compliance

- [ ] Authentication, authorization, and least privilege were reviewed, or N/A.
- [ ] No secrets, personal data, or sensitive information were added to the repository.
- [ ] Inputs, errors, logs, and dependencies are handled securely, or N/A.
- [ ] Any regulatory, fiscal, or data-retention impact is documented, or N/A.

**Notes:** <!-- Threats considered, scanners, exceptions, or N/A. -->

## Data and compatibility

- [ ] The migration remains backward compatible during deployment, or N/A.
- [ ] A rollback, backfill, and partial-data strategy exists, or N/A.
- [ ] Public contracts, existing clients, and versioning were evaluated, or N/A.

**Notes:**

## Quality evidence

| Verification | Command / evidence | Result |
|---|---|---|
| Unit tests |  | ⬜ |
| Integration tests |  | ⬜ |
| E2E / accessibility |  | ⬜ |
| Lint / static analysis |  | ⬜ |
| Security / dependencies |  | ⬜ |
| Infrastructure / configuration |  | ⬜ |

### Manual validation

<!-- Reproducible steps, data used, and expected result. -->

1.

## User experience

- [ ] Loading, empty, error, and success states are covered, or N/A.
- [ ] Keyboard navigation, focus, contrast, and screen-reader behavior were reviewed, or N/A.
- [ ] Responsive behavior and interface copy were reviewed, or N/A.
- [ ] Visual evidence is attached when the UI changes, or N/A.

## Operational readiness

- [ ] Logs, metrics, traces, alerts, and health checks are sufficient, or N/A.
- [ ] Configuration, variables, permissions, and secrets are documented, or N/A.
- [ ] Runbooks, support procedures, and failure response are current, or N/A.
- [ ] The change tolerates retries, partial deployments, and dependency failures, or N/A.

## Deployment and rollback

**Deployment plan:**

1.

**Post-deployment validation:**

1.

**Abort or rollback signals:**

-

**Rollback plan:**

1.

## Final checklist

- [ ] The linked issue has `status:approved`.
- [ ] The PR has exactly one `type:*` label.
- [ ] The scope matches the spec and exclusions are explicit.
- [ ] Tests and documentation accompany the behavior they verify.
- [ ] Required CI passes without hidden exceptions.
- [ ] Commits follow Conventional Commits and contain no automated attribution.
- [ ] The change is reviewable in size, or its exception / PR chain is documented.
- [ ] The reviewer knows what to validate first.

## Release notes

<!-- User-visible change, migration, feature flag, communication, or "No release notes". -->
