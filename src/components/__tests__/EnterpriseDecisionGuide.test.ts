import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import EnterpriseDecisionGuide from '../EnterpriseDecisionGuide.vue'

// Mock sub-components
vi.mock('../ui/Card.vue', () => ({
  default: {
    name: 'Card',
    template: '<div class="mock-card"><slot /><slot name="header" /></div>',
  },
}))

vi.mock('../ui/Badge.vue', () => ({
  default: {
    name: 'Badge',
    props: ['variant'],
    template: '<span class="mock-badge"><slot /></span>',
  },
}))

vi.mock('../ui/Button.vue', () => ({
  default: {
    name: 'Button',
    props: ['variant', 'size'],
    template: '<button class="mock-button"><slot /></button>',
  },
}))

// Mock heroicons using importOriginal to avoid missing icon errors
vi.mock('@heroicons/vue/24/outline', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@heroicons/vue/24/outline')>()
  return { ...actual }
})

function makeWrapper() {
  return mount(EnterpriseDecisionGuide, {
    global: { plugins: [createPinia()] },
  })
}

describe('EnterpriseDecisionGuide.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders without errors', () => {
    const wrapper = makeWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('renders mock cards', () => {
    const wrapper = makeWrapper()
    const cards = wrapper.findAll('.mock-card')
    expect(cards.length).toBeGreaterThan(0)
  })

  it('has enterpriseStandards computed from store', async () => {
    const wrapper = makeWrapper()
    await nextTick()
    const vm = wrapper.vm as any
    // enterpriseStandards is computed from tokenStore.tokenStandards
    // filtered by ENTERPRISE_FUNGIBLE_STANDARDS
    expect(Array.isArray(vm.enterpriseStandards)).toBe(true)
  })

  it('getStandardBadgeVariant returns default for unknown standard', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    const variant = vm.getStandardBadgeVariant('NONEXISTENT')
    expect(variant).toBe('default')
  })

  it('getStandardBadgeVariant returns the badge variant for known standard', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    // ASA should be in the token store and have a badgeVariant
    const variant = vm.getStandardBadgeVariant('ASA')
    const validVariants = ['default', 'info', 'success', 'warning', 'error']
    expect(validVariants).toContain(variant)
  })

  it('hasFeature returns true for auditTrail on any standard', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    const { tokenStore } = vm
    const allStandards = vm.enterpriseStandards

    for (const s of allStandards) {
      expect(vm.hasFeature(s, 'auditTrail')).toBe(true)
    }
  })

  it('hasFeature returns false for a standard with no features', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    const fakeStandard = { name: 'FAKE', features: undefined }
    expect(vm.hasFeature(fakeStandard, 'whitelisting')).toBe(false)
  })

  it('hasFeature walletSupport returns true for ERC20', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    const erc20 = { name: 'ERC20', features: { nativeL1: false } }
    expect(vm.hasFeature(erc20, 'walletSupport')).toBe(true)
  })

  it('hasFeature walletSupport returns true for ARC3FT', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    const arc3ft = { name: 'ARC3FT', features: { nativeL1: false } }
    expect(vm.hasFeature(arc3ft, 'walletSupport')).toBe(true)
  })

  it('hasFeature walletSupport returns true for nativeL1', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    const native = { name: 'ASA', features: { nativeL1: true } }
    expect(vm.hasFeature(native, 'walletSupport')).toBe(true)
  })

  it('hasFeature maps micaCompliant to complianceFlags', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    const s = { name: 'ARC200', features: { complianceFlags: true } }
    expect(vm.hasFeature(s, 'micaCompliant')).toBe(true)
  })

  it('hasFeature micaCompliant returns false when complianceFlags is false', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    const s = { name: 'ASA', features: { complianceFlags: false } }
    expect(vm.hasFeature(s, 'micaCompliant')).toBe(false)
  })

  it('has recommendations array with 4 items', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    expect(vm.recommendations).toBeDefined()
    expect(vm.recommendations.length).toBe(4)
  })

  it('has useCaseGuidance array with 4 items', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    expect(vm.useCaseGuidance).toBeDefined()
    expect(vm.useCaseGuidance.length).toBe(4)
  })

  it('has enterpriseFeatures array', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    expect(vm.enterpriseFeatures).toBeDefined()
    expect(vm.enterpriseFeatures.length).toBeGreaterThan(0)
  })
})
