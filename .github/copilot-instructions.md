# Copilot Instructions for Biatec Tokens

## 🚨 ABSOLUTE PRIORITY: TESTING COMPLIANCE 🚨

**CRITICAL ENFORCEMENT:** Under NO circumstances shall any work be completed with failing tests or insufficient test coverage. Previous violations have resulted in production bugs and must never recur.

- **IMMEDIATE ACTION REQUIRED:** If any test fails or coverage drops below 80% for ANY metric (statements, branches, functions, lines), STOP ALL WORK and fix immediately.
- **ZERO TOLERANCE:** Failing tests block all progress. Coverage below 80% blocks completion.
- **VERIFICATION MANDATORY:** Run full test suite and coverage check before ANY code changes and after EVERY change.

**PAST VIOLATIONS:** Copilot has previously finished work with failing tests and reduced coverage, violating these instructions. This has introduced bugs and reduced quality. This MUST NOT happen again.

## Project Overview

This is a Vue 3 + TypeScript frontend application for managing and deploying tokens on multiple blockchain networks. The application provides a user interface for creating, managing, and deploying various token standards with wallet integration across both EVM chains (Ethereum, Arbitrum, Base) and AVM chains (Algorand mainnet, Algorand testnet, VOI, Aramid).

## Tech Stack

- **Framework**: Vue 3 with Composition API (`<script setup>`)
- **Language**: TypeScript (strict mode enabled)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom configuration and dark mode support
- **State Management**: Pinia stores
- **Router**: Vue Router
- **Blockchain**: Multi-chain support with Algorand SDK (algosdk) for AVM chains and ethers.js/web3.js for EVM chains
- **Wallet Support**: @txnlab/use-wallet-vue for AVM chains, MetaMask/WalletConnect for EVM chains
- **Testing**:
  - **Unit Tests**: Vitest + Vue Test Utils
  - **E2E Tests**: Playwright (cross-browser testing)

## Project Structure

```
src/
├── components/       # Vue components
│   ├── ui/          # Reusable UI components (Button, Modal, Card, Input, Select, Badge)
│   └── layout/      # Layout components (Navbar, Sidebar)
├── generated/       # Auto-generated API client from backend Swagger spec
├── stores/          # Pinia stores (auth, tokens, theme, settings, subscription)
├── router/          # Vue Router configuration
├── views/           # Page components
├── assets/          # Static assets
├── main.ts          # Application entry point
└── App.vue          # Root component
```

## Development Commands

- **Development Server**: `npm run dev`
- **Build**: `npm run build` (runs vue-tsc type checking then vite build)
- **Preview Production Build**: `npm run preview`
- **Generate API Client**: `npm run generate-api` (generates TypeScript client from backend Swagger spec)
- **Unit Tests**: `npm test` (Vitest)
- **Unit Tests (Watch)**: `npm run test:watch`
- **Unit Tests (UI)**: `npm run test:ui`
- **Test Coverage**: `npm run test:coverage`
- **E2E Tests**: `npm run test:e2e` (Playwright)
- **E2E Tests (UI Mode)**: `npm run test:e2e:ui`
- **E2E Tests (Headed)**: `npm run test:e2e:headed`
- **E2E Tests (Debug)**: `npm run test:e2e:debug`
- **E2E Test Report**: `npm run test:e2e:report`

## Code Style and Conventions

### TypeScript

- **Strict Mode**: Always enabled - use proper typing, never use `as any` or `any` type
- **Compiler Options**: Target ES2020, use ESNext modules
- **Type Checking**: The build command includes `vue-tsc -b` for type checking
- Follow existing patterns in `tsconfig.app.json`:
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`
  - `noFallthroughCasesInSwitch: true`
  - For unused parameters in functions (e.g., event handlers), prefix with underscore (e.g., `_data`) to indicate intentional non-use and satisfy TypeScript strict mode. Preferably do not end work with unused parameters unless necessary.

### Vue Components

- Use **Composition API** with `<script setup>` syntax
- Component structure example:

  ```vue
  <script setup lang="ts">
  // imports
  // props/emits
  // composables/stores
  // reactive state
  // computed
  // methods
  </script>

  <template>
    <!-- markup -->
  </template>
  ```

- Use TypeScript for all component logic
- Prefer composition over options API

### Styling

- **Primary Framework**: Tailwind CSS
- **Dark Mode**: Use `class` strategy (check `tailwind.config.js`)
- **Custom Colors**:
  - Use extended gray palette (50-950)
  - Biatec-specific colors defined in theme
- **Custom Animations**: `fade-in`, `slide-up`, `float`, `pulse-slow` available
- **Utility Classes**: Extensive safelist defined in `tailwind.config.js` - use these classes
- **Font**: Inter font family is primary
- Follow the glass-effect and gradient patterns seen in existing components
- Aloways produce professional UX and UI designs

### State Management

- Use **Pinia** stores for global state
- Store files located in `src/stores/`
- Existing stores: `auth`, `tokens`, `theme`, `settings`, `subscription`
- Follow existing store patterns when creating new ones

### Blockchain Integration

- Use `algosdk` for AVM chain interactions (Algorand mainnet, testnet, VOI, Aramid)
- Use `ethers.js` or `web3.js` for EVM chain interactions (Ethereum, Arbitrum, Base, testnets)
- Wallet integration via `@txnlab/use-wallet-vue` for AVM chains and MetaMask/WalletConnect for EVM chains
- Support multiple networks: AVM chains (Algorand mainnet, testnet, VOI, Aramid) and EVM chains (Ethereum mainnet, Arbitrum, Base, Sepolia testnet)
- Network configurations defined in `main.ts`
- ERC standards (ERC20, ERC721) are for EVM chains
- ASA and ARC standards (ASA, ARC3, ARC19, ARC69, ARC200, ARC72) are for AVM chains
- Always handle wallet connection states properly across both chain types

### Backend API Integration

- **Generated API Client**: Use the auto-generated TypeScript client from `src/generated/ApiClient.ts`
- **Generation Command**: Run `npm run generate-api` to update the client when backend API changes
- **Base URL**: Configured via `VITE_API_BASE_URL` environment variable
- **Usage**: Import and instantiate the client for type-safe API calls
- **Regeneration**: Always regenerate the client after backend API schema changes to maintain type safety

### File Naming

- Vue components: PascalCase (e.g., `TokenCard.vue`, `Button.vue`)
- TypeScript files: kebab-case or camelCase (e.g., `auth.ts`, `stripe-config.ts`)
- Store files: lowercase (e.g., `tokens.ts`, `settings.ts`)

## Important Boundaries

### DO NOT:

- Modify `.github/workflows/` files unless specifically requested
- Change network configurations in `main.ts` without explicit instruction
- Remove or modify security-related code (wallet connections, authentication)
- Modify deployment scripts or SSH configurations
- Change TypeScript strict mode settings
- Add `any` types - always use proper typing
- Modify the Buffer/global polyfills in `main.ts` (required for wallet libraries)

### DO:

- Maintain existing component structure and patterns
- Follow Tailwind CSS utility-first approach
- Use Composition API with `<script setup>`
- Ensure proper TypeScript typing
- Test wallet integrations when modifying blockchain-related code
- Keep dark mode support in mind for UI changes
- Use existing UI components from `src/components/ui/` before creating new ones

## Testing and Validation

**🚨 CRITICAL TESTING REQUIREMENTS 🚨**

**ABSOLUTELY NEVER FINISH WORK WITH FAILING TESTS UNDER ANY CIRCUMSTANCES.** This project maintains strict quality standards where all tests must pass before code changes are accepted. Failing tests indicate potential bugs, broken functionality, or incomplete implementations that could impact users.

**PAST INCIDENT:** Copilot previously finished work with failing tests, which violated these instructions and could have introduced bugs into production. This must never happen again.

**If tests are failing:**

1. **IMMEDIATELY STOP** all other work
2. **DEBUG** the failing tests immediately - do not proceed until root cause is identified
3. **FIX** the root cause (not just the test symptoms) - ensure the fix is correct and complete
4. **RE-RUN** all tests to ensure they pass - verify multiple times if needed
5. **ONLY THEN** proceed with the work or mark it as complete

**Remember:** Test failures are not just technical issues - they represent potential user-facing problems that could break the application in production. Treat test failures as critical blocking issues that must be resolved before any other action.

### Automated Testing Enforcement

- **Before any code changes:** Run tests to establish baseline
- **After any code changes:** Run tests immediately to catch regressions
- **Before committing:** Run full test suite
- **Before PR creation:** Run all tests and ensure coverage thresholds are met
- **If uncertain about test status:** Run tests again to confirm

### Pre-Completion Testing Checklist

**MANDATORY: Complete ALL items before marking work as done. FAILURE TO COMPLETE WILL RESULT IN IMMEDIATE WORK REJECTION:**

- [ ] Run `npm test` (Unit tests) - Ensure 0 failures, 0 errors
- [ ] Run `npm run test:coverage` - Ensure coverage meets thresholds:
  - Statements: >80%
  - Branches: >80%
  - Functions: >80%
  - Lines: >80%
- [ ] Run `npm run test:e2e` (E2E tests) - Ensure 0 failures, 0 errors
- [ ] Run `npm run build` - Ensure TypeScript compilation passes
- [ ] Run `npm run check-typescript-errors-tsc` - Ensure TypeScript compilation without warnings/errors
- [ ] Run `npm run check-typescript-errors-vue` - Ensure VUE TypeScript compilation without warnings/errors
- [ ] If adding/modifying components: Run component-specific unit tests
- [ ] If changing UI/UX: Verify E2E tests for affected user flows pass
- [ ] If modifying API integration: Run `npm run generate-api` and update code accordingly
- [ ] Test wallet connectivity for blockchain-related changes
- [ ] Verify dark mode compatibility for UI changes

**FINAL VERIFICATION:** Before marking any task complete, run the full test suite one final time and document the results.

### Unit Tests (Vitest)

- Always run `npm test` for unit tests with Vitest
- Unit tests are located in `src/` directories alongside components (e.g., `*.test.ts`, `*.spec.ts`)
- Test files use Vitest with Vue Test Utils for component testing
- Run `npm run test:coverage` to check test coverage - must meet thresholds:
  - Statements: >80%
  - Branches: >80%
  - Functions: >80%
  - Lines: >80%
- Existing test patterns:
  - Component tests: Mock dependencies, test user interactions
  - Store tests: Test state management and actions
  - Service tests: Mock API calls, test business logic

### E2E Tests (Playwright)

- **CRITICAL: Always run E2E tests before finishing the work**
- **MANDATORY: Fix any failing tests immediately - do not finish work with failing tests**
- E2E tests are located in `e2e/` directory (e.g., `*.spec.ts`)
- **Before running E2E tests, ensure browsers are installed**: `npx playwright install --with-deps chromium` (run once)
- Run `npm run test:e2e` to execute all E2E tests
- Run `npm run test:e2e:ui` for interactive test runner
- Run `npm run test:e2e:headed` to see browser during tests
- Run `npm run test:e2e:debug` for debugging tests
- Playwright tests cover:
  - User flows (wallet connection, token creation)
  - Navigation between pages
  - Form interactions and validations
  - Responsive design across devices
  - Dark mode functionality
  - Error handling and edge cases

### E2E Test Writing Guidelines

When writing E2E tests:

- **Always wait for page load**: Use `await page.waitForLoadState("domcontentloaded")` after navigation
- **Use robust selectors**: Prefer `getByRole()`, `getByText()` over CSS selectors
- **Add timeouts**: Use `{ timeout: 10000 }` for visibility checks to handle slow loads
- **Handle missing elements gracefully**: Use `.isVisible().catch(() => false)` for optional elements
- **Test localStorage persistence**: Verify state persists across page reloads
- **Clear state in beforeEach**: Use `localStorage.clear()` to ensure test isolation
- **Mock wallet connections**: Set localStorage keys for wallet state without real wallet interactions
- **Test button text variations**: Use regex patterns like `/Connect Wallet|Authenticate/i` to match different button texts
- **Verify page loads successfully**: Always check page title or main heading as baseline
- **Focus on user behavior**: Test what users see and do, not implementation details

### Critical E2E Testing Requirements

**NEVER finish work request with failing E2E tests. Always:**

1. **Run tests before PR creation**: Execute `npm run test:e2e` and ensure all tests pass
2. **Fix failing tests immediately**: If tests fail, debug and fix them before proceeding
3. **Verify selectors are correct**: Check that CSS selectors and placeholders match actual DOM elements
4. **Test authentication flows**: Ensure protected routes are handled properly in tests
5. **Handle browser compatibility**: Add appropriate skips for browsers with known issues (e.g., Firefox networkidle timeouts)
6. **Test responsive design**: Make tests robust against different screen sizes and responsive layouts
7. **Update tests for UI changes**: When modifying components, update corresponding E2E tests
8. **Use correct URLs**: Verify route paths match actual Vue Router configuration

### Common E2E Test Patterns

```typescript
// Wait for page and check title
await page.goto("/");
await page.waitForLoadState("domcontentloaded");
await expect(page).toHaveTitle(/Expected Title/);

// Find button with flexible text matching
const button = page
  .locator("button")
  .filter({ hasText: /Button Text/i })
  .first();
await expect(button).toBeVisible({ timeout: 10000 });

// Test localStorage persistence
await page.evaluate(() => {
  localStorage.setItem("key", "value");
});
await page.reload();
const value = await page.evaluate(() => localStorage.getItem("key"));
expect(value).toBe("value");

// Handle optional elements
const element = page.locator("selector");
const isVisible = await element.isVisible().catch(() => false);
expect(isVisible || true).toBe(true); // Pass if element not found

// Handle authentication redirects
const currentUrl = page.url();
if (!currentUrl.includes("/expected-route")) {
  // Test passes if redirected due to auth
  expect(true).toBe(true);
  return;
}

// Skip Firefox for known issues
test.skip(browserName === "firefox", "Firefox has persistent networkidle timeout issues");
```

### Common E2E Test Patterns

```typescript
// Wait for page and check title
await page.goto("/");
await page.waitForLoadState("domcontentloaded");
await expect(page).toHaveTitle(/Expected Title/);

// Find button with flexible text matching
const button = page
  .locator("button")
  .filter({ hasText: /Button Text/i })
  .first();
await expect(button).toBeVisible({ timeout: 10000 });

// Test localStorage persistence
await page.evaluate(() => {
  localStorage.setItem("key", "value");
});
await page.reload();
const value = await page.evaluate(() => localStorage.getItem("key"));
expect(value).toBe("value");

// Handle optional elements
const element = page.locator("selector");
const isVisible = await element.isVisible().catch(() => false);
expect(isVisible || true).toBe(true); // Pass if element not found
```

### Test Setup and Configuration

- **Global Test Setup**: Located in `src/test/setup.ts` with configuration in `vitest.config.ts`
- **Wallet Composables Mocking**: `useWalletManager` and `useToast` are globally mocked to prevent Vue injection warnings
- **localStorage Handling**: Use real browser localStorage for tests that need persistence; clear in `beforeEach` for isolation
- **Environment**: Tests run in happy-dom environment for DOM simulation
- **Coverage Requirements**: Must maintain minimum thresholds (Statements ≥78%, Branches ≥69%, Functions ≥68.5%, Lines ≥79%)
- **Test Isolation**: Each test should be independent with proper cleanup

### Common Test Failure Causes and Solutions

**URL/Route Issues:**

- **Problem**: Tests use incorrect route paths (e.g., `/token-creator` instead of `/create`)
- **Solution**: Always verify routes in `src/router/index.ts` and use correct paths in tests

**Selector Issues:**

- **Problem**: Tests use generic selectors that don't match actual DOM elements
- **Solution**: Inspect actual HTML to find correct placeholders, classes, and element structures

**Authentication Issues:**

- **Problem**: Tests try to access protected routes without proper auth setup
- **Solution**: Mock `localStorage.setItem("wallet_connected", "true")` and handle auth redirects gracefully

**Browser Compatibility Issues:**

- **Problem**: Firefox has persistent `networkidle` timeout issues
- **Solution**: Add `test.skip(browserName === "firefox")` to affected test suites

**Responsive Design Issues:**

- **Problem**: Elements not visible on all screen sizes
- **Solution**: Make tests check for element visibility and handle gracefully when elements are hidden

**Timing Issues:**

- **Problem**: Tests fail due to slow page loads or async operations
- **Solution**: Use appropriate timeouts and wait strategies, prefer `waitForLoadState("domcontentloaded")`

**State Persistence Issues:**

- **Problem**: Tests don't properly isolate state between runs
- **Solution**: Clear localStorage in `beforeEach` hooks and mock required state

**Pinia Store Testing Issues (CRITICAL):**

- **Problem**: Store computed properties aren't reactive in tests. Setting `store.isActive = true` doesn't work when `isActive` is a computed property.
- **Solution**: Set the **underlying data** that the computed depends on, not the computed itself. Mock any lifecycle methods that might override test data.
- **Example**:
  ```typescript
  // ❌ WRONG - setting computed property directly
  subscriptionStore.isActive = true
  
  // ✅ CORRECT - set underlying data
  subscriptionStore.subscription = { subscription_status: 'active' } as any
  subscriptionStore.fetchSubscription = vi.fn().mockResolvedValue(undefined) // Mock to prevent override
  ```
- **Common patterns**:
  - `authStore.isAuthenticated` depends on `authStore.isConnected` AND `authStore.user` - set both
  - `subscriptionStore.isActive` depends on `subscriptionStore.subscription.subscription_status`
  - `complianceStore.metrics` depends on `complianceStore.checklistItems` array
  - Always mock `onMounted` lifecycle hooks that call store methods (like `fetchSubscription`)

**State Persistence Issues:**

- **Problem**: Tests don't properly isolate state between runs
- **Solution**: Clear localStorage in `beforeEach` hooks and mock required state

## 🚨 CI Workflow Verification & Dependency Updates 🚨

### Critical CI Workflow Requirements

**ABSOLUTE REQUIREMENT:** Before completing any PR (especially dependency updates), you MUST verify that CI workflows will actually run on the branch.

**PAST INCIDENT:** Multiple PRs were completed without verifying CI status, resulting in "No status checks" situations where tests weren't actually running. This violated quality standards and could have introduced bugs.

### CI Workflow Branch Pattern Verification

**Check FIRST, before making any changes:**

1. **Identify the branch pattern** of your PR (e.g., `copilot/**`, `dependabot/**`, `main`, `develop`)
2. **Review workflow configuration** in `.github/workflows/` to ensure your branch pattern is included:
   ```yaml
   on:
     pull_request:
       branches:
         - main
         - develop
         - 'dependabot/**'  # ← Required for Dependabot PRs
         - 'copilot/**'     # ← Required for Copilot PRs
   ```
3. **If your branch pattern is NOT included:**
   - ✅ Update workflow files FIRST before any other work
   - ✅ Commit and push the workflow changes
   - ✅ Verify CI runs are triggered in GitHub Actions

### "No Status Checks" Investigation Protocol

If you see "No status checks" or CI not running:

1. **DO NOT ASSUME TESTS PASSED** - No CI status means no testing occurred
2. **Check workflow branch patterns** in `.github/workflows/test.yml` and `playwright.yml`
3. **Verify your branch name** matches one of the configured patterns
4. **Update workflows if needed** to include your branch pattern
5. **Run tests locally** as verification: `npm test` and `npm run test:e2e`
6. **Document test results** in PR description with specific counts

### CI Workflow Files Requiring Branch Patterns

**Files to check:**
- `.github/workflows/test.yml` - Unit test workflow
- `.github/workflows/playwright.yml` - E2E test workflow
- `.github/workflows/build-fe.yml` - Build workflow

**Required patterns for all PR types:**
```yaml
pull_request:
  branches:
    - main
    - develop
    - 'dependabot/**'
    - 'copilot/**'
```

### Dependabot PR Special Considerations

**Critical for Dependabot PRs:**

1. **Comment Actions Must Skip Dependabot**
   - Dependabot PRs have restricted permissions
   - Workflows that post PR comments will fail with 403 errors
   - Always add: `&& github.actor != 'dependabot[bot]'` to comment conditions
   
   Example:
   ```yaml
   - name: Comment PR with Results
     if: always() && github.event_name == 'pull_request' && github.actor != 'dependabot[bot]'
   ```

2. **CI Status vs. Test Status**
   - "CI failed" does NOT always mean tests failed
   - Check actual test output: Look for "X passed (Y.Ym)" in logs
   - Permission errors (403) are infrastructure issues, not test failures

### Dependency Update Protocol

**MANDATORY STEPS for ALL dependency updates (no exceptions):**

#### 1. Pre-Update Analysis
- [ ] Identify what dependency is being updated and version change
- [ ] Research release notes/changelog for the new version
- [ ] Identify if there are breaking changes or security fixes
- [ ] Assess impact on wallet integration, token creation, or core flows

#### 2. Local Testing (BEFORE committing anything)
- [ ] Run `npm ci` to install updated dependencies
- [ ] Run `npm test` - Expect 2779+ tests passing
- [ ] Run `npm run test:e2e` - Expect 271+ tests passing
- [ ] Run `npm run build` - Must succeed with no errors
- [ ] Document exact test counts and any failures

#### 3. CI Workflow Verification
- [ ] Check if workflows will run on your branch pattern
- [ ] Update workflow files if branch pattern missing
- [ ] Verify workflows are triggered after first commit
- [ ] Check GitHub Actions UI for actual test execution
- [ ] If "No status checks", investigate immediately (don't ignore)

#### 4. Business Value Documentation (REQUIRED)
- [ ] Create `DEPENDENCY_UPDATE_<NAME>_<VERSION>.md` with:
  - What changed (features, security, fixes)
  - Why it matters to users (not just technical details)
  - Risk assessment (security, stability, compatibility)
  - Testing results (unit, E2E, build)
  - Rollback plan with estimated time
  - Product roadmap alignment (user trust, compliance, friction reduction)
  - Cost-benefit analysis with ROI estimate
  - Success metrics and monitoring plan

#### 5. Issue Documentation (REQUIRED)
- [ ] Create `ISSUE_<NAME>_<VERSION>.md` with:
  - Business value statement (customer impact)
  - Product vision alignment (low-friction experience, trust, compliance)
  - Target audience (who benefits and how)
  - Success criteria and acceptance criteria
  - Risk assessment with mitigation strategies
  - Timeline and cost-benefit analysis
  - Communication plan and monitoring metrics

#### 6. PR Description (REQUIRED)
- [ ] Link to business value document
- [ ] Link to issue document
- [ ] Summary of changes (what, why, impact)
- [ ] Test results (exact counts: "2779/2798 unit, 271/279 E2E")
- [ ] Manual verification summary
- [ ] Rollback plan
- [ ] Configuration changes (if any)
- [ ] Migration steps (if any)

#### 7. Final Verification (BEFORE marking PR ready)
- [ ] All tests passing locally (verify 2-3 times)
- [ ] CI workflows successfully executed in GitHub Actions
- [ ] No failing test jobs (check workflow logs)
- [ ] Build successful (no TypeScript errors)
- [ ] Business value document complete and comprehensive
- [ ] Issue document complete with ROI analysis
- [ ] PR marked "Ready for Review" (not draft)

### Documentation Requirements for Dependency Updates

**EVERY dependency update MUST include:**

1. **Technical Documentation** (300+ lines)
   - Executive summary with key benefits
   - What changed (features, fixes, security updates)
   - Why it matters (business impact, not just technical)
   - Trade-offs and considerations
   - Rollback plan with steps and timing
   - Testing results with exact counts
   - Configuration requirements
   - Impact on current users
   - Migration and deployment steps
   - Risk assessment (technical, security, user impact, business)
   - Product roadmap alignment (detailed analysis)
   - Cost-benefit analysis with ROI

2. **Business Case Documentation** (200+ lines)
   - Issue type and priority
   - Business value statement
   - Customer-facing impact (problem and solution)
   - Product vision alignment (all key pillars)
   - Target audience (who benefits)
   - Success criteria (must/should/could have)
   - Acceptance criteria (functional, non-functional, security)
   - Technical implementation summary
   - Risks and mitigation (detailed for each risk)
   - Timeline and effort estimate
   - Cost-benefit analysis with Year 1 ROI
   - Dependencies and prerequisites
   - Related issues and context
   - Communication plan
   - Monitoring and validation plan

3. **Test Evidence**
   - Exact test counts: "2779/2798 unit passing (19 skipped)"
   - Exact E2E counts: "271/279 E2E passing (8 skipped)"
   - Build time: "SUCCESS in 11.62s"
   - Coverage metrics: "Statements: 99.3%, Branches: 80.1%, Functions: 98.7%, Lines: 99.4%"
   - Manual test checklist with specific scenarios verified

### Why Documentation Matters

**Product Owner Perspective:**
- Dependency updates affect user experience and system reliability
- Business value must be clear to justify the change
- Risk assessment informs deployment timing and rollback readiness
- ROI analysis supports prioritization decisions
- Product roadmap alignment ensures strategic coherence

**Development Team Perspective:**
- Comprehensive docs prevent "why did we upgrade?" questions
- Rollback plans reduce incident response time
- Test evidence provides confidence in changes
- Risk analysis helps anticipate issues

**Support Team Perspective:**
- Understanding user impact helps with ticket triage
- Known issues documented upfront
- Success metrics help measure support burden changes

### Common Pitfalls to Avoid

❌ **NEVER:**
- Finish work without verifying CI actually ran
- Assume "no CI status" means tests passed (it means they didn't run!)
- Skip business value documentation for "simple" dependency updates
- Mark PR as complete with failing tests (even if CI shows green due to workflow issues)
- Ignore "No status checks" warnings in PR
- Complete work without comprehensive testing evidence
- Skip ROI analysis for dependency updates

✅ **ALWAYS:**
- Verify CI workflows will run BEFORE starting work
- Run tests locally even if CI is configured
- Create comprehensive business value documentation
- Create detailed issue linking to product vision
- Document exact test counts and pass/fail status
- Provide clear rollback plan with timing
- Include cost-benefit analysis with ROI
- Mark PR "Ready for Review" only when ALL requirements met

### Quality Standards Enforcement

**This section was added because:**
- Previous dependency update PRs were completed without CI verification
- "No status checks" situations were ignored, leading to untested changes
- Business value was not documented, making review difficult
- Risk assessment was missing, creating uncertainty about deployment
- ROI analysis was absent, preventing prioritization decisions

**These mistakes MUST NOT happen again.**

**Enforcement:**
- All PRs without complete documentation will be REJECTED
- All PRs without CI verification will be REJECTED
- All PRs with "No status checks" must investigate and fix workflows
- All dependency updates must include business value analysis
- All changes must have comprehensive testing evidence

## Additional Notes

- The application uses Vue Router for navigation
- Authentication and wallet state managed through Pinia stores
- Subscription/payment features integrated with Stripe (see `stripe-config.ts`)
- The project deploys to a staging environment via SSH (configured in GitHub Actions)
- Uses Vite for fast development and optimized production builds
