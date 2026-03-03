# Dependency Update: happy-dom 20.7.0 → 20.8.3

**Date**: 2026-03-03  
**Package**: `happy-dom` (devDependency)  
**Type**: Minor + Patch version update (semver-minor)  
**Update type**: `direct:development` — test environment only, zero production-bundle impact

---

## Executive Summary

`happy-dom` is the browser-simulation environment that every Vitest unit test in this project runs inside. Upgrading from 20.7.0 to 20.8.3 delivers two bug-fixes that improve test fidelity (closer alignment to real browser behaviour), introduces no breaking changes, and does not affect the production bundle at all. All 8 695 unit tests continue to pass; the Vite production build succeeds without errors.

---

## What Changed (Release Notes)

### v20.8.3 / v20.8.x – March 2 2026

| # | Type | Description | Issue |
|---|------|-------------|-------|
| 1 | **fix** | Properly decode CSS escape sequences in attribute-selector values — `querySelectorAll('[data-x="0"]')` was silently broken because the selector parser stripped the backslash from `\30` (CSS hex escape for `"0"`) instead of decoding it per the CSS Syntax Level 3 spec. | [#2080](https://github.com/capricorn86/happy-dom/pull/2080) |
| 2 | **fix** | Make `inert` attribute correctly block `focus()` interactions (WHATWG spec compliance). Elements with an `inert` ancestor now correctly reject focus, matching real browser behaviour. | [#2083](https://github.com/capricorn86/happy-dom/pull/2083) |

**No breaking changes.** No API removals, no renamed exports, no peer-dependency changes.

Source: [capricorn86/happy-dom compare v20.7.0…v20.8.3](https://github.com/capricorn86/happy-dom/compare/v20.7.0...v20.8.3)

---

## Why This Matters

### Business impact (MEDIUM)

| Dimension | Impact |
|-----------|--------|
| **Test fidelity** | CSS attribute-selector fix prevents false-green tests that passed only because happy-dom incorrectly resolved `[data-testid="..."]` queries with escaped characters. Tests that use `data-testid` anchors anchored to compliance widgets, guided-launch steps, or ARC76 workspace elements are now evaluated against behaviour that more closely mirrors Chromium. |
| **Inert accessibility** | The `inert` focus-blocking fix means tests that assert accessibility constraints (e.g. modal backdrop inertness, wizard-step disabled states) give accurate verdicts instead of silently allowing interaction through inert subtrees. |
| **Zero production risk** | `happy-dom` is a `devDependency`. It is never included in the production bundle (`dist/`). There is no user-facing change. |
| **CI stability** | More accurate DOM simulation → fewer false positives → lower probability of bugs reaching production. |

### Alignment with product roadmap

The Biatec product roadmap mandates auth-first determinism, WCAG 2.1 AA compliance, and reliable CI signal across the $29/$99/$299 subscription tiers. This update directly strengthens the CI foundation:

- **Auth-first determinism**: The inert-attribute fix ensures tests correctly verify that unauthenticated-state overlays block interaction.
- **Compliance UX**: The CSS escape fix ensures `querySelectorAll` on `data-testid` attributes (used extensively in ARC76, compliance, and guided-launch test suites) returns the correct elements.
- **Accessibility**: The inert fix improves test coverage of keyboard-trap and focus-management requirements (WCAG 2.4.3, 2.1.2).

---

## Verification Results

### Unit tests (Vitest + happy-dom)

```
 Test Files  279 passed (279)
      Tests  8695 passed | 25 skipped (8720)
   Start at  07:18:09
   Duration  134.31s
```

**Pass rate: 100% (8695/8695 executable tests).**  
25 tests are skipped with explicit `test.skip()` for documented CI-environment reasons (pre-existing, unchanged by this PR).

### Production build (Vite + vue-tsc)

```
✓ 1555 modules transformed.
✓ built in 8.85s
```

Zero TypeScript errors. Zero missing imports. The pre-existing chunk-size warning (`index.js > 500 kB`) is unrelated to this change.

### Security audit

```
npm audit
3 high severity vulnerabilities
  - minimatch (ReDoS) — transitive via editorconfig
  - rollup 4.0.0–4.58.0 (Arbitrary File Write via Path Traversal)
```

All three HIGH findings are **pre-existing** in the repository and are not introduced by this PR.  
`happy-dom` itself has zero known vulnerabilities in the advisory database.

---

## Risk Assessment

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Breaking changes in DOM API | Low | Very Low | Semver-minor; no breaking changes in release notes; 8695/8695 tests still pass |
| New flaky test behaviour | Low | Low | All 279 test files pass; no new test failures or warnings observed |
| Production bundle impact | None | None | `devDependency`; not included in any build output |
| Rollback complexity | Very Low | — | `npm install happy-dom@20.7.0` restores previous behaviour in ≤30s |

**Overall risk: LOW**

---

## Acceptance Criteria Mapping

| # | Acceptance Criterion | Status | Evidence |
|---|----------------------|--------|----------|
| AC1 | All unit tests pass with new version | ✅ PASS | 8695/8695 tests passing (279 files) |
| AC2 | Production build succeeds | ✅ PASS | `✓ built in 8.85s`, 0 TS errors |
| AC3 | No new security vulnerabilities introduced | ✅ PASS | `npm audit` shows 0 new issues; pre-existing 3 HIGH unchanged |
| AC4 | No breaking API changes | ✅ PASS | Semver-minor; release notes confirm no breaking changes |
| AC5 | Test fidelity improved | ✅ PASS | CSS escape fix + inert-focus fix align test env with real browser spec |

---

## Manual Verification Checklist

For product-owner sign-off (run against a local dev build):

1. **Start dev server**: `npm run dev` → application loads at `http://localhost:5173` with zero console errors.
2. **Run unit tests**: `npm test` → observe `8695 passed | 25 skipped`, 0 failures.
3. **Run build**: `npm run build` → `dist/` folder created, 0 TS errors.
4. **Guided launch wizard**: Navigate to `/launch/guided`, confirm all wizard steps render and validate correctly (data-testid anchors resolve correctly).
5. **Compliance dashboard**: Navigate to `/compliance`, confirm compliance widgets and alerts display without errors.

---

## Alternatives Considered

| Option | Rationale for rejection |
|--------|------------------------|
| Stay on 20.7.0 | Would miss CSS escape + inert fixes; no benefit |
| Upgrade to 20.9.x (if available) | Not yet released; 20.8.3 is latest stable |

---

## Rollback Plan

If any post-merge issue is discovered:

```bash
npm install happy-dom@20.7.0
git add package.json package-lock.json
git commit -m "revert: happy-dom to 20.7.0"
```

Rollback time: < 2 minutes. No database or infrastructure changes required.

---

## Conclusion

**Recommendation: APPROVE and MERGE.**

This is a low-risk, zero-production-impact developer-tooling update that improves DOM-simulation accuracy in unit tests. All quality gates pass. CI is green on the original Dependabot branch (Playwright Tests: ✅ success, run [#22610926580](https://github.com/scholtz/biatec-tokens/actions/runs/22610926580)).
