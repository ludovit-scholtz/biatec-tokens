/**
 * Tests for BenchmarkPanel.vue
 * Covers: lastUpdated computed, formatMetric, getComparisonClass, getComparisonText
 */
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BenchmarkPanel from '../BenchmarkPanel.vue'
import type { CompetitorBenchmark } from '../../../stores/insights'

vi.mock('../../ui/Card.vue', () => ({ default: { template: '<div><slot /></div>' } }))
vi.mock('../../ui/Badge.vue', () => ({ default: { template: '<span><slot /></span>' } }))

const mockBenchmarks: CompetitorBenchmark[] = [
  {
    id: 'bench-1',
    name: 'Competitor A',
    metrics: {
      aum: 1000000,
      tokensIssued: 50,
      avgCompliance: 0.9,
    },
    lastUpdated: '2026-04-01T12:00:00.000Z',
  },
]

const mountPanel = (benchmarks = mockBenchmarks, currentMetrics: Record<string, number | string> = {}) =>
  mount(BenchmarkPanel, {
    props: { benchmarks, currentMetrics },
    global: {
      stubs: { Card: { template: '<div><slot /></div>' }, Badge: { template: '<span><slot /></span>' } },
    },
  })

describe('BenchmarkPanel — lastUpdated computed', () => {
  it('returns N/A when benchmarks array is empty', () => {
    const wrapper = mountPanel([])
    const vm = wrapper.vm as any
    expect(vm.lastUpdated).toBe('N/A')
  })

  it('returns a formatted date string when benchmarks exist', () => {
    const wrapper = mountPanel(mockBenchmarks)
    const vm = wrapper.vm as any
    expect(typeof vm.lastUpdated).toBe('string')
    expect(vm.lastUpdated).not.toBe('N/A')
    expect(vm.lastUpdated.length).toBeGreaterThan(0)
  })
})

describe('BenchmarkPanel — formatMetric', () => {
  it('returns "-" for undefined', () => {
    const wrapper = mountPanel()
    const vm = wrapper.vm as any
    expect(vm.formatMetric(undefined)).toBe('-')
  })

  it('returns "-" for null', () => {
    const wrapper = mountPanel()
    const vm = wrapper.vm as any
    expect(vm.formatMetric(null)).toBe('-')
  })

  it('returns the string value unchanged', () => {
    const wrapper = mountPanel()
    const vm = wrapper.vm as any
    expect(vm.formatMetric('$1,234')).toBe('$1,234')
  })

  it('formats a number to locale string', () => {
    const wrapper = mountPanel()
    const vm = wrapper.vm as any
    // 1000 formatted with toLocaleString() in en-US → "1,000"
    const result = vm.formatMetric(1000)
    expect(result).toMatch(/1[,.]?000/)
  })
})

describe('BenchmarkPanel — getComparisonClass', () => {
  it('returns text-green-400 when yours > theirs', () => {
    const wrapper = mountPanel()
    const vm = wrapper.vm as any
    expect(vm.getComparisonClass(100, 50)).toBe('text-green-400')
  })

  it('returns text-red-400 when yours < theirs', () => {
    const wrapper = mountPanel()
    const vm = wrapper.vm as any
    expect(vm.getComparisonClass(30, 50)).toBe('text-red-400')
  })

  it('returns text-gray-400 when yours === theirs', () => {
    const wrapper = mountPanel()
    const vm = wrapper.vm as any
    expect(vm.getComparisonClass(50, 50)).toBe('text-gray-400')
  })

  it('returns text-gray-400 when yours is a non-numeric string', () => {
    const wrapper = mountPanel()
    const vm = wrapper.vm as any
    expect(vm.getComparisonClass('N/A', 50)).toBe('text-gray-400')
  })

  it('parses yours when it is a numeric string with commas', () => {
    const wrapper = mountPanel()
    const vm = wrapper.vm as any
    // "1,500" parsed → 1500 > 50 → green
    expect(vm.getComparisonClass('1,500', 50)).toBe('text-green-400')
  })
})

describe('BenchmarkPanel — getComparisonText', () => {
  it('returns positive percentage when yours > theirs', () => {
    const wrapper = mountPanel()
    const vm = wrapper.vm as any
    expect(vm.getComparisonText(150, 100)).toBe('+50%')
  })

  it('returns negative percentage when yours < theirs', () => {
    const wrapper = mountPanel()
    const vm = wrapper.vm as any
    expect(vm.getComparisonText(50, 100)).toBe('-50%')
  })

  it('returns "=" when yours === theirs', () => {
    const wrapper = mountPanel()
    const vm = wrapper.vm as any
    expect(vm.getComparisonText(100, 100)).toBe('=')
  })

  it('returns empty string when yours is not a valid number', () => {
    const wrapper = mountPanel()
    const vm = wrapper.vm as any
    expect(vm.getComparisonText('N/A', 100)).toBe('')
  })

  it('parses yours when it is a numeric string', () => {
    const wrapper = mountPanel()
    const vm = wrapper.vm as any
    // "200" as string → 200 / 100 = 100% up
    expect(vm.getComparisonText('200', 100)).toBe('+100%')
  })
})
