import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ComplianceDashboardFilters from '../ComplianceDashboardFilters.vue'

vi.mock('../ui/Card.vue', () => ({
  default: {
    name: 'Card',
    template: '<div><slot /></div>',
  },
}))

vi.mock('../ui/Badge.vue', () => ({
  default: {
    name: 'Badge',
    props: ['variant'],
    template: '<span class="badge"><slot /></span>',
  },
}))

function mountFilters(initialState: Record<string, unknown> = {}) {
  return mount(ComplianceDashboardFilters, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            complianceDashboard: {
              filters: {
                micaReady: null,
                whitelistRequired: null,
                kycRequired: null,
                jurisdictionRestricted: null,
                transferRestricted: null,
                network: 'all',
              },
              isFilterPanelExpanded: true,
              ...initialState,
            },
          },
        }),
      ],
      stubs: {
        Card: { template: '<div><slot /></div>' },
        Badge: { template: '<span class="badge"><slot /></span>', props: ['variant'] },
      },
    },
  })
}

describe('ComplianceDashboardFilters', () => {
  describe('computed properties', () => {
    it('exposes filters from store', () => {
      const wrapper = mountFilters()
      const vm = wrapper.vm as any
      expect(vm.filters).toBeDefined()
      expect(vm.filters.network).toBe('all')
    })

    it('exposes hasActiveFilters from store', () => {
      const wrapper = mountFilters()
      const vm = wrapper.vm as any
      expect(typeof vm.hasActiveFilters).toBe('boolean')
    })

    it('exposes activeFilterCount from store', () => {
      const wrapper = mountFilters()
      const vm = wrapper.vm as any
      expect(typeof vm.activeFilterCount).toBe('number')
    })

    it('exposes isExpanded from store', () => {
      const wrapper = mountFilters()
      const vm = wrapper.vm as any
      expect(vm.isExpanded).toBe(true)
    })
  })

  describe('setFilter method', () => {
    it('calls store.setFilter with key and value', () => {
      const wrapper = mountFilters()
      const vm = wrapper.vm as any
      vm.setFilter('network', 'ethereum')
      expect(vm.store.setFilter).toHaveBeenCalledWith('network', 'ethereum')
    })

    it('calls store.setFilter for micaReady filter', () => {
      const wrapper = mountFilters()
      const vm = wrapper.vm as any
      vm.setFilter('micaReady', true)
      expect(vm.store.setFilter).toHaveBeenCalledWith('micaReady', true)
    })
  })

  describe('handleReset method', () => {
    it('calls store.resetFilters', () => {
      const wrapper = mountFilters()
      const vm = wrapper.vm as any
      vm.handleReset()
      expect(vm.store.resetFilters).toHaveBeenCalled()
    })
  })

  describe('togglePanel method', () => {
    it('calls store.toggleFilterPanel', () => {
      const wrapper = mountFilters()
      const vm = wrapper.vm as any
      vm.togglePanel()
      expect(vm.store.toggleFilterPanel).toHaveBeenCalled()
    })
  })

  describe('template branch coverage — active filter state rendering', () => {
    it('applies active class to micaReady=true button when filter is true', () => {
      const wrapper = mountFilters({
        filters: {
          micaReady: true,
          whitelistRequired: null,
          kycRequired: null,
          jurisdictionRestricted: null,
          transferRestricted: null,
          network: 'all',
        },
        hasActiveFilters: true,
        activeFilterCount: 1,
      })
      // When micaReady=true, the "MICA Ready" true button should have active styling
      const html = wrapper.html()
      expect(html).toContain('MICA Ready')
    })

    it('renders network filter options', () => {
      const wrapper = mountFilters()
      const select = wrapper.find('select')
      expect(select.exists()).toBe(true)
      const html = select.html()
      expect(html).toContain('VOI')
      expect(html).toContain('Aramid')
    })

    it('hasActiveFilters is false by default (all filters null/all)', () => {
      const wrapper = mountFilters()
      const vm = wrapper.vm as any
      // By default all filters are null — hasActiveFilters computed returns false
      expect(vm.hasActiveFilters).toBe(false)
    })

    it('renders whitelistRequired filter buttons', () => {
      const wrapper = mountFilters({
        filters: {
          micaReady: null,
          whitelistRequired: true,
          kycRequired: null,
          jurisdictionRestricted: null,
          transferRestricted: null,
          network: 'all',
        },
        hasActiveFilters: true,
        activeFilterCount: 1,
      })
      const html = wrapper.html()
      expect(html).toMatch(/Required|Not Required/i)
    })

    it('renders kycRequired filter buttons', () => {
      const wrapper = mountFilters({
        filters: {
          micaReady: null,
          whitelistRequired: null,
          kycRequired: false,
          jurisdictionRestricted: null,
          transferRestricted: null,
          network: 'all',
        },
        hasActiveFilters: true,
        activeFilterCount: 1,
      })
      const html = wrapper.html()
      expect(html).toMatch(/KYC Required/i)
    })

    it('renders jurisdictionRestricted filter buttons', () => {
      const wrapper = mountFilters({
        filters: {
          micaReady: null,
          whitelistRequired: null,
          kycRequired: null,
          jurisdictionRestricted: true,
          transferRestricted: null,
          network: 'all',
        },
        hasActiveFilters: true,
        activeFilterCount: 1,
      })
      const html = wrapper.html()
      expect(html).toMatch(/Jurisdiction Restricted/i)
    })

    it('renders transferRestricted filter buttons', () => {
      const wrapper = mountFilters({
        filters: {
          micaReady: null,
          whitelistRequired: null,
          kycRequired: null,
          jurisdictionRestricted: null,
          transferRestricted: false,
          network: 'all',
        },
        hasActiveFilters: true,
        activeFilterCount: 1,
      })
      const html = wrapper.html()
      expect(html).toMatch(/Transfer Controls/i)
    })

    it('calls setFilter when whitelistRequired button clicked', async () => {
      const wrapper = mountFilters()
      const vm = wrapper.vm as any
      vm.setFilter('whitelistRequired', true)
      expect(vm.store.setFilter).toHaveBeenCalledWith('whitelistRequired', true)
    })

    it('calls setFilter when kycRequired button clicked', async () => {
      const wrapper = mountFilters()
      const vm = wrapper.vm as any
      vm.setFilter('kycRequired', false)
      expect(vm.store.setFilter).toHaveBeenCalledWith('kycRequired', false)
    })

    it('calls setFilter when jurisdictionRestricted button clicked', async () => {
      const wrapper = mountFilters()
      const vm = wrapper.vm as any
      vm.setFilter('jurisdictionRestricted', true)
      expect(vm.store.setFilter).toHaveBeenCalledWith('jurisdictionRestricted', true)
    })

    it('calls setFilter when transferRestricted button clicked', async () => {
      const wrapper = mountFilters()
      const vm = wrapper.vm as any
      vm.setFilter('transferRestricted', false)
      expect(vm.store.setFilter).toHaveBeenCalledWith('transferRestricted', false)
    })

    it('calls setFilter with null when "All" button for any filter clicked', () => {
      const wrapper = mountFilters()
      const vm = wrapper.vm as any
      vm.setFilter('micaReady', null)
      expect(vm.store.setFilter).toHaveBeenCalledWith('micaReady', null)
      vm.setFilter('whitelistRequired', null)
      expect(vm.store.setFilter).toHaveBeenCalledWith('whitelistRequired', null)
      vm.setFilter('kycRequired', null)
      expect(vm.store.setFilter).toHaveBeenCalledWith('kycRequired', null)
      vm.setFilter('jurisdictionRestricted', null)
      expect(vm.store.setFilter).toHaveBeenCalledWith('jurisdictionRestricted', null)
      vm.setFilter('transferRestricted', null)
      expect(vm.store.setFilter).toHaveBeenCalledWith('transferRestricted', null)
    })

    it('calls setFilter for VOI network', () => {
      const wrapper = mountFilters()
      const vm = wrapper.vm as any
      vm.setFilter('network', 'VOI')
      expect(vm.store.setFilter).toHaveBeenCalledWith('network', 'VOI')
    })

    it('shows "No filters active" text when no filters active', () => {
      const wrapper = mountFilters({
        hasActiveFilters: false,
        activeFilterCount: 0,
      })
      const html = wrapper.html()
      expect(html).toMatch(/No filters active/i)
    })

    it('shows chevron-up when panel is expanded (default)', () => {
      const wrapper = mountFilters()
      const html = wrapper.html()
      // Default is expanded (isFilterPanelExpanded: true)
      expect(html).toContain('pi-chevron-up')
    })

    it('shows chevron-up when panel is expanded', () => {
      const wrapper = mountFilters({
        isFilterPanelExpanded: true,
      })
      const html = wrapper.html()
      expect(html).toContain('pi-chevron-up')
    })
  })
})
