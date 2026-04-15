# Business Owner Roadmap: Biatec Tokens Platform

## Executive Summary

**Business Vision:** Biatec Tokens is a comprehensive tokenization platform specializing in regulated Real-World Asset (RWA) tokens in multichain environment. Our mission is to democratize compliant token issuance while ensuring enterprise-grade security and regulatory compliance.

**Target Audience:** Non-crypto native persons - traditional businesses and enterprises who need regulated token issuance without requiring blockchain or wallet knowledge.

**Authentication Approach:** Email and password authentication only - no wallet connectors anywhere on the web. Token creation and deployment handled entirely by backend services.

**Revenue Model:** Subscription-based SaaS with tiered pricing ($29/month basic, $99/month professional, $299/month enterprise). Target: 1,000 paying customers in Year 1, generating $2.5M ARR.

**Market Opportunity:** $50B+ RWA tokenization market by 2025, with MICA regulation creating demand for compliant platforms. Current competitors lack comprehensive compliance tooling.

**Current Status:** April 15, 2026 reality check: the accessible working copy of `main` and `origin/main` now both point to commit `97158ced2dd051185e573c0ef27aa03ce70ed54d` (`docs: update business roadmap reality check`) in `ludovit-scholtz/biatec-tokens`. GitHub metadata is richer than in the earlier roadmap snapshots: the maintained fork still reports `isFork: true`, `hasIssuesEnabled: true`, and now shows active workflow definitions for Build / Run Tests / Playwright / Strict Backend Sign-off plus recent successful `Copilot cloud agent` runs; however, `gh run list --workflow` still returns empty arrays for the product-validation workflows themselves, `gh pr list --state merged` / `gh issue list --state closed` still return empty arrays, and the fork currently reports only **2** open issues. Local validation is therefore still the authoritative product signal available here: `npm ci` and `npm run build` succeed on `97158ce`, `npm test` is almost green but still has 1 timeout failure in `src/__tests__/integration/ScreenReaderSignOffEvidence.integration.test.ts`, and representative Playwright blocker suites (`e2e/mvp-signoff-readiness.spec.ts`, `e2e/mvp-backend-signoff.spec.ts`) still fail to start locally because Playwright's `webServer` launches Vite in watch mode and hits `EMFILE` watcher limits. The remaining business-owner MVP blockers are fresh executable sign-off evidence on the current release head, protected-environment provisioning, residual Playwright blocker-suite rigor, local Playwright reproducibility, route-contract/document truthfulness, and stabilization of the lingering screen-reader sign-off timeout.

---

## Phase 1: MVP Foundation (Q1 2025) - 80% Feature Complete / 40% Sign-off-Evidence Complete 🟡

### Core Token Creation & Deployment - 70% Complete 🟡

- **Multi-Token Standard Support** (85%): ASA, ARC3, ARC200, ERC20, ERC721 - Support implemented but integration issues persist
- **Backend Token Creation Service** (60%): All token creation and deployment handled by backend - release-truthfulness UX is merged on `main`, the strict sign-off lane now emits auditable artifacts, and standard deployment verification was green before the March 25 TypeScript 6 regression; live protected release evidence still depends on sign-off environment provisioning
- **Multi-Network Deployment** (45%): Algorand Mainnet, Ethereum mainnet (Ethereum, Base, Arbitrum), VOI Testnet, Aramid Testnet - Main chains supported, test networks functional
- **Smart Contract Templates** (75%): 15+ pre-built templates with validation - Templates exist and functional
- **Real-time Deployment Status** (70%): Deployment lifecycle UI now pairs with current-head truthfulness, provenance, and next-action guidance in release-critical views, but protected real-backend evidence is still environment-blocked
- **Batch Deployment** (30%): Multiple tokens in single transaction, basic implementation exists

### Backend Token Creation & Authentication - 72% Complete 🟡

- **Email/Password Authentication** (87%): Secure user authentication without wallet requirements - standard CI is green again on current `main`, strict workflow plumbing is healthy, and fail-closed auth proof exists, but protected real-backend credentials still need provisioning for final business-owner proof
- **Backend Token Deployment** (68%): All token creation handled server-side - canonical strict Playwright coverage, current-head workflow artifacts, and green build/test signals now exist, but the newest strict artifact is still `not_configured`, not final release evidence
- **ARC76 Account Management** (72%): Automatic account derivation from user credentials - deterministic contract behavior is well covered in code, tests, and auth helpers, but live protected evidence remains incomplete
- **Transaction Processing** (66%): Backend handles all blockchain interactions - frontend orchestration and evidence messaging on `main` improved materially, but protected end-to-end deployment proof remains the gating evidence
- **Security & Compliance** (76%): Enterprise-grade security for token operations - fail-closed sign-off posture, evidence truthfulness, and deployment workflow health improved materially, but release governance still awaits one `is_release_evidence:true` artifact

### Basic Compliance Features - 76% Complete 🟡

- **MICA Readiness Check** (88%): Article 17-35 compliance validation - validation implemented and functional, with stronger operator-facing evidence on `main`
- **Basic Attestation System** (65%): Digital signatures for compliance - Partial implementation, needs completion
- **Compliance Badges** (95%): Visual compliance indicators - UI components exist, are now covered by green automated accessibility evidence, and are backed by screen-reader review artifacts
- **Audit Trail Logging** (78%): Basic transaction logging - logging implemented and functional, with evidence-pack workflows improving operator trust

---

## Phase 2: Enterprise Compliance (Q2 2025) - 76% Complete 🟡

### Advanced MICA Compliance - 75% Complete 🟡

- **Whitelist Management** (80%): Guided-launch whitelist authoring, policy dashboard review, and standalone compliance setup workspace proof now exist, but backend-backed enforcement evidence still needs release-grade cross-environment validation
- **Jurisdiction Tracking** (62%): Jurisdiction-aware policy modeling, contradiction detection, and operator review UX are implemented in the frontend, with deeper workspace proof now in CI and stronger reporting surfaces on `main`
- **KYC Integration** (56%): The frontend now has a dedicated investor-onboarding workspace plus a role-aware operations cockpit for staged KYC review, queue health, blocker surfacing, SLA-aware handoffs, and approval language for operators, and PR **#735** adds **58** integration tests plus **30** Playwright assertions proving provider-backed lifecycle mapping, fail-closed posture, cross-surface operator navigation, and wallet-free copy against the already wired enterprise surfaces; deployed-provider evidence and release-grade protected sign-off proof are still missing
- **AML Screening** (50%): The onboarding workflow and operations cockpit now surface AML / risk-review stages, aged items, remediation guidance, and degraded-state posture in the frontend, backend `master` includes provider-backed case lifecycle support alongside sanctions / AML orchestration from PR **#610**, and PR **#735** now proves blocked AML states and degraded evidence handling in automated tests; there is still no end-to-end protected evidence showing those checks in the real release sign-off flow
- **Compliance Reporting** (90%): Reporting, saved audience templates, scheduled delivery, approval history, export readiness, regulator-ready audit export packages, release evidence surfaces, and command-center lifecycle states are now merged on `main` via PR **#737**, and backend reporting / audit-export APIs are merged via **scholtz/BiatecTokensApi#614**; the remaining gap is not feature shipment but protected-environment sign-off evidence and customer-facing operational proof

### Enterprise Dashboard - 90% Complete 🟡

- **Compliance Monitoring** (95%): Compliance policy dashboards, evidence views, remediation workflows, approval/readiness panels, reporting workspaces, the investor-onboarding queue, release evidence center, the role-aware operations cockpit, and the newly shipped notification-center / remediation surfaces now provide a credible operator-facing governance surface with persona-based queue lenses, clearer next-action handoffs, evidence-linked case drill-down, approval-history context, and guided escalation workflows; live operational data integration and protected release evidence still need work.
- **Risk Assessment** (74%): Policy health summaries, contradiction warnings, onboarding blockers, queue-health signals, remediation rollups, sign-off-readiness posture, risk-report builders, cockpit aging/SLA signals, evidence status groupings, case timelines, and clearer escalation guidance improve operator risk awareness, and the shipped notification-center / remediation work makes those signals more actionable; scoring, live backend sourcing, and protected release evidence remain partial.
- **Audit Export** (88%): JSON / text export readiness, approval history, audience-scoped evidence reporting, regulator-ready audit export packaging, and the dedicated release evidence center are now visible product strengths, and backend PR **scholtz/BiatecTokensApi#614** has landed the API backbone; regulator-ready export trust now depends mainly on current strict execution evidence and real operator adoption
- **Multi-User Access** (80%): Team workspace, reviewer queues, staged approval UX, onboarding queue assignment/priority signals, role-aware workflow handoffs, persona-aware queue views, case drill-down ownership context, guided escalation paths, and backend approval-workflow APIs on `master` materially improve enterprise collaboration, but roles/permissions and deployed-system parity remain immature
- **Custom Reporting** (78%): Reporting workspaces, saved audience templates, scheduled delivery, approval history, audit export packaging, command-center lifecycle states, and the risk-report builder now move this from exploratory to commercially meaningful; remaining work is mostly configurability, downstream adoption, and release-grade evidence

### Regulatory Integration - 30% Complete 🔴

- **EU MICA Full Compliance** (26%): Compliance signals, reporting command-center surfaces, release-evidence workflows, and operations-cockpit routing are improving, but full regulator-grade operational validation is still incomplete
- **FATF Guidelines** (18%): AML/sanctions orchestration now exists in backend `master`, but deployed-system proof and downstream case-management workflows are still missing
- **SEC Integration** (5%): US securities compliance, not started - Not started
- **Regulatory API** (34%): API surface and compliance evidence services have advanced materially with merged audit-export / reporting endpoints in backend PR **#614**, and the release evidence center makes that work more usable to operators, but business-owner proof still depends on live-environment validation
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

- **White-label Solution** (35%): Branding workspace and enterprise portal customization UX are now shipped on `main`, but tenant domain configuration, backend parity, and customer rollout tooling remain incomplete
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

## MVP Blockers Reality Check (April 15, 2026 - accessible `main` at `97158ce`)

### Evidence Reviewed

- Accessible `main` in this environment is commit `97158ced2dd051185e573c0ef27aa03ce70ed54d` (`docs: update business roadmap reality check`) in `ludovit-scholtz/biatec-tokens`, and local `HEAD` matches `origin/main`.
- GitHub metadata confirms this repository is still a public fork (`isFork: true`) with issues enabled (`hasIssuesEnabled: true`) and **5** active workflow definitions (`Build and Deploy FE`, `Playwright Tests`, `🔒 Strict Backend Sign-off Gate`, `Run Tests`, `Copilot cloud agent`). The maintained fork now shows **4** recent successful `Copilot cloud agent` runs (`24439517347`, `24433010234`, `24425905441`, `24415719244`), but `gh run list --workflow 'Build and Deploy FE'`, `gh run list --workflow 'Playwright Tests'`, `gh run list --workflow 'Run Tests'`, and `gh run list --workflow '🔒 Strict Backend Sign-off Gate'` all still return empty arrays. `gh pr list --state merged` / `gh issue list --state closed` also still return empty arrays, while the repo currently reports **2** open issues. Older run IDs cited in adjacent docs therefore remain historical context rather than freshly revalidated product evidence for the current head.
- Local validation succeeded for dependency install and build on the actual maintained head: `npm ci` completed successfully, and `npm run build` produced a green production bundle on `97158ce`. The build still emits the known large-chunk warning (`dist/assets/index-DozjBDdL.js` ~2.67 MB) and an ineffective dynamic import warning for `src/stores/subscription.ts`, which are product hardening concerns but not the primary MVP blocker.
- Local unit-test validation is close but not fully green: `npm test` finished with **1** failing test file / **1** failing test (`src/__tests__/integration/ScreenReaderSignOffEvidence.integration.test.ts` timing out in the “single h1 — screen reader announced page identity” case) alongside **478** passing files, **15129** passing tests, and **25** skipped tests.
- Local Playwright execution remains operationally blocked in this container. Running representative blocker suites (`npx playwright test --project=chromium --reporter=line e2e/mvp-signoff-readiness.spec.ts` and `npx playwright test --project=chromium --reporter=line e2e/mvp-backend-signoff.spec.ts`) fails before test execution because the configured Playwright `webServer` starts Vite in watch mode and hits `EMFILE: too many open files, watch '/app/biatec-tokens/vite.config.ts'`.
- Static test inventory still confirms the blocker specs exist even though this container cannot execute them end-to-end: `e2e/mvp-signoff-readiness.spec.ts` currently contains **19** top-level Playwright tests, and `e2e/mvp-stabilization.spec.ts` contains **18** top-level Playwright tests.
- Static review of the current Playwright corpus still shows strong blocker-facing coverage in `e2e/mvp-signoff-readiness.spec.ts`, `e2e/release-evidence-center.spec.ts`, `e2e/compliance-reporting-workspace.spec.ts`, `e2e/kyc-aml-operator-journey.spec.ts`, and `e2e/wizard-redirect-compat.spec.ts`.
- Static review also confirms the remaining blocker-grade debt: `e2e/mvp-backend-signoff.spec.ts` still claims “Zero arbitrary waitForTimeout()” while containing a real `await page.waitForTimeout(5000)` poll plus **13** guarded `test.skip()` calls; the strict lane inside `e2e/backend-deployment-contract.spec.ts` still uses `waitForTimeout(...)`; and `e2e/mvp-stabilization.spec.ts` still mixes **8** `withAuth()` calls with only **3** `loginWithCredentials()` calls.
- Route truthfulness and stakeholder-document freshness are still materially off: `src/constants/navItems.ts` makes `/launch/workspace` the canonical top-level Guided Launch entry, while `e2e/README.md`, `docs/testing/PLAYWRIGHT_STATUS.md`, and `docs/implementations/MVP_SIGNOFF_READINESS_BLOCKER_MAPPING.md` still overstate `/launch/guided` as the canonical top-level route, still claim blocker-grade suites are fully semantic-wait / helper-clean, and still present March `09fe0cf` / `8a73807` workflow evidence as if it were current-head proof.

### Blocker Validation Status

- 🔴 **Fresh executable sign-off evidence is not currently available:** the maintained fork now exposes workflow definitions and recent non-product Copilot runs, but it still has no visible current Build / Run Tests / Playwright / Strict Backend Sign-off runs, and local Playwright execution still fails at `webServer` startup because of `EMFILE`.
- 🔴 **Backend-confirmed strict-release blocker remains open:** there is still no locally revalidated `is_release_evidence:true` artifact for business-owner sign-off, and the older strict-run references in docs must be treated as historical rather than current proof.
- 🟡 **Current-head application health is acceptable but not fully clean:** `npm run build` passes on `97158ce`, but no fresh current-head Playwright run was executable in this environment and the unit-test baseline still has a remaining timeout in `ScreenReaderSignOffEvidence.integration.test.ts`.
- ✅ **Enterprise onboarding, reporting, release-evidence, and accessibility surfaces remain strong in code:** the KYC/AML operator journey, reporting workspace, release-evidence center, and accessibility evidence specs still exist and remain aligned with the wallet-free enterprise story.
- 🟡 **Blocker-suite helper discipline is only partially compliant:** `mvp-stabilization.spec.ts` still mixes seeded auth with backend-attempted auth, so some blocker-facing paths remain softer than the stated `loginWithCredentials()` standard.
- 🟡 **Semantic-waits-only standard is still not met:** `mvp-backend-signoff.spec.ts` and the strict branch of `backend-deployment-contract.spec.ts` still rely on fixed polling sleeps.
- 🔴 **Stakeholder-document freshness is open:** `PLAYWRIGHT_STATUS.md`, `MVP_SIGNOFF_READINESS_BLOCKER_MAPPING.md`, and `e2e/README.md` overstate strict-lane behavior, helper convergence, and the canonical launch-route contract.
- 🔴 **Route-contract truthfulness is open:** source-of-truth navigation points to `/launch/workspace`, while `/launch/guided` is the downstream wizard destination; the docs still blur or invert that distinction.
- 🔴 **Local Playwright reproducibility remains open:** Vite watch-mode startup prevents representative blocker suites from running in this environment.
- ✅ **Legacy `/create/wizard` containment still looks healthy in code:** direct legacy-route navigation remains isolated to `e2e/wizard-redirect-compat.spec.ts`.

### Playwright Compliance vs MVP Blockers

**Status:** 🔴 **Not yet compliant for final MVP sign-off; feature coverage is materially present, but current-head release evidence is still blocked**

Current Playwright coverage still proves a meaningful share of the code-level MVP story through static review: the app remains wallet-free in the primary journeys, auth-first routing and legacy-route containment still have explicit coverage, and the highest-value enterprise surfaces (release evidence, reporting, KYC/AML operations, accessibility evidence) retain dedicated blocker-facing specs. However, the suite is **not** compliant with final business-owner MVP sign-off requirements because the evidence chain is incomplete at multiple levels: (1) this environment cannot produce fresh browser-level proof because Playwright startup still fails with `EMFILE`, (2) the maintained fork now exposes workflow metadata but still does not expose fresh build / Playwright / strict-signoff execution evidence for the current head, (3) `mvp-stabilization.spec.ts` still mixes seeded auth with backend-attempted auth, (4) `mvp-backend-signoff.spec.ts` and `backend-deployment-contract.spec.ts` still contain fixed polling sleeps, (5) `mvp-backend-signoff.spec.ts` still relies on guarded skips when strict prerequisites are absent, and (6) stakeholder-facing docs still overstate strict-lane freshness and the canonical `/launch/workspace` → `/launch/guided` route contract. In short: Playwright remains directionally supportive of MVP blocker confidence, but it is still **not** release-grade proof for business-owner sign-off.

### Required Playwright Improvements Before MVP Sign-off

1. Re-establish trustworthy product-validation evidence for the maintained release head: the fork now exposes workflow metadata, but business owners still need current Build / Run Tests / Playwright / Strict Backend Sign-off runs or an equivalent reviewable evidence channel on the head they actually audit.
2. Configure `SIGNOFF_API_BASE_URL`, `SIGNOFF_TEST_PASSWORD`, and (if needed) `SIGNOFF_TEST_EMAIL` in the real `sign-off-protected` environment, then run the strict lane on the actual maintained release head until it produces `is_release_evidence:true`.
3. Remove the remaining polling sleeps from `e2e/mvp-backend-signoff.spec.ts` and the strict lane inside `e2e/backend-deployment-contract.spec.ts`, replacing them with a semantic polling/retry helper that matches the documented blocker-suite standard.
4. Finish the auth-helper cleanup by moving the remaining blocker-facing seeded-auth assertions in `e2e/mvp-stabilization.spec.ts` to `loginWithCredentials()`, and clearly label any surviving `withAuth()` use as non-blocker evidence.
5. Refresh `docs/testing/PLAYWRIGHT_STATUS.md`, `docs/implementations/MVP_SIGNOFF_READINESS_BLOCKER_MAPPING.md`, and `e2e/README.md` so stakeholder-facing guidance matches the current repo topology, actual helper usage, strict-lane prerequisites, real `waitForTimeout()` posture, and the `/launch/workspace` → `/launch/guided` route split.
6. Add a non-watch startup path (or equivalent Playwright `webServer` override) so representative blocker suites can run locally without Vite exhausting file watchers.
7. Stabilize `src/__tests__/integration/ScreenReaderSignOffEvidence.integration.test.ts` so the local sign-off baseline is fully green again.
8. Preserve the KYC/reporting/release-evidence/accessibility hardening bar while reducing permissive debt in the rest of the E2E corpus.

### Priority Action Items

- **URGENT:** Restore fresh current-head executable evidence for the maintained release branch. Visible workflow metadata is no longer the blocker; missing current product-validation runs and artifacts still are.
- **URGENT:** Provision the real `sign-off-protected` environment and obtain the first locally credible `is_release_evidence:true` artifact-backed strict run on the maintained release head.
- **HIGH:** Remove the remaining strict-lane `waitForTimeout()` polling in `mvp-backend-signoff.spec.ts` and `backend-deployment-contract.spec.ts`.
- **HIGH:** Finish converting blocker-facing seeded-auth usage in `mvp-stabilization.spec.ts` to `loginWithCredentials()` or explicitly downgrade those assertions from blocker-grade evidence.
- **HIGH:** Refresh `docs/testing/PLAYWRIGHT_STATUS.md`, `docs/implementations/MVP_SIGNOFF_READINESS_BLOCKER_MAPPING.md`, and `e2e/README.md` so they stop overstating current strict-suite posture and the canonical launch-route contract.
- **HIGH:** Add a non-watch local Playwright startup path so roadmap stakeholders can execute representative blocker suites outside CI.
- **HIGH:** Fix the remaining timeout in `src/__tests__/integration/ScreenReaderSignOffEvidence.integration.test.ts` so local release-sign-off validation is fully green, not almost green.
- **MEDIUM:** Treat the large frontend bundle warning and ineffective subscription-store dynamic import as commercial hardening work that should be addressed once MVP blockers above are under tighter control.
- **MEDIUM:** Keep provider-backed onboarding proof, accessibility evidence, release-evidence truthfulness, and reporting/audit-export flows current as compliance surfaces evolve.

### Roadmap Adjustment

- **Lower evidentiary confidence, not product ambition:** the product surface still looks materially stronger than it did earlier in the quarter, but the business still lacks fresh executable product-validation evidence for the exact head being reviewed.
- **Treat historical upstream run IDs as supporting context, not current proof:** the maintained fork now exposes some workflow history, but not the build / test / Playwright / strict-signoff runs needed for sign-off-grade citations on the current head.
- **Re-open current-head Playwright credibility as an active business-owner risk:** passing local build is not enough when blocker suites cannot currently execute in the same environment.
- **Treat remaining blocker-facing seeded-auth usage and fixed polling sleeps as visible quality debt:** they still keep the suite short of the business-owner release bar.
- **Keep the enterprise compliance/reporting/release-evidence workstreams as shipped roadmap value, but not as MVP sign-off proof by themselves:** they need fresh executable evidence and protected-environment provenance.

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
- The canonical Guided Launch nav entry points to `/launch/workspace`, while `/launch/guided` remains the downstream wizard destination reached from the workspace and CTA flows.
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
- Canonical flow coverage is centered on the real split now enforced by code and blocker suites: `/launch/workspace` is the canonical nav/workspace entry, and `/launch/guided` remains the downstream token-parameter wizard.

**Business Impact:**
- Reduced route ambiguity in MVP-critical E2E journeys
- Lower regression risk for canonical launch path messaging

**Remaining Action:**
1. Keep redirect-compat tests isolated to the dedicated compatibility spec.
2. Reject any new direct `/create/wizard` navigation in non-compat tests during review.
3. Preserve `/launch/workspace` as the canonical top-level entry and `/launch/guided` as the downstream guided-wizard destination in new blocker-facing coverage.

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
- Broad Playwright error-suppression references: **256 `suppressBrowserErrors()` references across 65 spec files currently**; narrow suppressor usage is **85 references across 17 spec files**
- Playwright auth split: **44 files with `withAuth()`** vs **22 files with `loginWithCredentials()`** vs **2 files with `loginWithCredentialsStrict()`**
- Legacy route debt: direct `goto('/create/wizard')` still appears in only **1 spec file**, the dedicated redirect-compat suite
- `waitForTimeout` debt: **48 actual `waitForTimeout(...)` calls remain across 36 spec files**, and the two live polling sleeps that matter most for sign-off quality are still inside `e2e/mvp-backend-signoff.spec.ts` and `e2e/backend-deployment-contract.spec.ts`
- Documentation drift: the roadmap is current again, but `PLAYWRIGHT_STATUS.md`, `MVP_SIGNOFF_READINESS_BLOCKER_MAPPING.md`, and parts of `e2e/README.md` still do not match the April 14, 2026 reality check. They overstate strict-lane freshness, understate the lack of current validation-workflow runs on the maintained fork, and still lag the real `/launch/workspace` → `/launch/guided` launch-route contract

---

**Last Updated:** April 14, 2026 (reality check for accessible `main` head `4414e67`; local `npm ci` and `npm run build` succeed, `npm test` still has 1 timeout failure in `ScreenReaderSignOffEvidence.integration.test.ts`, representative Playwright blocker suites still fail to start in this environment because the Playwright `webServer` launches Vite in watch mode and hits `EMFILE`, the maintained fork now exposes workflow metadata plus one visible Copilot-cloud-agent run but still no current Build / Run Tests / Playwright / Strict Backend Sign-off runs, and the remaining business-owner blockers are fresh executable sign-off evidence, protected release-environment provisioning, residual blocker-suite helper / wait discipline, local Playwright reproducibility, route-contract truthfulness, and stale stakeholder-facing Playwright documentation)
**Next Review:** April 21, 2026
