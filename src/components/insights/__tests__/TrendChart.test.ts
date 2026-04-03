/**
 * Tests for TrendChart.vue
 * Covers: chartPoints, linePath, areaPath, firstLabel, lastLabel, tooltipData computed,
 *         showTooltip, hideTooltip
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TrendChart from '../TrendChart.vue'

const mockData = [
  { timestamp: '2026-03-01T00:00:00Z', value: 100, label: 'Mar 1' },
  { timestamp: '2026-03-15T00:00:00Z', value: 150, label: 'Mar 15' },
  { timestamp: '2026-04-01T00:00:00Z', value: 120, label: 'Apr 1' },
]

const mountChart = (data = mockData) =>
  mount(TrendChart, {
    props: { data, metricId: 'test_metric', label: 'Test Metric', unit: '$' },
  })

describe('TrendChart — chartPoints computed', () => {
  it('returns empty array when data is empty', () => {
    const wrapper = mountChart([])
    const vm = wrapper.vm as any
    expect(vm.chartPoints).toEqual([])
  })

  it('returns correct count of points matching data length', () => {
    const wrapper = mountChart(mockData)
    const vm = wrapper.vm as any
    expect(vm.chartPoints.length).toBe(3)
  })

  it('each chart point has x, y, value, label properties', () => {
    const wrapper = mountChart(mockData)
    const vm = wrapper.vm as any
    const [first] = vm.chartPoints
    expect(typeof first.x).toBe('number')
    expect(typeof first.y).toBe('number')
    expect(first.value).toBe(100)
    expect(first.label).toBe('Mar 1')
  })

  it('handles data with constant values (range=0 fallback)', () => {
    const flat = [
      { timestamp: '2026-03-01T00:00:00Z', value: 50, label: 'flat' },
      { timestamp: '2026-03-02T00:00:00Z', value: 50, label: 'flat' },
    ]
    const wrapper = mountChart(flat)
    const vm = wrapper.vm as any
    expect(vm.chartPoints.length).toBe(2)
  })
})

describe('TrendChart — linePath computed', () => {
  it('returns empty string when data is empty', () => {
    const wrapper = mountChart([])
    const vm = wrapper.vm as any
    expect(vm.linePath).toBe('')
  })

  it('returns a path string starting with M for non-empty data', () => {
    const wrapper = mountChart(mockData)
    const vm = wrapper.vm as any
    expect(vm.linePath).toMatch(/^M /)
  })
})

describe('TrendChart — areaPath computed', () => {
  it('returns empty string when data is empty', () => {
    const wrapper = mountChart([])
    const vm = wrapper.vm as any
    expect(vm.areaPath).toBe('')
  })

  it('returns a closed path string (ends with Z) for non-empty data', () => {
    const wrapper = mountChart(mockData)
    const vm = wrapper.vm as any
    expect(vm.areaPath).toMatch(/Z$/)
  })
})

describe('TrendChart — firstLabel / lastLabel computed', () => {
  it('returns empty string for empty data', () => {
    const wrapper = mountChart([])
    const vm = wrapper.vm as any
    expect(vm.firstLabel).toBe('')
    expect(vm.lastLabel).toBe('')
  })

  it('returns formatted date string for non-empty data', () => {
    const wrapper = mountChart(mockData)
    const vm = wrapper.vm as any
    expect(typeof vm.firstLabel).toBe('string')
    expect(vm.firstLabel.length).toBeGreaterThan(0)
    expect(typeof vm.lastLabel).toBe('string')
    expect(vm.lastLabel.length).toBeGreaterThan(0)
  })
})

describe('TrendChart — tooltipData computed', () => {
  it('returns null when tooltipIndex is null', () => {
    const wrapper = mountChart(mockData)
    const vm = wrapper.vm as any
    vm.tooltipIndex = null
    expect(vm.tooltipData).toBeNull()
  })

  it('returns the correct chart point when tooltipIndex is set', () => {
    const wrapper = mountChart(mockData)
    const vm = wrapper.vm as any
    vm.tooltipIndex = 1
    expect(vm.tooltipData?.value).toBe(150)
  })
})

describe('TrendChart — showTooltip / hideTooltip', () => {
  it('showTooltip sets tooltipIndex and makes tooltip visible', async () => {
    const wrapper = mountChart(mockData)
    const vm = wrapper.vm as any
    vm.showTooltip(0)
    await nextTick()
    expect(vm.tooltipIndex).toBe(0)
    expect(vm.tooltipVisible).toBe(true)
  })

  it('showTooltip sets tooltipX and tooltipY from chart point', async () => {
    const wrapper = mountChart(mockData)
    const vm = wrapper.vm as any
    vm.showTooltip(1)
    await nextTick()
    expect(typeof vm.tooltipX).toBe('number')
    expect(typeof vm.tooltipY).toBe('number')
  })

  it('hideTooltip clears tooltipVisible and index', async () => {
    const wrapper = mountChart(mockData)
    const vm = wrapper.vm as any
    vm.showTooltip(0)
    await nextTick()
    vm.hideTooltip()
    await nextTick()
    expect(vm.tooltipVisible).toBe(false)
    expect(vm.tooltipIndex).toBeNull()
  })
})
