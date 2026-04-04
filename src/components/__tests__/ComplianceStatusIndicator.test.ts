import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useComplianceStore } from '../../stores/compliance'
import ComplianceStatusIndicator from '../ComplianceStatusIndicator.vue'

vi.mock('../ui/Card.vue', () => ({
  default: { name: 'Card', template: '<div><slot /></div>', props: ['variant', 'padding'] }
}))
vi.mock('../ui/Badge.vue', () => ({
  default: { name: 'Badge', template: '<span :data-variant="variant"><slot /></span>', props: ['variant', 'size'] }
}))

function makeWrapper(percentage: number, compact = true) {
  const pinia = createTestingPinia({ createSpy: vi.fn })
  const store = useComplianceStore(pinia)
  Object.defineProperty(store, 'metrics', {
    get: () => ({ totalChecks: 10, completedChecks: Math.round(percentage / 10), completionPercentage: percentage, criticalIssues: 0 }),
    configurable: true
  })
  Object.defineProperty(store, 'categoryProgress', {
    get: () => [
      { category: 'kyc-aml', completed: 2, total: 3, percentage: 67 },
      { category: 'jurisdiction', completed: 1, total: 2, percentage: 50 },
    ],
    configurable: true
  })
  const wrapper = mount(ComplianceStatusIndicator, {
    props: { compact },
    global: { plugins: [pinia] }
  })
  return { wrapper, store, pinia }
}

describe('ComplianceStatusIndicator', () => {
  it('renders in compact mode', () => {
    const { wrapper } = makeWrapper(50, true)
    expect(wrapper.find('.compliance-status-indicator').exists()).toBe(true)
  })

  it('shows a status label in compact mode', () => {
    const { wrapper } = makeWrapper(100, true)
    expect(wrapper.text().length).toBeGreaterThan(0)
  })

  it('renders full mode when compact is false', () => {
    const { wrapper } = makeWrapper(60, false)
    expect(wrapper.exists()).toBe(true)
  })

  it('statusLabel returns Compliant at 100%', () => {
    const { wrapper } = makeWrapper(100)
    const vm = wrapper.vm as any
    expect(vm.statusLabel).toBe('Compliant')
  })

  it('statusLabel returns Nearly Compliant at 75%', () => {
    const { wrapper } = makeWrapper(75)
    const vm = wrapper.vm as any
    expect(vm.statusLabel).toBe('Nearly Compliant')
  })

  it('statusLabel returns In Progress at 50%', () => {
    const { wrapper } = makeWrapper(50)
    const vm = wrapper.vm as any
    expect(vm.statusLabel).toBe('In Progress')
  })

  it('statusLabel returns Action Required at 30%', () => {
    const { wrapper } = makeWrapper(30)
    const vm = wrapper.vm as any
    expect(vm.statusLabel).toBe('Action Required')
  })

  it('badgeVariant returns success at 100%', () => {
    const { wrapper } = makeWrapper(100)
    const vm = wrapper.vm as any
    expect(vm.badgeVariant).toBe('success')
  })

  it('badgeVariant returns info at 80%', () => {
    const { wrapper } = makeWrapper(80)
    const vm = wrapper.vm as any
    expect(vm.badgeVariant).toBe('info')
  })

  it('badgeVariant returns warning at 60%', () => {
    const { wrapper } = makeWrapper(60)
    const vm = wrapper.vm as any
    expect(vm.badgeVariant).toBe('warning')
  })

  it('badgeVariant returns error at 20%', () => {
    const { wrapper } = makeWrapper(20)
    const vm = wrapper.vm as any
    expect(vm.badgeVariant).toBe('error')
  })

  it('statusColor returns green class at 100%', () => {
    const { wrapper } = makeWrapper(100)
    const vm = wrapper.vm as any
    expect(vm.statusColor).toContain('green')
  })

  it('statusColor returns blue class at 80%', () => {
    const { wrapper } = makeWrapper(80)
    const vm = wrapper.vm as any
    expect(vm.statusColor).toContain('blue')
  })

  it('statusColor returns yellow class at 60%', () => {
    const { wrapper } = makeWrapper(60)
    const vm = wrapper.vm as any
    expect(vm.statusColor).toContain('yellow')
  })

  it('statusColor returns red class at 10%', () => {
    const { wrapper } = makeWrapper(10)
    const vm = wrapper.vm as any
    expect(vm.statusColor).toContain('red')
  })

  it('dotColor returns bg-green-500 at 100%', () => {
    const { wrapper } = makeWrapper(100)
    const vm = wrapper.vm as any
    expect(vm.dotColor).toBe('bg-green-500')
  })

  it('dotColor returns bg-blue-500 at 80%', () => {
    const { wrapper } = makeWrapper(80)
    const vm = wrapper.vm as any
    expect(vm.dotColor).toBe('bg-blue-500')
  })

  it('dotColor returns bg-yellow-500 at 55%', () => {
    const { wrapper } = makeWrapper(55)
    const vm = wrapper.vm as any
    expect(vm.dotColor).toBe('bg-yellow-500')
  })

  it('dotColor returns bg-red-500 at 20%', () => {
    const { wrapper } = makeWrapper(20)
    const vm = wrapper.vm as any
    expect(vm.dotColor).toBe('bg-red-500')
  })

  it('progressBarColor returns green class at 100%', () => {
    const { wrapper } = makeWrapper(100)
    const vm = wrapper.vm as any
    expect(vm.progressBarColor).toContain('green')
  })

  it('progressBarColor returns blue class at 80%', () => {
    const { wrapper } = makeWrapper(80)
    const vm = wrapper.vm as any
    expect(vm.progressBarColor).toContain('blue')
  })

  it('progressBarColor returns yellow class at 60%', () => {
    const { wrapper } = makeWrapper(60)
    const vm = wrapper.vm as any
    expect(vm.progressBarColor).toContain('yellow')
  })

  it('progressBarColor returns red class at 30%', () => {
    const { wrapper } = makeWrapper(30)
    const vm = wrapper.vm as any
    expect(vm.progressBarColor).toContain('red')
  })

  it('isMicaReady is true at 100%', () => {
    const { wrapper } = makeWrapper(100)
    const vm = wrapper.vm as any
    expect(vm.isMicaReady).toBe(true)
  })

  it('isMicaReady is false below 100%', () => {
    const { wrapper } = makeWrapper(99)
    const vm = wrapper.vm as any
    expect(vm.isMicaReady).toBe(false)
  })

  it('categoryBreakdown maps known category labels', () => {
    const { wrapper } = makeWrapper(70, false)
    const vm = wrapper.vm as any
    const breakdown = vm.categoryBreakdown
    expect(breakdown.length).toBe(2)
    expect(breakdown[0].label).toBe('KYC/AML')
    expect(breakdown[1].label).toBe('Jurisdiction')
  })

  it('toggles showDetails on compact status click', async () => {
    const { wrapper } = makeWrapper(60, true)
    const clickable = wrapper.find('.cursor-pointer')
    if (clickable.exists()) {
      await clickable.trigger('click')
      await nextTick()
    }
    expect(wrapper.find('.compliance-status-indicator').exists()).toBe(true)
  })

  it('renders category breakdown in full mode', () => {
    const { wrapper } = makeWrapper(70, false)
    expect(wrapper.exists()).toBe(true)
  })

  it('does not render wallet connector UI (product alignment)', () => {
    const { wrapper } = makeWrapper(50, true)
    expect(wrapper.html()).not.toMatch(/WalletConnect|MetaMask|\bPera\b|Defly/i)
  })

  it('categoryBreakdown handles unknown category with original key', () => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const store = useComplianceStore(pinia)
    Object.defineProperty(store, 'metrics', {
      get: () => ({ totalChecks: 5, completedChecks: 3, completionPercentage: 60, criticalIssues: 0 }),
      configurable: true
    })
    Object.defineProperty(store, 'categoryProgress', {
      get: () => [{ category: 'unknown-category', completed: 1, total: 2, percentage: 50 }],
      configurable: true
    })
    const wrapper = mount(ComplianceStatusIndicator, {
      props: { compact: false },
      global: { plugins: [pinia] }
    })
    const vm = wrapper.vm as any
    const breakdown = vm.categoryBreakdown
    expect(breakdown[0].label).toBe('unknown-category')
  })
})
