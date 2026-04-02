import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import AllowlistConfirmationDialog from '../AllowlistConfirmationDialog.vue'
import type { WhitelistStatus } from '../../types/compliance'

const makeStatus = (status: WhitelistStatus['status'], extra: Partial<WhitelistStatus> = {}): WhitelistStatus => ({
  address: 'ADDR' + status.toUpperCase(),
  whitelisted: status === 'active',
  status,
  ...extra,
})

const defaultProps = {
  isOpen: true,
  network: 'Algorand Testnet',
  tokenId: '12345',
  senderAddress: 'SENDER7ABCDEFGHIJKLMNOPQRST',
  receiverAddress: 'RECEIVER7ABCDEFGHIJKLMNOPQRST',
  senderStatus: makeStatus('active'),
  receiverStatus: makeStatus('active'),
}

function mountDialog(props = {}) {
  return mount(AllowlistConfirmationDialog, {
    props: { ...defaultProps, ...props },
    global: { plugins: [createTestingPinia({ createSpy: vi.fn })] },
  })
}

describe('AllowlistConfirmationDialog', () => {
  it('renders when isOpen is true', () => {
    const wrapper = mountDialog()
    expect(wrapper.find('.fixed').exists()).toBe(true)
    expect(wrapper.text()).toContain('Allowlist Verification Required')
  })

  it('does not render when isOpen is false', () => {
    const wrapper = mountDialog({ isOpen: false })
    expect(wrapper.find('.fixed').exists()).toBe(false)
  })

  it('emits close when cancel button is clicked', async () => {
    const wrapper = mountDialog()
    await wrapper.find('button[aria-label="Close dialog"]').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close when backdrop is clicked', async () => {
    const wrapper = mountDialog()
    const backdrop = wrapper.find('.fixed')
    await backdrop.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('displays network, tokenId, and amount', () => {
    const wrapper = mountDialog({ amount: '1000 TOKEN' })
    expect(wrapper.text()).toContain('Algorand Testnet')
    expect(wrapper.text()).toContain('12345')
    expect(wrapper.text()).toContain('1000 TOKEN')
  })

  it('does not show amount section when amount is not provided', () => {
    const wrapper = mountDialog()
    expect(wrapper.text()).not.toContain('Amount:')
  })

  it('canProceed is true when both statuses are active', () => {
    const wrapper = mountDialog()
    const vm = wrapper.vm as any
    expect(vm.canProceed).toBe(true)
  })

  it('canProceed is false when sender is pending', () => {
    const wrapper = mountDialog({ senderStatus: makeStatus('pending') })
    const vm = wrapper.vm as any
    expect(vm.canProceed).toBe(false)
  })

  it('canProceed is false when receiver is expired', () => {
    const wrapper = mountDialog({ receiverStatus: makeStatus('expired') })
    const vm = wrapper.vm as any
    expect(vm.canProceed).toBe(false)
  })

  it('proceed button is disabled when canProceed is false', () => {
    const wrapper = mountDialog({ senderStatus: makeStatus('denied') })
    const vm = wrapper.vm as any
    expect(vm.canProceed).toBe(false)
  })

  it('handleProceed does not emit when not confirmed', async () => {
    const wrapper = mountDialog()
    const vm = wrapper.vm as any
    vm.confirmed = false
    vm.handleProceed()
    expect(wrapper.emitted('proceed')).toBeFalsy()
  })

  it('handleProceed emits proceed when confirmed and canProceed', async () => {
    const wrapper = mountDialog()
    const vm = wrapper.vm as any
    vm.confirmed = true
    vm.handleProceed()
    expect(wrapper.emitted('proceed')).toBeTruthy()
  })

  describe('getStatusBadgeClass', () => {
    it('returns green for active', () => {
      const vm = mountDialog().vm as any
      expect(vm.getStatusBadgeClass('active')).toContain('green')
    })
    it('returns yellow for pending', () => {
      const vm = mountDialog().vm as any
      expect(vm.getStatusBadgeClass('pending')).toContain('yellow')
    })
    it('returns orange for expired', () => {
      const vm = mountDialog().vm as any
      expect(vm.getStatusBadgeClass('expired')).toContain('orange')
    })
    it('returns red for denied', () => {
      const vm = mountDialog().vm as any
      expect(vm.getStatusBadgeClass('denied')).toContain('red')
    })
    it('returns red for removed', () => {
      const vm = mountDialog().vm as any
      expect(vm.getStatusBadgeClass('removed')).toContain('red')
    })
    it('returns gray for not_listed', () => {
      const vm = mountDialog().vm as any
      expect(vm.getStatusBadgeClass('not_listed')).toContain('gray')
    })
    it('returns gray for unknown status', () => {
      const vm = mountDialog().vm as any
      expect(vm.getStatusBadgeClass('unknown')).toContain('gray')
    })
  })

  describe('formatStatus', () => {
    it('formats active', () => {
      const vm = mountDialog().vm as any
      expect(vm.formatStatus('active')).toBe('Active')
    })
    it('formats pending', () => {
      const vm = mountDialog().vm as any
      expect(vm.formatStatus('pending')).toBe('Pending Approval')
    })
    it('formats expired', () => {
      const vm = mountDialog().vm as any
      expect(vm.formatStatus('expired')).toBe('Expired')
    })
    it('formats denied', () => {
      const vm = mountDialog().vm as any
      expect(vm.formatStatus('denied')).toBe('Denied')
    })
    it('formats removed', () => {
      const vm = mountDialog().vm as any
      expect(vm.formatStatus('removed')).toBe('Removed')
    })
    it('formats not_listed', () => {
      const vm = mountDialog().vm as any
      expect(vm.formatStatus('not_listed')).toBe('Not Listed')
    })
    it('returns raw string for unknown', () => {
      const vm = mountDialog().vm as any
      expect(vm.formatStatus('unknown_state')).toBe('unknown_state')
    })
  })

  describe('getStatusMessage', () => {
    it('returns null for active', () => {
      const vm = mountDialog().vm as any
      expect(vm.getStatusMessage('active')).toBeNull()
    })
    it('returns message for pending', () => {
      const vm = mountDialog().vm as any
      expect(vm.getStatusMessage('pending')).toContain('pending approval')
    })
    it('returns message for expired', () => {
      const vm = mountDialog().vm as any
      expect(vm.getStatusMessage('expired')).toContain('expired')
    })
    it('returns message for denied', () => {
      const vm = mountDialog().vm as any
      expect(vm.getStatusMessage('denied')).toContain('denied')
    })
    it('returns message for removed', () => {
      const vm = mountDialog().vm as any
      expect(vm.getStatusMessage('removed')).toContain('removed')
    })
    it('returns message for not_listed', () => {
      const vm = mountDialog().vm as any
      expect(vm.getStatusMessage('not_listed')).toContain('not on the allowlist')
    })
    it('returns null for unknown', () => {
      const vm = mountDialog().vm as any
      expect(vm.getStatusMessage('unknown')).toBeNull()
    })
  })

  describe('getBlockReason', () => {
    it('returns empty string when both active', () => {
      const vm = mountDialog().vm as any
      expect(vm.getBlockReason()).toBe('')
    })
    it('includes sender reason for pending sender', () => {
      const vm = mountDialog({ senderStatus: makeStatus('pending') }).vm as any
      expect(vm.getBlockReason()).toContain('Sender address is pending approval')
    })
    it('includes sender reason for denied sender', () => {
      const vm = mountDialog({ senderStatus: makeStatus('denied') }).vm as any
      expect(vm.getBlockReason()).toContain('Sender address has been denied')
    })
    it('includes sender reason for expired sender', () => {
      const vm = mountDialog({ senderStatus: makeStatus('expired') }).vm as any
      expect(vm.getBlockReason()).toContain('Sender address allowlist status has expired')
    })
    it('includes sender reason for removed sender', () => {
      const vm = mountDialog({ senderStatus: makeStatus('removed') }).vm as any
      expect(vm.getBlockReason()).toContain('Sender address has been removed')
    })
    it('includes sender reason for not_listed sender', () => {
      const vm = mountDialog({ senderStatus: makeStatus('not_listed') }).vm as any
      expect(vm.getBlockReason()).toContain('Sender address is not on the allowlist')
    })
    it('includes receiver reason for pending receiver', () => {
      const vm = mountDialog({ receiverStatus: makeStatus('pending') }).vm as any
      expect(vm.getBlockReason()).toContain('Receiver address is pending approval')
    })
    it('includes receiver reason for denied receiver', () => {
      const vm = mountDialog({ receiverStatus: makeStatus('denied') }).vm as any
      expect(vm.getBlockReason()).toContain('Receiver address has been denied')
    })
    it('includes receiver reason for expired receiver', () => {
      const vm = mountDialog({ receiverStatus: makeStatus('expired') }).vm as any
      expect(vm.getBlockReason()).toContain('Receiver address allowlist status has expired')
    })
    it('includes receiver reason for removed receiver', () => {
      const vm = mountDialog({ receiverStatus: makeStatus('removed') }).vm as any
      expect(vm.getBlockReason()).toContain('Receiver address has been removed from allowlist')
    })
    it('includes receiver reason for not_listed receiver', () => {
      const vm = mountDialog({ receiverStatus: makeStatus('not_listed') }).vm as any
      expect(vm.getBlockReason()).toContain('Receiver address is not on the allowlist')
    })
    it('joins multiple reasons', () => {
      const vm = mountDialog({
        senderStatus: makeStatus('pending'),
        receiverStatus: makeStatus('denied'),
      }).vm as any
      const reason = vm.getBlockReason()
      expect(reason).toContain('Sender')
      expect(reason).toContain('Receiver')
    })
  })

  describe('truncateAddress', () => {
    it('returns full address if short', () => {
      const vm = mountDialog().vm as any
      expect(vm.truncateAddress('SHORT')).toBe('SHORT')
    })
    it('truncates long addresses', () => {
      const vm = mountDialog().vm as any
      const longAddr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      const result = vm.truncateAddress(longAddr)
      expect(result).toContain('...')
      expect(result.length).toBeLessThan(longAddr.length)
    })
    it('shows first 10 and last 10 chars for long address', () => {
      const vm = mountDialog().vm as any
      const addr = 'ABCDEFGHIJ__MIDDLE__KLMNOPQRST'
      const result = vm.truncateAddress(addr)
      expect(result.startsWith('ABCDEFGHIJ')).toBe(true)
      expect(result.endsWith('KLMNOPQRST')).toBe(true)
    })
  })

  describe('formatDate', () => {
    it('formats valid ISO date string', () => {
      const vm = mountDialog().vm as any
      const result = vm.formatDate('2025-06-15T00:00:00.000Z')
      expect(result).toMatch(/Jun|15|2025/)
    })
    it('returns original string for invalid date', () => {
      const vm = mountDialog().vm as any
      expect(vm.formatDate('not-a-date')).toBe('not-a-date')
    })
  })

  it('shows expired date when sender status is expired with expirationDate', () => {
    const wrapper = mountDialog({
      senderStatus: makeStatus('expired', { expirationDate: '2025-01-01T00:00:00.000Z' }),
    })
    expect(wrapper.text()).toContain('Expired On:')
  })

  it('shows denial reason when sender is denied with denialReason', () => {
    const wrapper = mountDialog({
      senderStatus: makeStatus('denied', { denialReason: 'KYC failed verification' }),
    })
    expect(wrapper.text()).toContain('KYC failed verification')
  })
})
