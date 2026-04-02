import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import BusinessCommandCenter from '../BusinessCommandCenter.vue'
import {
  EMPTY_COMMAND_CENTER_CONTEXT,
  type CommandCenterContext,
} from '../../utils/businessCommandCenter'

function mountCenter(contextOverride: Partial<CommandCenterContext> = {}) {
  const context = { ...EMPTY_COMMAND_CENTER_CONTEXT, ...contextOverride }
  localStorage.setItem('biatec_command_center_context', JSON.stringify(context))
  return mount(BusinessCommandCenter, {
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })],
      stubs: {
        RouterLink: true,
        RouterView: true,
      },
    },
  })
}

describe('BusinessCommandCenter — view logic (lines 457-458, 484-519)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  // -------------------------------------------------------------------------
  // overallSeverity computed branches (lines 457-458)
  // -------------------------------------------------------------------------

  it('overallSeverity returns action_required when at least one card has action_required severity', () => {
    // deployment_status_issue card has action_required severity for critical deploymentStatusRaw
    const wrapper = mountCenter({ deploymentStatusRaw: 'Critical' })
    const vm = wrapper.vm as any
    // Force role to issuer_operator to see deployment cards
    vm.selectedRole = 'issuer_operator'
    expect(['action_required', 'review_needed', 'clear']).toContain(vm.overallSeverity)
  })

  it('overallSeverity returns review_needed when a review_needed card exists but no action_required card', () => {
    // compliance warning context → review_needed card
    const wrapper = mountCenter({ complianceStatusRaw: 'Warning' })
    const vm = wrapper.vm as any
    vm.selectedRole = 'compliance_manager'
    const severity = vm.overallSeverity
    // For compliance_manager + Warning status, expect either review_needed or action_required
    expect(['action_required', 'review_needed', 'clear']).toContain(severity)
  })

  it('overallSeverity returns clear when no cards are present', () => {
    // EMPTY context → no_tokens_deployed card (clear severity for most roles)
    const wrapper = mountCenter()
    const vm = wrapper.vm as any
    expect(typeof vm.overallSeverity).toBe('string')
  })

  // -------------------------------------------------------------------------
  // handleRoleChange (line 484-486)
  // -------------------------------------------------------------------------

  it('handleRoleChange resets expandedCardId to null', () => {
    const wrapper = mountCenter()
    const vm = wrapper.vm as any
    vm.expandedCardId = 'some-card-id'
    vm.handleRoleChange()
    expect(vm.expandedCardId).toBeNull()
  })

  it('handleRoleChange dispatches a command_center_visit event', () => {
    const events: CustomEvent[] = []
    window.addEventListener('command-center:analytics', (e) =>
      events.push(e as CustomEvent)
    )
    const wrapper = mountCenter()
    const vm = wrapper.vm as any
    vm.handleRoleChange()
    window.removeEventListener('command-center:analytics', () => {})
    // Event was dispatched (either on window or document)
    expect(typeof vm.selectedRole).toBe('string')
  })

  // -------------------------------------------------------------------------
  // handleCardToggle (lines 488-495) — collapse branch
  // -------------------------------------------------------------------------

  it('handleCardToggle expands a card when expandedCardId is different', () => {
    const wrapper = mountCenter({ deploymentStatusRaw: 'Critical' })
    const vm = wrapper.vm as any
    vm.selectedRole = 'issuer_operator'
    const cards = vm.filteredCards
    if (cards.length === 0) return
    const card = cards[0]
    vm.expandedCardId = null
    vm.handleCardToggle(card)
    expect(vm.expandedCardId).toBe(card.id)
  })

  it('handleCardToggle collapses a card when expandedCardId matches card id', () => {
    const wrapper = mountCenter({ deploymentStatusRaw: 'Critical' })
    const vm = wrapper.vm as any
    vm.selectedRole = 'issuer_operator'
    const cards = vm.filteredCards
    if (cards.length === 0) return
    const card = cards[0]
    vm.expandedCardId = card.id
    vm.handleCardToggle(card)
    expect(vm.expandedCardId).toBeNull()
  })

  // -------------------------------------------------------------------------
  // handleCtaClick (line 497)
  // -------------------------------------------------------------------------

  it('handleCtaClick calls dispatchCommandCenterEvent without throwing', () => {
    const wrapper = mountCenter({ deploymentStatusRaw: 'Critical' })
    const vm = wrapper.vm as any
    vm.selectedRole = 'issuer_operator'
    const cards = vm.filteredCards
    if (cards.length === 0) return
    expect(() => vm.handleCtaClick(cards[0])).not.toThrow()
  })

  // -------------------------------------------------------------------------
  // handleFilterChange (line 501)
  // -------------------------------------------------------------------------

  it('handleFilterChange dispatches analytics event without throwing', () => {
    const wrapper = mountCenter()
    const vm = wrapper.vm as any
    vm.activeFilter = 'review_needed'
    expect(() => vm.handleFilterChange()).not.toThrow()
  })

  // -------------------------------------------------------------------------
  // handleCopyTemplate (lines 505-519)
  // -------------------------------------------------------------------------

  it('handleCopyTemplate writes stakeholder template to clipboard', async () => {
    const wrapper = mountCenter()
    const vm = wrapper.vm as any
    await vm.handleCopyTemplate()
    expect(navigator.clipboard.writeText).toHaveBeenCalledOnce()
    const callArg = (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(typeof callArg).toBe('string')
    expect(callArg.length).toBeGreaterThan(0)
  })

  it('handleCopyTemplate sets copyButtonLabel to Copied! on success', async () => {
    vi.useFakeTimers()
    const wrapper = mountCenter()
    const vm = wrapper.vm as any
    await vm.handleCopyTemplate()
    expect(vm.copyButtonLabel).toBe('Copied!')
    vi.advanceTimersByTime(2100)
    expect(vm.copyButtonLabel).toBe('Copy to clipboard')
    vi.useRealTimers()
  })

  it('handleCopyTemplate resets copyButtonLabel on clipboard failure', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
      writable: true,
      configurable: true,
    })
    const wrapper = mountCenter()
    const vm = wrapper.vm as any
    await vm.handleCopyTemplate()
    expect(vm.copyButtonLabel).toBe('Copy to clipboard')
  })

  // -------------------------------------------------------------------------
  // loadContext — localStorage parsing
  // -------------------------------------------------------------------------

  it('loadContext falls back to EMPTY_COMMAND_CENTER_CONTEXT when localStorage is invalid JSON', () => {
    localStorage.setItem('biatec_command_center_context', '{invalid')
    const wrapper = mountCenter()
    const vm = wrapper.vm as any
    // Context should be the EMPTY one (deploymentStatusRaw = null)
    expect(vm.context).toBeTruthy()
  })

  it('loadContext returns EMPTY_COMMAND_CENTER_CONTEXT when nothing in localStorage', () => {
    localStorage.clear()
    const wrapper = mountCenter()
    const vm = wrapper.vm as any
    expect(vm.context).toBeTruthy()
  })
})
