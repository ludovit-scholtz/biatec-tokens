# Business Owner Roadmap: Biatec Tokens Platform

## Executive Summary

**Business Vision:** Biatec Tokens is a comprehensive tokenization platform specializing in regulated Real-World Asset (RWA) tokens in multichain environment. Our mission is to democratize compliant token issuance while ensuring enterprise-grade security and regulatory compliance.

**Target Audience:** Non-crypto native persons - traditional businesses and enterprises who need regulated token issuance without requiring blockchain or wallet knowledge.

**Authentication Approach:** Email and password authentication only - no wallet connectors anywhere on the web. Token creation and deployment handled entirely by backend services.

**Revenue Model:** Subscription-based SaaS with tiered pricing ($29/month basic, $99/month professional, $299/month enterprise). Target: 1,000 paying customers in Year 1, generating $2.5M ARR.

**Market Opportunity:** $50B+ RWA tokenization market by 2025, with MICA regulation creating demand for compliant platforms. Current competitors lack comprehensive compliance tooling.

**Current Status:** March 23, 2026 reality check: frontend `main` now points to product-bearing commit `efbafa22e2108a24b7f34b28e3a60c994fa13d7e`, which merged PR **#733** and closed issue **#732** by wiring fail-closed strict-artifact classification into the Release Evidence Center. `Run Tests` (**23435862678**), `Playwright Tests` (**23435862685**), and `Build and Deploy FE` (**23435862669**) are all green on that exact head, so the latest roadmap state is backed by current application-bearing CI rather than a docs-only refresh. The protected `Strict Backend Sign-off Gate` also runs successfully on the same head (**23435862695**) and uploads artifact `strict-signoff-report-23435862695`, but the artifact still says `mode: "not-configured"` / `is_release_evidence: false` because `SIGNOFF_API_BASE_URL` and `SIGNOFF_TEST_PASSWORD` remain unset, so business-owner MVP sign-off is still blocked by protected-environment provisioning rather than by frontend artifact UX. Backend momentum also improved today: API PR **scholtz/BiatecTokensApi#610** merged provider-backed KYC/AML onboarding case lifecycle APIs, which strengthens the enterprise roadmap but has not yet been turned into protected frontend release evidence on `main`.

---

## Phase 1: MVP Foundation (Q1 2025) - 75% Complete 🟡

### Core Token Creation & Deployment - 67% Complete 🟡

- **Multi-Token Standard Support** (85%): ASA, ARC3, ARC200, ERC20, ERC721 - Support implemented but integration issues persist
- **Backend Token Creation Service** (60%): All token creation and deployment handled by backend - release-truthfulness UX is merged on `main`, `Build and Deploy FE` is green again, and the strict sign-off lane now emits auditable artifacts, but live protected release evidence still depends on sign-off environment provisioning
- **Multi-Network Deployment** (45%): Algorand Mainnet, Ethereum mainnet (Ethereum, Base, Arbitrum), VOI Testnet, Aramid Testnet - Main chains supported, test networks functional
- **Smart Contract Templates** (75%): 15+ pre-built templates with validation - Templates exist and functional
- **Real-time Deployment Status** (70%): Deployment lifecycle UI now pairs with current-head truthfulness, provenance, and next-action guidance in release-critical views, but protected real-backend evidence is still environment-blocked
- **Batch Deployment** (30%): Multiple tokens in single transaction, basic implementation exists

### Backend Token Creation & Authentication - 66% Complete 🟡

- **Email/Password Authentication** (85%): Secure user authentication without wallet requirements - strict workflow scheduling is fixed, fail-closed auth proof exists, and the permissive lane is green on `main`, but protected real-backend credentials still need provisioning for final business-owner proof
- **Backend Token Deployment** (58%): All token creation handled server-side - canonical strict Playwright coverage and current-head workflow artifacts now exist, but the latest strict artifact is `not-configured`, not final release evidence
- **ARC76 Account Management** (66%): Automatic account derivation from user credentials - deterministic contract behavior is well covered in code, docs, and strict auth helpers, but live protected evidence remains incomplete
- **Transaction Processing** (62%): Backend handles all blockchain interactions - core frontend orchestration and evidence messaging on `main` improved materially, but protected end-to-end deployment proof remains the gating evidence
- **Security & Compliance** (72%): Enterprise-grade security for token operations - fail-closed sign-off posture, evidence truthfulness, and deployment workflow health improved materially, but release governance still awaits one `is_release_evidence:true` artifact

### Basic Compliance Features - 76% Complete 🟡

- **MICA Readiness Check** (88%): Article 17-35 compliance validation - validation implemented and functional, with stronger operator-facing evidence on `main`
- **Basic Attestation System** (65%): Digital signatures for compliance - Partial implementation, needs completion
- **Compliance Badges** (95%): Visual compliance indicators - UI components exist, are now covered by green automated accessibility evidence, and are backed by screen-reader review artifacts
- **Audit Trail Logging** (78%): Basic transaction logging - logging implemented and functional, with evidence-pack workflows improving operator trust

---

## Phase 2: Enterprise Compliance (Q2 2025) - 66% Complete 🟡

### Advanced MICA Compliance - 67% Complete 🟡

- **Whitelist Management** (80%): Guided-launch whitelist authoring, policy dashboard review, and standalone compliance setup workspace proof now exist, but backend-backed enforcement evidence still needs release-grade cross-environment validation
- **Jurisdiction Tracking** (62%): Jurisdiction-aware policy modeling, contradiction detection, and operator review UX are implemented in the frontend, with deeper workspace proof now in CI and stronger reporting surfaces on `main`
- **KYC Integration** (48%): The frontend now has a dedicated investor-onboarding workspace plus a role-aware operations cockpit for staged KYC review, queue health, blocker surfacing, SLA-aware handoffs, and approval language for operators, and backend `master` now includes provider-backed onboarding lifecycle APIs from PR **scholtz/BiatecTokensApi#610**; live-provider journeys and release-grade protected evidence are still missing
- **AML Screening** (43%): The onboarding workflow and operations cockpit now surface AML / risk-review stages, aged items, remediation guidance, and degraded-state posture in the frontend, and backend `master` now includes provider-backed case lifecycle support alongside sanctions / AML orchestration from PR **#610**; there is still no end-to-end protected evidence showing those checks in the real release sign-off flow
- **Compliance Reporting** (80%): Reporting, saved audience templates, scheduled delivery, approval history, export readiness, regulator-ready audit export packages, release evidence surfaces, and command-center lifecycle states improved materially on `main`, though regulator-grade reporting still needs backend promotion and current protected sign-off evidence

### Enterprise Dashboard - 86% Complete 🟡

- **Compliance Monitoring** (92%): Compliance policy dashboards, evidence views, remediation workflows, approval/readiness panels, reporting workspaces, the investor-onboarding queue, release evidence center, and the role-aware operations cockpit now provide a credible operator-facing governance surface with persona-based queue lenses, clearer next-action handoffs, evidence-linked case drill-down, approval-history context, and guided escalation workflows, though live operational data integration still needs work
- **Risk Assessment** (70%): Policy health summaries, contradiction warnings, onboarding blockers, queue-health signals, remediation rollups, sign-off-readiness posture, risk-report builders, cockpit aging/SLA signals, evidence status groupings, case timelines, and clearer escalation guidance improve operator risk awareness, but scoring and live backend sourcing remain partial
- **Audit Export** (82%): JSON / text export readiness, approval history, audience-scoped evidence reporting, regulator-ready audit export packaging, and the dedicated release evidence center are now visible product strengths, but regulator-ready export trust still depends on backend branch promotion and current strict execution evidence
- **Multi-User Access** (80%): Team workspace, reviewer queues, staged approval UX, onboarding queue assignment/priority signals, role-aware workflow handoffs, persona-aware queue views, case drill-down ownership context, guided escalation paths, and backend approval-workflow APIs on `master` materially improve enterprise collaboration, but roles/permissions and deployed-system parity remain immature
- **Custom Reporting** (72%): Reporting workspaces, saved audience templates, scheduled delivery, approval history, audit export packaging, command-center lifecycle states, and the risk-report builder move this from exploratory to commercially meaningful, but configurable enterprise reporting is not yet complete

### Regulatory Integration - 24% Complete 🔴

- **EU MICA Full Compliance** (26%): Compliance signals, reporting command-center surfaces, release-evidence workflows, and operations-cockpit routing are improving, but full regulator-grade operational validation is still incomplete
- **FATF Guidelines** (18%): AML/sanctions orchestration now exists in backend `master`, but deployed-system proof and downstream case-management workflows are still missing
- **SEC Integration** (5%): US securities compliance, not started - Not started
- **Regulatory API** (25%): API surface and compliance evidence services are expanding, and the release evidence center makes that work more usable to operators, but current business-owner proof still depends on backend branch promotion and live-environment validation
- **Compliance Webhooks** (42%): Regulatory / compliance webhook work merged in backend `master`, and the frontend now has clearer workflow handoff surfaces for it, but it is not yet part of a business-owner-verified deployed workflow

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

## MVP Blockers Reality Check (March 23, 2026 - current `main` at `efbafa2`)

### Evidence Reviewed

- Current `main` head is product-bearing commit `efbafa22e2108a24b7f34b28e3a60c994fa13d7e`, which merged PR **#733** and closed issue **#732**.
- Latest `Run Tests` on `main` is green on commit `efbafa2` (run **23435862678**, `success`).
- Latest `Playwright Tests` on `main` is green on the same current head (run **23435862685**, `success`).
- Latest `Build and Deploy FE` evidence is also green on the same current head (run **23435862669**, `success`), so the release-evidence UX change is now backed by current product-bearing deployment proof.
- Latest `Strict Backend Sign-off Gate` run against `main` is **23435862695** (`success`) and uploads artifact `strict-signoff-report-23435862695`, proving the protected workflow, artifact plumbing, and current-head provenance path all work on the shipped frontend.
- The artifact from **23435862695** still says `status: "not_configured"`, `mode: "not-configured"`, and `is_release_evidence: false`; the strict Playwright steps were skipped because `SIGNOFF_API_BASE_URL` and `SIGNOFF_TEST_PASSWORD` are still unset. The blocker is therefore protected-environment provisioning, not workflow execution or frontend artifact consumption.
- PR **#733** materially closes the earlier frontend trust gap: the Release Evidence Center now classifies strict artifacts fail-closed instead of presenting infrastructure-only proof as backend-confirmed readiness.
- PR **#731** remains strategically important because it hardened the six highest-value enterprise suites with backend-backed auth attempts, narrow browser-error suppression, and semantic waits.
- Backend repo `scholtz/BiatecTokensApi` also moved today: PR **#610** / issue **#609** added provider-backed KYC/AML onboarding case lifecycle APIs on `master`, improving enterprise-readiness inputs for the frontend roadmap.
- `docs/testing/PLAYWRIGHT_STATUS.md` and `docs/implementations/MVP_SIGNOFF_READINESS_BLOCKER_MAPPING.md` now trail reality again: they stop before PR **#733**, still describe older run IDs, and overstate blocker closure versus the current strict artifact state.

### Blocker Validation Status

- 🟡 **Backend-confirmed strict-release blocker remains open:** the strict gate now executes cleanly on current `main`, but the artifact still reports `not_configured` / `is_release_evidence:false`, so there is still no backend-confirmed release proof for business-owner sign-off.
- ✅ **Frontend release-evidence truthfulness blocker is closed on current `main`:** PR **#733** merged the fail-closed strict-artifact classification into the Release Evidence Center, so infrastructure-only proof is no longer presented as backend-confirmed readiness.
- ✅ **Backend deployment verification blocker is closed on current head:** `Build and Deploy FE` is green on `efbafa2`, not just on an earlier product commit.
- ✅ **Enterprise-suite realism blocker remains materially improved:** PR **#731** still protects the six highest-value enterprise suites with backend-backed auth attempts, narrow suppression, and semantic waits.
- 🟡 **Mock-environment dependency blocker remains open outside the canonical gate:** the broader corpus still leans on permissive helpers, broad suppression, fixed sleeps, and skip guards in many secondary suites, so ordinary green E2E evidence remains softer than production reality.
- 🟡 **Stakeholder documentation freshness is open again:** the roadmap is being refreshed now, but `PLAYWRIGHT_STATUS.md` and the blocker-mapping doc remain stale relative to current head `efbafa2`.
- ✅ **Legacy `/create/wizard` blocker remains contained on `main`:** direct `goto('/create/wizard')` usage is still isolated to `e2e/wizard-redirect-compat.spec.ts`.
- ✅ **Accessibility-evidence blocker remains closed in code and CI:** shared-shell, procurement, and screen-reader evidence remain present and green, though they still require ongoing refresh as the product evolves.

### Playwright Compliance vs MVP Blockers

**Status:** 🟡 **Mostly compliant for code-level MVP blockers on current `main`, but still not sufficient as final business-owner release evidence**

Current Playwright coverage satisfies the major **frontend/code-level** blocker criteria more honestly than the prior roadmap snapshot: wallet-free auth-first routing is covered, the canonical strict backend-auth / deployment suite remains fail-closed by design, legacy route drift is contained, shell/mobile parity stays proven, accessibility evidence is green, and the Release Evidence Center now consumes strict artifacts conservatively after PR **#733**. However, Playwright still does **not** satisfy the final business-owner blocker because (1) the latest strict artifact on current `main` is still explicitly `mode: "not-configured"` / `is_release_evidence:false`, (2) `e2e/mvp-backend-signoff.spec.ts` still executes only behind `requireStrictBackend()` guardrails and therefore contributes **13** `test.skip()` gates in unconfigured environments, (3) the same strict suite still contains one `waitForTimeout(5000)` polling sleep in its terminal-state loop, and (4) the broader E2E corpus still contains substantial permissive patterns outside the hardened high-value suites (**46** files using `withAuth()`, **259** broad `suppressBrowserErrors()` references, **60** `waitForTimeout()` references, and **43** skip calls in `e2e/`). In other words, the product now tells the truth about strict evidence on current `main`, but the protected backend proof itself still has not happened.

### Required Playwright Improvements Before MVP Sign-off

1. Configure `SIGNOFF_API_BASE_URL` and `SIGNOFF_TEST_PASSWORD` (and confirm `SIGNOFF_TEST_EMAIL`) in the `sign-off-protected` GitHub Environment so the next strict run executes the real backend lane and can produce `is_release_evidence:true`.
2. Trigger a `workflow_dispatch` strict run after secrets are provisioned, download the resulting artifact, and verify `signoff-status.json` flips from infrastructure-only proof to backend-confirmed release evidence on the actual release head being signed off.
3. Make the `Strict Backend Sign-off Gate` a required release / environment-promotion status, not just a workflow that can succeed while reporting `not_configured`.
4. Remove the remaining `waitForTimeout(5000)` polling sleep from `e2e/mvp-backend-signoff.spec.ts` and replace it with a semantic poll or API retry helper so the canonical blocker suite fully matches its own “semantic waits only” contract.
5. Keep `e2e/mvp-backend-signoff.spec.ts` as the canonical blocker suite and do **not** substitute softer supporting suites for the release gate.
6. Preserve the PR **#731** gains: keep the six highest-value enterprise suites on `loginWithCredentials()` + `suppressBrowserErrorsNarrow()` + semantic waits, and reject regressions back to broad suppression, seeded-only auth, or fixed sleeps in those files.
7. Continue shrinking permissive patterns outside the hardened six suites — especially the remaining **46** `withAuth()` files, **259** broad suppression references, **60** `waitForTimeout()` references, and **43** skip calls — so ordinary CI evidence moves closer to production reality.
8. Refresh `docs/testing/PLAYWRIGHT_STATUS.md` and `docs/implementations/MVP_SIGNOFF_READINESS_BLOCKER_MAPPING.md` so stakeholder-facing evidence reflects PR **#733**, current run IDs, and the still-open protected-environment blocker.
9. Add one explicit always-on assertion path for the unconfigured strict lane (for example, artifact or UI-level verification) so ordinary CI proves fail-closed blocked-state messaging without relying only on workflow metadata.

### Priority Action Items

- **URGENT:** Provision the `sign-off-protected` environment and obtain the first `is_release_evidence:true` artifact-backed strict real-backend run on current `main`.
- **HIGH:** Refresh `docs/testing/PLAYWRIGHT_STATUS.md` and `docs/implementations/MVP_SIGNOFF_READINESS_BLOCKER_MAPPING.md` to current-head evidence (`efbafa2`: runs **23435862678** / **23435862685** / **23435862669** / **23435862695**).
- **HIGH:** Remove the last `waitForTimeout()` from `e2e/mvp-backend-signoff.spec.ts` so the canonical release-gate spec fully matches the documented semantic-waits standard.
- **HIGH:** Preserve PR **#731** hardening as the minimum quality bar for the six highest-value enterprise suites; do not allow broad suppression, fixed sleeps, or seeded-only auth to re-enter those paths.
- **MEDIUM:** Continue reducing permissive auth helpers, broad suppression, fixed sleeps, and skip guards in the rest of the E2E corpus.
- **MEDIUM:** Wire the newly merged backend provider-lifecycle APIs into frontend onboarding / operations flows and then prove them through protected sign-off evidence.
- **MEDIUM:** Keep accessibility and screen-reader evidence current as compliance, release-evidence, reporting, and onboarding surfaces continue to evolve.

### Roadmap Adjustment

- **Hold MVP Foundation at 75% for now:** current `main` is green in `Run Tests`, `Playwright Tests`, `Build and Deploy FE`, and the strict-gate workflow itself, but there is still no backend-confirmed `is_release_evidence:true` artifact on current head.
- **Treat issue #732 / PR #733 as closed and environment provisioning as the active frontend trust milestone:** the next material gap is no longer fail-closed artifact classification in the UI; it is protected-environment proof plus current stakeholder-doc refresh.
- **Re-open documentation drift as an active maintenance risk:** the roadmap is current again after this update, but `PLAYWRIGHT_STATUS.md` and the blocker-mapping doc should not be treated as authoritative until refreshed.
- **Keep PR #731 hardening as the baseline for commercially credible E2E evidence:** the six enterprise suites now define the minimum acceptable standard for supporting Playwright proof.
- **Use backend PR #610 as the next enterprise-compliance input, not as proof by itself:** provider-backed KYC/AML lifecycle APIs improve the roadmap, but they do not count as business-owner sign-off until surfaced in frontend UX and exercised through protected release evidence.

---

## UX/Design Improvement Roadmap (Added February 18, 2026)

### Critical UX/Design Issues Identified 🟡

Based on comprehensive product review including source code analysis, E2E test coverage review, and component structure assessment, the following design and UX issues require immediate attention:

#### 1. **Accessibility Evidence Maintenance & Trust Hardening** 🟡 **PRIORITY: MEDIUM**

**Issue:** Accessibility proof is now materially stronger and green on `main`, but it has shifted from a blocker-remediation problem to a release-governance and maintenance problem. The business now has automated and manual evidence; the remaining risk is keeping it current while the strict backend sign-off lane still lacks backend-confirmed release evidence because the protected environment is not yet configured.

**Evidence:**
- PRs **#632**, **#634**, **#636**, **#638**, and **#640** ship green axe/contrast verification, dedicated screen-reader preservation tests, and explicit manual-review artifacts.
- `e2e/accessibility-enterprise-journeys.spec.ts`, `e2e/procurement-accessibility-evidence.spec.ts`, and `e2e/screen-reader-review-evidence.spec.ts` now provide automated evidence for the highest-value enterprise journeys.
- `docs/accessibility/SCREEN_READER_REVIEW_ARTIFACT.md` and `docs/accessibility/SCREEN_READER_RELEASE_EVIDENCE.md` now provide the business-owned manual-review layer that was missing in the earlier roadmap.
- `e2e/mobile-first-shell-parity.spec.ts` still provides explicit keyboard-only and mobile-shell evidence for sign-in, navigation, Guided Launch, Compliance, Team Workspace, Operations, and Settings.

**Business Impact:** 
- Procurement and regulatory trust are materially stronger because accessibility claims are now backed by both automation and human review.
- The remaining business risk is credibility drift if these artifacts are not kept current when compliance, team, and evidence-pack surfaces change.
- Sustained evidence quality supports enterprise sales, trials, and internal customer approvals for higher subscription tiers.

**Required Actions:**
1. Keep automated axe/contrast verification green in CI for the home page, Guided Launch, Compliance, Compliance Setup Workspace, whitelist management, Team Workspace, and new evidence-pack surfaces.
2. Update the screen-reader review artifact whenever a covered journey changes materially.
3. Keep contrast/focus regressions blocked in CI and extend the shell-level keyboard evidence whenever shared navigation semantics change.
4. Tie accessibility evidence updates to release sign-off so procurement-facing proof stays current.

**Acceptance Criteria:**
- Automated accessibility checks run in CI for the highest-value routes and stay green on `main`.
- Keyboard-only navigation is proven across the shared shell and critical routes.
- Contrast-sensitive UI and status/error patterns are validated, not assumed.
- Screen-reader review artifacts stay current for the highest-value enterprise flows.

**Estimated Effort:** 4-8 hours per release cycle for evidence refresh and maintenance

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

**Issue:** 42 views detected, with more overlap risk now that onboarding, evidence, reporting, and cockpit surfaces have expanded rapidly.

**Evidence:**
- `src/views/` contains **42** view files
- Multiple similar flows: GuidedTokenLaunch.vue, TokenCreationWizard.vue, TokenCreator.vue
- Unclear which flow is recommended for different user types
- Increases maintenance burden and testing surface

**Business Impact:**
- Confuses users about which flow to use
- Increased development and QA costs
- Risk of feature drift between duplicate flows
- Harder to measure conversion metrics (split across flows)

**Required Actions:**
1. Map all 42 views to user journeys
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
1. 🔴 **Configure and pass the strict backend sign-off lane** - Provision protected-environment secrets, execute the real backend Playwright lane, and obtain the first green `is_release_evidence:true` artifact on the actual release candidate / current `main` head
2. 🔴 **Promote strict sign-off to a real release gate** - Treat the workflow result as required evidence for MVP / business-owner sign-off
3. 🟡 **Keep strict-evidence UX and docs aligned** - Preserve the merged PR **#733** fail-closed artifact panel, and refresh operator-facing documentation whenever strict workflow behavior or artifact semantics change

**Phase 2 (Post-MVP Hardening - Weeks 3-6):**
4. 🟡 **Maintain human-reviewed accessibility evidence** - Keep the new screen-reader and procurement artifacts current for procurement-sensitive flows
5. 🟡 **Reduce permissive Playwright patterns** - Restrict broad `suppressBrowserErrors()`, reduce `withAuth()` dependence, and keep blocker-adjacent suites closer to production reality
6. 🟡 **Productize the operations cockpit with live case-management parity** - Extend the shipped role-aware cockpit with deployed backend data, workflow handoffs, and case-management parity so upstream operations match downstream governance surfaces

**Phase 3 (Commercial Maturity - Q2 2026):**
7. 🟡 **Maintain shell parity as enterprise routes grow** - Extend PR **#618** coverage whenever navigation groups, destinations, or shell widgets change
8. 🟡 **Backend-backed compliance/team operations** - Replace remaining mock-only compliance/team workflow data with production-grade integrations and sign-off evidence

---

### Success Metrics

**Accessibility:**
- Automated WCAG / contrast evidence on critical routes: **Green on `main` in the permissive Playwright lane, including compliance policy, compliance setup, whitelist, team workspace, and shared shell routes**
- Screen-reader and keyboard validation on highest-value flows: **Keyboard shell proof automated and screen-reader review now documented with release evidence artifacts; both need active refresh as product surfaces evolve**

**Navigation:**
- Primary navigation complexity: **9-item / inconsistent mental model → 7 shared top-level destinations in code**
- Mobile feature access proof: **Assumed parity → Demonstrated parity in real mobile viewport tests on `main`**
- Task completion time: Baseline → -20%

**Error UX:**
- Support tickets (error-related): Baseline → -30%
- User satisfaction (error scenarios): Baseline → +40%

**Code Quality:**
- Playwright skip calls (`test.skip` + `test.describe.skip`): **43 currently remain across 22 spec files** in the `e2e/` corpus; target stays **0 in blocker-facing suites**
- Broad Playwright error-suppression references: **259 references across 65 spec files currently**
- Playwright auth split: **46 files with `withAuth()`** vs **19 files with `loginWithCredentials()`** vs **3 files with `loginWithCredentialsStrict()`**
- Legacy route debt: direct `goto('/create/wizard')` now appears in only **1 spec file**, the dedicated redirect-compat suite
- `waitForTimeout` debt: **60 references remain across 41 spec files**, so timeout cleanup should stay focused on blocker-adjacent suites first
- Documentation drift: the roadmap is current again, but `PLAYWRIGHT_STATUS.md` and the blocker-mapping doc still do not match the current `main` head after PR **#733** and strict run **23435862695**

---

**Last Updated:** March 23, 2026 (reality check for current head `efbafa2`; `Run Tests` **23435862678**, `Playwright Tests` **23435862685**, and `Build and Deploy FE` **23435862669** are green on `main`; `Strict Backend Sign-off Gate` **23435862695** now also succeeds on the same head and uploads artifact `strict-signoff-report-23435862695`, but that artifact still reports `mode: "not-configured"` / `is_release_evidence:false` because `SIGNOFF_API_BASE_URL` / `SIGNOFF_TEST_PASSWORD` are not set; issue **#732** is closed by merged PR **#733**; backend issue **scholtz/BiatecTokensApi#609** is closed by merged PR **#610** on API `master`; and the remaining business-owner blocker is still the absence of one backend-confirmed strict release artifact on current `main`)
**Next Review:** March 29, 2026
