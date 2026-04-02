# Business Owner Roadmap: Biatec Tokens Platform

## Executive Summary

**Business Vision:** Biatec Tokens is a comprehensive tokenization platform specializing in regulated Real-World Asset (RWA) tokens in multichain environment. Our mission is to democratize compliant token issuance while ensuring enterprise-grade security and regulatory compliance.

**Target Audience:** Non-crypto native persons - traditional businesses and enterprises who need regulated token issuance without requiring blockchain or wallet knowledge.

**Authentication Approach:** Email and password authentication only - no wallet connectors anywhere on the web. Token creation and deployment handled entirely by backend services.

**Revenue Model:** Subscription-based SaaS with tiered pricing ($29/month basic, $99/month professional, $299/month enterprise). Target: 1,000 paying customers in Year 1, generating $2.5M ARR.

**Market Opportunity:** $50B+ RWA tokenization market by 2025, with MICA regulation creating demand for compliant platforms. Current competitors lack comprehensive compliance tooling.

**Current Status:** April 2, 2026 reality check: `main` now points to commit `94b451a1d2d1ee3f011a4624f8c3774539da7709` (`docs: refresh business roadmap reality check`). Standard browser/test signals are green on that exact head: `Playwright Tests` (**23873500162**) and `Run Tests` (**23873500183**) both completed successfully, and local `npm ci && npm run build` also succeeds on the cloned `94b451a` checkout. The newest completed `Build and Deploy FE` success is still **23844787131** on prior head `d70a0aba851b925620af7e6b5ee37b9bd6671a30` (merged dependency PR **#757**), and the protected `Strict Backend Sign-off Gate` also still last completed on that same prior head as run **23844787156**. Its inspected `playwright-report/signoff-status.json` artifact still reports `status: "not_configured"`, `mode: "not-configured"`, `is_release_evidence: false`, `api_base_url_set: false`, and `credentials_set: false`, so there is still no backend-confirmed release evidence on the head the business is evaluating. Frontend PR **#754** is now merged and ships the release-evidence command center, frontend PR **#757** is merged and keeps dependency/test hygiene current, backend PR **scholtz/BiatecTokensApi#620** is merged as API-only enterprise-operations groundwork, while open issue **#758** and open frontend PRs **#755** / **#756** remain maintenance pipeline items rather than shipped roadmap progress. The remaining business-owner MVP blockers are protected-environment provisioning, current-head release-evidence credibility, residual Playwright blocker-suite rigor, and stale stakeholder-facing Playwright documentation.

---

## Phase 1: MVP Foundation (Q1 2025) - 80% Complete 🟡

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

- **Compliance Monitoring** (93%): Compliance policy dashboards, evidence views, remediation workflows, approval/readiness panels, reporting workspaces, the investor-onboarding queue, release evidence center, and the role-aware operations cockpit now provide a credible operator-facing governance surface with persona-based queue lenses, clearer next-action handoffs, evidence-linked case drill-down, approval-history context, and guided escalation workflows, and PR **#735** now adds explicit automated operator-journey proof for queue, drill-down, and cross-surface flows; live operational data integration still needs work, and although backend PR **scholtz/BiatecTokensApi#620** is now merged, the earlier frontend notification-center PR **#746** was closed without merge, so this percentage should remain unchanged until a replacement frontend delivery lands on `main`
- **Risk Assessment** (72%): Policy health summaries, contradiction warnings, onboarding blockers, queue-health signals, remediation rollups, sign-off-readiness posture, risk-report builders, cockpit aging/SLA signals, evidence status groupings, case timelines, and clearer escalation guidance improve operator risk awareness, and PR **#735** now proves blocked/stale provider states are surfaced fail-closed instead of as approval-like readiness; scoring and live backend sourcing remain partial, while backend event-feed groundwork now exists through PR **scholtz/BiatecTokensApi#620** but the corresponding frontend notification-center delivery still needs a merged replacement before it can count as roadmap evidence
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

## MVP Blockers Reality Check (April 2, 2026 - current `main` at `94b451a`)

### Evidence Reviewed

- Current `main` head is commit `94b451a1d2d1ee3f011a4624f8c3774539da7709` (`docs: refresh business roadmap reality check`), which refreshes roadmap evidence but does not change the underlying product/runtime surfaces.
- Latest `Playwright Tests` on `main` is green on the exact current head (run **23873500162**, `success`).
- Latest `Run Tests` on `main` is also green on the exact current head (run **23873500183**, `success`).
- Latest `Build and Deploy FE` success on `main` is still run **23844787131** on prior head `d70a0aba851b925620af7e6b5ee37b9bd6671a30` (`success`) from merged PR **#757**; there is still no newer completed FE deploy build on `94b451a`, while local baseline validation on the cloned repository reproduces a green `npm ci && npm run build` on current head `94b451a`.
- Latest `Strict Backend Sign-off Gate` has **not** rerun on `94b451a`; the newest strict artifact is still run **23844787156** on prior head `d70a0aba851b925620af7e6b5ee37b9bd6671a30`, and the downloaded `playwright-report/signoff-status.json` still reports `status: "not_configured"`, `mode: "not-configured"`, `is_release_evidence: false`, `api_base_url_set: false`, and `credentials_set: false`.
- Frontend PR **#754** is now legitimately merged and shipped, frontend PR **#757** is merged, issue **#734** remains closed by merged PR **#735**, backend issue **scholtz/BiatecTokensApi#609** remains closed by merged API PR **#610**, frontend PR **#737** remains merged, backend PR **scholtz/BiatecTokensApi#614** remains merged, and backend PR **scholtz/BiatecTokensApi#620** is also merged as event-feed API groundwork. Open issue **#758** plus open frontend PRs **#755** / **#756** are maintenance-track work and should not be counted as shipped roadmap completion yet.
- Static review of the current Playwright corpus still shows strong blocker-facing coverage (`e2e/kyc-aml-operator-journey.spec.ts`, `e2e/compliance-reporting-workspace.spec.ts`, `e2e/release-evidence-center.spec.ts`, `e2e/wizard-redirect-compat.spec.ts`), and PR **#744** remains the key blocker-suite hardening milestone that moved `e2e/mvp-signoff-readiness.spec.ts` from seeded `withAuth()` flows to `loginWithCredentials()`. The suite posture is still not as strict as stakeholder-facing docs imply, however: `e2e/mvp-backend-signoff.spec.ts` still documents "Zero arbitrary waitForTimeout()" while containing a real `await page.waitForTimeout(5000)` poll and **13** guarded `test.skip()` calls, `e2e/backend-deployment-contract.spec.ts` strict polling still uses `waitForTimeout`, and `e2e/mvp-stabilization.spec.ts` still mixes `withAuth()` and `loginWithCredentials()`.
- The prior notification-center upside should now be scored more conservatively: backend PR **#620** is merged, but the corresponding frontend notification-center PR **#746** was closed without merge, so no additional frontend enterprise-operations completion should be booked from that theme until a replacement delivery lands on `main`.
- `docs/testing/PLAYWRIGHT_STATUS.md`, `docs/implementations/MVP_SIGNOFF_READINESS_BLOCKER_MAPPING.md`, and parts of `e2e/README.md` now trail reality again: they still describe March-era run IDs, overstate auth-helper convergence, and the README still implies the strict lane simply skips at prerequisites even though the current workflow produces a successful-but-not-configured artifact instead.
- Local validation is mixed rather than perfectly reproducible: `npm run build` succeeds, a targeted rerun of `src/__tests__/integration/ScreenReaderSignOffEvidence.integration.test.ts` succeeds, but a full `npm test` run in this container timed out once in that same file. GitHub Actions therefore remains the authoritative branch-quality signal, and local reproducibility is still an operational gap.

### Blocker Validation Status

- 🟡 **Backend-confirmed strict-release blocker remains open:** there is still no backend-confirmed release proof for business-owner sign-off, and the newest strict artifact still says `not_configured` / `is_release_evidence:false`.
- ✅ **Current-head CI/build health blocker is closed again:** `Run Tests` and `Playwright Tests` are green on current head `94b451a`, and local `npm ci && npm run build` is green there as well; the latest FE deploy build evidence is still the prior head `d70a0ab`.
- ✅ **Standard Playwright lane remains green on current head:** the permissive Playwright workflow is green on `94b451a`, so the browser-level regression picture stays healthy on the same branch state the business is evaluating.
- ✅ **Enterprise onboarding realism blocker is materially improved:** PR **#735** still closes the frontend side of provider-backed KYC/AML lifecycle evidence, and backend PR **#610** keeps the corresponding API milestone closed.
- ✅ **Reporting / audit-export milestone is now shipped code:** frontend PR **#737** and backend PR **#614** are both merged, so this capability has moved from roadmap promise to delivered implementation.
- ✅ **Release-evidence command-center milestone is now shipped code:** merged frontend PR **#754** materially improves operator-facing release-readiness review on `main`, even though it does not replace the missing protected strict artifact.
- 🟡 **Blocker-suite helper discipline is only partially compliant:** PR **#744** closed the `mvp-signoff-readiness.spec.ts` gap, but `mvp-stabilization.spec.ts` still mixes seeded auth with backend-attempted auth, so some blocker-facing paths remain softer than the stated `loginWithCredentials()` standard.
- 🟡 **Semantic-waits-only standard is not fully met:** both `mvp-backend-signoff.spec.ts` and the strict lane inside `backend-deployment-contract.spec.ts` still use fixed polling sleeps instead of a semantic retry helper.
- 🟡 **Current-head strict freshness is open again:** the protected strict lane did not rerun on `94b451a`, so the newest strict provenance still points to `d70a0ab` and remains non-credible release evidence.
- 🟡 **Enterprise event-feed completeness is still split across repos:** backend PR **#620** is merged, but the earlier frontend notification-center PR **#746** was closed without merge, so the business still lacks shipped end-to-end frontend proof for that specific enterprise-operations theme.
- 🟡 **Stakeholder-document freshness is open again:** this roadmap is current again, but `PLAYWRIGHT_STATUS.md`, the blocker-mapping doc, and parts of `e2e/README.md` are still stale or overstated relative to the current suite posture.
- 🟡 **Local validation reproducibility is open:** full local `npm test` was not clean in this container even though the isolated failing file reran green, so GitHub Actions remains stronger evidence than ad-hoc local runs today.
- ✅ **Legacy `/create/wizard` blocker remains contained on `main`:** direct `goto('/create/wizard')` usage is still isolated to `e2e/wizard-redirect-compat.spec.ts`.
- ✅ **Accessibility-evidence blocker remains closed in code and CI:** shared-shell, procurement, and screen-reader evidence remain present and green, though they still require ongoing refresh as the product evolves.

### Playwright Compliance vs MVP Blockers

**Status:** 🟡 **Partially compliant for MVP blocker confidence, but still not compliant with final business-owner sign-off requirements**

Current Playwright coverage still proves a large share of the code-level MVP story: the app remains wallet-free in the standard user journey, auth-first routing and legacy-route containment still have explicit test coverage, the Release Evidence Center and new release-evidence command-center surface behave fail-closed, the provider-backed onboarding/operator-journey milestone from PR **#735** is still represented by automated frontend evidence, and the shipped reporting / audit-export workspace from PR **#737** still has dedicated browser-level coverage. The standard Playwright workflow is also green on current head `94b451a`, which is meaningful because it shows the most visible browser journeys, release-readiness surfaces, enterprise reporting flows, and compliance workspaces have not regressed on the same branch state where tests/build remain healthy. PR **#744** materially improved blocker compliance by moving `mvp-signoff-readiness.spec.ts` onto `loginWithCredentials()` and reducing strict-lane auth softness, and PR **#754** adds business-facing release-readiness UX that the browser suite now exercises indirectly through the merged branch state. However, the merged/mainline Playwright portfolio still does **not** satisfy the full MVP blocker bar for release sign-off because (1) the newest strict artifact is still `not_configured` and trails the current release head, (2) `mvp-stabilization.spec.ts` still mixes seeded auth with backend-attempted auth, (3) the two strict deployment/auth suites still contain fixed polling sleeps, (4) `mvp-backend-signoff.spec.ts` still relies on guarded skips whenever strict prerequisites are absent, and (5) stakeholder-facing test documentation still overstates strict-lane behavior. In short: Playwright is strong enough to support roadmap confidence for shipped MVP and enterprise-compliance functionality, but it is still not the final, release-grade proof required for business-owner MVP sign-off.

### Required Playwright Improvements Before MVP Sign-off

1. Configure `SIGNOFF_API_BASE_URL`, `SIGNOFF_TEST_PASSWORD`, and (if needed) `SIGNOFF_TEST_EMAIL` in the `sign-off-protected` GitHub Environment, then run the strict lane on the actual release head (`94b451a` or its successor) until it produces `is_release_evidence:true`.
2. Broaden the strict-lane operating model: either expand `strict-signoff.yml` freshness expectations or require a documented `workflow_dispatch` step whenever release-critical auth, onboarding, reporting, evidence, or blocker-spec posture changes, so the business always has a current-head strict artifact that can be cited.
3. Remove the remaining polling sleeps from `e2e/mvp-backend-signoff.spec.ts` and the strict lane inside `e2e/backend-deployment-contract.spec.ts`, replacing them with a semantic polling/retry helper that matches the documented blocker-suite standard.
4. Finish the auth-helper cleanup by moving the remaining blocker-facing seeded-auth assertions in `e2e/mvp-stabilization.spec.ts` to `loginWithCredentials()`, and document the intentionally permissive status of any surviving `withAuth()` usage elsewhere.
5. Refresh `docs/testing/PLAYWRIGHT_STATUS.md`, `docs/implementations/MVP_SIGNOFF_READINESS_BLOCKER_MAPPING.md`, and `e2e/README.md` so stakeholder-facing guidance matches current run IDs, helper usage, strict-lane prerequisites, and actual `waitForTimeout()` posture.
6. Preserve the PR **#731**, PR **#735**, and PR **#737** hardening bar: no skip creep, no broad suppressor re-expansion, and no seeded-only auth regressions in the highest-value enterprise suites.
7. Improve local Playwright reproducibility for constrained environments by providing a non-watch startup path (or equivalent) so representative blocker suites can be executed outside GitHub Actions without hitting `EMFILE`.
8. Continue reducing permissive debt in the wider E2E corpus, prioritizing release-critical and enterprise-facing suites before lower-signal smoke journeys.

### Priority Action Items

- **URGENT:** Provision the `sign-off-protected` environment and obtain the first `is_release_evidence:true` artifact-backed strict real-backend run on current `main` head `94b451a` (or its immediate successor).
- **HIGH:** Treat the newest strict workflow artifact (**23844787156**) as infrastructure-only proof, not release proof, until the artifact stops reporting `not_configured`.
- **HIGH:** Trigger or require a fresh strict run for `94b451a` whenever release-critical auth, onboarding, reporting, evidence, or blocker-spec posture changes so the protected artifact the business cites is always current.
- **HIGH:** Remove the remaining strict-lane `waitForTimeout()` polling in `mvp-backend-signoff.spec.ts` and `backend-deployment-contract.spec.ts`.
- **HIGH:** Finish converting blocker-facing seeded-auth usage in `mvp-stabilization.spec.ts` to `loginWithCredentials()` or explicitly downgrade those assertions from blocker-grade evidence.
- **HIGH:** Refresh `docs/testing/PLAYWRIGHT_STATUS.md`, `docs/implementations/MVP_SIGNOFF_READINESS_BLOCKER_MAPPING.md`, and `e2e/README.md` so they stop overstating current strict-suite posture and run freshness.
- **MEDIUM:** Convert the now-merged regulator-ready reporting / audit-export milestone across frontend PR **#737** and backend PR **scholtz/BiatecTokensApi#614** into customer-facing proof: demo scripts, release notes, and strict sign-off evidence should all reference the shipped workflow.
- **MEDIUM:** Re-plan the enterprise notification/event-feed theme after backend PR **#620**: the backend groundwork is merged, but the earlier frontend PR **#746** was closed without merge, so a replacement frontend delivery is still needed before this theme can count as shipped maturity.
- **MEDIUM:** Address the local Playwright `EMFILE` reproducibility problem so roadmap stakeholders can run representative blocker suites outside CI when needed.
- **MEDIUM:** Continue reducing broad suppressors, skip guards, and seeded-auth shortcuts in the rest of the E2E corpus.
- **MEDIUM:** Keep provider-backed onboarding proof, accessibility evidence, and release-evidence truthfulness current as compliance/reporting surfaces keep evolving.

### Roadmap Adjustment

- **Raise MVP Foundation confidence, but keep release readiness blocked:** current `main` now has green `Playwright Tests` and `Run Tests` evidence on `94b451a`, local `npm ci && npm run build` is green there, and the latest FE deploy build evidence remains green on prior head `d70a0ab`; there is still no backend-confirmed `is_release_evidence:true` artifact on the head being signed off.
- **Treat issue #734 / PR #735 as a closed enterprise-onboarding evidence milestone, not as sign-off proof:** the biggest remaining gaps are strict-environment provisioning, blocker-suite helper / wait discipline, and stakeholder-document freshness.
- **Treat frontend PR #737 and backend PR #614 as shipped roadmap progress, not hypothetical pipeline work:** they materially raise enterprise-compliance and audit-export maturity, but they still need protected release evidence and customer-facing validation before they count as business-owner sign-off proof.
- **Re-open current-head strict credibility and stakeholder-doc drift as active maintenance risks:** the roadmap is current again after this update, but `PLAYWRIGHT_STATUS.md`, the blocker-mapping doc, and parts of `e2e/README.md` should not be treated as authoritative until refreshed and stabilized.
- **Treat remaining blocker-facing seeded-auth usage and fixed polling sleeps as quality debt, not invisible implementation details:** PR **#744** reduced this debt materially, but it did not eliminate it, and the remainder still keeps the suite short of the business-owner release bar.
- **Keep PR #731, PR #735, and PR #737 hardening as the baseline for commercially credible E2E evidence:** the core enterprise suites plus the KYC/AML operator journey and reporting workspace now define the minimum acceptable quality bar for supporting Playwright proof.
- **Use backend PR #610 plus frontend issue #734 / PR #735 as enterprise-compliance inputs, not as proof by themselves:** provider-backed lifecycle APIs and their frontend evidence improve the roadmap, but they do not count as business-owner sign-off until exercised through protected release evidence.
- **Treat backend PR #620 as shipped infrastructure but not end-to-end product maturity:** because the earlier frontend PR **#746** was closed without merge, the event-feed / notification-center theme should influence planning but not completion percentages until a new frontend delivery lands.

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
- Broad/narrow Playwright error-suppression references: **341 references across 82 spec files currently**
- Playwright auth split: **44 files with `withAuth()`** vs **22 files with `loginWithCredentials()`** vs **2 files with `loginWithCredentialsStrict()`**
- Legacy route debt: direct `goto('/create/wizard')` still appears in only **1 spec file**, the dedicated redirect-compat suite
- `waitForTimeout` debt: **48 actual `waitForTimeout(...)` calls remain across 36 spec files**, and **2** of those calls are still inside the strict deployment/auth suites that matter most for sign-off quality
- Documentation drift: the roadmap is current again, but `PLAYWRIGHT_STATUS.md`, `MVP_SIGNOFF_READINESS_BLOCKER_MAPPING.md`, and parts of `e2e/README.md` still do not match the April 2 `main` head `94b451a`; the newest strict artifact is still run **23844787156** on prior head `d70a0ab` and still reports `not_configured` / `is_release_evidence:false`

---

**Last Updated:** April 2, 2026 (reality check for current `main` head `94b451a`; `Playwright Tests` **23873500162** and `Run Tests` **23873500183** are green on that exact commit, local `npm ci && npm run build` is green there as well, the latest `Build and Deploy FE` success remains **23844787131** on prior head `d70a0ab`, and the newest `Strict Backend Sign-off Gate` artifact remains **23844787156** on that same prior head and is still only a successful-but-`not_configured` infrastructure artifact because `SIGNOFF_API_BASE_URL` / `SIGNOFF_TEST_PASSWORD` are not set and `is_release_evidence` remains `false`; frontend PR **#754** and PR **#757** are now merged, issue **#734** remains closed by merged PR **#735**, backend issue **scholtz/BiatecTokensApi#609** remains closed by merged PR **#610**, frontend PR **#737** plus backend PR **scholtz/BiatecTokensApi#614** remain shipped reporting / audit-export milestones, backend PR **scholtz/BiatecTokensApi#620** is merged as API groundwork, open issue **#758** plus open frontend PRs **#755** / **#756** remain maintenance-track work rather than shipped roadmap progress, and the remaining business-owner blockers are protected release-evidence credibility, fresh strict-run provenance on current head, residual blocker-suite helper / wait discipline, and stale stakeholder-facing Playwright documentation)
**Next Review:** April 9, 2026
