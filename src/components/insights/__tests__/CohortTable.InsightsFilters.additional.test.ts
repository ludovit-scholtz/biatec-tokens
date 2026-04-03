import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import CohortTable from '../CohortTable.vue'
import InsightsFilters from '../InsightsFilters.vue'

// Mock Card, Badge, Select to avoid deep dependency graph
vi.mock('../../ui/Card.vue', () => ({
  default: {
    name: 'Card',
    template: '<div class="card-mock"><slot name="header"/><slot /><slot name="footer"/></div>',
  },
}))
vi.mock('../../ui/Badge.vue', () => ({
  default: {
    name: 'Badge',
    template: '<span class="badge-mock"><slot /></span>',
  },
}))
vi.mock('../../ui/Select.vue', () => ({
  default: {
    name: 'Select',
    props: ['modelValue', 'options'],
    emits: ['update:modelValue'],
    template: '<select class="select-mock" @change="$emit(\'update:modelValue\', $event.target.value)"><option v-for="o in options" :key="o.value||o" :value="o.value||o">{{o.label||o}}</option></select>',
  },
}))

describe('CohortTable.vue', () => {
  it('renders the table', () => {
    const wrapper = mount(CohortTable)
    expect(wrapper.find('table').exists()).toBe(true)
  })

  it('renders 5 cohort rows', () => {
    const wrapper = mount(CohortTable)
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(5)
  })

  it('renders Whales segment', () => {
    const wrapper = mount(CohortTable)
    expect(wrapper.text()).toContain('Whales')
  })

  it('renders total row in footer', () => {
    const wrapper = mount(CohortTable)
    const footer = wrapper.find('tfoot')
    expect(footer.text()).toContain('Total')
    expect(footer.text()).toContain('1,247')
  })

  it('formats balance in millions', () => {
    const wrapper = mount(CohortTable)
    // Whales avg balance = 2500000 -> $2.5M
    expect(wrapper.text()).toContain('$2.5M')
  })

  it('formats balance in thousands', () => {
    const wrapper = mount(CohortTable)
    // Active avg balance = 125000 -> $125.0K
    expect(wrapper.text()).toContain('$125.0K')
  })

  it('formats small balance as K (below million)', () => {
    const wrapper = mount(CohortTable)
    // Dormant avg balance = 3200 -> $3.2K (>= 1000)
    expect(wrapper.text()).toContain('$3.2K')
  })

  it('renders activity score percentage', () => {
    const wrapper = mount(CohortTable)
    // Whales activity = 85%
    expect(wrapper.text()).toContain('85%')
  })
})

describe('InsightsFilters.vue', () => {
  const defaultFilters = {
    timeframe: '30d' as const,
    networks: [] as string[],
    tokenIds: [] as string[],
    walletSegment: 'all',
  }

  it('renders timeframe select', () => {
    const wrapper = mount(InsightsFilters, {
      props: { filters: defaultFilters },
      global: { plugins: [createTestingPinia()] },
    })
    expect(wrapper.find('.select-mock').exists()).toBe(true)
  })

  it('does not show Reset All when no active filters', () => {
    const wrapper = mount(InsightsFilters, {
      props: { filters: defaultFilters },
      global: { plugins: [createTestingPinia()] },
    })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('shows Reset All when networks filter active', () => {
    const wrapper = mount(InsightsFilters, {
      props: {
        filters: { ...defaultFilters, networks: ['algorand'] },
      },
      global: { plugins: [createTestingPinia()] },
    })
    expect(wrapper.find('button').text()).toContain('Reset All')
  })

  it('shows Reset All when walletSegment is not all', () => {
    const wrapper = mount(InsightsFilters, {
      props: {
        filters: { ...defaultFilters, walletSegment: 'whales' },
      },
      global: { plugins: [createTestingPinia()] },
    })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('emits reset when Reset All clicked', async () => {
    const wrapper = mount(InsightsFilters, {
      props: {
        filters: { ...defaultFilters, networks: ['algorand'] },
      },
      global: { plugins: [createTestingPinia()] },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('reset')).toBeTruthy()
  })

  it('emits update:filters when timeframe changes', async () => {
    const wrapper = mount(InsightsFilters, {
      props: { filters: defaultFilters },
      global: { plugins: [createTestingPinia()] },
    })
    const selects = wrapper.findAll('.select-mock')
    await selects[0].setValue('7d')
    expect(wrapper.emitted('update:filters')).toBeTruthy()
  })

  it('shows active network badge', () => {
    const wrapper = mount(InsightsFilters, {
      props: {
        filters: { ...defaultFilters, networks: ['algorand'] },
      },
      global: { plugins: [createTestingPinia()] },
    })
    expect(wrapper.text()).toContain('Algorand')
  })

  it('shows active walletSegment badge', () => {
    const wrapper = mount(InsightsFilters, {
      props: {
        filters: { ...defaultFilters, walletSegment: 'whales' },
      },
      global: { plugins: [createTestingPinia()] },
    })
    expect(wrapper.text()).toContain('whales')
  })

  it('getNetworkLabel returns ethereum label', () => {
    const wrapper = mount(InsightsFilters, {
      props: {
        filters: { ...defaultFilters, networks: ['ethereum'] },
      },
      global: { plugins: [createTestingPinia()] },
    })
    expect(wrapper.text()).toContain('Ethereum')
  })

  it('getNetworkLabel returns unknown value as-is', () => {
    const wrapper = mount(InsightsFilters, {
      props: {
        filters: { ...defaultFilters, networks: ['unknown-net'] },
      },
      global: { plugins: [createTestingPinia()] },
    })
    expect(wrapper.text()).toContain('unknown-net')
  })
})
