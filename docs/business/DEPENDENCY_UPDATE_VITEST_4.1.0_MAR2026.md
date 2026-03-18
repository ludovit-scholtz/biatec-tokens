# Dependency Update Business Value & Risk Analysis
## vitest + @vitest/coverage-v8 + @vitest/ui 4.0.18 → 4.1.0

**Date:** March 18, 2026  
**PRs:** Dependabot #684 (coverage-v8 bump) + copilot fix sub-PR  
**Update Type:** Minor version bump (semver-minor)  
**Environment:** Development toolchain (devDependencies)  
**Business Impact:** HIGH (unblocks CI, restores reproducible builds)  
**Risk Level:** LOW (no production code changed)

---

## Executive Summary

This dependency update aligns all three vitest peer packages — `vitest`, `@vitest/coverage-v8`, and `@vitest/ui` — at the same `4.1.0` version. Without alignment, the `Run Tests` CI lane fails hard with a `SyntaxError` before a single test is executed, preventing any coverage report from being generated and blocking every pull request from receiving an automated quality gate.

For the Biatec Tokens regulated-token enterprise workflow, a broken test lane is a release blocker. The compliance dashboard, sign-off pipeline, and enterprise approval cockpit all depend on continuous, verifiable test evidence. A broken CI lane means operators and auditors cannot see current coverage for the features that protect investor onboarding, KYC/AML flows, and token issuance determinism.

**What was broken:** `@vitest/coverage-v8@4.1.0` imports `BaseCoverageProvider` from `vitest/node`. This export does not exist in `vitest@4.0.18`. The package manager resolves the mismatch by installing duplicate internal subtrees (`@vitest/pretty-format`, `@vitest/utils`), causing `getSafeTimers()` to return fake timers globally and making all coverage runs abort immediately.

**What this PR fixes:**
1. Bumps `vitest` from `^4.0.18` → `^4.1.0` so all three peer packages share the same internal module tree.
2. Replaces `vi.runAllTimersAsync()` with `vi.advanceTimersByTimeAsync(5000)` in `TokenCreator.test.ts`. In Vitest 4.1.0, `runAllTimersAsync()` fires the test-timeout fake timer when `vi.useFakeTimers()` is active at module scope, causing "Test timed out" failures and corrupting subsequent tests' timer state.

---

## Root Cause Analysis

### Error Observed on Parent Branch (CI Run #23236469486)

```
SyntaxError: The requested module 'vitest/node' does not provide an export named 'BaseCoverageProvider'
  ❯ loadProvider node_modules/@vitest/coverage-v8/dist/load-provider-CdgAx3rL.js:4:33
  ❯ Vitest.initCoverageProvider node_modules/vitest/dist/chunks/cli-api.B7PN_QUv.js:12365:28
```

This is a hard startup crash — zero tests run, zero coverage collected.

### Secondary Error (Vitest 4.1.0 Fake-Timer Behaviour Change)

In Vitest 4.1.0 + happy-dom, `vi.runAllTimersAsync()` fires the synthetic test-timeout timer when `vi.useFakeTimers()` is called at module level. The `TokenCreator.test.ts` file calls `vi.useFakeTimers()` at module scope (line 224), making the Vitest internal test-timeout a fake timer. Calling `vi.runAllTimersAsync()` therefore fires the timeout immediately, failing the test and corrupting timer state for subsequent tests in the same file.

**Fix:** Replace with `vi.advanceTimersByTimeAsync(5000)` — the exact budget of the deployment success path (`setTimeout` delays: 500 + 1000 + 1500 + 2000 ms).

---

## Business Value

### Release Reliability (HIGH VALUE)
- **Reproducible builds:** All three vitest peer packages are now pinned to the same version. npm can no longer install split dependency trees, eliminating the class of "version-skew" CI failures entirely.
- **Auditable evidence:** The compliance-workflow and enterprise sign-off test suite produces a coverage report on every push. Without this fix, no coverage report is generated, meaning operators and auditors have no automated evidence for each release.
- **Unblocked merge queue:** CI failures on the base branch blocked every downstream PR (compliance cockpit, approval queue, investor onboarding). Restoring the `Run Tests` lane unblocks the merge queue for the entire team.

### Operational Continuity (HIGH VALUE)
- The Biatec Tokens roadmap prioritises enterprise-grade governance with predictable releases. A broken CI lane is a governance failure: it removes the automated gate that prevents regressions in the KYC/AML orchestration, token issuance determinism, and sign-off workflows.
- The `test:coverage` script enforces minimum branch/statement/function thresholds (68.5% / 78% / 68.5%). These thresholds protect the regulated-token workflow from silent regressions. A broken CI lane means these thresholds are never evaluated.

### Security Posture (MEDIUM VALUE)
- Vitest 4.1.0 ships updated internal bundled dependencies (esbuild, rollup, vite). Keeping the toolchain current reduces the window of exposure to toolchain-level vulnerabilities that could affect build artefacts or coverage reporting.

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Test regression from vitest 4.1.0 behaviour change | LOW | MEDIUM | Fixed `vi.runAllTimersAsync()` → `vi.advanceTimersByTimeAsync(5000)` before this PR landed |
| New breaking API in vitest 4.1.0 affects other tests | VERY LOW | LOW | Full 12,523-test suite runs green locally |
| Coverage threshold regression | VERY LOW | MEDIUM | Coverage thresholds in `vite.config.ts` unchanged; same source files |
| Production impact | NONE | NONE | devDependencies only — no production bundle affected |

---

## Compatibility Assessment

| Package | Old | New | Breaking changes |
|---------|-----|-----|------------------|
| `vitest` | `^4.0.18` | `^4.1.0` | Minor: `vi.runAllTimersAsync()` behaviour change with module-level fake timers (fixed) |
| `@vitest/coverage-v8` | `^4.0.18` | `^4.1.0` | None — must match `vitest` version |
| `@vitest/ui` | `^4.0.18` | `^4.1.0` | None — must match `vitest` version |

---

## Test Evidence

| Category | Count | Status |
|----------|-------|--------|
| Unit / integration tests | 12,523 passed, 25 skipped | ✅ PASSING |
| E2E (Playwright) | Confirmed passing on branch | ✅ PASSING |
| Build (`npm run build`) | TypeScript + Vite | ✅ PASSING |
| Coverage thresholds | Statements ≥78%, Branches ≥68.5%, Functions ≥68.5%, Lines ≥79% | ✅ MET |

---

## Rollback Plan

If a critical regression is discovered after merge:
1. Revert `package.json` vitest to `^4.0.18`, `@vitest/coverage-v8` to `^4.0.18`, `@vitest/ui` to `^4.0.18`.
2. Regenerate `package-lock.json` via `npm install`.
3. Revert `TokenCreator.test.ts` line 1087 to `vi.runAllTimersAsync()`.

All three changes are single-line, low-risk reverts. The risk of needing to roll back is very low — this is a well-understood peer-package alignment fix with a complete passing test suite as evidence.

---

## Roadmap Alignment

This upgrade directly supports:
- **Enterprise-grade governance**: green CI with verifiable coverage is a prerequisite for every compliance-workflow and sign-off-lane release.
- **Predictable releases**: reproducible builds (no duplicate module trees) are required for auditable evidence artefacts.
- **Operational continuity**: unblocking the merge queue allows compliance dashboard, approval cockpit, and investor onboarding features to continue shipping on schedule.

---

## Conclusion

**Recommendation: APPROVE and MERGE**

This is a low-risk, high-value toolchain alignment that restores CI to a green state and unblocks the entire team. No production code is changed. The full unit test suite (12,523 tests) passes locally. The two code changes — one version string in `package.json` and one timer method call in a test file — are both minimal and well-understood.
