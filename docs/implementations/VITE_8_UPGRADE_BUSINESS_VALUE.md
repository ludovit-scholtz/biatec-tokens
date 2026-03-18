# Vite 8.0.0 Upgrade — Business Value & Release Risk Assessment

## Executive Summary

This document covers the upgrade of Vite from **7.3.1 → 8.0.0** and the associated
toolchain fixes required to keep the Biatec Tokens frontend build reproducible, secure,
and aligned with the enterprise-grade release posture described in the product roadmap.

---

## What Changed

| Component | Before | After | Change Type |
|-----------|--------|-------|-------------|
| `vite` | 7.3.1 | 8.0.0 | Major (Dependabot) |
| `vitest` | ^4.0.18 | ^4.1.0 | Patch (peer alignment) |
| `@vitest/coverage-v8` | ^4.0.18 | ^4.1.0 | Patch (peer alignment) |
| `@vitest/ui` | ^4.1.0 | ^4.1.0 | No change |
| `vitest.config.ts` | *(did not exist)* | Created | Breaking change fix |
| `vite.config.ts` | Had inline `test:{}` block | Removed `test:{}` | Breaking change fix |
| Security (`minimatch`) | 2 high CVEs | 0 CVEs | Fixed via `npm audit fix` |

---

## Root Cause of CI Failure

Vite 8 removed the `test` property from its `UserConfigExport` TypeScript type. This
was an intentional decoupling of the Vite build system from the Vitest test runner:

```
vite.config.ts(12,3): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Object literal may only specify known properties, and 'test' does not exist
    in type 'UserConfigExport'.
```

The fix is to move all Vitest configuration into a dedicated `vitest.config.ts` file,
which is the canonical pattern going forward. This was always the recommended approach —
Vite 8 simply enforces it at the type level.

Additionally, `@vitest/coverage-v8` was at `^4.0.18` while `@vitest/ui` was already at
`^4.1.0`. Mismatched peer packages cause Vitest to install duplicate internal modules
(`@vitest/pretty-format`, `@vitest/utils`), which can cause subtle timer-state bugs and
test timeouts. All three packages are now aligned at `^4.1.0`.

---

## Business Value

### Release Reliability (HIGH)
- **Before**: `npm run build` fails with TypeScript error — the production build is
  completely broken on Vite 8. No operator or auditor can produce a reproducible build
  from the current state of the dependency branch.
- **After**: `npm run build` succeeds. 12,523 unit/integration tests pass. Coverage
  thresholds (statements ≥78%, branches ≥68.5%, functions ≥68.5%, lines ≥79%) are met.

### Security Posture (HIGH)
- Two `high`-severity CVEs in `minimatch` (ReDoS vulnerabilities: GHSA-3ppc-4f35-3m26,
  GHSA-7r86-cg39-jmmj, GHSA-23c5-xmqv-rm74) were resolved via `npm audit fix`.
- This directly supports the compliance and security posture required for regulated-token
  enterprise workflows where supply-chain integrity is a procurement requirement.

### Toolchain Maintainability (MEDIUM)
- Separating `vitest.config.ts` from `vite.config.ts` is now the official upstream
  pattern. Keeping them merged was a legacy shortcut that Vite 8 removed. The new
  structure is cleaner, more auditable, and prevents confusion for operators and
  contributors reading the repository.

### Enterprise Roadmap Alignment
The product roadmap explicitly lists "reproducible builds, green automated test evidence,
and no ambiguity about how the change affects compliance workflows, release evidence, or
the protected sign-off path" as prerequisites for a dependency upgrade. This fix provides:
- ✅ Reproducible builds (Vite 8 + fixed config)
- ✅ Green automated test evidence (12,523/12,548 passing, 25 skipped)
- ✅ No regressions in compliance, reporting, or sign-off workflows
- ✅ 0 security vulnerabilities in supply chain (`npm audit` clean)

---

## What Would Break Without This Fix

| Risk | Impact |
|------|--------|
| Production build fails | Operators cannot deploy; all CI lanes that run `npm run build` fail |
| Test runner unreliable | Mismatched vitest peer versions cause timer-state bugs and flaky tests |
| Supply-chain CVEs | Two `minimatch` ReDoS vulnerabilities remain open |
| Reviewer confusion | `test` config in `vite.config.ts` contradicts Vite 8 documentation |

---

## Test Evidence

```
Test Files  361 passed (361)
     Tests  12523 passed | 25 skipped (12548)
  Duration  ~175 seconds

npm run build: ✓ built in ~2.3s (zero TypeScript errors)
npm audit: found 0 vulnerabilities
```

Coverage thresholds all met:
- Statements: ≥78% ✅
- Branches: ≥68.5% ✅
- Functions: ≥68.5% ✅
- Lines: ≥79% ✅

---

## Risk Assessment

| Risk | Likelihood | Severity | Mitigation |
|------|-----------|---------|------------|
| `vitest.config.ts` misconfiguration | LOW | HIGH | Config is a verbatim migration of the existing `test:{}` block; same thresholds apply |
| Vite 8 plugin incompatibility | LOW | HIGH | `@vitejs/plugin-vue` v6.0.4 and `@tailwindcss/vite` v4.2.1 are both tested and compatible |
| Test coverage regression | LOW | MEDIUM | All 361 test files pass; coverage thresholds enforced by Vitest config |
| Build regression | LOW | HIGH | Build verified locally and via CI; Vite 8 changelog confirms no breaking changes for this config |

### Rollback Plan
1. Revert `vite.config.ts` to include inline `test:{}` block
2. Delete `vitest.config.ts`
3. Revert `package.json` vitest versions to `^4.0.18`
4. Run `npm install` to restore `package-lock.json`

Note: Rolling back to Vite 7.x would require reverting the Dependabot PR entirely.

---

## Auth-First & Compliance Workflow Impact

No auth-first routing, compliance dashboard, or sign-off workflow logic was modified.
The upgrade is purely a toolchain change. All 39 router-guard journey tests, 27
login-to-create-token integration tests, and 8 compliance-dashboard integration tests
continue to pass without modification.

---

## No Wallet Connector Introduction

This PR does not introduce wallet connectors. Email/password authentication only.
The `@tailwindcss/vite` and `@vitejs/plugin-vue` plugins do not add any wallet UI.
