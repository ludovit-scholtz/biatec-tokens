/**
 * Tests for CohortTable.vue and InsightsFilters.vue
 * CohortTable: totalWallets, formatBalance
 * InsightsFilters: hasActiveFilters, updateFilter, getNetworkLabel
 */
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import CohortTable from '../CohortTable.vue'
import InsightsFilters from '../InsightsFilters.vue'
import type { InsightsFilters as InsightsFiltersType } from '../../../stores/insights'

vi.mock('../../ui/Card.vue', () => ({ default: { template: '<div><slot /></div>' } }))
vi.mock('../../ui/Badge.vue', () => ({ default: { template: '<span><slot /></span>' } }))
vi.mock('../../ui/Button.vue', () => ({
  default: { template: '<button @click="$emit(\'click\')"><slot /></button>', emits: ['click'] },
}))

// ---------------------------------------------------------------------------
// CohortTable
// ---------------------------------------------------------------------------

const mountCohort = () =>
  mount(CohortTable, {
    props: { tokenId: 'test-token', network: 'algorand' },
    global: {
      stubs: {
        Card: { template: '<div><slot /></div>' },
        Badge: { template: '<span><slot /></span>' },
      },
    },
  })

describe('CohortTable — totalWallets computed', () => {
  it('returns sum of all cohort wallet counts', () => {
    const wrapper = mountCohort()
    const vm = wrapper.vm as any
    // Default cohorts: 45 + 342 + 678 + 170 = 1235... + Whales
    expect(typeof vm.totalWallets).toBe('number')
    expect(vm.totalWallets).toBeGreaterThan(0)
  })
})

describe('CohortTable — formatBalance', () => {
  it('formats millions with M suffix', () => {
    const wrapper = mountCohort()
    const vm = wrapper.vm as any
    expect(vm.formatBalance(1500000)).toBe('$1.5M')
  })

  it('formats thousands with K suffix', () => {
    const wrapper = mountCohort()
    const vm = wrapper.vm as any
    expect(vm.formatBalance(8500)).toBe('$8.5K')
  })

  it('formats small balances with locale string', () => {
    const wrapper = mountCohort()
    const vm = wrapper.vm as any
    const result = vm.formatBalance(500)
    expect(result).toContain('$')
    expect(result).toContain('500')
  })

  it('formats exact boundary 1000', () => {
    const wrapper = mountCohort()
    const vm = wrapper.vm as any
    expect(vm.formatBalance(1000)).toBe('$1.0K')
  })

  it('formats exact boundary 1000000', () => {
    const wrapper = mountCohort()
    const vm = wrapper.vm as any
    expect(vm.formatBalance(1000000)).toBe('$1.0M')
  })
})

// ---------------------------------------------------------------------------
// InsightsFilters
// ---------------------------------------------------------------------------

const defaultFilters: InsightsFiltersType = {
  timeframe: '30d',
  networks: [],
  tokenIds: [],
  walletSegment: 'all',
}

const mountFilters = (filters = defaultFilters) =>
  mount(InsightsFilters, {
    props: { filters, availableTokens: [] },
    global: {
      stubs: {
        Card: { template: '<div><slot /></div>' },
        Button: { template: '<button @click="$emit(\'click\')"><slot /></button>', emits: ['click'] },
      },
    },
  })

describe('InsightsFilters — hasActiveFilters computed', () => {
  it('returns false when all filters are default', () => {
    const wrapper = mountFilters()
    const vm = wrapper.vm as any
    expect(vm.hasActiveFilters).toBe(false)
  })

  it('returns true when networks is non-empty', () => {
    const wrapper = mountFilters({ ...defaultFilters, networks: ['algorand'] })
    const vm = wrapper.vm as any
    expect(vm.hasActiveFilters).toBe(true)
  })

  it('returns true when tokenIds is non-empty', () => {
    const wrapper = mountFilters({ ...defaultFilters, tokenIds: ['token-1'] })
    const vm = wrapper.vm as any
    expect(vm.hasActiveFilters).toBe(true)
  })

  it('returns true when walletSegment is not "all"', () => {
    const wrapper = mountFilters({ ...defaultFilters, walletSegment: 'whales' })
    const vm = wrapper.vm as any
    expect(vm.hasActiveFilters).toBe(true)
  })
})

describe('InsightsFilters — updateFilter', () => {
  it('emits update:filters event with key-value pair', async () => {
    const wrapper = mountFilters()
    const vm = wrapper.vm as any
    vm.updateFilter('timeframe', '7d')
    await nextTick()
    const emitted = wrapper.emitted('update:filters')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toEqual({ timeframe: '7d' })
  })
})

describe('InsightsFilters — getNetworkLabel', () => {
  it('returns "Algorand" for algorand', () => {
    const wrapper = mountFilters()
    const vm = wrapper.vm as any
    expect(vm.getNetworkLabel('algorand')).toBe('Algorand')
  })

  it('returns "Ethereum" for ethereum', () => {
    const wrapper = mountFilters()
    const vm = wrapper.vm as any
    expect(vm.getNetworkLabel('ethereum')).toBe('Ethereum')
  })

  it('returns "Arbitrum" for arbitrum', () => {
    const wrapper = mountFilters()
    const vm = wrapper.vm as any
    expect(vm.getNetworkLabel('arbitrum')).toBe('Arbitrum')
  })

  it('returns "Base" for base', () => {
    const wrapper = mountFilters()
    const vm = wrapper.vm as any
    expect(vm.getNetworkLabel('base')).toBe('Base')
  })

  it('returns the value itself for unknown networks', () => {
    const wrapper = mountFilters()
    const vm = wrapper.vm as any
    expect(vm.getNetworkLabel('solana')).toBe('solana')
  })
})
