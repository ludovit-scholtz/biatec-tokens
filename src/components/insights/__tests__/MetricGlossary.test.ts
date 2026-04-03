import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MetricGlossary from '../MetricGlossary.vue'
import type { MetricData } from '../../../stores/insights'

// Mock Modal, Button, Badge to avoid Teleport rendering issues
vi.mock('../../ui/Modal.vue', () => ({
  default: {
    name: 'Modal',
    props: ['show', 'size'],
    emits: ['close'],
    template: '<div class="modal-mock" v-if="show"><slot name="header"/><slot /><slot name="footer"/><button class="modal-close" @click="$emit(\'close\')">X</button></div>',
  },
}))
vi.mock('../../ui/Button.vue', () => ({
  default: {
    name: 'Button',
    props: ['variant'],
    emits: ['click'],
    template: '<button class="btn-mock" @click="$emit(\'click\', $event)"><slot /></button>',
  },
}))
vi.mock('../../ui/Badge.vue', () => ({
  default: {
    name: 'Badge',
    props: ['variant', 'size'],
    template: '<span class="badge-mock"><slot /></span>',
  },
}))

const mockMetrics: MetricData[] = [
  {
    id: 'tvl',
    label: 'Total Value Locked',
    value: '$1.5M',
    change: 5.2,
    changeLabel: '+5.2%',
    trend: 'up',
    definition: 'The total value of tokens locked in the protocol.',
    benchmark: '80%',
  },
  {
    id: 'holders',
    label: 'Token Holders',
    value: '1,234',
    change: -2.1,
    changeLabel: '-2.1%',
    trend: 'down',
    definition: 'Number of unique wallet addresses holding tokens.',
    benchmark: undefined,
  },
  {
    id: 'velocity',
    label: 'Token Velocity',
    value: '0.42',
    change: 0,
    changeLabel: '0%',
    trend: 'neutral',
    definition: 'Measure of how quickly tokens change hands.',
    // no value means the "Current value" block should not render
  } as MetricData,
]

describe('MetricGlossary.vue', () => {
  it('renders all provided metrics', () => {
    const wrapper = mount(MetricGlossary, {
      props: { metrics: mockMetrics },
    })
    const rows = wrapper.findAll('.pb-4')
    expect(rows.length).toBe(3)
  })

  it('renders metric label', () => {
    const wrapper = mount(MetricGlossary, {
      props: { metrics: mockMetrics },
    })
    expect(wrapper.text()).toContain('Total Value Locked')
  })

  it('renders metric id as badge', () => {
    const wrapper = mount(MetricGlossary, {
      props: { metrics: mockMetrics },
    })
    expect(wrapper.text()).toContain('tvl')
    expect(wrapper.text()).toContain('holders')
  })

  it('renders metric definition', () => {
    const wrapper = mount(MetricGlossary, {
      props: { metrics: mockMetrics },
    })
    expect(wrapper.text()).toContain('The total value of tokens locked in the protocol.')
  })

  it('renders current value when provided', () => {
    const wrapper = mount(MetricGlossary, {
      props: { metrics: mockMetrics },
    })
    expect(wrapper.text()).toContain('$1.5M')
  })

  it('does not render current value section for metric without value', () => {
    const wrapper = mount(MetricGlossary, {
      props: { metrics: [{ ...mockMetrics[2], value: undefined } as MetricData] },
    })
    expect(wrapper.text()).not.toContain('Current value:')
  })

  it('emits close when close button clicked', async () => {
    const wrapper = mount(MetricGlossary, {
      props: { metrics: mockMetrics },
    })
    await wrapper.find('.modal-close').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close when Close button in footer clicked', async () => {
    const wrapper = mount(MetricGlossary, {
      props: { metrics: mockMetrics },
    })
    await wrapper.find('.btn-mock').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('renders empty list when no metrics', () => {
    const wrapper = mount(MetricGlossary, {
      props: { metrics: [] },
    })
    expect(wrapper.findAll('.pb-4').length).toBe(0)
  })
})
