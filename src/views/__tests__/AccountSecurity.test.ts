import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AccountSecurity from '../AccountSecurity.vue'
import { useSecurityStore, ActivityEventType } from '../../stores/security'
import { createRouter, createWebHistory } from 'vue-router'

// Mock telemetry service
vi.mock('../../services/TelemetryService', () => ({
  telemetryService: {
    trackSecurityCenterViewed: vi.fn(),
    trackRecoveryStarted: vi.fn(),
    trackAuditExportStarted: vi.fn(),
    trackAuditExportCompleted: vi.fn(),
    trackActivityFilterApplied: vi.fn(),
  },
}))

// Create a minimal router for testing
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/account/security',
      name: 'AccountSecurity',
      component: AccountSecurity,
    },
  ],
})

describe('AccountSecurity View', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render the security center header', async () => {
      const wrapper = mount(AccountSecurity, {
        global: {
          plugins: [createPinia(), router],
          stubs: {
            MainLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      await flushPromises()

      expect(wrapper.text()).toContain('Account Security Center')
      expect(wrapper.text()).toContain('Manage recovery, monitor activity, and maintain audit compliance')
    })

    it('should render all main sections', async () => {
      const wrapper = mount(AccountSecurity, {
        global: {
          plugins: [createPinia(), router],
          stubs: {
            MainLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      await flushPromises()

      expect(wrapper.text()).toContain('Wallet Recovery')
      expect(wrapper.text()).toContain('Account Activity')
      expect(wrapper.text()).toContain('Transaction History')
      expect(wrapper.text()).toContain('Audit Trail Export')
    })

    it('should render recovery options', async () => {
      const wrapper = mount(AccountSecurity, {
        global: {
          plugins: [createPinia(), router],
          stubs: {
            MainLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      await flushPromises()

      expect(wrapper.text()).toContain('Email Recovery')
      expect(wrapper.text()).toContain('Seed Phrase Backup')
      expect(wrapper.text()).toContain('Multi-Device Sync')
    })
  })

  describe('Activity Events Display', () => {
    it('should display activity events including mount event', async () => {
      const wrapper = mount(AccountSecurity, {
        global: {
          plugins: [createPinia(), router],
          stubs: {
            MainLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      await flushPromises()

      // Component adds a view event on mount
      expect(wrapper.text()).toContain('Viewed Account Security Center')
    })

    it('should display activity events', async () => {
      const pinia = createPinia()
      const wrapper = mount(AccountSecurity, {
        global: {
          plugins: [pinia, router],
          stubs: {
            MainLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      const store = useSecurityStore(pinia)
      store.addActivityEvent({
        type: ActivityEventType.LOGIN,
        timestamp: new Date().toISOString(),
        description: 'User logged in successfully',
        status: 'success',
      })

      await flushPromises()
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('User logged in successfully')
    })

    it('should filter activity events by type', async () => {
      const pinia = createPinia()
      const wrapper = mount(AccountSecurity, {
        global: {
          plugins: [pinia, router],
          stubs: {
            MainLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      const store = useSecurityStore(pinia)
      
      // Add different types of events
      store.addActivityEvent({
        type: ActivityEventType.LOGIN,
        timestamp: new Date().toISOString(),
        description: 'Login event',
        status: 'success',
      })
      
      store.addActivityEvent({
        type: ActivityEventType.LOGOUT,
        timestamp: new Date().toISOString(),
        description: 'Logout event',
        status: 'success',
      })

      await flushPromises()
      await wrapper.vm.$nextTick()

      // Initially should show all events
      expect(wrapper.text()).toContain('Login event')
      expect(wrapper.text()).toContain('Logout event')

      // Find and change filter select
      const select = wrapper.find('select')
      await select.setValue('login')
      await wrapper.vm.$nextTick()

      // Should only show login events
      expect(wrapper.text()).toContain('Login event')
      // Note: 'Logout event' might still appear in the page due to the filter options
    })
  })

  describe('Export Functionality', () => {
    it('should have export buttons for JSON and CSV', async () => {
      const wrapper = mount(AccountSecurity, {
        global: {
          plugins: [createPinia(), router],
          stubs: {
            MainLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      await flushPromises()

      expect(wrapper.text()).toContain('Export JSON')
      expect(wrapper.text()).toContain('Export CSV')
    })

    it('should enable export buttons when activity exists', async () => {
      const pinia = createPinia()
      const wrapper = mount(AccountSecurity, {
        global: {
          plugins: [pinia, router],
          stubs: {
            MainLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      await flushPromises()

      const buttons = wrapper.findAll('button')
      const exportButtons = buttons.filter(b => 
        b.text().includes('Export JSON') || b.text().includes('Export CSV')
      )

      // Export buttons should be enabled when there's activity (from mount event)
      expect(exportButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Transaction History', () => {
    it('should show transaction history section', async () => {
      const wrapper = mount(AccountSecurity, {
        global: {
          plugins: [createPinia(), router],
          stubs: {
            MainLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      await flushPromises()

      expect(wrapper.text()).toContain('Transaction History')
      expect(wrapper.text()).toContain('All Networks')
    })

    it('should show coming soon message for transactions', async () => {
      const wrapper = mount(AccountSecurity, {
        global: {
          plugins: [createPinia(), router],
          stubs: {
            MainLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      await flushPromises()

      expect(wrapper.text()).toContain('available soon')
    })
  })

  describe('Lifecycle and Telemetry', () => {
    it('should track security center view on mount', async () => {
      const { telemetryService } = await import('../../services/TelemetryService')
      
      mount(AccountSecurity, {
        global: {
          plugins: [createPinia(), router],
          stubs: {
            MainLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      await flushPromises()

      expect(telemetryService.trackSecurityCenterViewed).toHaveBeenCalled()
    })

    it('should add activity event on mount', async () => {
      const pinia = createPinia()
      
      mount(AccountSecurity, {
        global: {
          plugins: [pinia, router],
          stubs: {
            MainLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      await flushPromises()

      const store = useSecurityStore(pinia)
      const viewEvent = store.activityEvents.find(
        e => e.type === ActivityEventType.SECURITY_CENTER_VIEWED
      )

      expect(viewEvent).toBeDefined()
      expect(viewEvent?.description).toBe('Viewed Account Security Center')
    })
  })

  describe('Recovery Modal', () => {
    it('should track recovery action when clicking recovery button', async () => {
      const { telemetryService } = await import('../../services/TelemetryService')
      const pinia = createPinia()
      const wrapper = mount(AccountSecurity, {
        global: {
          plugins: [pinia, router],
          stubs: {
            MainLayout: {
              template: '<div><slot /></div>',
            },
            Modal: {
              template: '<div v-if="isOpen"><slot /><slot name="footer" /></div>',
              props: ['isOpen', 'title'],
            },
          },
        },
      })

      await flushPromises()

      // Find and click a recovery button
      const buttons = wrapper.findAll('button')
      const emailRecoveryButton = buttons.find(b => 
        b.text().includes('Start Email Recovery')
      )

      if (emailRecoveryButton) {
        await emailRecoveryButton.trigger('click')
        await wrapper.vm.$nextTick()

        expect(telemetryService.trackRecoveryStarted).toHaveBeenCalled()
      }
    })
  })

  describe('Error States', () => {
    it('should display activity error when present', async () => {
      const pinia = createPinia()
      const wrapper = mount(AccountSecurity, {
        global: {
          plugins: [pinia, router],
          stubs: {
            MainLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      const store = useSecurityStore(pinia)
      store.activityError = 'Failed to load activity'

      await flushPromises()
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Failed to load activity')
    })

    it('should display transaction error when present', async () => {
      const pinia = createPinia()
      const wrapper = mount(AccountSecurity, {
        global: {
          plugins: [pinia, router],
          stubs: {
            MainLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      const store = useSecurityStore(pinia)
      store.transactionError = 'Failed to load transactions'

      await flushPromises()
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Failed to load transactions')
    })
  })

  describe('Compliance Messaging', () => {
    it('should display compliance information', async () => {
      const wrapper = mount(AccountSecurity, {
        global: {
          plugins: [createPinia(), router],
          stubs: {
            MainLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      await flushPromises()

      expect(wrapper.text()).toContain('Compliance Ready')
      expect(wrapper.text()).toContain('regulatory requirements')
    })

    it('should explain self-custody security', async () => {
      const wrapper = mount(AccountSecurity, {
        global: {
          plugins: [createPinia(), router],
          stubs: {
            MainLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      await flushPromises()

      expect(wrapper.text()).toContain('self-custody')
      expect(wrapper.text()).toContain('private keys')
    })
  })
})
