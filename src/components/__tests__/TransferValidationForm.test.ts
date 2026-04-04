import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TransferValidationForm from '../TransferValidationForm.vue'

vi.mock('../../services/ComplianceService', () => ({
  complianceService: {
    validateTransfer: vi.fn().mockResolvedValue({
      allowed: true,
      timestamp: '2026-04-04T12:00:00.000Z',
      reasons: ['Transfer allowed'],
      senderStatus: { address: 'SENDER', whitelisted: true, status: 'active' },
      receiverStatus: { address: 'RECEIVER', whitelisted: true, status: 'active' },
      details: { senderCompliant: true, receiverCompliant: true },
    }),
  },
}))

vi.mock('../../composables/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  }),
}))

vi.mock('../AllowlistConfirmationDialog.vue', () => ({
  default: {
    name: 'AllowlistConfirmationDialog',
    props: ['show', 'senderStatus', 'receiverStatus', 'tokenId'],
    emits: ['close', 'proceed'],
    template: '<div />',
  },
}))

function mountForm() {
  return mount(TransferValidationForm, {
    props: { tokenId: 'token-001' },
  })
}

describe('TransferValidationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the transfer validation form', () => {
    const wrapper = mountForm()
    expect(wrapper.exists()).toBe(true)
  })

  it('does not render wallet connector UI (product alignment)', () => {
    const wrapper = mountForm()
    expect(wrapper.html()).not.toMatch(/WalletConnect|MetaMask|\bPera\b|Defly/i)
  })

  it('statusBadgeClass returns green for active', () => {
    const wrapper = mountForm()
    const vm = wrapper.vm as any
    expect(vm.statusBadgeClass('active')).toContain('green')
  })

  it('statusBadgeClass returns yellow for pending', () => {
    const wrapper = mountForm()
    const vm = wrapper.vm as any
    expect(vm.statusBadgeClass('pending')).toContain('yellow')
  })

  it('statusBadgeClass returns orange for expired', () => {
    const wrapper = mountForm()
    const vm = wrapper.vm as any
    expect(vm.statusBadgeClass('expired')).toContain('orange')
  })

  it('statusBadgeClass returns red for denied', () => {
    const wrapper = mountForm()
    const vm = wrapper.vm as any
    expect(vm.statusBadgeClass('denied')).toContain('red')
  })

  it('statusBadgeClass returns red for removed', () => {
    const wrapper = mountForm()
    const vm = wrapper.vm as any
    expect(vm.statusBadgeClass('removed')).toContain('red')
  })

  it('statusBadgeClass returns gray for not_listed', () => {
    const wrapper = mountForm()
    const vm = wrapper.vm as any
    expect(vm.statusBadgeClass('not_listed')).toContain('gray')
  })

  it('statusBadgeClass returns gray for unknown status', () => {
    const wrapper = mountForm()
    const vm = wrapper.vm as any
    expect(vm.statusBadgeClass('unknown')).toContain('gray')
  })

  it('formatTimestamp formats a date string correctly', () => {
    const wrapper = mountForm()
    const vm = wrapper.vm as any
    const result = vm.formatTimestamp('2026-04-04T12:00:00.000Z')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('handleDialogClose sets showConfirmDialog to false', () => {
    const wrapper = mountForm()
    const vm = wrapper.vm as any
    vm.showConfirmDialog = true
    vm.handleDialogClose()
    expect(vm.showConfirmDialog).toBe(false)
  })

  it('handleValidate sets validationResult on success (allowed=true)', async () => {
    const { complianceService } = await import('../../services/ComplianceService')
    vi.mocked(complianceService.validateTransfer).mockResolvedValueOnce({
      allowed: true,
      timestamp: '2026-04-04T12:00:00.000Z',
      reasons: [],
      senderStatus: { address: 'S', whitelisted: true, status: 'active' },
      receiverStatus: { address: 'R', whitelisted: true, status: 'active' },
      details: {},
    })
    const wrapper = mountForm()
    const vm = wrapper.vm as any
    await vm.handleValidate()
    expect(vm.validationResult).not.toBeNull()
    expect(vm.validationResult.allowed).toBe(true)
  })

  it('handleValidate handles allowed=false (warning toast)', async () => {
    const { complianceService } = await import('../../services/ComplianceService')
    vi.mocked(complianceService.validateTransfer).mockResolvedValueOnce({
      allowed: false,
      timestamp: '2026-04-04T12:00:00.000Z',
      reasons: ['Not whitelisted'],
      senderStatus: { address: 'S', whitelisted: false, status: 'not_listed' },
      receiverStatus: { address: 'R', whitelisted: false, status: 'not_listed' },
      details: {},
    })
    const wrapper = mountForm()
    const vm = wrapper.vm as any
    await vm.handleValidate()
    expect(vm.validationResult.allowed).toBe(false)
  })

  it('handleValidate sets error on Error exception', async () => {
    const { complianceService } = await import('../../services/ComplianceService')
    vi.mocked(complianceService.validateTransfer).mockRejectedValueOnce(new Error('Network error'))
    const wrapper = mountForm()
    const vm = wrapper.vm as any
    await vm.handleValidate()
    expect(vm.error).toBe('Network error')
  })

  it('handleValidate sets generic error on non-Error exception', async () => {
    const { complianceService } = await import('../../services/ComplianceService')
    vi.mocked(complianceService.validateTransfer).mockRejectedValueOnce('string-error')
    const wrapper = mountForm()
    const vm = wrapper.vm as any
    await vm.handleValidate()
    expect(vm.error).toBe('Failed to validate transfer')
  })

  it('handleCheckAllowlist sets error on Error exception', async () => {
    const { complianceService } = await import('../../services/ComplianceService')
    vi.mocked(complianceService.validateTransfer).mockRejectedValueOnce(new Error('Allowlist error'))
    const wrapper = mountForm()
    const vm = wrapper.vm as any
    await vm.handleCheckAllowlist()
    expect(vm.error).toBe('Allowlist error')
  })

  it('handleCheckAllowlist shows dialog on success', async () => {
    const wrapper = mountForm()
    const vm = wrapper.vm as any
    await vm.handleCheckAllowlist()
    expect(vm.showConfirmDialog).toBe(true)
  })

  it('VOI is the default selected network', () => {
    const wrapper = mountForm()
    const vm = wrapper.vm as any
    expect(vm.selectedNetwork).toBe('VOI')
  })
})
