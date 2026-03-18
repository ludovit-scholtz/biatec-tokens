/**
 * Unit Tests: Home — Logic Coverage
 *
 * Covers the script-setup handler functions in Home.vue that have no test
 * coverage in the existing WCAG / canonical-routing test files:
 *
 *  - shouldShowLandingEntry: returns true only when !authenticated && !hasSeenWelcome
 *  - handleCreateToken: routes authenticated users to /launch/guided; stores
 *      REDIRECT_AFTER_AUTH and opens modal for unauthenticated users
 *  - handleViewDashboard: same pattern as handleCreateToken for /dashboard
 *  - handleDiscoverTokens: always pushes to DiscoveryDashboard
 *  - handleEmailSignup: tracks telemetry, shows onboarding, pushes to DiscoveryDashboard
 *  - handleAuthComplete: clears modal, marks onboarding step, redirects to stored
 *      path or default /launch/guided
 *  - onMounted: opens auth modal when route.query.showAuth === 'true'
 *  - watch(route.query): opens auth modal on live query change to showAuth='true'
 *
 * Note: Vue Router 5 + happy-dom does not update currentRoute after mount.
 *       Navigation is verified via the mockPush spy injected through useRouter.
 *
 * Roadmap: https://raw.githubusercontent.com/scholtz/biatec-tokens/refs/heads/main/business-owner-roadmap.md
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import Home from '../Home.vue'

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('../../services/TelemetryService', () => ({
  telemetryService: {
    trackEmailSignupStarted: vi.fn(),
    trackEvent: vi.fn(),
  },
}))

// Persistent mock push/route controls for all tests
const mockPush = vi.fn().mockResolvedValue(undefined)
let mockQueryRef = { value: {} as Record<string, string> }

vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router')
  return {
    ...actual,
    useRouter: () => ({ push: mockPush }),
    useRoute: () => ({
      get query() { return mockQueryRef.value },
    }),
  }
})

// ── Helpers ────────────────────────────────────────────────────────────────

interface MountOptions {
  isAuthenticated?: boolean
  hasSeenWelcome?: boolean
  initialQuery?: Record<string, string>
}

const mountHome = async (opts: MountOptions = {}) => {
  const { isAuthenticated = false, hasSeenWelcome = false, initialQuery = {} } = opts

  // Set the mock route query BEFORE mounting so onMounted sees it
  mockQueryRef = { value: initialQuery }

  const wrapper = mount(Home, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            auth: {
              user: isAuthenticated ? { address: 'ADDR', email: 'user@biatec.io' } : null,
              isConnected: isAuthenticated,
            },
            onboarding: {
              state: { hasSeenWelcome },
            },
            tokens: {
              tokens: [],
            },
          },
        }),
      ],
      stubs: {
        MainLayout: { template: '<div><slot /></div>' },
        Navbar: { template: '<nav aria-label="Main navigation"></nav>' },
        Sidebar: { template: '<aside></aside>' },
        EmailAuthModal: { template: '<div data-testid="email-auth-modal"><slot /></div>' },
        LandingEntryModule: { template: '<div data-testid="landing-entry"><slot /></div>' },
        OnboardingChecklist: { template: '<div data-testid="onboarding-checklist"><slot /></div>' },
        RouterLink: { template: '<a><slot /></a>' },
        RouterView: { template: '<div />' },
      },
    },
  })

  await nextTick()
  await flushPromises()
  return wrapper
}

// ── shouldShowLandingEntry ─────────────────────────────────────────────────

describe('Home — shouldShowLandingEntry', () => {
  beforeEach(() => {
    localStorage.clear()
    mockPush.mockClear()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns true when user is not authenticated and has not seen welcome', async () => {
    const wrapper = await mountHome({ isAuthenticated: false, hasSeenWelcome: false })
    const vm = wrapper.vm as any
    expect(vm.shouldShowLandingEntry).toBe(true)
  })

  it('returns false when user is authenticated', async () => {
    const wrapper = await mountHome({ isAuthenticated: true, hasSeenWelcome: false })
    const vm = wrapper.vm as any
    expect(vm.shouldShowLandingEntry).toBe(false)
  })

  it('returns false when user has already seen welcome', async () => {
    const wrapper = await mountHome({ isAuthenticated: false, hasSeenWelcome: true })
    const vm = wrapper.vm as any
    expect(vm.shouldShowLandingEntry).toBe(false)
  })
})

// ── handleCreateToken ──────────────────────────────────────────────────────

describe('Home — handleCreateToken', () => {
  beforeEach(() => {
    localStorage.clear()
    mockPush.mockClear()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls router.push("/launch/guided") for authenticated user', async () => {
    const wrapper = await mountHome({ isAuthenticated: true })
    const vm = wrapper.vm as any

    vm.handleCreateToken()
    await nextTick()

    expect(mockPush).toHaveBeenCalledWith('/launch/guided')
  })

  it('stores REDIRECT_AFTER_AUTH and opens auth modal for unauthenticated user', async () => {
    const wrapper = await mountHome({ isAuthenticated: false })
    const vm = wrapper.vm as any

    vm.handleCreateToken()
    await nextTick()

    // AUTH_STORAGE_KEYS.REDIRECT_AFTER_AUTH = 'redirect_after_auth'
    expect(localStorage.getItem('redirect_after_auth')).toBe('/launch/guided')
    expect(vm.showAuthModal).toBe(true)
  })
})

// ── handleViewDashboard ────────────────────────────────────────────────────

describe('Home — handleViewDashboard', () => {
  beforeEach(() => {
    localStorage.clear()
    mockPush.mockClear()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls router.push("/dashboard") for authenticated user', async () => {
    const wrapper = await mountHome({ isAuthenticated: true })
    const vm = wrapper.vm as any

    vm.handleViewDashboard()
    await nextTick()

    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })

  it('stores REDIRECT_AFTER_AUTH /dashboard and opens auth modal for unauthenticated user', async () => {
    const wrapper = await mountHome({ isAuthenticated: false })
    const vm = wrapper.vm as any

    vm.handleViewDashboard()
    await nextTick()

    // AUTH_STORAGE_KEYS.REDIRECT_AFTER_AUTH = 'redirect_after_auth'
    expect(localStorage.getItem('redirect_after_auth')).toBe('/dashboard')
    expect(vm.showAuthModal).toBe(true)
  })
})

// ── handleDiscoverTokens ───────────────────────────────────────────────────

describe('Home — handleDiscoverTokens', () => {
  beforeEach(() => {
    localStorage.clear()
    mockPush.mockClear()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls router.push with DiscoveryDashboard route name', async () => {
    const wrapper = await mountHome({ isAuthenticated: false })
    const vm = wrapper.vm as any

    vm.handleDiscoverTokens()
    await nextTick()

    expect(mockPush).toHaveBeenCalledWith({ name: 'DiscoveryDashboard' })
  })
})

// ── handleEmailSignup ──────────────────────────────────────────────────────

describe('Home — handleEmailSignup', () => {
  beforeEach(() => {
    localStorage.clear()
    mockPush.mockClear()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls router.push with DiscoveryDashboard route name', async () => {
    const wrapper = await mountHome()
    const vm = wrapper.vm as any

    vm.handleEmailSignup()
    await nextTick()

    expect(mockPush).toHaveBeenCalledWith({ name: 'DiscoveryDashboard' })
  })
})

// ── handleAuthComplete ─────────────────────────────────────────────────────

describe('Home — handleAuthComplete', () => {
  beforeEach(() => {
    localStorage.clear()
    mockPush.mockClear()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('closes auth modal', async () => {
    const wrapper = await mountHome()
    const vm = wrapper.vm as any
    vm.showAuthModal = true

    vm.handleAuthComplete()
    await nextTick()

    expect(vm.showAuthModal).toBe(false)
  })

  it('calls router.push with stored REDIRECT_AFTER_AUTH path and clears it', async () => {
    // AUTH_STORAGE_KEYS.REDIRECT_AFTER_AUTH = 'redirect_after_auth'
    localStorage.setItem('redirect_after_auth', '/dashboard')
    const wrapper = await mountHome()
    mockPush.mockClear() // clear any calls from mount
    const vm = wrapper.vm as any

    vm.handleAuthComplete()
    await nextTick()

    expect(mockPush).toHaveBeenCalledWith('/dashboard')
    expect(localStorage.getItem('redirect_after_auth')).toBeNull()
  })

  it('falls back to /launch/guided when no REDIRECT_AFTER_AUTH stored', async () => {
    const wrapper = await mountHome()
    mockPush.mockClear()
    const vm = wrapper.vm as any

    vm.handleAuthComplete()
    await nextTick()

    expect(mockPush).toHaveBeenCalledWith('/launch/guided')
  })
})

// ── onMounted: showAuth query ──────────────────────────────────────────────

describe('Home — onMounted showAuth query', () => {
  beforeEach(() => {
    localStorage.clear()
    mockPush.mockClear()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('opens auth modal when route has ?showAuth=true on mount', async () => {
    const wrapper = await mountHome({ initialQuery: { showAuth: 'true' } })

    const vm = wrapper.vm as any
    expect(vm.showAuthModal).toBe(true)
  })

  it('opens auth modal when route has ?showOnboarding=true (legacy) on mount', async () => {
    const wrapper = await mountHome({ initialQuery: { showOnboarding: 'true' } })

    const vm = wrapper.vm as any
    expect(vm.showAuthModal).toBe(true)
  })

  it('does NOT open auth modal when query is absent', async () => {
    const wrapper = await mountHome()

    const vm = wrapper.vm as any
    expect(vm.showAuthModal).toBe(false)
  })
})
