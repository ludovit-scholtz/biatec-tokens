/**
 * Tests for MetricCard.vue
 * Covers: trendIcon computed (up/down/stable), trendColorClass computed, formatChange
 */
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MetricCard from '../MetricCard.vue'
import type { MetricData } from '../../../stores/insights'

vi.mock('@heroicons/vue/24/outline', () => ({
  ArrowTrendingUpIcon: { template: '<svg data-icon="up" />' },
  ArrowTrendingDownIcon: { template: '<svg data-icon="down" />' },
  MinusIcon: { template: '<svg data-icon="minus" />' },
  QuestionMarkCircleIcon: { template: '<svg />' },
}))
vi.mock('../../ui/Card.vue', () => ({ default: { template: '<div><slot /></div>' } }))
vi.mock('../../ui/Badge.vue', () => ({ default: { template: '<span><slot /></span>' } }))
vi.mock('../../ui/Tooltip.vue', () => ({ default: { template: '<div><slot /></div>' } }))

const makeMetric = (trend: 'up' | 'down' | 'stable', change = 5): MetricData => ({
  id: 'test_metric',
  label: 'Test Metric',
  value: 100,
  change,
  trend,
  definition: 'Test definition',
  timestamp: '2026-04-01T00:00:00Z',
})

const mountCard = (trend: 'up' | 'down' | 'stable', change = 5) =>
  mount(MetricCard, {
    props: { metric: makeMetric(trend, change) },
    global: { stubs: { Card: { template: '<div><slot /></div>' }, Badge: { template: '<span><slot /></span>' } } },
  })

describe('MetricCard — trendIcon computed', () => {
  it('returns ArrowTrendingUpIcon for trend=up', () => {
    const wrapper = mountCard('up')
    const vm = wrapper.vm as any
    expect(vm.trendIcon.template).toContain('up')
  })

  it('returns ArrowTrendingDownIcon for trend=down', () => {
    const wrapper = mountCard('down')
    const vm = wrapper.vm as any
    expect(vm.trendIcon.template).toContain('down')
  })

  it('returns MinusIcon for trend=stable', () => {
    const wrapper = mountCard('stable')
    const vm = wrapper.vm as any
    expect(vm.trendIcon.template).toContain('minus')
  })
})

describe('MetricCard — trendColorClass computed', () => {
  it('returns text-green-400 for trend=up', () => {
    const wrapper = mountCard('up')
    const vm = wrapper.vm as any
    expect(vm.trendColorClass).toBe('text-green-400')
  })

  it('returns text-red-400 for trend=down', () => {
    const wrapper = mountCard('down')
    const vm = wrapper.vm as any
    expect(vm.trendColorClass).toBe('text-red-400')
  })

  it('returns text-gray-400 for trend=stable', () => {
    const wrapper = mountCard('stable')
    const vm = wrapper.vm as any
    expect(vm.trendColorClass).toBe('text-gray-400')
  })
})

describe('MetricCard — formatChange', () => {
  it('formats positive change with + prefix', () => {
    const wrapper = mountCard('up', 7.5)
    const vm = wrapper.vm as any
    expect(vm.formatChange(7.5)).toBe('+7.5%')
  })

  it('formats negative change without + prefix', () => {
    const wrapper = mountCard('down', -3.2)
    const vm = wrapper.vm as any
    expect(vm.formatChange(-3.2)).toBe('-3.2%')
  })

  it('formats 0 change as 0.0% (no + prefix for zero)', () => {
    const wrapper = mountCard('stable', 0)
    const vm = wrapper.vm as any
    expect(vm.formatChange(0)).toBe('0.0%')
  })
})
