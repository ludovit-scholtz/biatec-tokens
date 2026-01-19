import { describe, it, expect, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../stores/auth'

// Import route configuration without the guard
import Home from '../views/Home.vue'
import TokenCreator from '../views/TokenCreator.vue'
import TokenDashboard from '../views/TokenDashboard.vue'
import Settings from '../views/Settings.vue'
import Pricing from '../views/subscription/Pricing.vue'
import Success from '../views/subscription/Success.vue'
import Cancel from '../views/subscription/Cancel.vue'

// Route guard timeout constant
const AUTH_TIMEOUT_MS = 10000

describe('Navigation Guards', () => {
  let router: any
  let authStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    authStore = useAuthStore()
    localStorage.clear()

    // Create router with routes but without guards for testing
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          name: 'Home',
          component: Home,
        },
        {
          path: '/create',
          name: 'TokenCreator',
          component: TokenCreator,
          meta: { requiresAuth: true },
        },
        {
          path: '/dashboard',
          name: 'TokenDashboard',
          component: TokenDashboard,
          meta: { requiresAuth: true },
        },
        {
          path: '/settings',
          name: 'Settings',
          component: Settings,
          meta: { requiresAuth: true },
        },
        {
          path: '/subscription/pricing',
          name: 'Pricing',
          component: Pricing,
        },
        {
          path: '/subscription/success',
          name: 'SubscriptionSuccess',
          component: Success,
          meta: { requiresAuth: true },
        },
        {
          path: '/subscription/cancel',
          name: 'SubscriptionCancel',
          component: Cancel,
        },
      ],
    })

    // Add the route guard manually for testing
    router.beforeEach(async (to: any, _from: any, next: any) => {
      const authStore = useAuthStore()
      
      if (authStore.loading) {
        let unwatch: (() => void) | undefined
        try {
          const timeout = new Promise(resolve => setTimeout(() => resolve(false), AUTH_TIMEOUT_MS))
          const waitForInit = new Promise(resolve => {
            unwatch = authStore.$subscribe(() => {
              if (!authStore.loading) {
                resolve(true)
              }
            })
            if (!authStore.loading) {
              resolve(true)
            }
          })
          
          await Promise.race([waitForInit, timeout])
        } finally {
          unwatch?.()
        }
      }
      
      if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'Home' })
      } else {
        next()
      }
    })
  })

  describe('unauthenticated users', () => {
    it('redirects unauthenticated users from /create to Home', async () => {
      expect(authStore.isAuthenticated).toBe(false)

      await router.push('/create')
      await router.isReady()

      expect(router.currentRoute.value.name).toBe('Home')
      expect(router.currentRoute.value.path).toBe('/')
    })

    it('redirects unauthenticated users from /dashboard to Home', async () => {
      expect(authStore.isAuthenticated).toBe(false)

      await router.push('/dashboard')
      await router.isReady()

      expect(router.currentRoute.value.name).toBe('Home')
    })

    it('redirects unauthenticated users from /settings to Home', async () => {
      expect(authStore.isAuthenticated).toBe(false)

      await router.push('/settings')
      await router.isReady()

      expect(router.currentRoute.value.name).toBe('Home')
    })

    it('redirects unauthenticated users from /subscription/success to Home', async () => {
      expect(authStore.isAuthenticated).toBe(false)

      await router.push('/subscription/success')
      await router.isReady()

      expect(router.currentRoute.value.name).toBe('Home')
    })

    it('allows access to public routes', async () => {
      expect(authStore.isAuthenticated).toBe(false)

      await router.push('/')
      await router.isReady()
      expect(router.currentRoute.value.name).toBe('Home')

      await router.push('/subscription/pricing')
      await router.isReady()
      expect(router.currentRoute.value.name).toBe('Pricing')

      await router.push('/subscription/cancel')
      await router.isReady()
      expect(router.currentRoute.value.name).toBe('SubscriptionCancel')
    })
  })

  describe('authenticated users', () => {
    beforeEach(async () => {
      await authStore.connectWallet('TEST_ADDRESS_123')
    })

    it('allows authenticated users to access /create', async () => {
      expect(authStore.isAuthenticated).toBe(true)

      await router.push('/create')
      await router.isReady()

      expect(router.currentRoute.value.name).toBe('TokenCreator')
      expect(router.currentRoute.value.path).toBe('/create')
    })

    it('allows authenticated users to access /dashboard', async () => {
      expect(authStore.isAuthenticated).toBe(true)

      await router.push('/dashboard')
      await router.isReady()

      expect(router.currentRoute.value.name).toBe('TokenDashboard')
    })

    it('allows authenticated users to access /settings', async () => {
      expect(authStore.isAuthenticated).toBe(true)

      await router.push('/settings')
      await router.isReady()

      expect(router.currentRoute.value.name).toBe('Settings')
    })

    it('allows authenticated users to access /subscription/success', async () => {
      expect(authStore.isAuthenticated).toBe(true)

      await router.push('/subscription/success')
      await router.isReady()

      expect(router.currentRoute.value.name).toBe('SubscriptionSuccess')
    })
  })

  describe('auth initialization handling', () => {
    it('waits for auth store to complete initialization', async () => {
      authStore.loading = true
      
      // Simulate auth completing
      setTimeout(async () => {
        await authStore.connectWallet('TEST_ADDRESS')
        authStore.loading = false
      }, 50)

      await router.push('/create')
      await router.isReady()

      expect(router.currentRoute.value.name).toBe('TokenCreator')
    })

    it('continues immediately if auth is not loading', async () => {
      // Auth is not loading
      authStore.loading = false
      await authStore.connectWallet('TEST_ADDRESS')

      await router.push('/create')
      await router.isReady()

      expect(router.currentRoute.value.name).toBe('TokenCreator')
    })
  })

  describe('memory leak prevention', () => {
    it('ensures cleanup function is available', () => {
      // Verify that $subscribe returns a cleanup function
      authStore.loading = true
      const unwatch = authStore.$subscribe(() => {})
      
      expect(typeof unwatch).toBe('function')
      unwatch()
    })
  })

  describe('edge cases', () => {
    it('handles multiple rapid navigation attempts', async () => {
      expect(authStore.isAuthenticated).toBe(false)

      // Rapidly try to navigate to multiple protected routes
      const promises = [
        router.push('/create'),
        router.push('/dashboard'),
        router.push('/settings'),
      ]

      await Promise.all(promises)
      await router.isReady()

      // Should end up on home for all attempts
      expect(router.currentRoute.value.name).toBe('Home')
    })

    it('handles auth state changes during navigation', async () => {
      expect(authStore.isAuthenticated).toBe(false)

      const navPromise = router.push('/create')
      
      // Authenticate during navigation
      await authStore.connectWallet('TEST_ADDRESS')
      
      await navPromise
      await router.isReady()

      // Should allow access since user authenticated
      expect(router.currentRoute.value.name).toBe('TokenCreator')
    })

    it('handles sign out during navigation', async () => {
      await authStore.connectWallet('TEST_ADDRESS')
      expect(authStore.isAuthenticated).toBe(true)

      const navPromise = router.push('/dashboard')
      
      // Sign out during navigation
      await authStore.signOut()
      
      await navPromise
      await router.isReady()

      // Should redirect since user signed out
      expect(router.currentRoute.value.name).toBe('Home')
    })
  })
})
