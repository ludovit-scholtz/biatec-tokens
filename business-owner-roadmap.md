# Business Owner Roadmap: Biatec Tokens Platform

## Executive Summary

**Business Vision:** Biatec Tokens is a comprehensive tokenization platform specializing in regulated Real-World Asset (RWA) tokens in multichain environment. Our mission is to democratize compliant token issuance while ensuring enterprise-grade security and regulatory compliance.

**Target Audience:** Non-crypto native persons - traditional businesses and enterprises who need regulated token issuance without requiring blockchain or wallet knowledge.

**Authentication Approach:** Email and password authentication only - no wallet connectors anywhere on the web. Token creation and deployment handled entirely by backend services.

**Revenue Model:** Subscription-based SaaS with tiered pricing ($29/month basic, $99/month professional, $299/month enterprise). Target: 1,000 paying customers in Year 1, generating $2.5M ARR.

**Market Opportunity:** $50B+ RWA tokenization market by 2025, with MICA regulation creating demand for compliant platforms. Current competitors lack comprehensive compliance tooling.

**Current Status:** Frontend and backend hardening kept moving through March 2026 (recent merged frontend PRs now include **#558**, **#560**, **#562**, **#564**, **#566**, **#568**, **#570**, **#572**, **#574**, **#576**, **#584**, **#586**, **#588**, and **#590**; backend PRs **#471**, **#473**, **#477**, **#479**, **#481**, **#483**, **#485**, **#487**, **#491**). The latest `Run Tests`, `Playwright Tests`, and `Build and Deploy FE` workflows on `main` are green on commit `58ccbafb12afa9392f72b2868f3ba22e6a403cca` (updated **2026-03-12 10:19-10:32 UTC**). Fresh local validation in a clean clone also passed (`npm run build`, `npm test`: **309** files, **9741** tests passing, **25** skipped). Business-owner MVP sign-off is still blocked, but the picture is now more nuanced: a strict real-backend Playwright lane exists on `main`, legacy `/create/wizard` drift is contained, and documentation is more honest; however, the strict lane is not wired into standard CI, deployment proof is still partly permissive/soft-failing, and broad suppression plus seeded-auth reliance remain too high for enterprise sign-off.

---

## Phase 1: MVP Foundation (Q1 2025) - 56% Complete 🟡

### Core Token Creation & Deployment - 60% Complete 🟡

- **Multi-Token Standard Support** (85%): ASA, ARC3, ARC200, ERC20, ERC721 - Support implemented but integration issues persist
- **Backend Token Creation Service** (50%): All token creation and deployment handled by backend - API structure exists, deployment logic partially implemented
- **Multi-Network Deployment** (45%): Algorand Mainnet, Ethereum mainnet (Ethereum, Base, Arbitrum), VOI Testnet, Aramid Testnet - Main chains supported, test networks functional
- **Smart Contract Templates** (75%): 15+ pre-built templates with validation - Templates exist and functional
- **Real-time Deployment Status** (55%): Basic transaction monitoring, backend integration partially working
- **Batch Deployment** (30%): Multiple tokens in single transaction, basic implementation exists

### Backend Token Creation & Authentication - 50% Complete 🟡

- **Email/Password Authentication** (70%): Secure user authentication without wallet requirements - Implementation exists but ARC76 integration needs completion
- **Backend Token Deployment** (45%): All token creation handled server-side - API structure complete, deployment logic needs testing
- **ARC76 Account Management** (35%): Automatic account derivation from user credentials - Framework implemented, needs full integration
- **Transaction Processing** (50%): Backend handles all blockchain interactions - Implementation exists with some integration issues
- **Security & Compliance** (60%): Enterprise-grade security for token operations - Security measures implemented

### Basic Compliance Features - 65% Complete 🟡

- **MICA Readiness Check** (85%): Article 17-35 compliance validation - Validation implemented and functional
- **Basic Attestation System** (65%): Digital signatures for compliance - Partial implementation, needs completion
- **Compliance Badges** (90%): Visual compliance indicators - UI components exist and working
- **Audit Trail Logging** (75%): Basic transaction logging - Logging implemented and functional

---

## Phase 2: Enterprise Compliance (Q2 2025) - 30% Complete 🔴

### Advanced MICA Compliance - 35% Complete 🔴

- **Whitelist Management** (50%): Address-based access control, basic implementation - UI exists but functionality limited
- **Jurisdiction Tracking** (20%): Geographic compliance mapping, partial - Basic framework exists
- **KYC Integration** (10%): Third-party KYC provider integration, not started - Dashboard widget exists but no actual integration
- **AML Screening** (15%): Automated sanctions checking, basic - Not implemented
- **Compliance Reporting** (40%): Automated MICA reports, partial - Basic reporting exists

### Enterprise Dashboard - 40% Complete 🔴

- **Compliance Monitoring** (50%): Real-time compliance status, basic - Dashboard exists but data issues
- **Risk Assessment** (30%): Automated risk scoring, partial - Basic framework
- **Audit Export** (60%): CSV/JSON compliance exports - Export functionality exists
- **Multi-User Access** (10%): Team collaboration features, not implemented - Not started
- **Custom Reporting** (20%): Configurable compliance dashboards, basic - Basic dashboard exists

### Regulatory Integration - 15% Complete 🔴

- **EU MICA Full Compliance** (20%): Complete regulatory framework, partial - Basic compliance checks exist
- **FATF Guidelines** (10%): Anti-money laundering standards, basic - Not implemented
- **SEC Integration** (5%): US securities compliance, not started - Not started
- **Regulatory API** (15%): Third-party regulator connectivity, partial - Basic API structure
- **Compliance Webhooks** (20%): Real-time regulatory notifications, basic - Partial implementation

---

## Phase 3: Advanced Features (Q3-Q4 2025) - 10% Complete 🔴

### DeFi Integration - 5% Complete 🔴

- **DEX Integration** (5%): Decentralized exchange connectivity, not started
- **Liquidity Pools** (0%): Automated market making, not started
- **Yield Farming** (0%): Staking and rewards, not started
- **Cross-Chain Bridges** (10%): Multi-chain token transfers, basic - Basic framework exists
- **Flash Loans** (0%): Instant liquidity protocols, not started

### Advanced Token Features - 15% Complete 🔴

- **Dynamic NFTs** (10%): Evolving token metadata, basic - Basic support exists
- **Soulbound Tokens** (20%): Non-transferable assets, partial - Partial implementation
- **Token Gating** (25%): Access control mechanisms, basic - Basic functionality
- **Royalty Management** (5%): Automated creator fees, not started
- **Token Burning** (30%): Supply reduction mechanisms, partial - Basic burning exists

### Analytics & Intelligence - 10% Complete 🔴

- **Portfolio Analytics** (15%): Performance tracking, basic - Basic tracking exists
- **Market Intelligence** (5%): Price and volume data, not started
- **Risk Analytics** (10%): Portfolio risk assessment, basic - Basic framework
- **Compliance Analytics** (20%): Regulatory reporting, partial - Basic reporting
- **Predictive Modeling** (0%): Market trend analysis, not started

---

## Phase 4: Scale & Monetization (Q1-Q2 2026) - 5% Complete 🔴

### Enterprise Features - 10% Complete 🔴

- **White-label Solution** (5%): Custom branding, not started
- **API Access** (10%): Full platform API, basic - Basic API exists
- **Custom Integrations** (0%): Client-specific features, not started
- **Priority Support** (15%): 24/7 enterprise support, basic - Basic support exists
- **SLA Guarantees** (5%): Service level agreements, not started

### Marketplace Features - 0% Complete 🔴

- **Token Marketplace** (5%): Buy/sell regulated tokens, not started - Basic UI exists
- **Liquidity Provision** (0%): Market making services, not started
- **Token Discovery** (10%): Search and filter tools, basic - Basic search exists
- **Price Oracles** (0%): Real-time pricing data, not started
- **Trading Interfaces** (0%): Professional trading UI, not started

### Global Expansion - 0% Complete 🔴

- **Multi-Language Support** (0%): Localization, not started
- **Regional Compliance** (0%): Country-specific regulations, not started
- **Local Payment Methods** (0%): Regional payment processing, not started
- **Partner Ecosystems** (0%): Local integrator networks, not started
- **Regulatory Partnerships** (0%): Government collaborations, not started

---

## Phase 5: Innovation & Leadership (2026+) - 0% Complete 🔴

### AI-Powered Features - 0% Complete 🔴

- **Smart Contract Generation** (0%): AI-assisted contract creation, not started
- **Risk Prediction** (0%): ML-based compliance risk assessment, not started
- **Automated Compliance** (0%): AI-driven regulatory adherence, not started
- **Market Analysis** (0%): AI-powered investment insights, not started
- **Chat Support** (0%): AI customer service, not started

### Next-Generation Blockchain - 0% Complete 🔴

- **Layer 2 Solutions** (0%): Scalability improvements, not started
- **Privacy Features** (0%): Zero-knowledge proofs, not started
- **Interoperability** (5%): Cross-chain communication, basic - Basic framework
- **Quantum Resistance** (0%): Future-proof cryptography, not started
- **Carbon Neutral** (0%): Sustainable blockchain operations, not started

---

## MVP Blockers Reality Check (March 12, 2026 - Weekly Update)

### Evidence Reviewed

- Recent hardening/productization work is merged to `main` (frontend PRs now include **#584**, **#586**, **#588**, and **#590** in addition to the earlier March stream; backend PRs remain **#471**, **#473**, **#477**, **#479**, **#481**, **#483**, **#485**, **#487**, **#491**).
- Latest `Run Tests`, `Playwright Tests`, and `Build and Deploy FE` workflows on `main` are all green on commit `58ccbafb12afa9392f72b2868f3ba22e6a403cca` (updated **2026-03-12 10:19-10:32 UTC**, all `success`).
- Fresh local baseline validation in a clean clone completed successfully for `npm run build` and `npm test` (**309** test files, **9741** tests passing, **25** skipped), which lowers general frontend regression risk but does **not** by itself close the business-owner blocker because the remaining gap is E2E sign-off fidelity, not build/unit stability.
- `e2e/mvp-backend-signoff.spec.ts` now provides a genuine strict auth lane on `main`: it uses `loginWithCredentialsStrict()` and will fail loudly instead of falling back to localStorage when the backend is unavailable.
- `e2e/helpers/auth.ts` still shows the default suite is **not fully real-backend**: `loginWithCredentials()` remains permissive and explicitly falls back to `withAuth()` localStorage seeding when `API_BASE_URL` or the backend is unavailable.
- `.github/workflows/playwright.yml` currently runs only `npm run test:e2e` with `CI=true`; it does **not** set `BIATEC_STRICT_BACKEND=true` or a live `API_BASE_URL`, so the strict sign-off lane is present in the repo but skipped in standard CI.
- `e2e/backend-deployment-contract.spec.ts` still uses DOM injection in its permissive lane, while its strict lane verifies endpoint reachability/response shape rather than a full create-token -> accepted deployment -> status progression -> terminal outcome journey.
- `e2e/mvp-backend-signoff.spec.ts` improves deployment realism, but several AC #3 checks still return early on missing `/initiate`, missing `deploymentId`, unavailable `/validate`, or non-terminal status after polling; that is stronger than the March 11 state, but it is still not blocker-grade sign-off proof.
- Documentation is more honest than on March 11: `e2e/README.md` now clearly separates strict sign-off coverage from permissive/mock-safe coverage and lists known remaining gaps.
- Current Playwright debt is still meaningful: the `e2e/` corpus contains **58 spec files**, **54** `test.skip` / `test.describe.skip` calls, `suppressBrowserErrors()` appears in **52 spec files**, `withAuth()` appears in **29 spec files**, `loginWithCredentials()` appears in **11 spec files**, `loginWithCredentialsStrict()` appears in only **2 spec files**, direct `goto('/create/wizard')` now remains in only **1 spec file** (the dedicated redirect-compat suite), and a lightweight heuristic scan still flags **51** candidate low-signal assertions across **24** spec files.

### Blocker Validation Status

- 🟡 **ARC76 critical-path blocker materially improved but not closed:** the repo now has a strict real-backend auth lane (`mvp-backend-signoff.spec.ts` + `loginWithCredentialsStrict()`), which closes the old "no suite fails on fallback" gap when that lane is actually enabled. But standard CI does not enable it, and blocker-adjacent coverage still leans on `withAuth()` / permissive `loginWithCredentials()` instead of proving real email/password -> ARC76 -> authenticated backend session by default.
- 🔴 **Backend deployment verification blocker remains open:** the repo now contains more real-backend deployment requests and polling, but the strict deployment proof is still not hard enough. `backend-deployment-contract.spec.ts` strict mode is mostly reachability/shape validation, and `mvp-backend-signoff.spec.ts` still allows several early-return paths that avoid failing the sign-off run when lifecycle evidence is missing.
- ✅ **Legacy `/create/wizard` blocker is now contained on main:** direct `goto('/create/wizard')` calls are isolated to `e2e/wizard-redirect-compat.spec.ts`, which is the correct redirect-compat location.
- 🟡 **Mock-environment dependency blocker remains open:** the strict lane is skipped in ordinary CI, `withAuth()` still outnumbers backend-backed login usage, and `suppressBrowserErrors()` remains widespread enough that non-blocker regressions can still hide inside permissive coverage.
- 🔴 **Assertion-quality blocker remains open:** the debt is smaller than the March 11 estimate, but still real. A lightweight heuristic scan now flags **51** candidate low-signal assertions across **24** spec files, with notable hotspots in `e2e/arc76-determinism.spec.ts`, `e2e/canonical-launch-aa-hardening.spec.ts`, `e2e/guided-token-launch.spec.ts`, `e2e/guided-portfolio-onboarding.spec.ts`, and `e2e/arc76-validation.spec.ts`.
- ✅ **Documentation honesty improved:** `e2e/README.md` now clearly distinguishes strict sign-off evidence from permissive/mock-safe coverage and explicitly lists the remaining gaps (full UI form submission, real-time polling, rollback/retry, compliance evidence upload). The problem is now less documentation honesty and more workflow enforcement.

### Playwright Compliance vs MVP Blockers

**Status:** 🟡 **Partially compliant — much stronger than March 11, but still not business-owner sign-off ready**

Current Playwright coverage now proves more than it did a day ago: the repository contains a strict backend-auth lane, clearer documentation about what is and is not real-backend, and cleaner canonical-route discipline. It still does **not** provide business-owner-grade proof that the highest-risk production path is enforced in release automation, because the strict lane is skipped in ordinary CI and the deployment sign-off path can still complete without hard-failing on missing lifecycle evidence.

### Required Playwright Improvements Before MVP Sign-off

1. Wire the strict sign-off lane into a protected CI/staging job by setting `BIATEC_STRICT_BACKEND=true` and a live `API_BASE_URL`, so blocker-grade auth proof runs automatically instead of silently skipping in normal CI.
2. Upgrade `e2e/mvp-backend-signoff.spec.ts` so sign-off AC #3 fails when `/initiate` is unreachable, when no `deploymentId` is returned, when `/validate` is unavailable, or when no terminal lifecycle evidence is surfaced in the designated sign-off environment.
3. Replace the strict portion of `e2e/backend-deployment-contract.spec.ts` with full lifecycle assertions (or demote it to supporting contract coverage and keep one canonical blocker-grade suite elsewhere); endpoint reachability and shape checks alone are not enough for business-owner release proof.
4. Continue shrinking broad console/page-error suppression and seeded-auth usage across blocker and blocker-adjacent suites so ordinary CI evidence becomes closer to production reality.
5. Eliminate the remaining low-signal assertions, starting with `e2e/arc76-determinism.spec.ts`, `e2e/canonical-launch-aa-hardening.spec.ts`, `e2e/guided-token-launch.spec.ts`, `e2e/guided-portfolio-onboarding.spec.ts`, and `e2e/arc76-validation.spec.ts`.
6. Keep documentation and workflow descriptions aligned: standard CI can stay permissive for developer feedback, but business-owner sign-off must explicitly require the strict lane and state what it proves.

### Priority Action Items

- **URGENT:** Add a dedicated strict Playwright job (or protected staging gate) that exports `BIATEC_STRICT_BACKEND=true` and a live `API_BASE_URL`, then treat failure there as a release blocker.
- **URGENT:** Make strict deployment sign-off fail hard when lifecycle proof is missing; remove the current early-return escape hatches in `e2e/mvp-backend-signoff.spec.ts`.
- **HIGH:** Rework `e2e/backend-deployment-contract.spec.ts` so strict coverage proves real lifecycle behavior, while DOM-injection tests stay clearly labeled as supporting UI-contract coverage only.
- **HIGH:** Remove low-signal assertions and broad suppression from the current hotspot files, starting with ARC76 and guided-launch hardening suites.
- **MEDIUM:** Continue reducing seeded session usage and skip density in secondary flows.

### Roadmap Adjustment

- **MVP Foundation confidence can rise modestly to 65%**: green workflows, fresh local validation, strict-auth scaffolding on `main`, and legacy-route containment all improve credibility. But business-owner sign-off is still blocked until strict backend evidence is enforced in automation and deployment lifecycle proof becomes hard-failing instead of partially permissive.

---

## UX/Design Improvement Roadmap (Added February 18, 2026)

### Critical UX/Design Issues Identified 🔴

Based on comprehensive product review including source code analysis, E2E test coverage review, and component structure assessment, the following design and UX issues require immediate attention:

#### 1. **CRITICAL: WCAG Accessibility Compliance** 🔴 **PRIORITY: HIGH**

**Issue:** Color contrast violations likely failing WCAG 2.1 AA standards (4.5:1 ratio requirement)

**Evidence:**
- `text-gray-300`, `text-gray-400`, `text-gray-500` used extensively on dark backgrounds
- `text-red-300` error messages on light backgrounds
- Focus indicators present but not consistently visible across interactive elements

**Business Impact:** 
- Legal compliance risk (EU Web Accessibility Directive, ADA)
- Excludes users with visual impairments (15%+ of potential market)
- Regulatory review blocker for MICA compliance (accessibility is part of consumer protection)

**Required Actions:**
1. Audit all color combinations using automated tools (axe DevTools, WAVE)
2. Replace low-contrast grays with WCAG AA compliant alternatives
3. Redesign error state colors to meet 4.5:1 minimum contrast
4. Implement visible focus indicators on all interactive elements
5. Test with real screen readers (NVDA, JAWS, VoiceOver)
6. Document keyboard navigation patterns for all workflows

**Acceptance Criteria:**
- 100% WCAG 2.1 AA compliance verified with automated tools
- All error messages pass 4.5:1 contrast ratio
- Focus indicators visible at 1.5rem distance
- Screen reader testing on 5 critical user flows
- Keyboard-only navigation documentation complete

**Estimated Effort:** 40-60 hours (2-3 weeks, 1 developer)

---

#### 2. **Navigation Complexity & Mobile Inconsistency** 🟡 **PRIORITY: MEDIUM**

**Issue:** Desktop shows 9 navigation items, mobile menu shows only 7 items (missing 2 links)

**Evidence:**
- Desktop navigation: Home, Cockpit, Guided Launch, Compliance, Create, Dashboard, Insights, Pricing, Settings (9 items)
- Mobile navigation: Incomplete subset of desktop items
- Cognitive load at upper limit for non-technical users (target audience per roadmap)

**Business Impact:**
- Confuses non-crypto native users (target audience)
- Mobile users cannot access all features (40%+ of traffic)
- Reduces feature discovery and conversion rates

**Required Actions:**
1. Consolidate navigation to 5-7 core items maximum
2. Group related items under dropdowns (e.g., "Compliance" → Setup, Dashboard, Whitelists)
3. Ensure 100% parity between desktop and mobile navigation
4. Add visual hierarchy (primary vs secondary actions)
5. A/B test reduced navigation for conversion impact

**Acceptance Criteria:**
- Maximum 7 top-level navigation items
- 100% mobile/desktop parity
- Sub-navigation for grouped features
- User testing shows improved task completion time
- Analytics show improved feature discovery

**Estimated Effort:** 24-32 hours (1-2 weeks, 1 developer)

---

#### 3. **Legacy Wizard Flow Cleanup** 🟡 **PRIORITY: MEDIUM**

**Status:** `/create/wizard` direct navigation is reduced but **not yet fully isolated** to `wizard-redirect-compat.spec.ts`.

**Evidence:**
- Direct `goto('/create/wizard')` calls appear in `e2e/wizard-redirect-compat.spec.ts` (**3** assertions), `e2e/mvp-deterministic-journey.spec.ts` (**1** assertion), and `e2e/mvp-stabilization.spec.ts` (**2** assertions).
- Canonical flow coverage is centered on `/launch/guided` in MVP hardening suites.

**Business Impact:**
- Reduced route ambiguity in MVP-critical E2E journeys
- Lower regression risk for canonical launch path messaging

**Remaining Action:**
1. Remove the remaining non-compat `goto('/create/wizard')` calls from `mvp-deterministic-journey.spec.ts` and `mvp-stabilization.spec.ts`.
2. Keep redirect-compat tests isolated to the dedicated compatibility spec.
3. Reject any new direct `/create/wizard` navigation in non-compat tests during review.

---

#### 4. **Error Message User Experience** 🟡 **PRIORITY: MEDIUM**

**Issue:** Error messages sometimes expose technical details instead of user-friendly guidance

**Evidence:**
- Components use `err.message` patterns which may show stack traces or error codes
- Good patterns exist (`StateMessage` component with `userGuidance` and `nextAction` fields) but not used consistently
- Some errors show "Temporary Issue" vs "Error" semantic differentiation (good) but inconsistent

**Business Impact:**
- Non-technical users confused by error messages (target audience per roadmap)
- Increased support ticket volume
- Reduced user trust and confidence
- Longer time to resolution for user errors

**Required Actions:**
1. Audit all error handling code for user-facing error messages
2. Implement consistent error message translation layer
3. Ensure all errors include:
   - What happened (user-friendly language)
   - Why it matters (business impact)
   - How to fix it (actionable next steps)
   - Support contact (for unresolvable errors)
4. Add error message testing to QA checklist
5. Document error message patterns in style guide

**Acceptance Criteria:**
- 100% of user-facing errors use translation layer
- All errors include 3-part structure (what/why/how)
- No technical error codes or stack traces shown to users
- Error messages tested with non-technical users
- Style guide documented with 10+ examples

**Estimated Effort:** 32-48 hours (2 weeks, 1 developer)

---

#### 5. **View/Component Consolidation** 🟡 **PRIORITY: LOW**

**Issue:** 28 views detected, potential duplication (GuidedTokenLaunch + TokenCreationWizard both create tokens)

**Evidence:**
- `src/views/` contains 28 view files
- Multiple similar flows: GuidedTokenLaunch.vue, TokenCreationWizard.vue, TokenCreator.vue
- Unclear which flow is recommended for different user types
- Increases maintenance burden and testing surface

**Business Impact:**
- Confuses users about which flow to use
- Increased development and QA costs
- Risk of feature drift between duplicate flows
- Harder to measure conversion metrics (split across flows)

**Required Actions:**
1. Map all 28 views to user journeys
2. Identify duplicate/overlapping functionality
3. Consolidate to single recommended flow per use case
4. Archive or remove deprecated views
5. Update navigation to reflect consolidated structure
6. Add flow selection guidance for edge cases

**Acceptance Criteria:**
- Single recommended token creation flow documented
- Deprecated views removed from codebase
- Navigation updated to reflect consolidated structure
- User journey map shows clear paths (no overlap)
- Analytics tracking on single consolidated flow

**Estimated Effort:** 40-60 hours (2-3 weeks, 1 developer)

---

### Low Priority UX Improvements 🟢

#### 6. **Loading State Consistency** 🟢 **PRIORITY: LOW**

**Issue:** Loading states exist (Button component has loading spinner) but consistency across views not verified

**Required Actions:**
1. Audit all async operations for loading state indicators
2. Standardize loading state patterns (skeleton loaders, spinners, progress bars)
3. Ensure loading states accessible (aria-busy, aria-live announcements)
4. Document loading state guidelines

**Estimated Effort:** 16-24 hours

---

#### 7. **Form Validation UX** 🟢 **PRIORITY: LOW**

**Issue:** Form validation present (Input/Select components have error states) but validation timing not documented

**Required Actions:**
1. Audit validation timing (on blur vs on submit vs on change)
2. Standardize validation feedback patterns
3. Add inline validation hints before errors occur
4. Test validation UX with real users

**Estimated Effort:** 16-24 hours

---

#### 8. **Progressive Disclosure** 🟢 **PRIORITY: LOW**

**Issue:** Some components use `<details>` for technical information (good pattern) but not consistent across complex flows

**Required Actions:**
1. Identify complex workflows with 5+ steps
2. Implement progressive disclosure (show essential, hide advanced)
3. Add "Show advanced options" toggles
4. Test with beginner vs expert users

**Estimated Effort:** 24-32 hours

---

### Recommended Implementation Priority

**Phase 1 (MVP Blockers - Next 2 Weeks):**
1. 🔴 **Live backend auth proof in Playwright** - Must fail on localStorage fallback and prove real ARC76-backed session establishment
2. 🔴 **Real deployment lifecycle E2E** - Must replace DOM injection with backend-accepted creation, progression, and terminal assertions
3. 🟡 **Legacy route cleanup in blocker suites** - Remove the remaining direct `/create/wizard` navigation outside redirect compatibility coverage

**Phase 2 (Post-MVP Test Hardening - Weeks 3-6):**
4. 🟡 **Error suppression reduction** - Restrict `suppressBrowserErrors()` to a small allowlist and fail blocker suites on real regressions
5. 🟡 **Assertion quality cleanup** - Eliminate the remaining low-signal Playwright assertions, starting with token standards/detail/discovery and team/whitelist coverage (current heuristic scan flags **115** candidate low-signal assertions)
6. 🟡 **Seeded auth reduction** - Move blocker-facing coverage from `withAuth()` to backend-validated login flows

**Phase 3 (Continuous Improvement - Q2 2026):**
7. ✅ **WCAG accessibility and navigation parity hardening** - Materially improved and no longer the primary MVP blocker
8. ✅ **Error-message UX and guided-launch polish** - Improved, but should now be protected by stronger end-to-end evidence

---

### Success Metrics

**Accessibility:**
- WCAG 2.1 AA compliance: 0% → 100%
- Screen reader compatibility: Unknown → 5 flows tested

**Navigation:**
- Mobile feature access: ~70% → 100%
- Task completion time: Baseline → -20%

**Error UX:**
- Support tickets (error-related): Baseline → -30%
- User satisfaction (error scenarios): Baseline → +40%

**Code Quality:**
- Playwright skip calls (`test.skip` + `test.describe.skip`): **54 currently remain** in the `e2e/` corpus; target stays **0 in blocker-facing suites**
- Broad Playwright error-suppression references: **52 spec files currently**
- Playwright auth split: **29 `withAuth()` spec files** vs **11 `loginWithCredentials()` spec files** vs **2 `loginWithCredentialsStrict()` spec files**
- Legacy route debt: direct `goto('/create/wizard')` now appears in only **1 spec file**, the dedicated redirect-compat suite
- `waitForTimeout` debt: **1 runtime call remains** (`e2e/full-e2e-journey.spec.ts`, cursor animation helper)
- Low-signal assertion debt: a lightweight heuristic scan flags **51** candidate matches across **24** spec files targeted for cleanup

---

**Last Updated:** March 12, 2026 (reality-check refresh: latest green main-branch workflow set, fresh local build/unit baseline, workflow wiring reviewed, and Playwright MVP blocker evidence re-verified against the current repo)
**Next Review:** March 19, 2026
