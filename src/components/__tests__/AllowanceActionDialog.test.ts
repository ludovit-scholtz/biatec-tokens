import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AllowanceActionDialog from '../AllowanceActionDialog.vue'
import type { EVMTokenAllowance } from '../../types/allowances'

// Mock Modal and Button components to avoid complex dependencies
vi.mock('../ui/Modal.vue', () => ({
  default: {
    name: 'Modal',
    props: ['show', 'size'],
    emits: ['close'],
    template: '<div v-if="show"><slot name="title"/><slot/><slot name="footer"/></div>',
  },
}))

vi.mock('../ui/Button.vue', () => ({
  default: {
    name: 'Button',
    props: ['variant', 'disabled'],
    emits: ['click'],
    template: '<button :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
  },
}))

const evmAllowance: EVMTokenAllowance = {
  id: 'evm-1',
  chainType: 'EVM',
  networkId: 'ethereum',
  ownerAddress: '0xowner',
  spenderAddress: '0xabcdef1234567890',
  spenderName: 'Uniswap V3',
  tokenAddress: '0xtoken',
  tokenSymbol: 'USDC',
  tokenName: 'USD Coin',
  tokenDecimals: 6,
  allowanceAmount: '1000000',
  formattedAllowance: '1.00 USDC',
  isUnlimited: false,
  riskLevel: 'low',
  activityStatus: 'active',
  discoveredAt: new Date('2024-01-01'),
}

const evmNoSpenderName: EVMTokenAllowance = {
  ...evmAllowance,
  id: 'evm-2',
  spenderName: undefined,
  spenderAddress: '0xabcdef1234567890abcd',
}

function mountDialog(props: Record<string, unknown>) {
  return mount(AllowanceActionDialog, {
    props: {
      isOpen: true,
      allowance: evmAllowance,
      action: 'revoke',
      ...props,
    },
    global: {
      stubs: {
        Modal: {
          template: '<div v-if="show"><slot name="title"/><slot/><slot name="footer"/></div>',
          props: ['show', 'size'],
        },
        Button: {
          template: '<button :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
          props: ['variant', 'disabled'],
          emits: ['click'],
        },
      },
    },
  })
}

describe('AllowanceActionDialog', () => {
  describe('tokenDisplay computed', () => {
    it('shows token symbol and name for EVM allowance', () => {
      const wrapper = mountDialog({ action: 'revoke' })
      const vm = wrapper.vm as any
      expect(vm.tokenDisplay).toBe('USDC (USD Coin)')
    })

    it('shows "Token" fallback for non-EVM chainType', () => {
      const wrapper = mountDialog({
        allowance: { ...evmAllowance, chainType: 'AVM' },
        action: 'revoke',
      })
      const vm = wrapper.vm as any
      expect(vm.tokenDisplay).toBe('Token')
    })
  })

  describe('spenderDisplay computed', () => {
    it('shows spenderName when available', () => {
      const wrapper = mountDialog({ action: 'revoke' })
      const vm = wrapper.vm as any
      expect(vm.spenderDisplay).toBe('Uniswap V3')
    })

    it('shows formatted address when spenderName is undefined', () => {
      const wrapper = mountDialog({ allowance: evmNoSpenderName, action: 'revoke' })
      const vm = wrapper.vm as any
      // formatAddress truncates: first 6 + "..." + last 4
      expect(vm.spenderDisplay).toContain('0xabcd')
    })
  })

  describe('currentAllowanceDisplay computed', () => {
    it('shows formattedAllowance for EVM chainType', () => {
      const wrapper = mountDialog({ action: 'revoke' })
      const vm = wrapper.vm as any
      expect(vm.currentAllowanceDisplay).toBe('1.00 USDC')
    })

    it('shows N/A for non-EVM chainType', () => {
      const wrapper = mountDialog({
        allowance: { ...evmAllowance, chainType: 'AVM' },
        action: 'revoke',
      })
      const vm = wrapper.vm as any
      expect(vm.currentAllowanceDisplay).toBe('N/A')
    })
  })

  describe('actionTitle computed', () => {
    it('returns "Revoke Token Access" for revoke action', () => {
      const wrapper = mountDialog({ action: 'revoke' })
      const vm = wrapper.vm as any
      expect(vm.actionTitle).toBe('Revoke Token Access')
    })

    it('returns "Reduce Token Access" for reduce action', () => {
      const wrapper = mountDialog({ action: 'reduce' })
      const vm = wrapper.vm as any
      expect(vm.actionTitle).toBe('Reduce Token Access')
    })
  })

  describe('actionWarning computed', () => {
    it('returns revoke warning for revoke action', () => {
      const wrapper = mountDialog({ action: 'revoke' })
      const vm = wrapper.vm as any
      expect(vm.actionWarning).toContain('completely remove')
    })

    it('returns reduce warning for reduce action', () => {
      const wrapper = mountDialog({ action: 'reduce' })
      const vm = wrapper.vm as any
      expect(vm.actionWarning).toContain('reduce')
    })
  })

  describe('actionDescription computed', () => {
    it('returns revoke description for revoke', () => {
      const wrapper = mountDialog({ action: 'revoke' })
      const vm = wrapper.vm as any
      expect(vm.actionDescription).toContain('no longer be able')
    })

    it('returns reduce description for reduce', () => {
      const wrapper = mountDialog({ action: 'reduce' })
      const vm = wrapper.vm as any
      expect(vm.actionDescription).toContain('only be able to access up to')
    })
  })

  describe('benefit1 computed', () => {
    it('returns revoke benefit for revoke', () => {
      const wrapper = mountDialog({ action: 'revoke' })
      const vm = wrapper.vm as any
      expect(vm.benefit1).toContain('Eliminates security risk')
    })

    it('returns reduce benefit for reduce', () => {
      const wrapper = mountDialog({ action: 'reduce' })
      const vm = wrapper.vm as any
      expect(vm.benefit1).toContain('Limits potential loss')
    })
  })

  describe('benefit2 computed', () => {
    it('returns revoke benefit2 for revoke', () => {
      const wrapper = mountDialog({ action: 'revoke' })
      const vm = wrapper.vm as any
      expect(vm.benefit2).toContain('unauthorized token')
    })

    it('returns reduce benefit2 for reduce', () => {
      const wrapper = mountDialog({ action: 'reduce' })
      const vm = wrapper.vm as any
      expect(vm.benefit2).toContain('Maintains ability')
    })
  })

  describe('benefit3 computed', () => {
    it('returns revoke benefit3 for revoke', () => {
      const wrapper = mountDialog({ action: 'revoke' })
      const vm = wrapper.vm as any
      expect(vm.benefit3).toContain('No future transaction')
    })

    it('returns reduce benefit3 for reduce', () => {
      const wrapper = mountDialog({ action: 'reduce' })
      const vm = wrapper.vm as any
      expect(vm.benefit3).toContain('least privilege')
    })
  })

  describe('confirmButtonText computed', () => {
    it('returns "Revoke Access" for revoke', () => {
      const wrapper = mountDialog({ action: 'revoke' })
      const vm = wrapper.vm as any
      expect(vm.confirmButtonText).toBe('Revoke Access')
    })

    it('returns "Reduce Access" for reduce', () => {
      const wrapper = mountDialog({ action: 'reduce' })
      const vm = wrapper.vm as any
      expect(vm.confirmButtonText).toBe('Reduce Access')
    })
  })

  describe('isValidAmount computed', () => {
    it('returns true for non-reduce action regardless of amount', () => {
      const wrapper = mountDialog({ action: 'revoke' })
      const vm = wrapper.vm as any
      expect(vm.isValidAmount).toBe(true)
    })

    it('returns false for reduce action with empty amount', () => {
      const wrapper = mountDialog({ action: 'reduce' })
      const vm = wrapper.vm as any
      expect(vm.isValidAmount).toBe(false)
    })

    it('returns false for reduce action with non-numeric amount', () => {
      const wrapper = mountDialog({ action: 'reduce' })
      const vm = wrapper.vm as any
      vm.reduceAmount = 'abc'
      expect(vm.isValidAmount).toBe(false)
    })

    it('returns false for reduce action with zero amount', () => {
      const wrapper = mountDialog({ action: 'reduce' })
      const vm = wrapper.vm as any
      vm.reduceAmount = '0'
      expect(vm.isValidAmount).toBe(false)
    })

    it('returns true for reduce action with positive numeric amount', () => {
      const wrapper = mountDialog({ action: 'reduce' })
      const vm = wrapper.vm as any
      vm.reduceAmount = '500'
      expect(vm.isValidAmount).toBe(true)
    })

    it('returns true for reduce action with decimal amount', () => {
      const wrapper = mountDialog({ action: 'reduce' })
      const vm = wrapper.vm as any
      vm.reduceAmount = '1.5'
      expect(vm.isValidAmount).toBe(true)
    })
  })

  describe('handleConfirm method', () => {
    it('emits confirm with allowanceId only for revoke action', () => {
      const wrapper = mountDialog({ action: 'revoke' })
      const vm = wrapper.vm as any
      vm.handleConfirm()
      const emitted = wrapper.emitted('confirm')
      expect(emitted).toBeTruthy()
      expect(emitted![0][0]).toEqual({ allowanceId: 'evm-1' })
    })

    it('does not emit confirm for reduce action with invalid amount', () => {
      const wrapper = mountDialog({ action: 'reduce' })
      const vm = wrapper.vm as any
      vm.reduceAmount = ''
      vm.handleConfirm()
      expect(wrapper.emitted('confirm')).toBeFalsy()
    })

    it('emits confirm with allowanceId and newAmount for valid reduce action', () => {
      const wrapper = mountDialog({ action: 'reduce' })
      const vm = wrapper.vm as any
      vm.reduceAmount = '100'
      vm.handleConfirm()
      const emitted = wrapper.emitted('confirm')
      expect(emitted).toBeTruthy()
      expect(emitted![0][0].allowanceId).toBe('evm-1')
      expect(emitted![0][0].newAmount).toBeTruthy()
    })

    it('computes correct rawAmount for reduce action with decimals', () => {
      const wrapper = mountDialog({ action: 'reduce' })
      const vm = wrapper.vm as any
      vm.reduceAmount = '1'
      vm.handleConfirm()
      const emitted = wrapper.emitted('confirm')
      // 1 * 10^6 = 1000000 (tokenDecimals is 6)
      expect(emitted![0][0].newAmount).toBe('1000000')
    })
  })
})
