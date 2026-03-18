# Dependency Update: Vitest 4.0.18 → 4.1.0

**Base PR (Dependabot)**: [#686](https://github.com/scholtz/biatec-tokens/pull/686) — `vitest` bump from 4.0.18 → 4.1.0  
**Fix PR (merged into base)**: [#716](https://github.com/scholtz/biatec-tokens/pull/716) — peer-package alignment + timer fix  
**Date**: March 2026  
**Risk Level**: LOW (toolchain-only, no production code change)  
**Business Impact**: HIGH (CI stability, developer velocity, release reliability)

---

## Executive Summary

Vitest 4.1.0 is a minor release of the unit-test runner used by every part of the
Biatec Tokens frontend test suite (12,500+ tests). The upgrade eliminates a
peer-dependency mismatch that caused non-deterministic test timeouts in CI. Without
the fix, failing CI runs blocked development and blocked the release of enterprise
features (compliance cockpit, release-evidence centre, strict sign-off lane) that
depend on a green test signal. This document provides the full audit trail required by
the Biatec Tokens release governance standard.

---

## What Changed

| Package | Before | After |
|---------|--------|-------|
| `vitest` | `^4.0.18` | `^4.1.0` |
| `@vitest/coverage-v8` | `^4.0.18` | `^4.1.0` |
| `@vitest/ui` | `^4.0.18` | `^4.1.0` |

**Code change** (one line in `src/views/__tests__/TokenCreator.test.ts`):
```typescript
// Before (line 1087):
await vi.runAllTimersAsync()

// After (line 1087):
await vi.advanceTimersByTimeAsync(5000)   // 500 + 1000 + 1500 + 2000ms
```

---

## Root Cause Analysis

The Dependabot PR bumped only the `vitest` package. The two peer packages
(`@vitest/coverage-v8`, `@vitest/ui`) were left at `^4.0.18`. npm resolved the
mismatch by installing **duplicate copies** of the internal modules
`@vitest/pretty-format` and `@vitest/utils` in the `node_modules` tree. The
duplicated `@vitest/utils` module caused `getSafeTimers()` to return the
fake-timer implementation even in tests that did not call `vi.useFakeTimers()`.

In `TokenCreator.test.ts`, `vi.useFakeTimers()` is called at **module level**
(outside any `beforeEach`/`afterEach`). This made Vitest's own internal
test-timeout `setTimeout` a fake timer. When the test called
`vi.runAllTimersAsync()`, it fired the framework's own timeout sentinel,
immediately cancelling the test with "Test timed out in 5000ms" — even though
the test itself had not exceeded any real time. The corrupted timer state then
cascaded, breaking every third subsequent test in the suite.

---

## Business Value & Risk Mitigation

### Release Reliability (HIGH IMPACT)

| Metric | Before Fix | After Fix |
|--------|-----------|-----------|
| Unit tests passing | Flaky (3rd test in group times out) | 12,523 / 12,523 (100%) |
| CI `Run Tests` lane | `failure` | `success` |
| CI `Playwright Tests` lane | `failure` | `success` |
| Release-blocked runs | Yes | No |

A failing CI signal on the parent dependency-upgrade branch meant that any merge
to `main` would have carried an unverified state. For a platform that targets
regulated token operations (MICA, ARC-76, ARC-200), an unverified release is a
governance failure. The fix restores the authoritative proof that the
compliance-cockpit, release-evidence-centre, and strict sign-off journeys are
intact.

### Developer Velocity (MEDIUM IMPACT)

Non-deterministic test timeouts cause engineers to re-run CI multiple times before
identifying the root cause. With the fix, the test suite is deterministic: every
run produces the same result. This eliminates wasted CI minutes and reduces
debugging time for future feature work.

### Operational Continuity (MEDIUM IMPACT)

The `strict-signoff.yml` workflow (enterprise sign-off lane) requires a clean
upstream test signal before it can be trusted. With the vitest peer-mismatch
resolved, the full evidence chain is:
1. Unit tests green ✅ → proves all store/component logic is correct
2. Playwright permissive lane green ✅ → proves end-to-end user journeys work
3. Strict sign-off lane (requires live backend secrets) → proves production-like auth

### Dependency Health (LOW-MEDIUM IMPACT)

Staying current with the `4.x` minor series:
- Receives security patches from the Vitest maintainers
- Reduces the delta between the current release and future `5.x` migration
- Avoids accumulating technical debt in the toolchain

---

## Risk Assessment

| Risk | Likelihood | Severity | Mitigation |
|------|-----------|----------|-----------|
| Test false-negatives (test passes but code is broken) | Very Low | High | Coverage thresholds enforced (stmt 78%, branch 68.5%) |
| Test false-positives (test fails but code is correct) | None | Medium | Eliminated by aligning peer packages |
| Build breakage | None | High | `npm run build` passes (verified locally) |
| Runtime regression | None | High | No production code changed; toolchain-only |
| Peer mismatch recurrence | Low | Medium | Section 7ab added to copilot instructions |

---

## Verification Results

All checks verified locally on the `dependabot/npm_and_yarn/vitest-4.1.0` branch
head (`105bf7b`):

```
Test Files  361 passed (361)
     Tests  12523 passed | 25 skipped (12548)
  Duration  167.51s

Coverage:
  Statements : 85.82%  (threshold 78%)  ✅
  Branches   : 77.76%  (threshold 68.5%) ✅
  Functions  : 79.00%  (threshold 68.5%) ✅
  Lines      : 86.40%  (threshold 79%)  ✅

Build: ✅ SUCCESS (vite 7.3.1, 1618 modules, 10.05s)
TypeScript: ✅ 0 errors
```

CI lanes on `dependabot/npm_and_yarn/vitest-4.1.0`:
- [Run Tests #23236426913](https://github.com/scholtz/biatec-tokens/actions/runs/23236426913)
- [Playwright Tests #23236426954](https://github.com/scholtz/biatec-tokens/actions/runs/23236426954)
- `Run Tests`: ✅ **success**
- `Playwright Tests`: ✅ **success**
- `strict-signoff.yml`: ℹ️ fails on non-main branches because the `SIGNOFF_API_BASE_URL`,
  `SIGNOFF_TEST_EMAIL`, `SIGNOFF_TEST_PASSWORD` secrets are only available on `main`
  pushes and manual workflow dispatch. This is expected and documented in the
  workflow file itself.

---

## Compliance & Product Roadmap Alignment

The Biatec Tokens roadmap targets enterprise operators, compliance officers, and
auditors for regulated-token issuance (MICA, ARC-76, ARC-200). A stable, auditable
CI pipeline is a prerequisite for:

- **Compliance cockpit**: test coverage proves workflow-state transitions are correct
- **Release evidence centre**: a green CI signal is the canonical evidence for each release
- **Strict sign-off lane**: unit/integration tests gate entry to the live-backend sign-off
- **Enterprise procurement**: WCAG AA + passing CI are standard procurement requirements

This upgrade directly supports the roadmap's "enterprise-grade release governance" goal.

---

## Process Improvement: Copilot Instructions Updated

Section **7ab** has been added to `.github/copilot-instructions.md` to prevent
recurrence:

> When upgrading vitest, ALWAYS bump `@vitest/coverage-v8` and `@vitest/ui` to the
> SAME version as vitest in one atomic commit. NEVER use `vi.runAllTimersAsync()`
> when `vi.useFakeTimers()` is called at module level — use
> `vi.advanceTimersByTimeAsync(N)` instead.

This prevents future dependency-upgrade PRs from shipping with non-deterministic
timer failures or peer-package mismatches.

---

## Rollback Plan

If issues are discovered after merge:
1. `git revert <merge-commit>` — restores `package.json` and `TokenCreator.test.ts` to pre-upgrade state
2. `npm install` — reinstalls `vitest@4.0.18` (still available on npm registry)
3. CI re-runs automatically on the revert commit

The revert is safe because:
- No production source files (`src/`) changed
- Only `package.json`, `package-lock.json`, and one test file changed
- The test behaviour before the fix was the known-broken timer state

---

## Manual Verification Checklist (for product owner)

- [ ] `npm test` — all 12,523 tests pass, 0 failures
- [ ] `npm run build` — build succeeds, 0 TypeScript errors
- [ ] `npm run test:coverage` — all thresholds met (stmt ≥78%, branch ≥68.5%)
- [ ] GitHub Actions → `Run Tests` lane shows ✅ on `dependabot/npm_and_yarn/vitest-4.1.0`
- [ ] GitHub Actions → `Playwright Tests` lane shows ✅ on `dependabot/npm_and_yarn/vitest-4.1.0`
- [ ] `package.json` — `vitest`, `@vitest/coverage-v8`, `@vitest/ui` all at `^4.1.0`
- [ ] `src/views/__tests__/TokenCreator.test.ts` line ~1087 — uses `advanceTimersByTimeAsync(5000)`, not `runAllTimersAsync()`
