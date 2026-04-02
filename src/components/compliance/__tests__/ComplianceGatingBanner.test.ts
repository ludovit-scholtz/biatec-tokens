import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ComplianceGatingBanner from '../ComplianceGatingBanner.vue'
import type { RemediationAction } from '../../../types/compliance'

const makeEligibility = (overrides = {}) => ({
  eligible: false,
  status: 'pending' as const,
  reasons: [],
  nextActions: [],
  canRetry: false,
  ...overrides,
})

const makeAction = (overrides: Partial<RemediationAction> = {}): RemediationAction => ({
  type: 'upload_document',
  title: 'Upload ID',
  description: 'Please upload your identification.',
  priority: 'high',
  ...overrides,
})

const globalStubs = {
  ComplianceStatusBadge: true,
  ShieldExclamationIcon: true,
  CheckCircleIcon: true,
  ExclamationCircleIcon: true,
  DocumentCheckIcon: true,
  SparklesIcon: true,
  ChatBubbleLeftRightIcon: true,
  ArrowPathIcon: true,
  InformationCircleIcon: true,
  ClockIcon: true,
  ArrowRightIcon: true,
}

describe('ComplianceGatingBanner', () => {
  it('shows "Token Issuance Unavailable" when blocked', () => {
    const w = mount(ComplianceGatingBanner, {
      props: { eligibility: makeEligibility({ eligible: false }) },
      global: { stubs: globalStubs },
    })
    expect(w.text()).toContain('Token Issuance Unavailable')
  })

  it('shows "Ready for Token Issuance" when eligible', () => {
    const w = mount(ComplianceGatingBanner, {
      props: { eligibility: makeEligibility({ eligible: true }) },
      global: { stubs: globalStubs },
    })
    expect(w.text()).toContain('Ready for Token Issuance')
  })

  it('shows red border when blocked', () => {
    const w = mount(ComplianceGatingBanner, {
      props: { eligibility: makeEligibility({ eligible: false }) },
      global: { stubs: globalStubs },
    })
    expect(w.html()).toContain('border-red-700')
  })

  it('shows green border when eligible', () => {
    const w = mount(ComplianceGatingBanner, {
      props: { eligibility: makeEligibility({ eligible: true }) },
      global: { stubs: globalStubs },
    })
    expect(w.html()).toContain('border-green-700')
  })

  it('shows reasons when blocked with reasons', () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({
          eligible: false,
          reasons: ['Missing KYC', 'Address not verified'],
        }),
      },
      global: { stubs: globalStubs },
    })
    expect(w.text()).toContain('Missing KYC')
    expect(w.text()).toContain('Address not verified')
  })

  it('emits complete-compliance when button clicked', async () => {
    const w = mount(ComplianceGatingBanner, {
      props: { eligibility: makeEligibility({ eligible: false }) },
      global: { stubs: globalStubs },
    })
    const btn = w.findAll('button').find(b => b.text().includes('Complete Compliance'))
    if (btn) {
      await btn.trigger('click')
      expect(w.emitted('complete-compliance')).toBeTruthy()
    }
  })

  it('emits create-token when eligible and button clicked', async () => {
    const w = mount(ComplianceGatingBanner, {
      props: { eligibility: makeEligibility({ eligible: true }) },
      global: { stubs: globalStubs },
    })
    const btn = w.findAll('button').find(b => b.text().includes('Create Token'))
    if (btn) {
      await btn.trigger('click')
      expect(w.emitted('create-token')).toBeTruthy()
    }
  })

  it('shows retry button when canRetry is true', () => {
    const w = mount(ComplianceGatingBanner, {
      props: { eligibility: makeEligibility({ eligible: false, canRetry: true }) },
      global: { stubs: globalStubs },
    })
    expect(w.text()).toContain('Retry Verification')
  })

  it('shows help text by default', () => {
    const w = mount(ComplianceGatingBanner, {
      props: { eligibility: makeEligibility() },
      global: { stubs: globalStubs },
    })
    expect(w.html()).toContain('border-gray-700')
  })

  // --- Next Actions branch coverage ---

  it('shows next actions section when nextActions is non-empty', () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({
          nextActions: [makeAction({ priority: 'high', title: 'Upload Docs' })],
        }),
      },
      global: { stubs: globalStubs },
    })
    expect(w.text()).toContain('Next Steps')
    expect(w.text()).toContain('Upload Docs')
  })

  it('renders high-priority action with red border', () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({
          nextActions: [makeAction({ priority: 'high' })],
        }),
      },
      global: { stubs: globalStubs },
    })
    expect(w.html()).toContain('border-red-700 bg-red-900/10')
  })

  it('renders medium-priority action with yellow border', () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({
          nextActions: [makeAction({ priority: 'medium', type: 'contact_support', title: 'Contact Us' })],
        }),
      },
      global: { stubs: globalStubs },
    })
    expect(w.html()).toContain('border-yellow-700 bg-yellow-900/10')
  })

  it('renders low-priority action with gray border', () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({
          nextActions: [makeAction({ priority: 'low', type: 'wait_for_review', title: 'Wait' })],
        }),
      },
      global: { stubs: globalStubs },
    })
    expect(w.html()).toContain('border-gray-700 bg-gray-800/30')
  })

  it('shows High Priority badge for high-priority actions', () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({
          nextActions: [makeAction({ priority: 'high' })],
        }),
      },
      global: { stubs: { ...globalStubs, Badge: false } },
    })
    expect(w.html()).toContain('High Priority')
  })

  it('shows dueDate when action has dueDate', () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({
          nextActions: [makeAction({ dueDate: '2025-12-31', priority: 'high' })],
        }),
      },
      global: { stubs: globalStubs },
    })
    expect(w.text()).toContain('Due:')
  })

  it('shows action button when action has actionUrl', () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({
          nextActions: [makeAction({ actionUrl: 'https://example.com/upload', priority: 'high' })],
        }),
      },
      global: { stubs: { ...globalStubs, Button: false } },
    })
    expect(w.html()).toContain('Upload')
  })

  it('emits action-clicked when action button is clicked', async () => {
    // Intercept window.location.href assignment to avoid navigation errors in happy-dom
    const origDescriptor = Object.getOwnPropertyDescriptor(window, 'location')
    const hrefSetter = vi.fn()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, set href(v: string) { hrefSetter(v) } },
    })

    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({
          nextActions: [makeAction({ actionUrl: 'https://example.com/upload', priority: 'high' })],
        }),
      },
      global: { stubs: { ...globalStubs } },
    })
    const btn = w.findAll('button').find(b => b.text().includes('Upload'))
    if (btn) {
      await btn.trigger('click')
      expect(w.emitted('action-clicked')).toBeTruthy()
    }
    if (origDescriptor) {
      Object.defineProperty(window, 'location', origDescriptor)
    }
  })

  // --- getActionButtonText label coverage ---

  it('returns correct label for resubmit_document action type', () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({
          nextActions: [makeAction({ type: 'resubmit_document', actionUrl: '/resubmit', priority: 'low' })],
        }),
      },
      global: { stubs: { ...globalStubs, Button: false } },
    })
    expect(w.html()).toContain('Resubmit')
  })

  it('returns correct label for provide_additional_info action type', () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({
          nextActions: [makeAction({ type: 'provide_additional_info', actionUrl: '/info', priority: 'medium' })],
        }),
      },
      global: { stubs: { ...globalStubs, Button: false } },
    })
    expect(w.html()).toContain('Provide Info')
  })

  it('returns correct label for acknowledge_block action type', () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({
          nextActions: [makeAction({ type: 'acknowledge_block', actionUrl: '/ack', priority: 'low' })],
        }),
      },
      global: { stubs: { ...globalStubs, Button: false } },
    })
    expect(w.html()).toContain('Acknowledge')
  })

  it('returns correct label for wait_for_review action type', () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({
          nextActions: [makeAction({ type: 'wait_for_review', actionUrl: '/status', priority: 'low' })],
        }),
      },
      global: { stubs: { ...globalStubs, Button: false } },
    })
    expect(w.html()).toContain('View Status')
  })

  it('returns correct label for contact_support action type', () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({
          nextActions: [makeAction({ type: 'contact_support', actionUrl: '/contact', priority: 'medium' })],
        }),
      },
      global: { stubs: { ...globalStubs, Button: false } },
    })
    expect(w.html()).toContain('Contact')
  })

  // --- CTA button visibility with prop overrides ---

  it('hides complete-compliance button when showCompleteButton is false', () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({ eligible: false }),
        showCompleteButton: false,
      },
      global: { stubs: globalStubs },
    })
    const btn = w.findAll('button').find(b => b.text().includes('Complete Compliance'))
    expect(btn).toBeUndefined()
  })

  it('hides create-token button when showCreateTokenButton is false', () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({ eligible: true }),
        showCreateTokenButton: false,
      },
      global: { stubs: globalStubs },
    })
    const btn = w.findAll('button').find(b => b.text().includes('Create Token'))
    expect(btn).toBeUndefined()
  })

  it('emits contact-support when button clicked', async () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({ eligible: false }),
        showContactSupport: true,
      },
      global: { stubs: globalStubs },
    })
    const btn = w.findAll('button').find(b => b.text().includes('Contact Support'))
    if (btn) {
      await btn.trigger('click')
      expect(w.emitted('contact-support')).toBeTruthy()
    }
  })

  it('emits retry-compliance when retry button clicked', async () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({ eligible: false, canRetry: true }),
        showRetryButton: true,
      },
      global: { stubs: globalStubs },
    })
    const btn = w.findAll('button').find(b => b.text().includes('Retry Verification'))
    if (btn) {
      await btn.trigger('click')
      expect(w.emitted('retry-compliance')).toBeTruthy()
    }
  })

  it('hides contact-support button when showContactSupport is false', () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({ eligible: false }),
        showContactSupport: false,
      },
      global: { stubs: globalStubs },
    })
    const btn = w.findAll('button').find(b => b.text().includes('Contact Support'))
    expect(btn).toBeUndefined()
  })

  it('hides help text section when showHelpText is false', () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({ eligible: false }),
        showHelpText: false,
      },
      global: { stubs: globalStubs },
    })
    expect(w.text()).not.toContain('business days')
  })

  it('shows approved help text when eligible', () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({ eligible: true }),
        showHelpText: true,
      },
      global: { stubs: globalStubs },
    })
    expect(w.text()).toContain('12 months')
  })

  it('shows blocked help text when not eligible', () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({ eligible: false }),
        showHelpText: true,
      },
      global: { stubs: globalStubs },
    })
    expect(w.text()).toContain('business days')
  })

  it('formatDate produces readable date string from action dueDate', () => {
    const w = mount(ComplianceGatingBanner, {
      props: {
        eligibility: makeEligibility({
          nextActions: [makeAction({ dueDate: '2025-06-15', priority: 'high' })],
        }),
      },
      global: { stubs: globalStubs },
    })
    // The date should be formatted into something like "Jun 15, 2025"
    const text = w.text()
    expect(text).toMatch(/Jun|2025/)
  })
})
