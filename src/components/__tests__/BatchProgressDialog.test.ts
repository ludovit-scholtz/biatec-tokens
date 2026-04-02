import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BatchProgressDialog from '../BatchProgressDialog.vue'
import type { BatchTokenEntry, BatchStatusSummary } from '../../types/batch'

vi.mock('../ui/Modal.vue', () => ({
  default: {
    name: 'Modal',
    props: ['show', 'size'],
    emits: ['close'],
    template: '<div v-if="show"><slot name="title"/><slot/><slot name="footer"/></div>',
  },
}))

vi.mock('../ui/Badge.vue', () => ({
  default: {
    name: 'Badge',
    props: ['variant'],
    template: '<span class="badge"><slot /></span>',
  },
}))

const makeSummary = (overrides: Partial<BatchStatusSummary> = {}): BatchStatusSummary => ({
  batchId: 'batch-1',
  status: 'deploying',
  totalCount: 3,
  completedCount: 1,
  failedCount: 0,
  deployingCount: 1,
  pendingCount: 1,
  progress: 33,
  createdAt: Date.now(),
  ...overrides,
})

const makeToken = (overrides: Partial<BatchTokenEntry> = {}): BatchTokenEntry => ({
  id: 'tok-1',
  request: { standard: 'ERC20', name: 'Test Token', symbol: 'TST', initialSupply: '1000000', decimals: 18, network: 'ethereum' } as any,
  status: 'pending',
  retryCount: 0,
  ...overrides,
})

const makeAvmToken = (overrides: Partial<BatchTokenEntry> = {}): BatchTokenEntry => ({
  id: 'tok-2',
  request: { standard: 'ASA', name: 'Test ASA', unitName: 'TASA', totalSupply: 1000000, decimals: 0, network: 'algorand-mainnet' } as any,
  status: 'completed',
  transactionId: 'TX123ABC',
  retryCount: 0,
  ...overrides,
})

function mountDialog(props: Record<string, unknown> = {}) {
  return mount(BatchProgressDialog, {
    props: {
      isOpen: true,
      tokens: [makeToken()],
      summary: makeSummary(),
      ...props,
    },
    global: {
      stubs: {
        Modal: {
          template: '<div v-if="show"><slot name="title"/><slot/><slot name="footer"/></div>',
          props: ['show', 'size'],
        },
        Badge: {
          template: '<span class="badge"><slot /></span>',
          props: ['variant'],
        },
      },
    },
  })
}

describe('BatchProgressDialog', () => {
  describe('isDeploying computed', () => {
    it('returns true when status is deploying', () => {
      const wrapper = mountDialog({ summary: makeSummary({ status: 'deploying' }) })
      const vm = wrapper.vm as any
      expect(vm.isDeploying).toBe(true)
    })

    it('returns false when status is completed', () => {
      const wrapper = mountDialog({ summary: makeSummary({ status: 'completed' }) })
      const vm = wrapper.vm as any
      expect(vm.isDeploying).toBe(false)
    })
  })

  describe('isCompleted computed', () => {
    it('returns true when status is completed', () => {
      const wrapper = mountDialog({ summary: makeSummary({ status: 'completed' }) })
      const vm = wrapper.vm as any
      expect(vm.isCompleted).toBe(true)
    })

    it('returns false when status is deploying', () => {
      const wrapper = mountDialog({ summary: makeSummary({ status: 'deploying' }) })
      const vm = wrapper.vm as any
      expect(vm.isCompleted).toBe(false)
    })
  })

  describe('hasErrors computed', () => {
    it('returns true when failedCount > 0', () => {
      const wrapper = mountDialog({ summary: makeSummary({ failedCount: 2 }) })
      const vm = wrapper.vm as any
      expect(vm.hasErrors).toBe(true)
    })

    it('returns false when failedCount is 0', () => {
      const wrapper = mountDialog({ summary: makeSummary({ failedCount: 0 }) })
      const vm = wrapper.vm as any
      expect(vm.hasErrors).toBe(false)
    })
  })

  describe('title computed', () => {
    it('returns "Deploying Batch..." when deploying', () => {
      const wrapper = mountDialog({ summary: makeSummary({ status: 'deploying' }) })
      const vm = wrapper.vm as any
      expect(vm.title).toBe('Deploying Batch...')
    })

    it('returns "Batch Deployment Complete" when completed without errors', () => {
      const wrapper = mountDialog({ summary: makeSummary({ status: 'completed', failedCount: 0 }) })
      const vm = wrapper.vm as any
      expect(vm.title).toBe('Batch Deployment Complete')
    })

    it('returns "Batch Deployment Completed with Errors" when completed with errors', () => {
      const wrapper = mountDialog({ summary: makeSummary({ status: 'failed', failedCount: 1 }) })
      const vm = wrapper.vm as any
      expect(vm.title).toBe('Batch Deployment Completed with Errors')
    })

    it('returns "Batch Deployment" as fallback', () => {
      const wrapper = mountDialog({ summary: makeSummary({ status: 'pending', failedCount: 0 }) })
      const vm = wrapper.vm as any
      expect(vm.title).toBe('Batch Deployment')
    })
  })

  describe('estimatedTimeText computed', () => {
    it('returns null when estimatedTimeRemaining is not set', () => {
      const wrapper = mountDialog({ summary: makeSummary({ estimatedTimeRemaining: undefined }) })
      const vm = wrapper.vm as any
      expect(vm.estimatedTimeText).toBeNull()
    })

    it('returns seconds format when < 60s', () => {
      const wrapper = mountDialog({ summary: makeSummary({ estimatedTimeRemaining: 30000 }) })
      const vm = wrapper.vm as any
      expect(vm.estimatedTimeText).toBe('30s')
    })

    it('returns minutes format when >= 60s and < 3600s', () => {
      const wrapper = mountDialog({ summary: makeSummary({ estimatedTimeRemaining: 120000 }) })
      const vm = wrapper.vm as any
      expect(vm.estimatedTimeText).toBe('2m')
    })

    it('returns hours format when >= 3600s', () => {
      const wrapper = mountDialog({ summary: makeSummary({ estimatedTimeRemaining: 7200000 }) })
      const vm = wrapper.vm as any
      expect(vm.estimatedTimeText).toBe('2h')
    })
  })

  describe('getStatusLabel function', () => {
    it('returns correct labels for each status', () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      expect(vm.getStatusLabel('pending')).toBe('Pending')
      expect(vm.getStatusLabel('deploying')).toBe('Deploying')
      expect(vm.getStatusLabel('completed')).toBe('Completed')
      expect(vm.getStatusLabel('failed')).toBe('Failed')
      expect(vm.getStatusLabel('retrying')).toBe('Retrying')
    })

    it('returns the status itself for unknown status', () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      expect(vm.getStatusLabel('unknown')).toBe('unknown')
    })
  })

  describe('getStatusBadgeVariant function', () => {
    it('returns correct variant for each status', () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      expect(vm.getStatusBadgeVariant('pending')).toBe('default')
      expect(vm.getStatusBadgeVariant('deploying')).toBe('info')
      expect(vm.getStatusBadgeVariant('completed')).toBe('success')
      expect(vm.getStatusBadgeVariant('failed')).toBe('error')
      expect(vm.getStatusBadgeVariant('retrying')).toBe('warning')
    })

    it('returns "default" for unknown status', () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      expect(vm.getStatusBadgeVariant('unknown')).toBe('default')
    })
  })

  describe('getTokenSymbol function', () => {
    it('returns symbol from ERC20 request', () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      const token = makeToken()
      expect(vm.getTokenSymbol(token)).toBe('TST')
    })

    it('returns unitName from ASA request', () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      const token = makeAvmToken()
      expect(vm.getTokenSymbol(token)).toBe('TASA')
    })

    it('returns empty string when neither symbol nor unitName', () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      const token = makeToken({ request: { standard: 'ERC20', name: 'No Symbol', decimals: 18 } as any })
      expect(vm.getTokenSymbol(token)).toBe('')
    })
  })

  describe('getExplorerUrl function', () => {
    it('returns etherscan URL for ERC20 with transactionId', () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      const token = makeToken({ transactionId: 'TX123' })
      expect(vm.getExplorerUrl(token)).toBe('https://etherscan.io/tx/TX123')
    })

    it('returns algoexplorer URL for non-ERC20 with transactionId', () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      const token = makeAvmToken({ transactionId: 'TX456' })
      expect(vm.getExplorerUrl(token)).toBe('https://algoexplorer.io/tx/TX456')
    })

    it('returns "#" when no transactionId', () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      const token = makeToken({ transactionId: undefined })
      expect(vm.getExplorerUrl(token)).toBe('#')
    })
  })

  describe('handleClose function', () => {
    it('emits close when not deploying', () => {
      const wrapper = mountDialog({ summary: makeSummary({ status: 'completed' }) })
      const vm = wrapper.vm as any
      vm.handleClose()
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('does not emit close when deploying', () => {
      const wrapper = mountDialog({ summary: makeSummary({ status: 'deploying' }) })
      const vm = wrapper.vm as any
      vm.handleClose()
      expect(wrapper.emitted('close')).toBeFalsy()
    })
  })
})
