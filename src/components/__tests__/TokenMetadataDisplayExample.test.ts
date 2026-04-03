import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import TokenMetadataDisplayExample from '../TokenMetadataDisplayExample.vue'

// Mock sub-components
vi.mock('../MetadataStatusBadge.vue', () => ({
  default: {
    name: 'MetadataStatusBadge',
    props: ['result'],
    template: '<div class="mock-badge">MetadataStatusBadge</div>',
  },
}))

vi.mock('../MetadataValidationPanel.vue', () => ({
  default: {
    name: 'MetadataValidationPanel',
    props: ['result', 'normalized'],
    template: '<div class="mock-validation-panel">MetadataValidationPanel</div>',
  },
}))

function makeWrapper() {
  return mount(TokenMetadataDisplayExample, {
    global: { plugins: [createPinia()] },
  })
}

describe('TokenMetadataDisplayExample.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders without errors', () => {
    const wrapper = makeWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('shows loading state initially', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    expect(vm.loading).toBe(true)
  })

  it('loads data after 1 second timeout', async () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    expect(vm.loading).toBe(true)
    
    await vi.advanceTimersByTimeAsync(1000)
    await nextTick()
    
    expect(vm.loading).toBe(false)
    expect(vm.validationResult).not.toBeNull()
    expect(vm.normalizedMetadata).not.toBeNull()
  })

  it('sets validationResult with correct data after loading', async () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    
    await vi.advanceTimersByTimeAsync(1000)
    await nextTick()
    
    expect(vm.validationResult.isValid).toBe(true)
    expect(vm.validationResult.standard).toBe('ARC3')
    expect(vm.validationResult.score).toBe(85)
    expect(vm.validationResult.issues.length).toBe(2)
    expect(vm.validationResult.passedChecks.length).toBe(5)
  })

  it('sets normalizedMetadata with correct data after loading', async () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    
    await vi.advanceTimersByTimeAsync(1000)
    await nextTick()
    
    expect(vm.normalizedMetadata.title).toBe('Example Token')
    expect(vm.normalizedMetadata.standard).toBe('ARC3')
    expect(vm.normalizedMetadata.unitName).toBe('DEMO')
    expect(vm.normalizedMetadata.decimals).toBe(6)
  })

  it('handleImageError sets imageResolved to false', async () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    
    await vi.advanceTimersByTimeAsync(1000)
    await nextTick()
    
    expect(vm.normalizedMetadata.imageResolved).toBe(true)
    vm.handleImageError()
    expect(vm.normalizedMetadata.imageResolved).toBe(false)
  })

  it('handleImageError does nothing if normalizedMetadata is null', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    // normalizedMetadata starts null
    expect(() => vm.handleImageError()).not.toThrow()
  })

  it('formatSupply formats millions correctly', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    // 1000000 supply with 0 decimals = 1M
    expect(vm.formatSupply('1000000', 0)).toBe('1.00M')
  })

  it('formatSupply formats thousands correctly', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    // 1000000 supply with 3 decimals = 1K
    expect(vm.formatSupply('1000000', 3)).toBe('1.00K')
  })

  it('formatSupply formats small numbers with locale', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    // 500 supply with 0 decimals
    const result = vm.formatSupply('500', 0)
    expect(result).toBe('500')
  })

  it('formatSupply handles NaN input', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    expect(vm.formatSupply('invalid', 6)).toBe('invalid')
  })

  it('formatSupply handles decimal adjustment', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    // 1000000 supply with 6 decimals = 1.00 (not millions)
    const result = vm.formatSupply('1000000', 6)
    expect(result).toBe('1')
  })

  it('getStandardDocUrl returns correct URL for ARC3', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    expect(vm.getStandardDocUrl('ARC3')).toContain('arc-0003')
  })

  it('getStandardDocUrl returns correct URL for ARC69', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    expect(vm.getStandardDocUrl('ARC69')).toContain('arc-0069')
  })

  it('getStandardDocUrl returns correct URL for ARC19', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    expect(vm.getStandardDocUrl('ARC19')).toContain('arc-0019')
  })

  it('getStandardDocUrl returns correct URL for ASA', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    expect(vm.getStandardDocUrl('ASA')).toContain('algorand.org')
  })

  it('getStandardDocUrl returns default URL for unknown standard', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    expect(vm.getStandardDocUrl('UNKNOWN' as any)).toBe('https://developer.algorand.org/')
  })
})
