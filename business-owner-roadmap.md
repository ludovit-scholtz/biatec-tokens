# Business Owner Roadmap: Biatec Tokens Platform

## Executive Summary

**Business Vision:** Biatec Tokens is a comprehensive tokenization platform specializing in regulated Real-World Asset (RWA) tokens in multichain environment. Our mission is to democratize compliant token issuance while ensuring enterprise-grade security and regulatory compliance.

**Target Audience:** Non-crypto native persons - traditional businesses and enterprises who need regulated token issuance without requiring blockchain or wallet knowledge.

**Authentication Approach:** Email and password authentication only - no wallet connectors anywhere on the web. Token creation and deployment handled entirely by backend services.

**Revenue Model:** Subscription-based SaaS with tiered pricing ($29/month basic, $99/month professional, $299/month enterprise). Target: 1,000 paying customers in Year 1, generating $2.5M ARR.

**Market Opportunity:** $50B+ RWA tokenization market by 2025, with MICA regulation creating demand for compliant platforms. Current competitors lack comprehensive compliance tooling.

**Current Status:** March 26, 2026 reality check: `main` now points to test-only commit `ce40d41c780564b48559897b53accf6d2db5e0a0`, which removed `WhitelistService` unit tests but did not change the core launch blockers. `Playwright Tests` is green on that exact head (**23582789250**), while `Run Tests` (**23582789254**) and `Build and Deploy FE` (**23582789225**) are both red on the same commit because the TypeScript 6 regression is still unresolved in `src/composables/useTokenMetadata.ts` (`Buffer`), `src/stores/auth.ts` (`Buffer`), and `src/utils/backendSignoffConfig.ts` (`process`). The protected `Strict Backend Sign-off Gate` still has not rerun on current `main`; the latest strict artifact remains **23499673360** on older head `d2dbbd285403ab89ff41a7187d6650b77e1a6015` and still reports `mode: "not-configured"` / `is_release_evidence: false` because `SIGNOFF_API_BASE_URL` and `SIGNOFF_TEST_PASSWORD` remain unset. Draft PR **#737** and draft backend PR **scholtz/BiatecTokensApi#614** remain the next reporting / audit-export milestones, but business-owner MVP sign-off is still blocked by protected-environment provisioning, stale strict-artifact freshness, the unresolved TypeScript 6 build/type regression, and blocker-facing Playwright suites that still mix permissive auth helpers and fixed polling sleeps outside the canonical strict lane.

---

## Phase 1: MVP Foundation (Q1 2025) - 75% Complete 🟡

### Core Token Creation & Deployment - 67% Complete 🟡

- **Multi-Token Standard Support** (85%): ASA, ARC3, ARC200, ERC20, ERC721 - Support implemented but integration issues persist
- **Backend Token Creation Service** (60%): All token creation and deployment handled by backend - release-truthfulness UX is merged on `main`, the strict sign-off lane now emits auditable artifacts, and standard deployment verification was green before the March 25 TypeScript 6 regression; live protected release evidence still depends on sign-off environment provisioning
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

## Phase 2: Enterprise Compliance (Q2 2025) - 68% Complete 🟡

### Advanced MICA Compliance - 69% Complete 🟡

- **Whitelist Management** (80%): Guided-launch whitelist authoring, policy dashboard review, and standalone compliance setup workspace proof now exist, but backend-backed enforcement evidence still needs release-grade cross-environment validation
- **Jurisdiction Tracking** (62%): Jurisdiction-aware policy modeling, contradiction detection, and operator review UX are implemented in the frontend, with deeper workspace proof now in CI and stronger reporting surfaces on `main`
- **KYC Integration** (56%): The frontend now has a dedicated investor-onboarding workspace plus a role-aware operations cockpit for staged KYC review, queue health, blocker surfacing, SLA-aware handoffs, and approval language for operators, and PR **#735** adds **58** integration tests plus **30** Playwright assertions proving provider-backed lifecycle mapping, fail-closed posture, cross-surface operator navigation, and wallet-free copy against the already wired enterprise surfaces; deployed-provider evidence and release-grade protected sign-off proof are still missing
- **AML Screening** (50%): The onboarding workflow and operations cockpit now surface AML / risk-review stages, aged items, remediation guidance, and degraded-state posture in the frontend, backend `master` includes provider-backed case lifecycle support alongside sanctions / AML orchestration from PR **#610**, and PR **#735** now proves blocked AML states and degraded evidence handling in automated tests; there is still no end-to-end protected evidence showing those checks in the real release sign-off flow
- **Compliance Reporting** (80%): Reporting, saved audience templates, scheduled delivery, approval history, export readiness, regulator-ready audit export packages, release evidence surfaces, and command-center lifecycle states improved materially on `main`; draft PR **#737** extends frontend reporting / audit-export navigation and wiring, while draft backend PR **scholtz/BiatecTokensApi#614** adds the regulator-reporting / audit-export API backbone, but both are still open, and regulator-grade reporting still needs merged frontend delivery, backend promotion, and current protected sign-off evidence

### Enterprise Dashboard - 87% Complete 🟡

- **Compliance Monitoring** (93%): Compliance policy dashboards, evidence views, remediation workflows, approval/readiness panels, reporting workspaces, the investor-onboarding queue, release evidence center, and the role-aware operations cockpit now provide a credible operator-facing governance surface with persona-based queue lenses, clearer next-action handoffs, evidence-linked case drill-down, approval-history context, and guided escalation workflows, and PR **#735** now adds explicit automated operator-journey proof for queue, drill-down, and cross-surface flows; live operational data integration still needs work
- **Risk Assessment** (72%): Policy health summaries, contradiction warnings, onboarding blockers, queue-health signals, remediation rollups, sign-off-readiness posture, risk-report builders, cockpit aging/SLA signals, evidence status groupings, case timelines, and clearer escalation guidance improve operator risk awareness, and PR **#735** now proves blocked/stale provider states are surfaced fail-closed instead of as approval-like readiness; scoring and live backend sourcing remain partial
- **Audit Export** (82%): JSON / text export readiness, approval history, audience-scoped evidence reporting, regulator-ready audit export packaging, and the dedicated release evidence center are now visible product strengths, and backend draft PR **scholtz/BiatecTokensApi#614** shows the API contract is actively being built, but regulator-ready export trust still depends on that backend branch landing plus current strict execution evidence
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

## MVP Blockers Reality Check (March 26, 2026 - current `main` at `ce40d41`)

### Evidence Reviewed

- Current `main` head is test-only commit `ce40d41c780564b48559897b53accf6d2db5e0a0` (`test: remove WhitelistService unit tests`). It advanced after the March 25 docs refresh but did not change the underlying launch blockers.
- Latest `Playwright Tests` on `main` is green on the exact current head (run **23582789250**, `success`).
- Latest `Run Tests` on `main` is failing on the exact current head (run **23582789254**, `failure`).
- Latest `Build and Deploy FE` on `main` is also failing on the exact current head (run **23582789225**, `failure`).
- Both failing workflows still break on the same TypeScript 6 regression: `src/composables/useTokenMetadata.ts` and `src/stores/auth.ts` reference `Buffer`, while `src/utils/backendSignoffConfig.ts` still references `process` without node typings. Local baseline validation on the cloned repository reproduces the same nine `vue-tsc` errors with `npm run build`.
- Latest `Strict Backend Sign-off Gate` is still **23499673360** on older head `d2dbbd285403ab89ff41a7187d6650b77e1a6015`, not current `ce40d41`, and its uploaded artifact still reports `status: "not_configured"`, `mode: "not-configured"`, and `is_release_evidence: false`.
- The strict lane did not refresh after the docs-only commits or the current test-only commit because `strict-signoff.yml` only reruns on a narrowed path set; the newest protected artifact therefore does not prove current-head release readiness.
- Issue **#734** remains legitimately closed by merged PR **#735**, and backend issue **scholtz/BiatecTokensApi#609** remains closed by merged API PR **#610**. Provider-backed KYC/AML enterprise onboarding evidence is materially stronger than it was a week ago.
- Draft frontend PR **#737** and draft backend PR **scholtz/BiatecTokensApi#614** are still open reporting / audit-export milestones, so that business capability is still in-flight rather than shipped.
- Static review of the current Playwright corpus shows the most valuable blocker-facing strengths still exist (`e2e/kyc-aml-operator-journey.spec.ts`, `e2e/compliance-reporting-workspace.spec.ts`, `e2e/release-evidence-center.spec.ts`, `e2e/wizard-redirect-compat.spec.ts`), but the suite posture is not as strict as some docs claim: `e2e/mvp-backend-signoff.spec.ts` still has **13** guarded `test.skip()` calls in unconfigured environments and one real `await page.waitForTimeout(5000)` poll, `e2e/backend-deployment-contract.spec.ts` strict polling still uses `waitForTimeout`, `e2e/mvp-signoff-readiness.spec.ts` still seeds authenticated flows with `withAuth()`, and `e2e/mvp-stabilization.spec.ts` still mixes `withAuth()` and `loginWithCredentials()`.
- `docs/testing/PLAYWRIGHT_STATUS.md`, `docs/implementations/MVP_SIGNOFF_READINESS_BLOCKER_MAPPING.md`, and parts of `e2e/README.md` now trail reality: they predate current head `ce40d41`, still cite March 21-25 run IDs as current, and claim zero `waitForTimeout()` in sign-off-critical specs even though the strict deployment/auth suites still poll with fixed sleeps.

### Blocker Validation Status

- 🟡 **Backend-confirmed strict-release blocker remains open:** there is still no backend-confirmed release proof for business-owner sign-off, and the latest strict artifact both reports `not_configured` / `is_release_evidence:false` and trails current `main` by multiple commits.
- 🔴 **Current-head CI/build health blocker remains open:** `Run Tests` and `Build and Deploy FE` are both red on `ce40d41` because the TypeScript 6 `Buffer` / `process` typing regression is still unresolved.
- ✅ **Standard Playwright lane remains green on current head:** the permissive Playwright workflow is green on `ce40d41`, so the browser-level regression picture is still better than the build/typecheck picture.
- ✅ **Enterprise onboarding realism blocker is materially improved:** PR **#735** still closes the frontend side of provider-backed KYC/AML lifecycle evidence, and backend PR **#610** keeps the corresponding API milestone closed.
- 🟡 **Blocker-suite helper discipline is only partially compliant:** `mvp-signoff-readiness.spec.ts` still uses `withAuth()` for authenticated flows, and `mvp-stabilization.spec.ts` still mixes seeded auth with backend-attempted auth, so some blocker-facing paths remain softer than the stated `loginWithCredentials()` standard.
- 🟡 **Semantic-waits-only standard is not fully met:** both `mvp-backend-signoff.spec.ts` and the strict lane inside `backend-deployment-contract.spec.ts` still use fixed polling sleeps instead of a semantic retry helper.
- 🟡 **Current-head strict freshness is open:** the protected strict lane has not produced an artifact on `ce40d41`, so the newest strict provenance still points to `d2dbbd2`.
- 🟡 **Stakeholder-document freshness is open again:** the roadmap is being refreshed now, but `PLAYWRIGHT_STATUS.md`, the blocker-mapping doc, and parts of `e2e/README.md` are still stale or overstated relative to the current suite posture.
- ✅ **Legacy `/create/wizard` blocker remains contained on `main`:** direct `goto('/create/wizard')` usage is still isolated to `e2e/wizard-redirect-compat.spec.ts`.
- ✅ **Accessibility-evidence blocker remains closed in code and CI:** shared-shell, procurement, and screen-reader evidence remain present and green, though they still require ongoing refresh as the product evolves.

### Playwright Compliance vs MVP Blockers

**Status:** 🟡 **Partially compliant for MVP blocker confidence, but still not compliant with final business-owner sign-off requirements**

Current Playwright coverage still proves a large share of the code-level MVP story: the app remains wallet-free in the standard user journey, auth-first routing and legacy-route containment still have explicit test coverage, the Release Evidence Center still behaves fail-closed after PR **#733**, and the provider-backed onboarding/operator-journey milestone from PR **#735** is still represented by automated frontend evidence. The standard Playwright workflow is also green on current head `ce40d41`, which is meaningful because it shows the most visible browser journeys have not regressed even while build/type validation is failing. However, the Playwright portfolio does **not** yet satisfy the full MVP blocker bar for release sign-off because (1) the latest strict artifact is still `not_configured` and not current-head evidence, (2) blocker-facing authenticated suites still rely partly on seeded auth helpers instead of backend-attempted auth, (3) the two strict deployment/auth suites still contain fixed polling sleeps, and (4) the broader corpus still carries substantial permissive debt (**43** skip calls across **22** spec files, **259** broad `suppressBrowserErrors()` references across **65** spec files, **16** actual `await page.waitForTimeout(...)` calls across **11** spec files, and a helper split of **46** `withAuth()` files vs **20** `loginWithCredentials()` files vs **3** `loginWithCredentialsStrict()` files). In short: Playwright is good enough to support roadmap confidence and to keep the wallet-free UX blockers mostly closed, but it is still not the final, release-grade proof required for business-owner MVP sign-off.

### Required Playwright Improvements Before MVP Sign-off

1. Fix the current TypeScript 6 regression so the release head regains green `Run Tests` (**23582789254**) and `Build and Deploy FE` (**23582789225**) evidence alongside green Playwright results.
2. Configure `SIGNOFF_API_BASE_URL`, `SIGNOFF_TEST_PASSWORD`, and (if needed) `SIGNOFF_TEST_EMAIL` in the `sign-off-protected` GitHub Environment, then run the strict lane on the actual release head (`ce40d41` or its successor) until it produces `is_release_evidence:true`.
3. Broaden the strict-lane freshness policy: either expand `strict-signoff.yml` `push.paths` coverage or require a documented post-merge `workflow_dispatch` whenever release-critical auth, onboarding, evidence, or test posture changes, so strict artifacts never trail the head being signed off.
4. Remove the remaining polling sleeps from `e2e/mvp-backend-signoff.spec.ts` and the strict lane inside `e2e/backend-deployment-contract.spec.ts`, replacing them with a semantic polling/retry helper that matches the documented blocker-suite standard.
5. Move blocker-facing authenticated happy-path assertions in `e2e/mvp-signoff-readiness.spec.ts` and the remaining seeded-auth paths in `e2e/mvp-stabilization.spec.ts` to `loginWithCredentials()`, or explicitly document why any surviving `withAuth()` usage is acceptable for blocker evidence.
6. Refresh `docs/testing/PLAYWRIGHT_STATUS.md`, `docs/implementations/MVP_SIGNOFF_READINESS_BLOCKER_MAPPING.md`, and `e2e/README.md` so stakeholder-facing guidance matches current run IDs, helper usage, and actual `waitForTimeout()` posture.
7. Preserve the PR **#731** / PR **#735** hardening bar: no skip creep, no broad suppressor re-expansion, and no seeded-only auth regressions in the highest-value enterprise suites.
8. Continue reducing permissive debt in the wider E2E corpus, prioritizing release-critical and enterprise-facing suites before lower-signal smoke journeys.

### Priority Action Items

- **URGENT:** Fix the TypeScript 6 regression on `main` so `Run Tests` (**23582789254**) and `Build and Deploy FE` (**23582789225**) return to green on current head `ce40d41`; the concrete offenders remain `Buffer` usage in `src/composables/useTokenMetadata.ts` / `src/stores/auth.ts` and `process` usage in `src/utils/backendSignoffConfig.ts`.
- **URGENT:** Provision the `sign-off-protected` environment and obtain the first `is_release_evidence:true` artifact-backed strict real-backend run on current `main`.
- **HIGH:** Trigger or require a current-head strict run for `ce40d41` (or the next release candidate) so the protected artifact no longer trails the head the business is evaluating.
- **HIGH:** Remove the remaining strict-lane `waitForTimeout()` polling in `mvp-backend-signoff.spec.ts` and `backend-deployment-contract.spec.ts`.
- **HIGH:** Convert blocker-facing seeded-auth usage in `mvp-signoff-readiness.spec.ts` and the remaining seeded paths in `mvp-stabilization.spec.ts` to `loginWithCredentials()` or explicitly downgrade those assertions from blocker-grade evidence.
- **HIGH:** Refresh `docs/testing/PLAYWRIGHT_STATUS.md`, `docs/implementations/MVP_SIGNOFF_READINESS_BLOCKER_MAPPING.md`, and `e2e/README.md` so they stop overstating current strict-suite posture and run freshness.
- **MEDIUM:** Merge and independently validate the regulator-ready reporting / audit-export milestone across frontend PR **#737** and backend PR **scholtz/BiatecTokensApi#614**; do not count it as shipped until both sides have landed with standard CI and current-head evidence.
- **MEDIUM:** Continue reducing broad suppressors, skip guards, and seeded-auth shortcuts in the rest of the E2E corpus.
- **MEDIUM:** Keep provider-backed onboarding proof, accessibility evidence, and release-evidence truthfulness current as compliance/reporting surfaces keep evolving.

### Roadmap Adjustment

- **Hold MVP Foundation at 75% for feature completeness, but treat release readiness as still blocked:** current `main` only has green Playwright evidence; both `Run Tests` and `Build and Deploy FE` are red on `ce40d41`, and there is still no backend-confirmed `is_release_evidence:true` artifact on the head being signed off.
- **Treat issue #734 / PR #735 as a closed enterprise-onboarding evidence milestone, not as sign-off proof:** the biggest remaining gaps are current-head CI/build recovery, strict-environment provisioning, and stricter blocker-suite discipline.
- **Re-open current-head strict freshness and stakeholder-doc drift as active maintenance risks:** the roadmap is current again after this update, but `PLAYWRIGHT_STATUS.md`, the blocker-mapping doc, and parts of `e2e/README.md` should not be treated as authoritative until refreshed.
- **Treat blocker-facing seeded-auth usage and fixed polling sleeps as quality debt, not invisible implementation details:** they do not erase current value, but they do keep the suite short of the business-owner release bar.
- **Keep PR #731 and PR #735 hardening as the baseline for commercially credible E2E evidence:** the six enterprise suites plus the KYC/AML operator-journey suite now define the minimum acceptable quality bar for supporting Playwright proof.
- **Treat draft PR #737 and backend draft PR scholtz/BiatecTokensApi#614 as in-flight roadmap progress, not shipped product:** together they strengthen the reporting / audit-export milestone, but they do not count toward business-owner sign-off until both merge and are backed by current-head CI and protected release evidence.
- **Use backend PR #610 plus frontend issue #734 / PR #735 as enterprise-compliance inputs, not as proof by themselves:** provider-backed lifecycle APIs and their frontend evidence improve the roadmap, but they do not count as business-owner sign-off until exercised through protected release evidence.

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
- Playwright auth split: **46 files with `withAuth()`** vs **20 files with `loginWithCredentials()`** vs **3 files with `loginWithCredentialsStrict()`**
- Legacy route debt: direct `goto('/create/wizard')` still appears in only **1 spec file**, the dedicated redirect-compat suite
- `waitForTimeout` debt: **16 actual `await page.waitForTimeout(...)` calls remain across 11 spec files**, and two of those calls are still inside the strict deployment/auth suites that matter most for sign-off quality
- Documentation drift: the roadmap is current again, but `PLAYWRIGHT_STATUS.md`, `MVP_SIGNOFF_READINESS_BLOCKER_MAPPING.md`, and parts of `e2e/README.md` still do not match the March 26 `main` head `ce40d41`; the newest strict artifact remains run **23499673360** on `d2dbbd2` and still reports `not-configured`

---

**Last Updated:** March 26, 2026 (reality check for current `main` head `ce40d41`; `Playwright Tests` **23582789250** is green on that exact commit, while `Run Tests` **23582789254** and `Build and Deploy FE` **23582789225** are both red because the TypeScript 6 upgrade still leaves unresolved `Buffer` / `process` typing errors in `src/composables/useTokenMetadata.ts`, `src/stores/auth.ts`, and `src/utils/backendSignoffConfig.ts`; the latest `Strict Backend Sign-off Gate` is still **23499673360** on older head `d2dbbd2` and still reports `mode: "not-configured"` / `is_release_evidence:false` because `SIGNOFF_API_BASE_URL` / `SIGNOFF_TEST_PASSWORD` are not set; issue **#734** remains closed by merged PR **#735**, backend issue **scholtz/BiatecTokensApi#609** remains closed by merged PR **#610**, and draft frontend PR **#737** plus draft backend PR **scholtz/BiatecTokensApi#614** remain in-flight reporting / audit-export milestones rather than shipped evidence; the remaining business-owner blockers are still current-head strict release proof, current-head CI/build recovery, blocker-suite helper discipline, and stale stakeholder-facing Playwright documentation)
**Next Review:** April 2, 2026
