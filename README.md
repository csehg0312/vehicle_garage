# vehicle_garage

## Development method

New product work follows a requirements-first, test-before-implementation workflow.

### 1. Define the requirement

Write the requirement in terms of user value and observable behavior. Keep it small enough to implement and verify independently.

Use this format:

```text
As a [user], I want [capability], so that [value].

Acceptance criteria:
- Given [initial context], when [action], then [observable result].
- Given [edge condition], when [action], then [expected result].
```

Requirements should state the important business rules, validation, error behavior, and affected user flow. Avoid prescribing implementation details unless they are part of the product contract.

### 2. Create the test cases

Before changing product code, turn every acceptance criterion into a test case. Include the normal path, meaningful edge cases, invalid input or missing data, and regression coverage for related behavior.

Choose the narrowest test level that proves the behavior:

- Unit tests for stores, domain rules, and pure functions.
- Integration tests for behavior crossing stores, routing, or feature boundaries.
- Browser tests for visible workflows and interactions.

Each test should describe behavior in user or domain language and follow `arrange -> act -> assert`. A failing test is expected at this stage; it confirms that the requirement is not already implemented.

### 3. Implement the requirement

Only after the requirement and test cases are clear, implement the smallest product change that makes the tests pass. Keep the public behavior aligned with the acceptance criteria and do not weaken a test to fit the implementation.

### 4. Verify and review

Run the focused test first, then the broader checks when the change is complete:

```bash
npm run test:unit
npm run test:integration
npm run typecheck
npm run build
```

For a small change, running only the relevant test file during iteration is fine; the full applicable suite is required before merging. A requirement is complete when its acceptance tests pass, type checking and build succeed, and the implementation does not introduce unrelated behavior changes.

### Requirement checklist

- [ ] User value and observable behavior are written down.
- [ ] Acceptance criteria cover success, edge, and failure behavior.
- [ ] Test cases exist before product implementation.
- [ ] The focused tests fail for the expected reason before implementation.
- [ ] The smallest implementation makes the tests pass.
- [ ] Relevant unit, integration, typecheck, and build checks pass.
- [ ] The requirement and tests are updated if the agreed behavior changes.
# Local vehicle catalog

Vehicle selector uses bundled manufacturer index and free model files from `vehicle-makes-models`. Model files load from GitHub on manufacturer selection. No API token required.

Dataset license: ODbL 1.0. Keep attribution and share-alike obligations when distributing derived database content.
