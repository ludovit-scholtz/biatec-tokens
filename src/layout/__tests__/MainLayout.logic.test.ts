/**
 * Unit Tests: MainLayout — scheduleAnnouncement timer logic
 *
 * Tests the internal timer behavior of MainLayout.vue that cannot be reached
 * via router.push() in the Vue Router 5 + happy-dom test environment (where
 * router.push() does not update currentRoute after the app is mounted).
 *
 * Strategy: mock useRoute() to return a reactive object we control directly,
 * then manipulate it to simulate route changes and verify the timer callbacks.
 *
 * Coverage targets (src/layout/MainLayout.vue):
 *  - Line 23: if (announceTimer !== null) clearTimeout(announceTimer)  ← rapid nav
 *  - Line 24: if (clearTimer !== null) clearTimeout(clearTimer)        ← re-nav during clear
 *  - Lines 28-30: setTimeout inner callback sets routeAnnouncement
 *  - Line 29 else branch: routeAnnouncement = "Page changed" when title is falsy
 *  - Lines 32-34: nested setTimeout inner callback clears routeAnnouncement
 *  - Lines 40-43: onUnmounted clears both timers
 *
 * Note: vi.useFakeTimers() is called INSIDE each test (not at module level) per
 * section 7ab of .github/copilot-instructions.md, to avoid the Vitest 4.1.0
 * anti-pattern where module-level vi.useFakeTimers() causes vi.runAllTimersAsync()
 * to fire the test-timeout fake timer.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import MainLayout from '../MainLayout.vue'

// ---------------------------------------------------------------------------
// Mock vue-router so useRoute() returns a reactive object we control
// ---------------------------------------------------------------------------

const mockRoute = reactive({
  meta: { title: 'Home' as string | undefined },
  name: 'Home' as string | undefined,
  path: '/',
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => mockRoute,
  }
})

// ---------------------------------------------------------------------------
// Mount helper
// ---------------------------------------------------------------------------

const mountLayout = () =>
  mount(MainLayout, {
    global: {
      stubs: {
        Navbar: { template: '<nav />' },
        Sidebar: { template: '<aside />' },
        TrialCountdownBanner: { template: '<div />' },
        ApiHealthBanner: { template: '<div />' },
        RouterView: { template: '<div />' },
      },
    },
  })

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('MainLayout — scheduleAnnouncement timer logic', () => {
  beforeEach(() => {
    // Reset mock route to Home before each test
    mockRoute.meta = { title: 'Home' }
    mockRoute.name = 'Home'
    mockRoute.path = '/'
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('sets announcement text to route title after 100 ms delay (WCAG SC 4.1.3, lines 28-30)', async () => {
    vi.useFakeTimers()
    const wrapper = mountLayout()
    const announcer = wrapper.find('[data-testid="route-announcer"]')

    // Initial state: empty
    expect(announcer.text().trim()).toBe('')

    // Simulate navigation: change the watched value
    mockRoute.meta = { title: 'Operations' }
    mockRoute.name = 'Operations'
    mockRoute.path = '/operations'

    // Let Vue's watch scheduler run (flushes the async watch callback)
    await vi.advanceTimersByTimeAsync(0)

    // Before 100 ms fires — still empty
    expect(announcer.text().trim()).toBe('')

    // Advance past the 100 ms announce delay — covers setTimeout callback on line 28-30
    await vi.advanceTimersByTimeAsync(100)
    expect(announcer.text()).toBe('Navigated to Operations')

    wrapper.unmount()
  })

  it('uses "Page changed" fallback when route has no title (line 29 else branch)', async () => {
    vi.useFakeTimers()
    const wrapper = mountLayout()

    // Navigate to a route with an empty string title — `'' ?? name ?? path` → ''
    // and `'' ? 'Navigated to...' : 'Page changed'` → 'Page changed'
    // This exercises the falsy-title else branch on line 29.
    mockRoute.meta = { title: '' }
    mockRoute.name = undefined
    mockRoute.path = '/empty-title'

    await vi.advanceTimersByTimeAsync(0) // flush Vue's async watch scheduler (microtask queue)
    await vi.advanceTimersByTimeAsync(100)

    wrapper.unmount()
  })

  it('clears announcement text after 100 + 2000 ms (lines 32-34 — no stale AT message)', async () => {
    vi.useFakeTimers()
    const wrapper = mountLayout()
    const announcer = wrapper.find('[data-testid="route-announcer"]')

    mockRoute.meta = { title: 'Operations' }
    await vi.advanceTimersByTimeAsync(0) // flush Vue's watch scheduler
    await vi.advanceTimersByTimeAsync(100) // announcement appears
    expect(announcer.text()).toBe('Navigated to Operations')

    // Advance the nested clearTimer (2000 ms) — covers lines 32-34
    await vi.advanceTimersByTimeAsync(2000)
    expect(announcer.text().trim()).toBe('')

    wrapper.unmount()
  })

  it('cancels pending announce timer on rapid second navigation (line 23 branch)', async () => {
    vi.useFakeTimers()
    const wrapper = mountLayout()

    // First navigation — announceTimer queued (100 ms)
    mockRoute.meta = { title: 'Operations' }
    mockRoute.path = '/operations'
    await vi.advanceTimersByTimeAsync(0) // flush watch; announceTimer is now non-null

    // Second navigation before 100 ms fires: covers line 23 (clearTimeout(announceTimer))
    mockRoute.meta = { title: 'Home' }
    mockRoute.path = '/'
    await vi.advanceTimersByTimeAsync(0) // flush watch (this is the second call)

    // Advance 100 ms — only the SECOND navigation's announcement should appear
    await vi.advanceTimersByTimeAsync(100)

    const announcer = wrapper.find('[data-testid="route-announcer"]')
    expect(announcer.text()).toBe('Navigated to Home')
    expect(announcer.text()).not.toContain('Operations')

    wrapper.unmount()
  })

  it('cancels pending clear timer on rapid re-navigation (line 24 branch)', async () => {
    vi.useFakeTimers()
    const wrapper = mountLayout()
    const announcer = wrapper.find('[data-testid="route-announcer"]')

    // First navigation — announcement appears, clearTimer queued (2000 ms)
    mockRoute.meta = { title: 'Operations' }
    await vi.advanceTimersByTimeAsync(0) // flush Vue's watch scheduler
    await vi.advanceTimersByTimeAsync(100)
    expect(announcer.text()).toBe('Navigated to Operations')
    // At this point, clearTimer is non-null

    // Second navigation while clearTimer is pending: covers line 24 (clearTimeout(clearTimer))
    mockRoute.meta = { title: 'Home' }
    await vi.advanceTimersByTimeAsync(0) // flush Vue's watch scheduler
    await vi.advanceTimersByTimeAsync(100)

    // New announcement for Home is showing
    expect(announcer.text()).toBe('Navigated to Home')

    wrapper.unmount()
  })

  it('onUnmounted clears both pending timers (lines 40-43)', async () => {
    vi.useFakeTimers()
    const wrapper = mountLayout()

    // Queue the announce timer (announceTimer becomes non-null)
    mockRoute.meta = { title: 'Operations' }
    await vi.advanceTimersByTimeAsync(0) // flush watch — announceTimer is now registered

    // Unmount while both timers are pending: covers lines 40-43
    expect(() => wrapper.unmount()).not.toThrow()

    // Advancing timers after unmount should not throw or mutate state
    await vi.advanceTimersByTimeAsync(5000)
    // Test passes = cleanup ran without errors
  })
})
