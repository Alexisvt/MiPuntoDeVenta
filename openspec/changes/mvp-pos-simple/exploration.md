## Exploration: Focused Point-of-Sale MVP

### Current state

At exploration time, the repository contained no application or selected stack. The legacy-system screenshots identified the workflows to preserve conceptually: sign-in, cash opening and listing, new sale, cash-paid receipt, and printed day close. The broad legacy menu was explicitly excluded as a product reference.

### Affected areas

- `openspec/changes/mvp-pos-simple/` — initial product planning.
- Future application — authentication, inventory, sales, cash opening/closing, and thermal printing.

### Approaches

1. **Flow-centered modular MVP** — build only the five requested workflows with minimal navigation.
   - Pros: reduces complexity and validates the product quickly with the real business.
   - Cons: some reports and modules remain deferred.
   - Effort: Medium.
2. **Replicate the current system, then simplify** — copy the modules and menus from the existing product.
   - Pros: greater apparent coverage.
   - Cons: reproduces the identified problem and increases both cost and training burden.
   - Effort: High.

### Recommendation

Adopt the flow-centered modular MVP. The operational unit is the cash session: open, register sales, close, and print. Inventory and user access support that lifecycle. Stack, printing model, and fiscal rules must be decided in design after validating the hardware and operating country.

### Risks

- The operating country and electronic-invoicing obligation were initially undefined.
- The thermal printer, connectivity, and protocol were initially unidentified.
- Inventory, payments, returns, taxes, and role permissions needed explicit rules.
- TDD could not be enabled until a stack and test runners were selected.

### Ready for proposal

Yes — proceed with an MVP proposal while making technical and business-rule decisions explicit.
