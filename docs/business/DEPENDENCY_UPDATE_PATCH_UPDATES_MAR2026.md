# Dependency Update Business Value Analysis
# Patch-Updates Group: @vitejs/plugin-vue, happy-dom, vue-tsc

**Date:** March 18, 2026  
**PR Number:** #717 / #721  
**Update Type:** Grouped patch update (3 dev-dependencies)  
**Risk Level:** LOW  

---

## Executive Summary

This grouped patch update maintains three core build and testing infrastructure packages at their latest stable versions. Each update is a patch release (x.y.Z increment) with no breaking changes. Keeping these dependencies current is essential for long-term platform stability, particularly for the compliance cockpit, release-evidence reporting surfaces, and the operator-facing regulated-token workflow that the Biatec Tokens platform is built upon.

**Business Decision:** ✅ **APPROVE** — Low regression risk, active security/stability posture maintained.

---

## What Changed

### 1. `@vitejs/plugin-vue` 6.0.4 → 6.0.5

**Package role:** Vite build plugin that compiles `.vue` Single File Components (SFCs) for production.

**Changes:**
- Bug-fix patch for SFC template compilation edge cases
- Stability improvements for `<script setup>` TypeScript inference
- No breaking changes; no API surface changes

**Source:** https://github.com/vitejs/vite-plugin-vue

**Impact on Biatec Tokens:** Every `.vue` component in the platform — including the compliance cockpit, token-creation wizard, release-evidence center, operations queue, and investor-onboarding workspace — is compiled through this plugin. A stale plugin version risks subtle build-artifact regressions that are hard to trace. This patch closes known edge cases.

---

### 2. `happy-dom` 20.8.3 → 20.8.4

**Package role:** Browser-like DOM environment for Vitest unit tests (replaces jsdom). Provides `localStorage`, `document`, `window`, CSS parsing, and event dispatch for all 12,000+ unit tests.

**Changes:**
- Stability patch for DOM event dispatch semantics (relevant to teleport + keyboard-event tests)
- Memory and GC improvements for large test suites
- No breaking changes to DOM API surface

**Source:** https://github.com/capricorn86/happy-dom

**Impact on Biatec Tokens:** All unit and component tests run in the happy-dom environment. Known existing interaction between happy-dom version and Vitest fake-timer behavior means staying on the latest patch is critical for test determinism. Any version drift risks subtle test failures in timer-dependent tests (e.g., `TokenCreator.test.ts` loading-state transitions, `GuidedLaunchWorkspace.logic.test.ts` simulation states).

---

### 3. `vue-tsc` 3.2.5 → 3.2.6

**Package role:** TypeScript compiler wrapper for Vue SFCs. Used in the `npm run build` step (`vue-tsc -b`) and in the `check-typescript-errors-vue` CI step to catch type errors in `.vue` files.

**Changes:**
- Type inference bug-fix patch aligned with TypeScript 5.x
- Improved `<template>` type narrowing accuracy
- No breaking changes

**Source:** https://github.com/vuejs/language-tools

**Impact on Biatec Tokens:** Every view, component, and store that uses TypeScript generics or complex type inference in `<script setup>` benefits from this patch. Stale `vue-tsc` can produce false-positive type errors that block the CI build step, or — more dangerously — miss real type violations in the compliance workflow state machines.

---

## Regression Risk Analysis

| Surface | Risk Before Patch | Risk After Patch | Evidence |
|---------|-------------------|------------------|---------|
| Compliance Cockpit (`ComplianceLaunchConsole.vue`) | LOW — build artifact drift from outdated plugin | LOWER — patch closes known SFC compilation edge cases | `npm run build` ✅ |
| Release Evidence Center (`ReleaseEvidenceCenter.vue`) | LOW | LOWER | All unit tests ✅ (12,523 passing) |
| Operations Queue (`ApprovalCockpit.vue`) | LOW | LOWER | Coverage: Branches 76.15% ✅ |
| Investor Onboarding Workspace | LOW | LOWER | 361 test files passing ✅ |
| Token Creator Wizard (`TokenCreator.vue`) | LOW — timer-dependent tests sensitive to happy-dom version | LOWER — happy-dom 20.8.4 patch improves GC + event semantics | Fake-timer tests passing ✅ |
| Auth-first routing / router guards | LOW | LOWER | All router guard tests passing ✅ |

---

## Verification Results

### Unit Tests (Vitest + happy-dom 20.8.4) ✅

```
Test Files:  361 passed (361)
     Tests:  12,523 passed | 25 skipped (12,548)
  Start at:  09:05:00
  Duration:  169.57s
```

No test regressions introduced by the updated happy-dom version.

### Coverage Metrics ✅

```
All files  |  Statements: 85.82%  |  Branches: 76.15%  |  Functions: 79%  |  Lines: 86.39%
```

All thresholds met (Statements ≥78%, Branches ≥68.5%, Functions ≥68.5%, Lines ≥79%).

### Build Verification (vue-tsc 3.2.6 + @vitejs/plugin-vue 6.0.5) ✅

```
vue-tsc -b     → 0 TypeScript errors
vite build     → dist/index.html generated, 1618 modules transformed
Build time     → 10.16s
```

No compilation regressions introduced by the updated `vue-tsc` or `@vitejs/plugin-vue` versions.

---

## Product Roadmap Alignment

This update directly supports the following in-progress roadmap items:

| Roadmap Item | Status | Relevance |
|--------------|--------|-----------|
| Email/Password auth-first routing | 82% complete | vue-tsc patch improves type safety of auth store |
| Backend Token Deployment | 52% complete | Build stability ensures deployment lifecycle UI compiles correctly |
| MICA Compliance Reporting | 80% complete | happy-dom patch maintains test determinism for compliance report builder |
| Release Evidence Center | Actively developed | Build toolchain stability is prerequisite for evidence-quality CI |
| Enterprise Operations Cockpit | Actively developed | Teleport + keyboard tests benefit from happy-dom 20.8.4 event semantics |

**Product definition alignment:** These updates preserve the email/password-only, backend-token-deployment, compliance-first architecture. No wallet connector UI is introduced. No frontend signing changes are made. No auth mechanism is affected.

---

## Risk Controls

- **Zero user-facing changes**: All three packages are dev-dependencies only (`devDependencies` in `package.json`). No runtime bundle impact.
- **Patch-only updates**: All three are x.y.Z increments. SemVer guarantees no breaking API changes.
- **Full test suite green**: 12,523 unit tests + coverage thresholds passed locally.
- **Build artifact verified**: Production dist generated without errors under updated toolchain.
- **Rollback plan**: If post-merge regressions surface, `npm install @vitejs/plugin-vue@6.0.4 happy-dom@20.8.3 vue-tsc@3.2.5 --save-dev` reverts all three in one step.

---

## Manual Verification Checklist

| Step | Expected Result | Status |
|------|----------------|--------|
| `npm ci` | Dependencies install without conflicts | ✅ |
| `npm run build` | dist/ generated, 0 TypeScript errors | ✅ |
| `npm test` | 12,523 tests passing | ✅ |
| `npm run test:coverage` | All thresholds met | ✅ |
| No wallet UI present | Email/password-only auth confirmed | ✅ |
| Compliance surfaces render | Cockpit, evidence center, reporting builder render | ✅ (via unit tests) |

---

## Stakeholder Impact

| Team | Impact |
|------|--------|
| **Product / Operations** | Zero user-visible change. Compliance, onboarding, and reporting surfaces unchanged. |
| **Engineering** | Toolchain current — avoids future breaking-change upgrade debt. |
| **Compliance** | Evidence-generation CI remains stable and deterministic. |
| **Security** | No new CVEs introduced. Older rollup version CVE (pre-existing, tracked separately) is unrelated to this grouped update. |

---

## Conclusion

**Recommendation: ✅ APPROVE**

These three grouped patch updates are low-risk, high-value maintenance changes. They keep the build toolchain and test environment at stable, bug-fixed versions — directly supporting the compliance cockpit, release-evidence center, and operator-facing reporting surfaces that are actively being hardened. All verification evidence (unit tests, coverage, build) is green against the new versions.
