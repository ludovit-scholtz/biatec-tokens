/**
 * Unit tests for ReviewSubmitStep
 *
 * Validates that:
 * - Heading and Readiness Score section are rendered
 * - canSubmit is false when blockers present or risk not acknowledged
 * - canSubmit is true when no blockers AND risk acknowledged
 * - handleSubmit emits 'submit' only when canSubmit is true
 * - Blockers list is shown when readinessScore has blockers
 * - Warnings list is shown when readinessScore has warnings
 *
 * Business value: The ReviewSubmitStep is the final gate before token launch.
 * Correct validation ensures users cannot submit without acknowledging risks.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ReviewSubmitStep from '../ReviewSubmitStep.vue'

const CardStub = { name: 'Card', template: '<div><slot /></div>', props: ['variant', 'padding'] }
const BadgeStub = { name: 'Badge', template: '<span><slot /></span>', props: ['variant', 'size'] }
const ButtonStub = {
  name: 'Button',
  template: '<button :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
  props: ['disabled', 'variant', 'size', 'fullWidth', 'full-width'],
  emits: ['click'],
}
const TransactionPreviewPanelStub = {
  name: 'TransactionPreviewPanel',
  template: '<div data-testid="tx-preview"><slot /></div>',
  props: ['acknowledged', 'tokenName', 'tokenStandard', 'network', 'totalSupply', 'decimals', 'managementAddress'],
  emits: ['update:acknowledged'],
  methods: { validate: () => true },
}

const makeReadinessScore = (overrides = {}) => ({
  overallScore: 100,
  requiredStepsComplete: 5,
  totalRequiredSteps: 5,
  blockers: [] as string[],
  warnings: [] as string[],
  ...overrides,
})

const makeFormData = () => ({
  organizationProfile: null,
  tokenIntent: null,
  selectedTemplate: null,
  whitelistPolicy: null,
  tokenEconomics: null,
  complianceReadiness: null,
  stepStatuses: {},
})

const mountStep = (readinessScore = makeReadinessScore(), formData = makeFormData()) =>
  mount(ReviewSubmitStep, {
    props: { readinessScore, formData },
    global: {
      plugins: [createPinia()],
      stubs: {
        Card: CardStub,
        Badge: BadgeStub,
        Button: ButtonStub,
        TransactionPreviewPanel: TransactionPreviewPanelStub,
      },
    },
  })

describe('ReviewSubmitStep', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders Review & Submit heading', () => {
    const wrapper = mountStep()
    expect(wrapper.text()).toContain('Review')
    expect(wrapper.text()).toContain('Submit')
  })

  it('renders Readiness Score section', () => {
    const wrapper = mountStep()
    expect(wrapper.text()).toContain('Readiness Score')
  })

  it('displays overall score percentage', () => {
    const wrapper = mountStep(makeReadinessScore({ overallScore: 80 }))
    expect(wrapper.text()).toContain('80%')
  })

  it('displays required steps fraction', () => {
    const wrapper = mountStep(makeReadinessScore({ requiredStepsComplete: 4, totalRequiredSteps: 5 }))
    expect(wrapper.text()).toContain('4')
    expect(wrapper.text()).toContain('5')
  })

  // ── Blockers & Warnings ────────────────────────────────────────────────────

  it('shows blockers section when blockers present', () => {
    const wrapper = mountStep(makeReadinessScore({ blockers: ['Missing compliance'] }))
    expect(wrapper.text()).toContain('Blockers')
    expect(wrapper.text()).toContain('Missing compliance')
  })

  it('does not show blockers section when no blockers', () => {
    const wrapper = mountStep(makeReadinessScore({ blockers: [] }))
    expect(wrapper.text()).not.toContain('Blockers:')
  })

  it('shows warnings section when warnings present', () => {
    const wrapper = mountStep(makeReadinessScore({ warnings: ['Optional field empty'] }))
    expect(wrapper.text()).toContain('Warnings')
    expect(wrapper.text()).toContain('Optional field empty')
  })

  it('does not show warnings section when no warnings', () => {
    const wrapper = mountStep(makeReadinessScore({ warnings: [] }))
    expect(wrapper.text()).not.toContain('Warnings:')
  })

  // ── canSubmit Logic ────────────────────────────────────────────────────────

  it('canSubmit is false when blockers present', () => {
    const wrapper = mountStep(makeReadinessScore({ blockers: ['blocker'] }))
    const vm = wrapper.vm as any
    expect(vm.canSubmit).toBe(false)
  })

  it('canSubmit is false when no blockers but risk not acknowledged', () => {
    const wrapper = mountStep(makeReadinessScore({ blockers: [] }))
    const vm = wrapper.vm as any
    vm.riskAcknowledged = false
    expect(vm.canSubmit).toBe(false)
  })

  it('canSubmit is true when no blockers and risk acknowledged', async () => {
    const wrapper = mountStep(makeReadinessScore({ blockers: [] }))
    const vm = wrapper.vm as any
    vm.riskAcknowledged = true
    await wrapper.vm.$nextTick()
    expect(vm.canSubmit).toBe(true)
  })

  // ── Submission ─────────────────────────────────────────────────────────────

  it('handleSubmit emits submit event when canSubmit is true', async () => {
    const wrapper = mountStep(makeReadinessScore({ blockers: [] }))
    const vm = wrapper.vm as any
    vm.riskAcknowledged = true
    await wrapper.vm.$nextTick()
    vm.handleSubmit()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it('handleSubmit does not emit submit when canSubmit is false', async () => {
    const wrapper = mountStep(makeReadinessScore({ blockers: ['blocker'] }))
    const vm = wrapper.vm as any
    vm.handleSubmit()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('submit')).toBeFalsy()
  })

  // ── Template v-if: organizationProfile section ─────────────────────────────
  it('shows organizationProfile section when formData.organizationProfile provided', () => {
    const formData = {
      ...makeFormData(),
      organizationProfile: {
        organizationName: 'Biatec AG',
        organizationType: 'corporation',
        jurisdiction: 'CH',
        contactEmail: 'test@biatec.io',
      },
    } as any
    const wrapper = mountStep(makeReadinessScore(), formData)
    expect(wrapper.text()).toContain('Biatec AG')
    expect(wrapper.text()).toContain('Organization Profile')
  })

  // ── Template v-if: tokenIntent section ────────────────────────────────────
  it('shows tokenIntent section when formData.tokenIntent provided', () => {
    const formData = {
      ...makeFormData(),
      tokenIntent: {
        tokenPurpose: 'Security token for real estate fund',
        utilityType: 'security',
      },
    } as any
    const wrapper = mountStep(makeReadinessScore(), formData)
    expect(wrapper.text()).toContain('Token Intent')
    expect(wrapper.text()).toContain('Security token for real estate fund')
  })

  // ── Template v-if: selectedTemplate section ────────────────────────────────
  it('shows selectedTemplate section when formData.selectedTemplate provided', () => {
    const formData = {
      ...makeFormData(),
      selectedTemplate: { name: 'ARC200 Security Token', standard: 'ARC200', network: 'algorand_mainnet' },
    } as any
    const wrapper = mountStep(makeReadinessScore(), formData)
    expect(wrapper.text()).toContain('ARC200 Security Token')
    expect(wrapper.text()).toContain('Selected Template')
  })

  // ── Whitelist Policy: isEnabled=true with allowedJurisdictions ────────────
  it('shows allowed jurisdictions when whitelist enabled with allowedJurisdictions', () => {
    const formData = {
      ...makeFormData(),
      whitelistPolicy: {
        isEnabled: true,
        allowedJurisdictions: [{ code: 'CH', name: 'Switzerland' }],
        restrictedJurisdictions: [],
        investorCategories: [],
        requiresWhitelist: true,
      },
    } as any
    const wrapper = mountStep(makeReadinessScore(), formData)
    expect(wrapper.text()).toContain('Allowed countries')
    expect(wrapper.text()).toContain('Switzerland')
  })

  // ── Whitelist Policy: isEnabled=true with restrictedJurisdictions (line 86-90) ──
  it('shows restricted jurisdictions when whitelist enabled with restrictedJurisdictions', () => {
    const formData = {
      ...makeFormData(),
      whitelistPolicy: {
        isEnabled: true,
        allowedJurisdictions: [],
        restrictedJurisdictions: [{ code: 'US', name: 'United States' }],
        investorCategories: [],
        requiresWhitelist: true,
      },
    } as any
    const wrapper = mountStep(makeReadinessScore(), formData)
    expect(wrapper.text()).toContain('Blocked countries')
    expect(wrapper.text()).toContain('United States')
  })

  // ── Whitelist Policy: isEnabled=true with investorCategories (lines 93-100) ──
  it('shows investor categories when whitelist enabled with investorCategories', () => {
    const formData = {
      ...makeFormData(),
      whitelistPolicy: {
        isEnabled: true,
        allowedJurisdictions: [],
        restrictedJurisdictions: [],
        investorCategories: ['accredited_investor'],
        requiresWhitelist: true,
      },
    } as any
    const wrapper = mountStep(makeReadinessScore(), formData)
    expect(wrapper.text()).toContain('Investor categories')
    expect(wrapper.text()).toContain('accredited investor')
  })

  // ── Whitelist Policy: isEnabled=true but no jurisdictions or categories ────
  it('shows fallback message when whitelist enabled but no specific rules defined', () => {
    const formData = {
      ...makeFormData(),
      whitelistPolicy: {
        isEnabled: true,
        allowedJurisdictions: [],
        restrictedJurisdictions: [],
        investorCategories: [],
        requiresWhitelist: true,
      },
    } as any
    const wrapper = mountStep(makeReadinessScore(), formData)
    expect(wrapper.text()).toMatch(/no specific rules|Restrictions enabled/i)
  })

  // ── Whitelist Policy: isEnabled=false shows freely transferable (v-else) ──
  it('shows freely transferable message when whitelist is not enabled', () => {
    const formData = {
      ...makeFormData(),
      whitelistPolicy: {
        isEnabled: false,
        allowedJurisdictions: [],
        restrictedJurisdictions: [],
        investorCategories: [],
        requiresWhitelist: false,
      },
    } as any
    const wrapper = mountStep(makeReadinessScore(), formData)
    expect(wrapper.text()).toMatch(/freely transferable|No transfer restrictions/i)
  })

  // ── isSubmitting prop ─────────────────────────────────────────────────────
  it('passes isSubmitting=true prop without crashing', () => {
    const wrapper = mount(ReviewSubmitStep, {
      props: { readinessScore: makeReadinessScore(), formData: makeFormData() as any, isSubmitting: true },
      global: {
        plugins: [createPinia()],
        stubs: {
          Card: CardStub,
          Badge: BadgeStub,
          Button: ButtonStub,
          TransactionPreviewPanel: TransactionPreviewPanelStub,
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
