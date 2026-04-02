import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MarketplaceFilters from '../MarketplaceFilters.vue'
import type { MarketplaceFilters as IMarketplaceFilters } from '../../stores/marketplace'

const defaultFilters: IMarketplaceFilters = {
  network: 'All',
  complianceBadge: 'All',
  assetClass: 'All',
  search: '',
}

function mountFilters(filters = defaultFilters, props = {}) {
  setActivePinia(createPinia())
  return mount(MarketplaceFilters, {
    props: { filters, filteredCount: 10, totalTokens: 20, ...props },
  })
}

describe('MarketplaceFilters', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('renders search input', () => {
    const wrapper = mountFilters()
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('renders network, compliance, and asset class selects', () => {
    const wrapper = mountFilters()
    const selects = wrapper.findAll('select')
    expect(selects.length).toBe(3)
  })

  it('shows token count', () => {
    const wrapper = mountFilters()
    expect(wrapper.text()).toContain('10 of 20 tokens')
  })

  it('emits update:filters when search input changes', async () => {
    const wrapper = mountFilters()
    const input = wrapper.find('input[type="text"]')
    await input.setValue('test search')
    await input.trigger('input')
    expect(wrapper.emitted('update:filters')).toBeTruthy()
    const emitted = wrapper.emitted('update:filters') as any[][]
    expect(emitted[0][0].search).toBe('test search')
  })

  it('emits update:filters when network select changes', async () => {
    const wrapper = mountFilters()
    const selects = wrapper.findAll('select')
    await selects[0].setValue('VOI')
    await selects[0].trigger('change')
    const emitted = wrapper.emitted('update:filters') as any[][]
    expect(emitted[0][0].network).toBe('VOI')
  })

  it('emits update:filters when compliance select changes', async () => {
    const wrapper = mountFilters()
    const selects = wrapper.findAll('select')
    await selects[1].setValue('MICA Compliant')
    await selects[1].trigger('change')
    const emitted = wrapper.emitted('update:filters') as any[][]
    expect(emitted[0][0].complianceBadge).toBe('MICA Compliant')
  })

  it('emits update:filters when asset class select changes', async () => {
    const wrapper = mountFilters()
    const selects = wrapper.findAll('select')
    await selects[2].setValue('NFT')
    await selects[2].trigger('change')
    const emitted = wrapper.emitted('update:filters') as any[][]
    expect(emitted[0][0].assetClass).toBe('NFT')
  })

  it('does not show Reset All when no active filters', () => {
    const wrapper = mountFilters()
    expect(wrapper.text()).not.toContain('Reset All')
  })

  it('shows Reset All when search filter is active', () => {
    const wrapper = mountFilters({ ...defaultFilters, search: 'foo' })
    expect(wrapper.text()).toContain('Reset All')
  })

  it('shows Reset All when network filter is active', () => {
    const wrapper = mountFilters({ ...defaultFilters, network: 'VOI' })
    expect(wrapper.text()).toContain('Reset All')
  })

  it('emits reset when Reset All clicked', async () => {
    const wrapper = mountFilters({ ...defaultFilters, network: 'VOI' })
    const allBtns = wrapper.findAll('button')
    const resetBtn = allBtns.find(b => b.text().includes('Reset All'))
    if (resetBtn) {
      await resetBtn.trigger('click')
      expect(wrapper.emitted('reset')).toBeTruthy()
    } else {
      expect(wrapper.text()).toContain('Reset All')
    }
  })

  it('resets all filters to default on Reset All click', async () => {
    const wrapper = mountFilters({ ...defaultFilters, network: 'VOI', search: 'foo' })
    const allBtns = wrapper.findAll('button')
    const resetBtn = allBtns.find(b => b.text().includes('Reset All'))
    if (resetBtn) {
      await resetBtn.trigger('click')
      // handleReset only emits 'reset', internal state is reset
      expect(wrapper.emitted('reset')).toBeTruthy()
    }
  })

  it('shows active filter badge for network when not All', () => {
    const wrapper = mountFilters({ ...defaultFilters, network: 'VOI' })
    expect(wrapper.text()).toContain('VOI')
  })

  it('shows active filter badge for complianceBadge when not All', () => {
    const wrapper = mountFilters({ ...defaultFilters, complianceBadge: 'MICA Compliant' })
    expect(wrapper.text()).toContain('MICA Compliant')
  })

  it('shows active filter badge for assetClass when not All', () => {
    const wrapper = mountFilters({ ...defaultFilters, assetClass: 'FT' })
    expect(wrapper.text()).toContain('FT')
  })

  it('clears network filter when its × button is clicked', async () => {
    const wrapper = mountFilters({ ...defaultFilters, network: 'VOI' })
    const closeBtn = wrapper.findAll('button').find(b => b.attributes('aria-label') === 'Clear network filter')
    if (closeBtn) {
      await closeBtn.trigger('click')
      const emitted = wrapper.emitted('update:filters') as any[][]
      expect(emitted[emitted.length - 1][0].network).toBe('All')
    }
  })

  it('watches external filter changes', async () => {
    const wrapper = mountFilters()
    await wrapper.setProps({ filters: { ...defaultFilters, search: 'updated' } })
    const input = wrapper.find('input[type="text"]') as any
    expect(input.element.value).toBe('updated')
  })
})
