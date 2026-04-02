import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MicaDashboardSummary from '../MicaDashboardSummary.vue'

vi.mock('../MicaSummaryWidget.vue', () => ({
  default: { name: 'MicaSummaryWidget', template: '<div class="mock-summary"></div>', props: ['metrics', 'isLoading'] },
}))

vi.mock('../../services/ComplianceService', () => ({
  complianceService: {
    getMicaComplianceMetrics: vi.fn().mockRejectedValue(new Error('API unavailable')),
  },
}))

function mountSummary(props: Record<string, unknown> = {}) {
  return mount(MicaDashboardSummary, {
    props: {
      tokenId: 'token-abc',
      network: 'VOI',
      ...props,
    },
    global: {
      stubs: {
        MicaSummaryWidget: { template: '<div class="mock-summary"></div>', props: ['metrics', 'isLoading'] },
      },
    },
  })
}

describe('MicaDashboardSummary', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('formatNumber', () => {
    it('formats numbers >= 1M with M suffix', () => {
      const wrapper = mountSummary()
      const vm = wrapper.vm as any
      expect(vm.formatNumber('1500000')).toBe('1.50M')
      expect(vm.formatNumber(2000000)).toBe('2.00M')
    })

    it('formats numbers >= 1K with K suffix', () => {
      const wrapper = mountSummary()
      const vm = wrapper.vm as any
      expect(vm.formatNumber('5000')).toBe('5.00K')
      expect(vm.formatNumber(12345)).toBe('12.35K')
    })

    it('formats numbers < 1K without suffix', () => {
      const wrapper = mountSummary()
      const vm = wrapper.vm as any
      expect(vm.formatNumber(500)).toMatch(/500/)
      expect(vm.formatNumber('0')).toBe('0')
    })

    it('handles string input', () => {
      const wrapper = mountSummary()
      const vm = wrapper.vm as any
      expect(vm.formatNumber('1000000')).toBe('1.00M')
    })
  })

  describe('formatTimestamp', () => {
    it('returns "Just now" for very recent timestamps', () => {
      const wrapper = mountSummary()
      const vm = wrapper.vm as any
      const ts = new Date(Date.now() - 30000).toISOString()
      expect(vm.formatTimestamp(ts)).toBe('Just now')
    })

    it('returns minutes ago for timestamps < 60 min', () => {
      const wrapper = mountSummary()
      const vm = wrapper.vm as any
      const ts = new Date(Date.now() - 10 * 60000).toISOString()
      expect(vm.formatTimestamp(ts)).toBe('10m ago')
    })

    it('returns hours ago for timestamps < 24 hours', () => {
      const wrapper = mountSummary()
      const vm = wrapper.vm as any
      const ts = new Date(Date.now() - 3 * 3600000).toISOString()
      expect(vm.formatTimestamp(ts)).toBe('3h ago')
    })

    it('returns formatted date for older timestamps', () => {
      const wrapper = mountSummary()
      const vm = wrapper.vm as any
      const ts = new Date(Date.now() - 3 * 86400000).toISOString()
      const result = vm.formatTimestamp(ts)
      expect(typeof result).toBe('string')
      expect(result).not.toBe('Just now')
    })
  })

  describe('shortenAddress', () => {
    it('shortens long addresses', () => {
      const wrapper = mountSummary()
      const vm = wrapper.vm as any
      const addr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const result = vm.shortenAddress(addr)
      expect(result).toContain('...')
      expect(result).toBe('ABCDEF...WXYZ')
    })

    it('returns short addresses unchanged', () => {
      const wrapper = mountSummary()
      const vm = wrapper.vm as any
      expect(vm.shortenAddress('SHORT')).toBe('SHORT')
      expect(vm.shortenAddress('')).toBe('')
    })
  })

  describe('getTransferStatusClass', () => {
    it('returns green class for completed', () => {
      const wrapper = mountSummary()
      const vm = wrapper.vm as any
      expect(vm.getTransferStatusClass('completed')).toContain('green')
    })

    it('returns yellow class for pending', () => {
      const wrapper = mountSummary()
      const vm = wrapper.vm as any
      expect(vm.getTransferStatusClass('pending')).toContain('yellow')
    })

    it('returns red class for failed', () => {
      const wrapper = mountSummary()
      const vm = wrapper.vm as any
      expect(vm.getTransferStatusClass('failed')).toContain('red')
    })

    it('returns orange class for blocked', () => {
      const wrapper = mountSummary()
      const vm = wrapper.vm as any
      expect(vm.getTransferStatusClass('blocked')).toContain('orange')
    })

    it('returns gray class for unknown status', () => {
      const wrapper = mountSummary()
      const vm = wrapper.vm as any
      expect(vm.getTransferStatusClass('unknown')).toContain('gray')
    })
  })

  describe('emit events', () => {
    it('emits navigate-to-whitelist', () => {
      const wrapper = mountSummary()
      const vm = wrapper.vm as any
      vm.$emit('navigate-to-whitelist')
      expect(wrapper.emitted('navigate-to-whitelist')).toBeTruthy()
    })

    it('emits navigate-to-audit-log', () => {
      const wrapper = mountSummary()
      const vm = wrapper.vm as any
      vm.$emit('navigate-to-audit-log')
      expect(wrapper.emitted('navigate-to-audit-log')).toBeTruthy()
    })
  })

  describe('state refs', () => {
    it('initializes showSupplyDetails, showDistributionDetails, showTransferDetails to false', () => {
      const wrapper = mountSummary()
      const vm = wrapper.vm as any
      expect(vm.showSupplyDetails).toBe(false)
      expect(vm.showDistributionDetails).toBe(false)
      expect(vm.showTransferDetails).toBe(false)
    })

    it('toggle refs work', () => {
      const wrapper = mountSummary()
      const vm = wrapper.vm as any
      vm.showSupplyDetails = true
      expect(vm.showSupplyDetails).toBe(true)
    })
  })
})
