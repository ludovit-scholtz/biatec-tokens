import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ComplianceExports from '../ComplianceExports.vue'

vi.mock('../ui/Modal.vue', () => ({
  default: {
    name: 'Modal',
    props: ['show', 'size'],
    emits: ['close'],
    template: '<div v-if="show"><slot name="title"/><slot/><slot name="footer"/></div>',
  },
}))

vi.useFakeTimers()

function mountExports(props: Record<string, unknown> = {}) {
  return mount(ComplianceExports, {
    props: {
      tokenId: 'token-123',
      network: 'algorand-mainnet',
      ...props,
    },
    global: {
      stubs: {
        Modal: {
          template: '<div v-if="show"><slot name="title"/><slot/><slot name="footer"/></div>',
          props: ['show', 'size'],
          emits: ['close'],
        },
      },
    },
  })
}

describe('ComplianceExports', () => {
  afterEach(() => {
    vi.clearAllTimers()
    vi.restoreAllMocks()
    localStorage.clear()
  })

  describe('today computed', () => {
    it('returns today date string in ISO format (YYYY-MM-DD)', () => {
      const wrapper = mountExports()
      const vm = wrapper.vm as any
      expect(vm.today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })

  describe('validateFilters function', () => {
    it('fails validation when tokenId is empty', () => {
      const wrapper = mountExports({ tokenId: '' })
      const vm = wrapper.vm as any
      vm.filters.tokenId = ''
      const isValid = vm.validateFilters()
      expect(isValid).toBe(false)
      expect(vm.validationErrors.tokenId).toBeTruthy()
    })

    it('fails validation when startDate is missing', () => {
      const wrapper = mountExports()
      const vm = wrapper.vm as any
      vm.filters.startDate = ''
      vm.filters.endDate = '2026-03-01'
      const isValid = vm.validateFilters()
      expect(isValid).toBe(false)
      expect(vm.validationErrors.startDate).toBeTruthy()
    })

    it('fails validation when endDate is missing', () => {
      const wrapper = mountExports()
      const vm = wrapper.vm as any
      vm.filters.startDate = '2026-01-01'
      vm.filters.endDate = ''
      const isValid = vm.validateFilters()
      expect(isValid).toBe(false)
      expect(vm.validationErrors.endDate).toBeTruthy()
    })

    it('fails validation when start date is after end date', () => {
      const wrapper = mountExports()
      const vm = wrapper.vm as any
      vm.filters.startDate = '2026-06-01'
      vm.filters.endDate = '2026-01-01'
      const isValid = vm.validateFilters()
      expect(isValid).toBe(false)
      expect(vm.validationErrors.startDate).toBeTruthy()
    })

    it('fails validation when date range > 1 year', () => {
      const wrapper = mountExports()
      const vm = wrapper.vm as any
      // End date in the future → endDate error
      vm.filters.startDate = '2024-01-01'
      vm.filters.endDate = '2030-06-01'
      const isValid = vm.validateFilters()
      expect(isValid).toBe(false)
    })

    it('passes validation when all required fields are set correctly', () => {
      const wrapper = mountExports()
      const vm = wrapper.vm as any
      vm.filters.tokenId = 'token-123'
      vm.filters.startDate = '2026-01-01'
      vm.filters.endDate = '2026-03-01'
      const isValid = vm.validateFilters()
      expect(isValid).toBe(true)
      expect(Object.keys(vm.validationErrors).length).toBe(0)
    })
  })

  describe('resetFilters function', () => {
    it('resets filters to defaults with tokenId from props', () => {
      const wrapper = mountExports({ tokenId: 'my-token' })
      const vm = wrapper.vm as any
      vm.filters.startDate = '2026-01-01'
      vm.filters.endDate = '2026-03-01'
      vm.filters.actionType = 'whitelist_add'
      vm.validationErrors = { tokenId: 'error' }

      vm.resetFilters()

      expect(vm.filters.tokenId).toBe('my-token')
      expect(vm.filters.startDate).toBe('')
      expect(vm.filters.endDate).toBe('')
      expect(vm.filters.actionType).toBe('')
      expect(vm.filters.format).toBe('csv')
      expect(Object.keys(vm.validationErrors).length).toBe(0)
    })
  })

  describe('previewExport function', () => {
    it('does not proceed when validation fails', async () => {
      const wrapper = mountExports({ tokenId: '' })
      const vm = wrapper.vm as any
      vm.filters.tokenId = ''
      await vm.previewExport()
      expect(vm.isGeneratingPreview).toBe(false)
      expect(vm.showPreviewModal).toBe(false)
    })

    it('generates preview when validation passes', async () => {
      const wrapper = mountExports()
      const vm = wrapper.vm as any
      vm.filters.tokenId = 'token-123'
      vm.filters.startDate = '2026-01-01'
      vm.filters.endDate = '2026-03-01'

      const previewPromise = vm.previewExport()
      expect(vm.isGeneratingPreview).toBe(true)

      vi.advanceTimersByTime(1100)
      await previewPromise

      expect(vm.showPreviewModal).toBe(true)
      expect(vm.exportPreview).not.toBeNull()
      expect(vm.exportPreview.recordCount).toBeGreaterThan(0)
      expect(vm.isGeneratingPreview).toBe(false)
    })
  })

  describe('executeExport function', () => {
    it('does nothing when exportPreview is null', async () => {
      const wrapper = mountExports()
      const vm = wrapper.vm as any
      vm.exportPreview = null
      await vm.executeExport()
      expect(vm.isExporting).toBe(false)
    })

    it('does nothing when exportPreview.recordCount is 0', async () => {
      const wrapper = mountExports()
      const vm = wrapper.vm as any
      vm.exportPreview = { recordCount: 0, estimatedSize: '0KB', sampleData: [] }
      await vm.executeExport()
      expect(vm.isExporting).toBe(false)
    })

    it('executes export with valid preview and records download history', async () => {
      const wrapper = mountExports()
      const vm = wrapper.vm as any
      vm.filters.tokenId = 'token-123'
      vm.filters.startDate = '2026-01-01'
      vm.filters.endDate = '2026-03-01'
      vm.exportPreview = { recordCount: 100, estimatedSize: '50KB', sampleData: [] }

      // Mock URL methods (not supported in happy-dom)
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
      vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

      // Run export with timers advancing
      const exportPromise = vm.executeExport()
      await vi.runAllTimersAsync()
      await exportPromise

      expect(vm.downloadHistory.length).toBe(1)
      expect(vm.downloadHistory[0].status).toBe('success')
      expect(vm.isExporting).toBe(false)
    })
  })

  describe('filters initialization', () => {
    it('initializes tokenId from props', () => {
      const wrapper = mountExports({ tokenId: 'my-token-456' })
      const vm = wrapper.vm as any
      expect(vm.filters.tokenId).toBe('my-token-456')
    })

    it('initializes with empty tokenId when prop not provided', () => {
      const wrapper = mountExports({ tokenId: undefined })
      const vm = wrapper.vm as any
      expect(vm.filters.tokenId).toBe('')
    })
  })
})
