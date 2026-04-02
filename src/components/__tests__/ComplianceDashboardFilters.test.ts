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
})
