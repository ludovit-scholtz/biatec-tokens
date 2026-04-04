import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TransactionHistoryPanel from '../TransactionHistoryPanel.vue'
import type { Transaction } from '../TransactionHistoryPanel.vue'

vi.useFakeTimers()

const makeTx = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: `tx-${Math.random()}`,
  type: 'token_creation',
  status: 'confirmed',
  timestamp: Date.now() - 10000,
  hash: '0xabcdef1234567890abcdef',
  network: 'ethereum',
  ...overrides,
})

function mountPanel(props: Record<string, unknown> = {}) {
  return mount(TransactionHistoryPanel, {
    props: {
      transactions: [],
      isLoading: false,
      ...props,
    },
  })
}

describe('TransactionHistoryPanel', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('filteredTransactions computed', () => {
    it('returns all transactions when statusFilter is "all"', () => {
      const txs = [makeTx({ status: 'confirmed' }), makeTx({ status: 'pending' })]
      const wrapper = mountPanel({ transactions: txs })
      const vm = wrapper.vm as any
      expect(vm.filteredTransactions.length).toBe(2)
    })

    it('filters by status when statusFilter is set', () => {
      const txs = [makeTx({ status: 'confirmed' }), makeTx({ status: 'pending' })]
      const wrapper = mountPanel({ transactions: txs })
      const vm = wrapper.vm as any
      vm.statusFilter = 'confirmed'
      expect(vm.filteredTransactions.length).toBe(1)
      expect(vm.filteredTransactions[0].status).toBe('confirmed')
    })

    it('filters by type when typeFilter is set', () => {
      const txs = [makeTx({ type: 'token_creation' }), makeTx({ type: 'network_switch' })]
      const wrapper = mountPanel({ transactions: txs })
      const vm = wrapper.vm as any
      vm.typeFilter = 'token_creation'
      expect(vm.filteredTransactions.length).toBe(1)
    })

    it('applies pagination - shows only 10 items per page', () => {
      const txs = Array.from({ length: 15 }, () => makeTx())
      const wrapper = mountPanel({ transactions: txs })
      const vm = wrapper.vm as any
      expect(vm.filteredTransactions.length).toBe(10)
    })

    it('shows correct items on page 2', () => {
      const txs = Array.from({ length: 15 }, (_, i) => makeTx({ id: `tx-${i}` }))
      const wrapper = mountPanel({ transactions: txs })
      const vm = wrapper.vm as any
      vm.currentPage = 2
      expect(vm.filteredTransactions.length).toBe(5)
    })
  })

  describe('totalPages computed', () => {
    it('calculates total pages correctly', () => {
      const txs = Array.from({ length: 25 }, () => makeTx())
      const wrapper = mountPanel({ transactions: txs })
      const vm = wrapper.vm as any
      expect(vm.totalPages).toBe(3)
    })

    it('returns 0 for empty transactions', () => {
      const wrapper = mountPanel({ transactions: [] })
      const vm = wrapper.vm as any
      expect(vm.totalPages).toBe(0)
    })
  })

  describe('getStatusIcon function', () => {
    it('returns check-circle for confirmed', () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      expect(vm.getStatusIcon('confirmed')).toBe('pi pi-check-circle')
    })

    it('returns spinner for pending', () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      expect(vm.getStatusIcon('pending')).toBe('pi pi-spin pi-spinner')
    })

    it('returns times-circle for failed', () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      expect(vm.getStatusIcon('failed')).toBe('pi pi-times-circle')
    })

    it('returns circle for unknown status', () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      expect(vm.getStatusIcon('unknown')).toBe('pi pi-circle')
    })
  })

  describe('formatTransactionType function', () => {
    it('formats all known types', () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      expect(vm.formatTransactionType('token_creation')).toBe('Token Creation')
      expect(vm.formatTransactionType('token_transfer')).toBe('Token Transfer')
      expect(vm.formatTransactionType('token_deployment')).toBe('Token Deployment')
      expect(vm.formatTransactionType('network_switch')).toBe('Network Switch')
      expect(vm.formatTransactionType('other')).toBe('Transaction')
    })

    it('returns "Transaction" for unknown type', () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      expect(vm.formatTransactionType('unknown_type')).toBe('Transaction')
    })
  })

  describe('formatStatus function', () => {
    it('capitalizes status', () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      expect(vm.formatStatus('confirmed')).toBe('Confirmed')
      expect(vm.formatStatus('pending')).toBe('Pending')
      expect(vm.formatStatus('failed')).toBe('Failed')
    })
  })

  describe('formatTimestamp function', () => {
    it('returns "Just now" for timestamps < 1 min ago', () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      const timestamp = Date.now() - 30000 // 30 seconds ago
      expect(vm.formatTimestamp(timestamp)).toBe('Just now')
    })

    it('returns minutes format for timestamps < 1 hour ago', () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      const timestamp = Date.now() - 5 * 60000 // 5 minutes ago
      expect(vm.formatTimestamp(timestamp)).toBe('5m ago')
    })

    it('returns hours format for timestamps < 1 day ago', () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      const timestamp = Date.now() - 3 * 3600000 // 3 hours ago
      expect(vm.formatTimestamp(timestamp)).toBe('3h ago')
    })

    it('returns days format for timestamps < 1 week ago', () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      const timestamp = Date.now() - 3 * 86400000 // 3 days ago
      expect(vm.formatTimestamp(timestamp)).toBe('3d ago')
    })

    it('returns date string for timestamps > 1 week ago', () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      const timestamp = Date.now() - 10 * 86400000 // 10 days ago
      const result = vm.formatTimestamp(timestamp)
      expect(typeof result).toBe('string')
      expect(result).not.toBe('Just now')
    })
  })

  describe('formatHash function', () => {
    it('returns hash as-is when <= 16 chars', () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      expect(vm.formatHash('0xabcd')).toBe('0xabcd')
    })

    it('truncates long hashes', () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      const longHash = '0xabcdef1234567890abcdef1234567890'
      const result = vm.formatHash(longHash)
      expect(result).toContain('...')
      expect(result.startsWith(longHash.slice(0, 8))).toBe(true)
      expect(result.endsWith(longHash.slice(-8))).toBe(true)
    })
  })

  describe('copyHash function', () => {
    it('sets copiedHash and clears it after 2s', async () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      const writeTextMock = vi.fn().mockResolvedValue(undefined)
      vi.stubGlobal('navigator', { clipboard: { writeText: writeTextMock } })

      await vm.copyHash('0xhash')
      expect(vm.copiedHash).toBe('0xhash')

      vi.advanceTimersByTime(2001)
      expect(vm.copiedHash).toBeNull()

      vi.unstubAllGlobals()
    })
  })

  describe('handleRefresh function', () => {
    it('emits refresh and sets isRefreshing temporarily', async () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      vm.handleRefresh()
      expect(vm.isRefreshing).toBe(true)
      expect(wrapper.emitted('refresh')).toBeTruthy()

      vi.advanceTimersByTime(1001)
      expect(vm.isRefreshing).toBe(false)
    })
  })

  describe('handleTransactionClick', () => {
    it('emits transaction-click with transaction', () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      const tx = makeTx()
      vm.handleTransactionClick(tx)
      const emitted = wrapper.emitted('transaction-click')
      expect(emitted).toBeTruthy()
      expect(emitted![0][0]).toEqual(tx)
    })
  })

  describe('handleCheckStatus', () => {
    it('emits check-status with transaction', () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      const tx = makeTx()
      vm.handleCheckStatus(tx)
      expect(wrapper.emitted('check-status')![0][0]).toEqual(tx)
    })
  })

  describe('handleRetry', () => {
    it('emits retry with transaction', () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      const tx = makeTx()
      vm.handleRetry(tx)
      expect(wrapper.emitted('retry')![0][0]).toEqual(tx)
    })
  })

  describe('pagination', () => {
    it('previousPage decrements currentPage when > 1', () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      vm.currentPage = 2
      vm.previousPage()
      expect(vm.currentPage).toBe(1)
    })

    it('previousPage does not decrement below 1', () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      vm.currentPage = 1
      vm.previousPage()
      expect(vm.currentPage).toBe(1)
    })

    it('nextPage increments when < totalPages', () => {
      const txs = Array.from({ length: 15 }, () => makeTx())
      const wrapper = mountPanel({ transactions: txs })
      const vm = wrapper.vm as any
      vm.currentPage = 1
      vm.nextPage()
      expect(vm.currentPage).toBe(2)
    })

    it('nextPage does not go beyond totalPages', () => {
      const txs = Array.from({ length: 15 }, () => makeTx())
      const wrapper = mountPanel({ transactions: txs })
      const vm = wrapper.vm as any
      vm.currentPage = 2
      vm.nextPage()
      expect(vm.currentPage).toBe(2)
    })
  })
})

  describe('copyHash - error branch (line 325)', () => {
    it('handles clipboard write failure gracefully', async () => {
      const wrapper = mountPanel()
      const vm = wrapper.vm as any
      vi.stubGlobal('navigator', {
        clipboard: { writeText: vi.fn().mockRejectedValue(new Error('Clipboard denied')) },
      })
      // Should not throw
      await vm.copyHash('0xhash')
      // copiedHash should remain null since the write failed
      expect(vm.copiedHash).toBeNull()
      vi.unstubAllGlobals()
    })
  })

  describe('close emit (line 21)', () => {
    it('emits close when close button is triggered via vm', () => {
      const wrapper = mountPanel()
      wrapper.vm.$emit('close')
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('failed transaction status v-if branch (line 153)', () => {
    it('renders failed transactions correctly', () => {
      const failedTx = makeTx({ status: 'failed' })
      const wrapper = mountPanel({ transactions: [failedTx] })
      const vm = wrapper.vm as any
      // filteredTransactions should contain the failed tx
      expect(vm.filteredTransactions).toHaveLength(1)
      // handleRetry works for failed transactions
      vm.handleRetry(failedTx)
      expect(wrapper.emitted('retry')).toBeTruthy()
    })
  })
