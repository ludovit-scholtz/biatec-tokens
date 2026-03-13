# Business Owner Roadmap: Biatec Tokens Platform

## Executive Summary

**Business Vision:** Biatec Tokens is a comprehensive tokenization platform specializing in regulated Real-World Asset (RWA) tokens in multichain environment. Our mission is to democratize compliant token issuance while ensuring enterprise-grade security and regulatory compliance.

**Target Audience:** Non-crypto native persons - traditional businesses and enterprises who need regulated token issuance without requiring blockchain or wallet knowledge.

**Authentication Approach:** Email and password authentication only - no wallet connectors anywhere on the web. Token creation and deployment handled entirely by backend services.

**Revenue Model:** Subscription-based SaaS with tiered pricing ($29/month basic, $99/month professional, $299/month enterprise). Target: 1,000 paying customers in Year 1, generating $2.5M ARR.

**Market Opportunity:** $50B+ RWA tokenization market by 2025, with MICA regulation creating demand for compliant platforms. Current competitors lack comprehensive compliance tooling.

**Current Status:** March 13, 2026 reality check: frontend scope advanced again with **#606** (guided-launch whitelist policy step), **#608** (compliance policy dashboard / whitelist evidence UX), **#610** (team workspace and approval UX), and **#618** (mobile-first shell parity, focus restoration, and route-announcer accessibility proof) now merged on `main`. The product story is materially stronger for enterprise compliance operations and enterprise shell trust; business-owner MVP sign-off is now blocked primarily by the missing successful protected strict-backend Playwright run, plus the remaining gap between shell-level accessibility proof and full automated WCAG / contrast verification.

---

## Phase 1: MVP Foundation (Q1 2025) - 67% Complete 🟡

### Core Token Creation & Deployment - 63% Complete 🟡

- **Multi-Token Standard Support** (85%): ASA, ARC3, ARC200, ERC20, ERC721 - Support implemented but integration issues persist
- **Backend Token Creation Service** (55%): All token creation and deployment handled by backend - canonical deployment contracts and strict sign-off scaffolding exist, but release evidence still depends on live backend configuration
- **Multi-Network Deployment** (45%): Algorand Mainnet, Ethereum mainnet (Ethereum, Base, Arbitrum), VOI Testnet, Aramid Testnet - Main chains supported, test networks functional
- **Smart Contract Templates** (75%): 15+ pre-built templates with validation - Templates exist and functional
- **Real-time Deployment Status** (65%): Deployment lifecycle UI and strict status-polling proof exist, but live protected evidence is still missing
- **Batch Deployment** (30%): Multiple tokens in single transaction, basic implementation exists

### Backend Token Creation & Authentication - 58% Complete 🟡

- **Email/Password Authentication** (78%): Secure user authentication without wallet requirements - strong frontend proof exists, but strict real-backend sign-off still lacks one passing protected run
- **Backend Token Deployment** (55%): All token creation handled server-side - canonical strict Playwright coverage exists, but staging/protected workflow evidence is still pending
- **ARC76 Account Management** (55%): Automatic account derivation from user credentials - deterministic contract behavior is well covered in code, but live-backend evidence remains incomplete
- **Transaction Processing** (55%): Backend handles all blockchain interactions - core frontend orchestration exists, but protected end-to-end deployment proof remains the gating evidence
- **Security & Compliance** (65%): Enterprise-grade security for token operations - fail-closed sign-off posture is stronger, but operational release governance is not yet complete

### Basic Compliance Features - 65% Complete 🟡

- **MICA Readiness Check** (85%): Article 17-35 compliance validation - Validation implemented and functional
- **Basic Attestation System** (65%): Digital signatures for compliance - Partial implementation, needs completion
- **Compliance Badges** (90%): Visual compliance indicators - UI components exist and working
- **Audit Trail Logging** (75%): Basic transaction logging - Logging implemented and functional

---

## Phase 2: Enterprise Compliance (Q2 2025) - 38% Complete 🟡

### Advanced MICA Compliance - 48% Complete 🟡

- **Whitelist Management** (72%): Guided-launch whitelist authoring and post-launch policy management UX now exist, but backend-backed enforcement evidence is still limited
- **Jurisdiction Tracking** (55%): Jurisdiction-aware policy modeling, contradiction detection, and operator review UX are now implemented in the frontend
- **KYC Integration** (5%): Third-party KYC provider integration - placeholders only; no live vendor integration is evidenced yet
- **AML Screening** (5%): Automated sanctions checking - policy framing exists, but no live screening integration is implemented
- **Compliance Reporting** (45%): Policy summaries, audit metadata, and operator-facing evidence improved, but regulator-grade reporting remains partial

### Enterprise Dashboard - 46% Complete 🟡

- **Compliance Monitoring** (60%): Compliance policy dashboard and evidence views now exist, though live operational data integration still needs work
- **Risk Assessment** (35%): Policy health summaries and contradiction warnings improve operator risk awareness, but scoring remains partial
- **Audit Export** (60%): CSV/JSON compliance exports - Export functionality exists
- **Multi-User Access** (45%): Team workspace, reviewer queues, and approval-state UX are now shipped in the frontend, but backend roles/permissions are still immature
- **Custom Reporting** (25%): Dashboard surfaces are expanding, but configurable reporting is still early-stage

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

## MVP Blockers Reality Check (March 13, 2026 - PR #618 Reality Check)

### Evidence Reviewed

- Recent hardening/productization work is merged to `main`: the earlier March sign-off stream is now followed by **#606**, **#608**, **#610**, and **#618**, which materially improve whitelist setup, compliance policy review, team approval UX, and shell-level accessibility proof.
- Latest `Run Tests` and `Playwright Tests` workflow runs on `main` are green on commit `918c0d0ccb022dd97f12865b438fecf849072bac` (`success`), which is the merge commit for PR **#618**.
- Issue **#617** (mobile-first app-shell parity and keyboard-only accessibility proof) is now closed by PR **#618**, and `e2e/mobile-first-shell-parity.spec.ts` adds 34 shell-level tests covering phone-sized navigation, Escape-key focus restoration, route live-region announcements, keyboard traversal, and wallet-free navigation.
- The protected workflow `.github/workflows/strict-signoff.yml` exists, triggers on push to `main` for sign-off-critical files plus `workflow_dispatch`, sets `BIATEC_STRICT_BACKEND=true`, and fails fast when required secrets are missing.
- The latest strict-signoff workflow run is still the failed run on commit `fa73edd99c4a3a227ee9db08a8b03ae75545c09a`; it stops before the Playwright suite starts because the required sign-off backend credentials/environment are not configured. That means the release gate is wired, but still not operationally usable as enterprise sign-off evidence.
- `e2e/mvp-backend-signoff.spec.ts` remains genuinely fail-closed for the canonical blocker path: missing bearer token, unreachable `/initiate`, missing `deploymentId`, unreachable `/status`, missing terminal state within the 60s poll window, missing `assetId` / `userGuidance`, and unreachable `/validate` all hard-fail with `[STRICT SIGN-OFF FAILURE]`.
- `e2e/compliance-setup-workspace.spec.ts` still carries **13** CI-only skips for deeper multi-step flows, which means compliance setup is only partially proven under CI pressure even though the entry and validation slices are stable.
- `e2e/helpers/auth.ts` still confirms the default corpus is **not** real-backend by default: `loginWithCredentials()` remains permissive and falls back to `withAuth()` localStorage seeding when the backend is unavailable.
- `.github/workflows/playwright.yml` remains the permissive developer-feedback lane: it runs `npm run test:e2e` with `CI=true` only and does **not** export live-backend variables, which is acceptable only because the strict lane now exists separately.
- `docs/testing/MVP_STABILIZATION_STATUS.md` remains directionally useful, but stakeholder-facing proof should prioritize the canonical blocker docs plus the latest workflow evidence instead of aggregate suite-count claims.

### Blocker Validation Status

- 🟡 **ARC76 critical-path blocker is closed in code but still open in operational evidence:** `mvp-backend-signoff.spec.ts` + `loginWithCredentialsStrict()` remove the old fallback hole, and the dedicated strict workflow is wired on `main`. However, there is still **no successful strict-backend run** because the required secrets/backing environment are not configured.
- 🟡 **Backend deployment verification blocker is materially improved in the canonical suite, but sign-off evidence is still incomplete:** the canonical blocker suite now hard-fails on missing lifecycle evidence. The remaining gap is not soft-return logic in `mvp-backend-signoff.spec.ts`; it is the lack of one passing protected strict run against a real backend.
- ✅ **Shell accessibility / mobile parity blocker is closed in code and CI for the shared shell:** PR **#618** closes Issue **#617**, and `e2e/mobile-first-shell-parity.spec.ts` now proves phone-sized menu parity, Escape-key focus restoration, route live-region behavior, keyboard traversal, and wallet-free shell semantics.
- ✅ **Legacy `/create/wizard` blocker is contained on `main`:** direct `goto('/create/wizard')` usage is isolated to `e2e/wizard-redirect-compat.spec.ts`, which is the correct redirect-compat location.
- 🟡 **Accessibility-evidence blocker is narrowed but not fully closed:** shell-level keyboard and mobile parity are now covered, but there is still no automated axe-core / contrast verification and no business-owned screen-reader review evidence for the highest-value enterprise journeys.
- 🟡 **Mock-environment dependency blocker remains open outside the canonical gate:** the strict lane exists, but the broader corpus still leans heavily on `withAuth()` and broad `suppressBrowserErrors()`, so most ordinary E2E evidence is still more permissive than production reality.
- 🔴 **CI-depth / pacing debt remains open in enterprise workflows:** `e2e/compliance-setup-workspace.spec.ts` still carries 13 CI-only skips for deeper wizard transitions, so compliance readiness is not yet fully demonstrated under CI pressure even though the entry slices are stable.
- ✅ **Documentation honesty is materially better:** the roadmap can now cite both the strict release-gate posture and the shell-parity proof without overstating business-owner sign-off. The remaining problem is enabling and passing the real backend gate and finishing accessibility evidence.

### Playwright Compliance vs MVP Blockers

**Status:** 🟡 **Compliant for the major frontend MVP blockers, not yet compliant for protected release evidence**

Current Playwright coverage now satisfies the most important **frontend/code-level** MVP blocker criteria: wallet-free auth-first routing is well covered, the canonical strict backend-auth/deployment suite is fail-closed, legacy route drift is contained, and PR **#618** adds real mobile-menu parity plus keyboard/app-shell evidence on `main`. It still does **not** satisfy the full **business-owner** blocker because no successful strict sign-off run exists yet on `main`; the gate currently proves only that configuration is missing, not that the production-like journey passes against a live backend. In addition, accessibility proof is still incomplete at the procurement level because automated axe/contrast verification is absent, and compliance setup still has 13 CI-only skips in its deeper multi-step journeys.

### Required Playwright Improvements Before MVP Sign-off

1. Configure `SIGNOFF_API_BASE_URL` and `SIGNOFF_TEST_PASSWORD` (and confirm `SIGNOFF_TEST_EMAIL`) so the protected strict workflow can actually run against a live backend and produce one passing artifact-backed sign-off result.
2. Make the `Strict Backend Sign-off Gate` a required release / environment promotion status, not just a workflow that exists on `main`.
3. Keep `e2e/mvp-backend-signoff.spec.ts` as the canonical blocker suite and do **not** rely on softer supporting suites as release proof.
4. Add automated axe-core / contrast verification for Home, Guided Launch, Compliance, Team Workspace, and the new shell-announcer/mobile-menu patterns so accessibility claims become procurement-grade evidence.
5. Convert the highest-value CI-skipped `e2e/compliance-setup-workspace.spec.ts` journeys into smaller deterministic slices (or otherwise remove the 13 CI-only skips) so compliance readiness is proven more deeply under CI.
6. Continue shrinking broad console/page-error suppression and seeded-auth usage across blocker-adjacent suites so ordinary CI evidence becomes materially closer to production reality.
7. Eliminate low-signal assertions and timing debt in older hotspot suites, especially ARC76, guided-launch hardening, and legacy accessibility specs.
8. Keep documentation and workflow descriptions aligned: permissive CI can remain for developer feedback, but business-owner sign-off must explicitly reference the strict workflow run ID and artifact as release evidence.

### Priority Action Items

- **URGENT:** Configure strict-signoff GitHub secrets/environment and obtain the first green protected run on `main`; until then there is still no blocker-grade release evidence.
- **URGENT:** Mark the `Strict Backend Sign-off Gate` as required for release promotion / business-owner sign-off.
- **HIGH:** Add procurement-grade accessibility evidence (axe/contrast automation plus explicit screen-reader review notes) now that shell-level parity tests exist.
- **HIGH:** Convert or split the highest-value CI-skipped compliance setup journeys so enterprise compliance proof is deeper than route-entry coverage.
- **MEDIUM:** Continue reducing seeded-session usage, broad suppression, and low-signal assertions in secondary flows.
- **MEDIUM:** Reconcile published Playwright metrics across `business-owner-roadmap.md`, `docs/testing/PLAYWRIGHT_STATUS.md`, and blocker summary docs before using aggregate test-count numbers in stakeholder communication.

### Roadmap Adjustment

- **MVP Foundation confidence remains fairly represented at 67%**: wallet-free auth/routing, canonical route control, MVP stabilization, and the new shell-parity proof are now all present on `main`. But business-owner sign-off is still blocked until the strict workflow is fully configured and produces repeatable green evidence against a live backend.
- **Enterprise compliance maturity is improving faster than the old roadmap reflected**: whitelist policy authoring, policy evidence review, and team approval UX are now visible product strengths, so the roadmap should treat them as in-progress monetizable capabilities rather than as barely-started placeholders.
- **Accessibility risk moved from basic shell parity to procurement-grade evidence**: the navigation/keyboard blocker is no longer the main gap; the remaining accessibility work is automated WCAG / contrast proof plus explicit high-value flow review.

---

## UX/Design Improvement Roadmap (Added February 18, 2026)

### Critical UX/Design Issues Identified 🔴

Based on comprehensive product review including source code analysis, E2E test coverage review, and component structure assessment, the following design and UX issues require immediate attention:

#### 1. **CRITICAL: Accessibility Verification & Trust Hardening** 🔴 **PRIORITY: HIGH**

**Issue:** Accessibility implementation has improved materially, but business-grade proof is still incomplete. Current blocker suites verify landmarks, skip links, labels, and some keyboard/focus semantics, yet they do **not** prove full WCAG 2.1 AA conformance across the app shell and the expanding enterprise workflows.

**Evidence:**
- PRs **#594** and **#600** shipped WCAG-focused hardening for form controls, modal dialogs, status badges, dashboard views, and keyboard access.
- Blocker suites assert skip links, `aria-label` landmarks, and wallet-free UI, which is valuable baseline evidence.
- `e2e/mobile-first-shell-parity.spec.ts` now provides explicit keyboard-only and mobile-shell evidence for sign-in, navigation, Guided Launch, Compliance, Team Workspace, Operations, and Settings.
- There is still no automated axe-core / contrast verification in the published Playwright evidence, and no business-owned screen-reader review evidence for the newest compliance/team surfaces.

**Business Impact:** 
- Procurement and regulatory trust remain at risk if accessibility claims cannot be evidenced.
- The product is increasingly enterprise-facing; inaccessible shared navigation or workflow controls would undermine demos, trials, and internal customer approvals.
- Accessibility debt now affects not just launch flows, but also compliance dashboards and team approvals that are intended to justify higher subscription tiers.

**Required Actions:**
1. Add automated axe/contrast verification for the home page, Guided Launch, Compliance, and Team Workspace flows.
2. Run manual screen-reader checks on the highest-value enterprise journeys (launch, compliance policy, team workspace, subscription/account).
3. Keep contrast/focus regressions blocked in CI once the automated checks exist.
4. Extend the new shell-level keyboard evidence whenever shared navigation semantics change.

**Acceptance Criteria:**
- Automated accessibility checks run in CI for the highest-value routes.
- Keyboard-only navigation is proven across the shared shell and critical routes.
- Contrast-sensitive UI and status/error patterns are validated, not assumed.
- Screen-reader review covers at least the four highest-value enterprise flows.

**Estimated Effort:** 24-32 hours (1-2 weeks, 1 developer)

---

#### 2. **Navigation Discoverability & Mobile-Proof Evidence** ✅ **PRIORITY: MEDIUM**

**Issue:** The primary navigation blocker is materially reduced. `src/constants/navItems.ts` still enforces a 7-item shared nav model for desktop and mobile, and PR **#618** now adds durable mobile-menu and keyboard proof for the shared shell. The remaining risk is preserving that parity as more enterprise routes and shell affordances are added.

**Evidence:**
- `src/constants/navItems.ts` uses a single source of truth with **7** top-level destinations: Home, Guided Launch, Dashboard, Portfolio, Operations, Compliance, Settings.
- `e2e/mobile-first-shell-parity.spec.ts` now opens the mobile menu on a phone-sized viewport, verifies route discoverability/reachability, checks `aria-current`, and proves Escape-key focus restoration plus route-announcer behavior.
- Issue **#617** is closed by PR **#618**, which means the shell-level navigation parity blocker is no longer the primary MVP risk.

**Business Impact:**
- Enterprise prospects now see a more credible, procurement-friendly shell during demos and trials.
- Mobile-safe discoverability has moved from assumed to demonstrated for the shared shell.
- Remaining commercial risk is now more about sustained parity as routes evolve than about missing basic mobile proof.

**Required Actions:**
1. Keep the 7-item shared nav model intact as new enterprise destinations are introduced.
2. Extend the mobile-shell parity suite whenever new primary routes or shell widgets are added.
3. Collect demo / user feedback on whether the current labels and grouping stay understandable to non-crypto-native operators.

**Acceptance Criteria:**
- 7 or fewer top-level navigation items remain the shared source of truth.
- Mobile and desktop continue to expose the same critical destinations in tested, user-observable behavior.
- Keyboard and focus behavior remain verified for the shared shell.
- Demo feedback confirms the shell remains understandable as compliance and team workflows expand.

**Estimated Effort:** 8-12 hours ongoing maintenance

---

#### 3. **Legacy Wizard Flow Cleanup** ✅ **PRIORITY: LOW**

**Status:** `/create/wizard` direct navigation is now correctly isolated to `wizard-redirect-compat.spec.ts`.

**Evidence:**
- Direct `goto('/create/wizard')` calls now appear only in `e2e/wizard-redirect-compat.spec.ts` (**3** redirect-source assertions).
- Canonical flow coverage is centered on `/launch/guided` in MVP hardening suites.

**Business Impact:**
- Reduced route ambiguity in MVP-critical E2E journeys
- Lower regression risk for canonical launch path messaging

**Remaining Action:**
1. Keep redirect-compat tests isolated to the dedicated compatibility spec.
2. Reject any new direct `/create/wizard` navigation in non-compat tests during review.
3. Preserve `/launch/guided` as the only canonical destination in new blocker-facing coverage.

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
1. 🔴 **Configure and pass the strict backend sign-off lane** - Provide protected backend credentials/environment and obtain the first green artifact-backed run on `main`
2. 🔴 **Promote strict sign-off to a real release gate** - Treat the workflow result as required evidence for MVP/business-owner sign-off
3. 🟡 **Automate accessibility verification** - Add axe/contrast checks and explicit screen-reader review notes so shell-quality claims become procurement-grade evidence

**Phase 2 (Post-MVP Hardening - Weeks 3-6):**
4. 🟡 **Deepen compliance journey proof** - Convert or split the 13 CI-skipped compliance setup journeys into deterministic coverage that survives CI timing ceilings
5. 🟡 **Reduce permissive Playwright patterns** - Restrict broad `suppressBrowserErrors()`, reduce `withAuth()` dependence, and keep blocker-adjacent suites closer to production reality
6. 🟡 **Clean up hotspot test debt** - Remove low-signal assertions and `waitForTimeout()` hotspots, starting with ARC76, guided-launch, and older accessibility suites

**Phase 3 (Commercial Maturity - Q2 2026):**
7. 🟡 **Maintain shell parity as enterprise routes grow** - Extend PR **#618** coverage whenever navigation groups, destinations, or shell widgets change
8. 🟡 **Backend-backed compliance/team operations** - Replace remaining mock-only compliance/team workflow data with production-grade integrations and sign-off evidence

---

### Success Metrics

**Accessibility:**
- Automated WCAG / contrast evidence on critical routes: **Not yet in CI → Required before external accessibility claims**
- Screen-reader and keyboard validation on highest-value flows: **Keyboard shell proof automated; screen-reader review still ad hoc → Explicitly tracked and reviewed**

**Navigation:**
- Primary navigation complexity: **9-item / inconsistent mental model → 7 shared top-level destinations in code**
- Mobile feature access proof: **Assumed parity → Demonstrated parity in real mobile viewport tests on `main`**
- Task completion time: Baseline → -20%

**Error UX:**
- Support tickets (error-related): Baseline → -30%
- User satisfaction (error scenarios): Baseline → +40%

**Code Quality:**
- Playwright skip calls (`test.skip` + `test.describe.skip`): **55 currently remain** in the `e2e/` corpus; target stays **0 in blocker-facing suites**
- Broad Playwright error-suppression references: **53 spec files currently**
- Playwright auth split: **30 `withAuth()` spec files** vs **11 `loginWithCredentials()` spec files** vs **2 `loginWithCredentialsStrict()` spec files**
- Legacy route debt: direct `goto('/create/wizard')` now appears in only **1 spec file**, the dedicated redirect-compat suite
- `waitForTimeout` debt: **38 runtime calls remain across 28 spec files**
- Low-signal assertion debt: a lightweight heuristic scan flags **65** candidate matches across **33** spec files targeted for cleanup

---

**Last Updated:** March 13, 2026 (PR **#618** reality check: roadmap updated for PRs **#606**, **#608**, **#610**, and **#618**; shell-parity blocker closed in code, strict-backend blocker re-validated, and remaining accessibility/compliance-proof gaps narrowed)
**Next Review:** March 20, 2026
