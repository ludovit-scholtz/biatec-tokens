# Business Owner Roadmap: Biatec Tokens Platform

## Executive Summary

**Business Vision:** Biatec Tokens is a comprehensive tokenization platform specializing in regulated Real-World Asset (RWA) tokens in multichain environment. Our mission is to democratize compliant token issuance while ensuring enterprise-grade security and regulatory compliance.

**Target Audience:** Non-crypto native persons - traditional businesses and enterprises who need regulated token issuance without requiring blockchain or wallet knowledge.

**Authentication Approach:** Email and password authentication only - no wallet connectors anywhere on the web. Token creation and deployment handled entirely by backend services.

**Revenue Model:** Subscription-based SaaS with tiered pricing ($29/month basic, $99/month professional, $299/month enterprise). Target: 1,000 paying customers in Year 1, generating $2.5M ARR.

**Market Opportunity:** $50B+ RWA tokenization market by 2025, with MICA regulation creating demand for compliant platforms. Current competitors lack comprehensive compliance tooling.

**Current Status:** March 14, 2026 reality check: frontend scope advanced again with **#620**, **#622**, **#624**, **#626**, and now **#642** on `main`, adding procurement-grade accessibility evidence and a regulator-ready compliance evidence workspace. The latest `Run Tests` (**23097982730**) and permissive `Playwright Tests` (**23097982717**) both passed on current head `15fdc2a`, so the earlier compliance-policy contrast regression is no longer the active blocker. Business-owner MVP sign-off is still blocked because the protected strict-backend Playwright lane failed on the same commit before test execution (**23097982712**) with missing `SIGNOFF_API_BASE_URL` / `SIGNOFF_TEST_PASSWORD`, and the public Playwright status documents now lag the real suite shape and risk profile.

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

## Phase 2: Enterprise Compliance (Q2 2025) - 42% Complete 🟡

### Advanced MICA Compliance - 54% Complete 🟡

- **Whitelist Management** (78%): Guided-launch whitelist authoring, policy dashboard review, and standalone compliance setup workspace proof now exist, but backend-backed enforcement evidence is still limited
- **Jurisdiction Tracking** (58%): Jurisdiction-aware policy modeling, contradiction detection, and operator review UX are now implemented in the frontend, with deeper workspace proof now in CI
- **KYC Integration** (5%): Third-party KYC provider integration - placeholders only; no live vendor integration is evidenced yet
- **AML Screening** (5%): Automated sanctions checking - policy framing exists, but no live screening integration is implemented
- **Compliance Reporting** (52%): Policy summaries, audit metadata, and operator-facing evidence improved further, but regulator-grade reporting remains partial

### Enterprise Dashboard - 52% Complete 🟡

- **Compliance Monitoring** (68%): Compliance policy dashboard, evidence views, and procurement-grade accessibility assertions now exist, though live operational data integration still needs work
- **Risk Assessment** (40%): Policy health summaries and contradiction warnings improve operator risk awareness, but scoring remains partial
- **Audit Export** (60%): CSV/JSON compliance exports - Export functionality exists
- **Multi-User Access** (50%): Team workspace, reviewer queues, approval-state UX, and accessibility proof are now shipped in the frontend, but backend roles/permissions are still immature
- **Custom Reporting** (28%): Dashboard surfaces are expanding, but configurable reporting is still early-stage

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

## MVP Blockers Reality Check (March 14, 2026 - Head `15fdc2a` Reality Check)

### Evidence Reviewed

- Recent hardening/productization work is merged to `main`: the earlier March sign-off stream is now followed by **#620**, **#622**, **#624**, **#626**, and **#642**, adding procurement-grade axe/contrast coverage, explicit screen-reader sign-off evidence, deeper compliance setup coverage, and a regulator-ready compliance evidence workspace.
- Latest `Run Tests` on `main` is green on current head `15fdc2aec373b5fe04d8cb0de03c6b86d4483566` (`run 23097982730`, `success`).
- Latest `Playwright Tests` on `main` is also green on that same head (`run 23097982717`, `success`), which means the earlier compliance policy dashboard contrast regression has been fixed in the permissive lane.
- Issue **#617** (mobile-first app-shell parity and keyboard-only accessibility proof) remains closed by PR **#618**, and `e2e/mobile-first-shell-parity.spec.ts` still provides shell-level proof for phone-sized navigation, Escape-key focus restoration, route live-region announcements, keyboard traversal, and wallet-free navigation.
- The protected workflow `.github/workflows/strict-signoff.yml` exists, triggers on push to `main` for sign-off-critical files plus `workflow_dispatch`, sets `BIATEC_STRICT_BACKEND=true`, and fails fast when required secrets are missing.
- The latest strict-signoff workflow run is still a prerequisite failure on current head (`run 23097982712` on commit `15fdc2aec373b5fe04d8cb0de03c6b86d4483566`); it stops before the Playwright suite starts because `API_BASE_URL` and `TEST_USER_PASSWORD` are empty, which traces back to missing `SIGNOFF_API_BASE_URL` and `SIGNOFF_TEST_PASSWORD` secrets. That means the release gate is wired, but still not operationally usable as enterprise sign-off evidence.
- `e2e/mvp-backend-signoff.spec.ts` remains genuinely fail-closed for the canonical blocker path: missing bearer token, unreachable `/initiate`, missing `deploymentId`, unreachable `/status`, missing terminal state within the 60s poll window, missing `assetId` / `userGuidance`, and unreachable `/validate` all hard-fail with `[STRICT SIGN-OFF FAILURE]`.
- `e2e/compliance-setup-workspace.spec.ts` no longer carries the old CI-only blocker narrative; the suite now uses draft pre-seeding to prove deeper multi-step workspace states within CI budgets, and the current permissive lane is green on `main`.
- `e2e/accessibility-enterprise-journeys.spec.ts`, `e2e/procurement-accessibility-evidence.spec.ts`, and the newer screen-reader evidence work now keep procurement-grade axe WCAG 2.1 AA coverage green in the permissive lane for Home, sign-in, Guided Launch, Compliance Launch Console, Compliance policy dashboard, Compliance Setup Workspace, whitelist management, and Team Workspace.
- `e2e/helpers/auth.ts` still confirms the default corpus is **not** real-backend by default: `loginWithCredentials()` remains permissive and falls back to `withAuth()` localStorage seeding when the backend is unavailable, while only `loginWithCredentialsStrict()` is fail-closed.
- `.github/workflows/playwright.yml` remains the permissive developer-feedback lane: it runs `npm run test:e2e` with `CI=true` only and does **not** export live-backend variables, which is acceptable only because the strict lane now exists separately.
- The live suite shape has moved materially since the last public documentation refresh: the repo now contains **70** Playwright spec files, **43** `test.skip()` / `test.describe.skip()` calls, **41** spec files still using `withAuth()`, **12** using `loginWithCredentials()`, **2** using `loginWithCredentialsStrict()`, and **10** runtime `waitForTimeout()` calls across **8** spec files.
- `docs/testing/PLAYWRIGHT_STATUS.md` and `docs/implementations/MVP_SIGNOFF_READINESS_BLOCKER_MAPPING.md` are now stale on suite size, skip counts, strict-auth coverage, and remaining-open-items framing, so stakeholder-facing proof should prioritize the latest workflow evidence until those docs are refreshed.

### Blocker Validation Status

- 🟡 **ARC76 critical-path blocker is closed in code but still open in operational evidence:** `mvp-backend-signoff.spec.ts` + `loginWithCredentialsStrict()` remove the old fallback hole, and the dedicated strict workflow is wired on `main`. However, there is still **no successful strict-backend run** because the required secrets/backing environment are not configured.
- 🟡 **Backend deployment verification blocker is materially improved in the canonical suite, but sign-off evidence is still incomplete:** the canonical blocker suite now hard-fails on missing lifecycle evidence. The remaining gap is not soft-return logic in `mvp-backend-signoff.spec.ts`; it is the lack of one passing protected strict run against a real backend.
- ✅ **Shell accessibility / mobile parity blocker is closed in code and CI for the shared shell:** PR **#618** closes Issue **#617**, and `e2e/mobile-first-shell-parity.spec.ts` now proves phone-sized menu parity, Escape-key focus restoration, route live-region behavior, keyboard traversal, and wallet-free shell semantics.
- ✅ **Legacy `/create/wizard` blocker is contained on `main`:** direct `goto('/create/wizard')` usage is isolated to `e2e/wizard-redirect-compat.spec.ts`, which is the correct redirect-compat location.
- ✅ **Accessibility-evidence blocker is closed in the permissive Playwright lane on current head:** automated axe/contrast verification and explicit screen-reader sign-off evidence now pass on `main`; the remaining business-owner risk is sustaining that proof, not the old policy-dashboard contrast regression itself.
- 🟡 **Mock-environment dependency blocker remains open outside the canonical gate:** the strict lane exists, but the broader corpus still leans heavily on permissive helpers (`withAuth()` in **41** files, `loginWithCredentials()` in **12**, `loginWithCredentialsStrict()` in **2**) and broad `suppressBrowserErrors()` usage, so most ordinary E2E evidence is still more permissive than production reality.
- ✅ **CI-depth / pacing debt is materially reduced for compliance setup:** the old CI-only blocker narrative no longer matches the current green permissive run on head `15fdc2a`, which proves the deeper workspace slices can now survive CI budgets again.
- 🟡 **Documentation honesty still needs one more pass:** the roadmap can now cite strict release-gate posture, shell-parity proof, accessibility automation, and the compliance-setup improvements without repeating the old contrast-regression story, but the public Playwright status docs still overstate blocker closure and understate current suite size / permissive-auth exposure.

### Playwright Compliance vs MVP Blockers

**Status:** 🟡 **Compliant for most frontend-code blockers, not yet compliant for business-owner release evidence on current `main`**

Current Playwright coverage now satisfies nearly all of the important **frontend/code-level** MVP blocker criteria: wallet-free auth-first routing is well covered, the canonical strict backend-auth/deployment suite is fail-closed, legacy route drift is contained, shell/mobile parity is proven, procurement-grade axe coverage is green again on current `main`, and the compliance setup workspace no longer carries the old CI-only blocker narrative. It still does **not** satisfy the full **business-owner** blocker because (1) no successful strict sign-off run exists yet on `main`, (2) the canonical strict lane fails before test execution due to missing protected backend secrets, and (3) the broader green corpus remains significantly more permissive than production reality. That means the Playwright corpus is materially aligned with the MVP blockers, but not yet compliant enough to serve as standalone release evidence.

### Required Playwright Improvements Before MVP Sign-off

1. Configure `SIGNOFF_API_BASE_URL` and `SIGNOFF_TEST_PASSWORD` (and confirm `SIGNOFF_TEST_EMAIL`) so the protected strict workflow can actually run against a live backend and produce one passing artifact-backed sign-off result.
2. Make the `Strict Backend Sign-off Gate` a required release / environment promotion status, not just a workflow that exists on `main`.
3. Keep `e2e/mvp-backend-signoff.spec.ts` as the canonical blocker suite and do **not** rely on softer supporting suites as release proof.
4. Refresh `docs/testing/PLAYWRIGHT_STATUS.md` and `docs/implementations/MVP_SIGNOFF_READINESS_BLOCKER_MAPPING.md` so public status claims match the real suite shape (**70** specs, **43** skip calls, **2** strict-auth spec files, **10** `waitForTimeout()` calls).
5. Continue shrinking permissive auth/bootstrap patterns so blocker-adjacent suites move closer to production reality (`withAuth()` still appears in **41** spec files, while `loginWithCredentialsStrict()` appears in only **2**).
6. Continue shrinking broad console/page-error suppression and remaining `waitForTimeout()` hotspots across older suites so green CI evidence is higher-signal.
7. Preserve and extend the new automated axe-core / contrast verification and screen-reader sign-off evidence for Home, Guided Launch, Compliance, Compliance Setup Workspace, whitelist management, Team Workspace, and shell-adjacent patterns so accessibility claims remain procurement-grade evidence instead of a one-off push artifact.
8. Keep workflow outcome messaging aligned with reality: the strict lane currently fails prerequisite verification before tests start, so business-owner sign-off must reference a future passing strict run ID and artifact, not the current "skipped" summary text.

### Priority Action Items

- **URGENT:** Configure strict-signoff GitHub secrets/environment and obtain the first green protected run on `main`; until then there is still no blocker-grade release evidence.
- **URGENT:** Promote the strict sign-off workflow from "present" to "required" for release promotion / business-owner sign-off.
- **HIGH:** Refresh the public Playwright status / blocker docs so stakeholder messaging stops repeating the resolved contrast-regression story and instead highlights the real open blocker: missing strict-backend evidence.
- **HIGH:** Expand fail-closed auth/deployment proof beyond the 2 canonical strict suites only where it meaningfully improves blocker confidence.
- **MEDIUM:** Continue reducing seeded-session usage, broad suppression, and `waitForTimeout()` hotspots in secondary flows.
- **MEDIUM:** Keep the new accessibility and screen-reader evidence green as the compliance evidence pack, team workspace, and procurement surfaces evolve.

### Roadmap Adjustment

- **MVP Foundation confidence remains fairly represented at 67%**: wallet-free auth/routing, canonical route control, MVP stabilization, shell-parity proof, and accessibility automation are all present on `main`, and the permissive Playwright lane is green again on current head. Business-owner sign-off is still blocked until the strict workflow is fully configured and produces repeatable green evidence against a live backend.
- **Enterprise compliance maturity is improving faster than the old roadmap reflected**: whitelist policy authoring, policy evidence review, team approval UX, compliance setup workspace depth, and procurement-grade accessibility assertions are now visible product strengths, so the roadmap should treat them as in-progress monetizable capabilities rather than as barely-started placeholders.
- **Accessibility risk moved from missing automation to proof maintenance:** the navigation/keyboard blocker is no longer the main gap; the remaining accessibility work is preserving the now-green automated WCAG evidence and keeping explicit high-value flow review current as the product surface expands.

---

## UX/Design Improvement Roadmap (Added February 18, 2026)

### Critical UX/Design Issues Identified 🔴

Based on comprehensive product review including source code analysis, E2E test coverage review, and component structure assessment, the following design and UX issues require immediate attention:

#### 1. **CRITICAL: Accessibility Verification & Trust Hardening** 🔴 **PRIORITY: HIGH**

**Issue:** Accessibility implementation has improved materially, and business-grade automated proof now exists for the highest-value enterprise journeys, but the proof is not yet stable enough for sign-off because the compliance policy dashboard still fails WCAG color-contrast checks on current `main` and explicit screen-reader review evidence is still missing.

**Evidence:**
- PRs **#620**, **#622**, and **#626** now ship automated axe-core / contrast verification across the highest-value enterprise journeys, including the compliance setup workspace.
- Blocker suites still assert skip links, `aria-label` landmarks, and wallet-free UI, which remains valuable baseline evidence under the newer automation layer.
- `e2e/mobile-first-shell-parity.spec.ts` still provides explicit keyboard-only and mobile-shell evidence for sign-in, navigation, Guided Launch, Compliance, Team Workspace, Operations, and Settings.
- The latest `Playwright Tests` run on `main` fails because the compliance policy dashboard still has **5** serious `color-contrast` violations, and no business-owned screen-reader review evidence exists yet for the newest compliance/team surfaces.

**Business Impact:** 
- Procurement and regulatory trust remain at risk if accessibility claims cannot be evidenced.
- The product is increasingly enterprise-facing; inaccessible shared navigation or workflow controls would undermine demos, trials, and internal customer approvals.
- Accessibility debt now affects not just launch flows, but also compliance dashboards and team approvals that are intended to justify higher subscription tiers.

**Required Actions:**
1. Fix the compliance policy dashboard contrast defects so the new automated accessibility evidence is green on `main`.
2. Keep automated axe/contrast verification in CI for the home page, Guided Launch, Compliance, Compliance Setup Workspace, whitelist management, and Team Workspace flows.
3. Run manual screen-reader checks on the highest-value enterprise journeys (launch, compliance policy, team workspace, subscription/account).
4. Keep contrast/focus regressions blocked in CI and extend the shell-level keyboard evidence whenever shared navigation semantics change.

**Acceptance Criteria:**
- Automated accessibility checks run in CI for the highest-value routes and stay green on `main`.
- Keyboard-only navigation is proven across the shared shell and critical routes.
- Contrast-sensitive UI and status/error patterns are validated, not assumed.
- Screen-reader review covers at least the four highest-value enterprise flows.

**Estimated Effort:** 12-20 hours for the current contrast/screen-reader sign-off gap, plus ongoing maintenance

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
1. 🔴 **Fix the current accessibility regression on `main`** - Resolve the compliance policy dashboard contrast failure and restore a green permissive Playwright run
2. 🔴 **Configure and pass the strict backend sign-off lane** - Provide protected backend credentials/environment and obtain the first green artifact-backed run on `main`
3. 🔴 **Promote strict sign-off to a real release gate** - Treat the workflow result as required evidence for MVP/business-owner sign-off

**Phase 2 (Post-MVP Hardening - Weeks 3-6):**
4. 🟡 **Add human-reviewed accessibility evidence** - Pair the new automated axe/contrast proof with explicit screen-reader review notes for procurement-sensitive flows
5. 🟡 **Reduce permissive Playwright patterns** - Restrict broad `suppressBrowserErrors()`, reduce `withAuth()` dependence, and keep blocker-adjacent suites closer to production reality
6. 🟡 **Clean up hotspot test debt** - Remove low-signal assertions and `waitForTimeout()` hotspots, starting with ARC76, guided-launch, and older accessibility suites

**Phase 3 (Commercial Maturity - Q2 2026):**
7. 🟡 **Maintain shell parity as enterprise routes grow** - Extend PR **#618** coverage whenever navigation groups, destinations, or shell widgets change
8. 🟡 **Backend-backed compliance/team operations** - Replace remaining mock-only compliance/team workflow data with production-grade integrations and sign-off evidence

---

### Success Metrics

**Accessibility:**
- Automated WCAG / contrast evidence on critical routes: **Green in the current permissive CI lane for enterprise journeys; target is to keep it green on every `main` push**
- Screen-reader and keyboard validation on highest-value flows: **Keyboard shell proof automated; screen-reader sign-off evidence now exists for enterprise journeys, but it still needs active refresh as product surfaces evolve**

**Navigation:**
- Primary navigation complexity: **9-item / inconsistent mental model → 7 shared top-level destinations in code**
- Mobile feature access proof: **Assumed parity → Demonstrated parity in real mobile viewport tests on `main`**
- Task completion time: Baseline → -20%

**Error UX:**
- Support tickets (error-related): Baseline → -30%
- User satisfaction (error scenarios): Baseline → +40%

**Code Quality:**
- Playwright skip calls (`test.skip` + `test.describe.skip`): **43 currently remain** in the `e2e/` corpus; target stays **0 in blocker-facing suites**
- Broad Playwright error-suppression references: **59 files currently**
- Playwright auth split: **41 files with `withAuth()`** vs **12 files with `loginWithCredentials()`** vs **2 files with `loginWithCredentialsStrict()`**
- Legacy route debt: direct `goto('/create/wizard')` now appears in only **1 spec file**, the dedicated redirect-compat suite
- `waitForTimeout` debt: **10 runtime calls remain across 8 spec files**
- Documentation drift: `docs/testing/PLAYWRIGHT_STATUS.md` and `docs/implementations/MVP_SIGNOFF_READINESS_BLOCKER_MAPPING.md` still need refresh before their aggregate metrics should be reused in stakeholder communication

---

**Last Updated:** March 14, 2026 (head `15fdc2a` reality check: roadmap refreshed for PRs **#620**, **#622**, **#624**, **#626**, and **#642**; permissive `Playwright Tests` are green again on current `main`, but strict-backend proof is still blocked by missing protected secrets and the public Playwright status docs are now stale)
**Next Review:** March 21, 2026
