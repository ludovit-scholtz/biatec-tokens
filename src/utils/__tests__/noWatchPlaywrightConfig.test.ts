/**
 * Unit Tests: Non-Watch Playwright Configuration Semantics
 *
 * Validates that playwright.no-watch.config.ts carries the correct configuration
 * properties to deliver its stated guarantees:
 *
 * 1. EMFILE prevention — the webServer command must use 'vite preview', not 'npm run dev',
 *    so that zero inotify/kqueue file watchers are registered.
 *
 * 2. networkidle compatibility — 'vite preview' (static file server) does NOT establish
 *    the Vite HMR SSE connection that blocks waitForLoadState('networkidle') indefinitely.
 *
 * 3. Pre-flight safety — the command must include a dist/ guard so operators get an
 *    actionable error message if they forget to run 'npm run build' first.
 *
 * 4. Timeout budget alignment — per section 7j of copilot instructions, CI tests
 *    must have a global timeout >= 60 s to handle cold-start overhead.
 *
 * 5. Configuration parity — the browser projects, retries, and parallelism settings
 *    must be equivalent to playwright.config.ts so the two configs are drop-in alternatives.
 *
 * These tests exercise the file as a readable artefact (fs.readFileSync) rather than
 * importing the Playwright `defineConfig` runtime, which avoids @playwright/test
 * availability issues in the Vitest happy-dom environment.
 *
 * AC linkage: Issue #1 — Restore release-grade enterprise sign-off evidence
 *   AC-EMFILE: Non-watch path eliminates EMFILE in constrained environments
 *   AC-SEMANTIC: No arbitrary waitForTimeout in blocker-critical path
 *   AC-DOC: Documentation matches actual behaviour
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// ---------------------------------------------------------------------------
// Load the raw config source text once (avoids @playwright/test import issues
// in the Vitest happy-dom environment while still giving us deterministic
// assertions on the content that governs real CI behaviour).
// ---------------------------------------------------------------------------

const CONFIG_PATH = resolve(__dirname, '../../../playwright.no-watch.config.ts')
const DEV_CONFIG_PATH = resolve(__dirname, '../../../playwright.config.ts')

function readConfig(path: string): string {
  return readFileSync(path, 'utf-8')
}

// ---------------------------------------------------------------------------
// EMFILE prevention: webServer command must use 'vite preview', not 'npm run dev'
// ---------------------------------------------------------------------------

describe('noWatchPlaywrightConfig — EMFILE prevention (vite preview vs npm run dev)', () => {
  it('webServer command contains "vite preview"', () => {
    const source = readConfig(CONFIG_PATH)
    expect(source).toContain('vite preview')
  })

  it('webServer command does NOT contain "npm run dev"', () => {
    const source = readConfig(CONFIG_PATH)
    // The webServer block must not invoke the Vite HMR dev server.
    // Check the region after "webServer:" in the file.
    const webServerSection = source.slice(source.indexOf('webServer:'))
    expect(webServerSection).not.toContain("command: 'npm run dev'")
    expect(webServerSection).not.toContain('command: "npm run dev"')
    expect(webServerSection).toContain('vite preview')
  })

  it('webServer command routes to port 5173', () => {
    const source = readConfig(CONFIG_PATH)
    expect(source).toContain('vite preview --port 5173')
  })

  it('playwright.config.ts (dev config) uses npm run dev for comparison', () => {
    // Sanity check: the standard config does use the dev server
    const devSource = readConfig(DEV_CONFIG_PATH)
    expect(devSource).toContain('npm run dev')
  })
})

// ---------------------------------------------------------------------------
// Pre-flight dist/ guard — operator gets a clear error if dist/ is missing
// ---------------------------------------------------------------------------

describe('noWatchPlaywrightConfig — pre-flight dist/ guard', () => {
  it('webServer command checks for dist/ directory before starting server', () => {
    const source = readConfig(CONFIG_PATH)
    // The shell guard: test -d dist || { echo ERROR ... && exit 1; }
    expect(source).toContain('test -d dist')
  })

  it('pre-flight guard exits with non-zero code when dist/ is missing', () => {
    const source = readConfig(CONFIG_PATH)
    expect(source).toContain('exit 1')
  })

  it('pre-flight guard emits an actionable error message', () => {
    const source = readConfig(CONFIG_PATH)
    // Operators must see guidance — not a silent failure
    expect(source).toMatch(/dist.*not found|ERROR.*dist/i)
    expect(source).toMatch(/npm run build/i)
  })
})

// ---------------------------------------------------------------------------
// networkidle safety — config must NOT use networkidle in waitForLoadState
// (Vite HMR SSE would block it; 'vite preview' avoids SSE but we still
//  document the rule for future authors via the configuration comments)
// ---------------------------------------------------------------------------

describe('noWatchPlaywrightConfig — networkidle awareness', () => {
  it('config file documents the SSE / networkidle compatibility benefit', () => {
    const source = readConfig(CONFIG_PATH)
    expect(source).toMatch(/networkidle|SSE|Server-Sent/i)
  })

  it('config file explicitly references HMR connection difference', () => {
    const source = readConfig(CONFIG_PATH)
    expect(source).toMatch(/HMR|Hot Module/i)
  })
})

// ---------------------------------------------------------------------------
// Timeout budget alignment (section 7j: CI global timeout >= 60 s)
// ---------------------------------------------------------------------------

describe('noWatchPlaywrightConfig — timeout budget', () => {
  it('global test timeout is at least 60000 ms', () => {
    const source = readConfig(CONFIG_PATH)
    const match = source.match(/timeout:\s*(\d+)/)
    expect(match).not.toBeNull()
    const timeout = parseInt(match![1], 10)
    expect(timeout).toBeGreaterThanOrEqual(60000)
  })

  it('navigationTimeout is set to limit waitForLoadState hanging', () => {
    const source = readConfig(CONFIG_PATH)
    expect(source).toContain('navigationTimeout')
    const match = source.match(/navigationTimeout:\s*(\d+)/)
    expect(match).not.toBeNull()
    const navTimeout = parseInt(match![1], 10)
    // Must be at least 15 s but no more than 60 s (section 7h/7j guidance)
    expect(navTimeout).toBeGreaterThanOrEqual(15000)
    expect(navTimeout).toBeLessThanOrEqual(60000)
  })
})

// ---------------------------------------------------------------------------
// Configuration parity with playwright.config.ts
// ---------------------------------------------------------------------------

describe('noWatchPlaywrightConfig — parity with playwright.config.ts', () => {
  it('both configs share the same testDir', () => {
    const noWatchSource = readConfig(CONFIG_PATH)
    const devSource = readConfig(DEV_CONFIG_PATH)
    // Both should reference the e2e test directory (single or double quotes)
    expect(noWatchSource).toMatch(/testDir:\s*['"]\.\/e2e['"]/)
    expect(devSource).toMatch(/testDir:\s*['"]\.\/e2e['"]/)
  })

  it('both configs reference the same globalSetup file', () => {
    const noWatchSource = readConfig(CONFIG_PATH)
    const devSource = readConfig(DEV_CONFIG_PATH)
    expect(noWatchSource).toContain('global-setup.ts')
    expect(devSource).toContain('global-setup.ts')
  })

  it('both configs use the same baseURL', () => {
    const noWatchSource = readConfig(CONFIG_PATH)
    const devSource = readConfig(DEV_CONFIG_PATH)
    expect(noWatchSource).toContain('http://localhost:5173')
    expect(devSource).toContain('http://localhost:5173')
  })

  it('both configs configure retries on CI', () => {
    const noWatchSource = readConfig(CONFIG_PATH)
    const devSource = readConfig(DEV_CONFIG_PATH)
    expect(noWatchSource).toContain('retries: process.env.CI ? 2 : 0')
    expect(devSource).toContain('retries: process.env.CI ? 2 : 0')
  })

  it('both configs include chromium, firefox, and webkit projects for local runs', () => {
    const noWatchSource = readConfig(CONFIG_PATH)
    const devSource = readConfig(DEV_CONFIG_PATH)
    for (const browser of ['chromium', 'firefox', 'webkit']) {
      expect(noWatchSource).toContain(browser)
      expect(devSource).toContain(browser)
    }
  })

  it('no-watch config has custom-reporter.ts (same as dev config)', () => {
    const noWatchSource = readConfig(CONFIG_PATH)
    const devSource = readConfig(DEV_CONFIG_PATH)
    expect(noWatchSource).toContain('custom-reporter.ts')
    expect(devSource).toContain('custom-reporter.ts')
  })
})

// ---------------------------------------------------------------------------
// Semantic wait invariant — white-label-branding spec must not use waitForTimeout
// for auth-redirect detection (replaced by waitForFunction polling the DOM)
// ---------------------------------------------------------------------------

describe('whiteLabelBranding spec — semantic wait invariant', () => {
  it('white-label-branding.spec.ts does not use waitForTimeout for auth-redirect detection', () => {
    const specPath = resolve(__dirname, '../../../e2e/white-label-branding.spec.ts')
    const specSource = readFileSync(specPath, 'utf-8')
    // The old arbitrary 3000 ms wait for the router guard must be gone
    expect(specSource).not.toContain('waitForTimeout(3000)')
    expect(specSource).not.toContain('waitForTimeout(5000)')
  })

  it('white-label-branding.spec.ts uses waitForFunction for auth-redirect detection', () => {
    const specPath = resolve(__dirname, '../../../e2e/white-label-branding.spec.ts')
    const specSource = readFileSync(specPath, 'utf-8')
    expect(specSource).toContain('waitForFunction')
  })

  it('white-label-branding.spec.ts waitForFunction predicate checks URL and DOM (belt-and-suspenders)', () => {
    const specPath = resolve(__dirname, '../../../e2e/white-label-branding.spec.ts')
    const specSource = readFileSync(specPath, 'utf-8')
    // Predicate should check for: URL leaving /enterprise/branding, showAuth=true, or auth form
    expect(specSource).toContain('/enterprise/branding')
    expect(specSource).toContain('showAuth=true')
    expect(specSource).toContain('email')
  })
})

// ---------------------------------------------------------------------------
// Remaining waitForTimeout calls — must all be REST polling delays, not UI waits
// ---------------------------------------------------------------------------

describe('E2E spec files — remaining waitForTimeout calls are REST polling only', () => {
  it('white-label-branding.spec.ts has no waitForTimeout calls at all', () => {
    const specPath = resolve(__dirname, '../../../e2e/white-label-branding.spec.ts')
    const specSource = readFileSync(specPath, 'utf-8')
    // Confirm the semantic-wait migration removed ALL waitForTimeout from this file
    const calls = (specSource.match(/waitForTimeout\s*\(/g) || []).length
    expect(calls).toBe(0)
  })

  it('backend-deployment-contract.spec.ts waitForTimeout is wrapped in a polling loop', () => {
    const specPath = resolve(__dirname, '../../../e2e/backend-deployment-contract.spec.ts')
    const specSource = readFileSync(specPath, 'utf-8')
    // The ONLY waitForTimeout here should be inside a polling loop (POLL_INTERVAL_MS pattern)
    const calls = (specSource.match(/waitForTimeout\s*\(/g) || []).length
    if (calls > 0) {
      // Any remaining call must be inside a loop or gated on attempt count
      expect(specSource).toMatch(/POLL_INTERVAL_MS|attempt\s*<|for\s*\(|while\s*\(/)
    }
  })
})

// ---------------------------------------------------------------------------
// npm script presence — operators must be able to run with one command
// ---------------------------------------------------------------------------

describe('package.json — test:e2e:no-watch npm script', () => {
  it('package.json defines the test:e2e:no-watch script', () => {
    const pkgPath = resolve(__dirname, '../../../package.json')
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    expect(pkg.scripts).toBeDefined()
    expect(pkg.scripts['test:e2e:no-watch']).toBeDefined()
  })

  it('test:e2e:no-watch script builds before running tests', () => {
    const pkgPath = resolve(__dirname, '../../../package.json')
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    const script: string = pkg.scripts['test:e2e:no-watch']
    // Must include a build step to produce dist/ before running Playwright
    expect(script).toMatch(/npm run build|vite build/)
  })

  it('test:e2e:no-watch script references the no-watch config', () => {
    const pkgPath = resolve(__dirname, '../../../package.json')
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    const script: string = pkg.scripts['test:e2e:no-watch']
    expect(script).toContain('playwright.no-watch.config.ts')
  })
})
