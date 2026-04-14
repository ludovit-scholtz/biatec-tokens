/**
 * playwright.no-watch.config.ts
 *
 * Alternative Playwright configuration for environments with limited inotify watchers.
 * Uses 'vite preview' (serves pre-built static files from dist/) instead of 'vite dev'
 * (which monitors source files via chokidar and can exhaust OS inotify limits, producing
 * EMFILE: too many open files errors when the project has many node_modules entries).
 *
 * PREREQUISITES:
 *   npm run build     ← must produce a valid dist/ folder before using this config
 *
 * USAGE (preferred — handles build automatically):
 *   npm run test:e2e:no-watch
 *
 * USAGE (direct):
 *   npm run build && npx playwright test --config playwright.no-watch.config.ts
 *
 * ADDITIONAL BENEFIT: Because 'vite preview' does not establish the Vite HMR
 * Server-Sent Events (SSE) connection that 'vite dev' maintains, any test that
 * uses waitForLoadState('networkidle') will work as expected without blocking
 * indefinitely on the persistent SSE connection.
 *
 * See: docs/testing/PLAYWRIGHT_STATUS.md — "Non-Watch Startup Path"
 * See: e2e/README.md — "Running E2E Tests Without File Watchers"
 */

import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  /* Global setup and teardown */
  globalSetup: './e2e/global-setup.ts',
  globalTeardown: './e2e/global-teardown.ts',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Workers */
  workers: process.env.CI ? 2 : 4,
  /* Global timeout for each test */
  timeout: 60000,
  /* Reporter */
  reporter: [
    ['html', { open: 'never' }],
    ['./e2e/custom-reporter.ts'],
  ],
  /* Shared settings */
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    navigationTimeout: 30000,
    ignoreHTTPSErrors: true,
    env: {
      ...process.env,
      VITE_API_BASE_URL: 'https://api.tokens.biatec.io/',
    },
  },
  /* Browser projects — identical to playwright.config.ts */
  projects: process.env.CI
    ? [
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
      ]
    : [
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
        {
          name: 'firefox',
          use: { ...devices['Desktop Firefox'] },
        },
        {
          name: 'webkit',
          use: { ...devices['Desktop Safari'] },
        },
        {
          name: 'Mobile Chrome',
          use: { ...devices['Pixel 5'] },
        },
        {
          name: 'Mobile Safari',
          use: { ...devices['iPhone 12'] },
        },
      ],

  /**
   * KEY DIFFERENCE FROM playwright.config.ts
   *
   * webServer uses 'vite preview' instead of 'npm run dev':
   *
   *   'npm run dev'      → starts Vite HMR dev server
   *                        registers inotify/kqueue watchers for every source file
   *                        can cause EMFILE on systems with low fs.inotify.max_user_watches
   *                        establishes persistent SSE connection (blocks 'networkidle')
   *
   *   'vite preview'     → serves pre-built static files from dist/
   *                        no file watchers (zero inotify/kqueue registrations)
   *                        no HMR SSE connection (networkidle works correctly)
   *                        starts in 2-5 seconds (vs 10-30s for dev server)
   *
   * REQUIREMENT: dist/ must exist. Run 'npm run build' before using this config.
   */
  webServer: {
    command:
      'test -d dist || { echo "" && echo "ERROR: dist/ directory not found." && echo "Run '\''npm run build'\'' before using playwright.no-watch.config.ts, or use the npm script:" && echo "  npm run test:e2e:no-watch" && echo "" && exit 1; } && vite preview --port 5173',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
})
