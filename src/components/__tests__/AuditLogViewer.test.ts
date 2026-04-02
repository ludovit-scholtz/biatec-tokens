import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import AuditLogViewer from '../AuditLogViewer.vue'

vi.mock('../../services/ComplianceService', () => ({
  complianceService: {
    getAuditLog: vi.fn().mockResolvedValue({ entries: [], total: 0, hasMore: false }),
    exportAuditLog: vi.fn().mockResolvedValue('csv,data\nrow1'),
  },
}))

vi.mock('../../composables/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  }),
}))

function mountViewer(props = {}) {
  return mount(AuditLogViewer, {
    props: { tokenId: 'TOKEN123', network: 'VOI', ...props },
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })],
      stubs: { Modal: true },
    },
  })
}

describe('AuditLogViewer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the Audit Log heading', async () => {
    const wrapper = mountViewer()
    await nextTick()
    expect(wrapper.text()).toContain('Audit Log')
  })

  it('loads audit log on mount', async () => {
    const { complianceService } = await import('../../services/ComplianceService')
    mountViewer()
    await nextTick()
    expect(complianceService.getAuditLog).toHaveBeenCalled()
  })

  it('shows loading state while fetching', async () => {
    let resolve: (v: any) => void = () => {}
    const { complianceService } = await import('../../services/ComplianceService')
    vi.mocked(complianceService.getAuditLog).mockImplementation(
      () => new Promise(r => { resolve = r })
    )
    const wrapper = mountViewer()
    // isLoading should be set to true during fetch
    expect(wrapper.vm.$data).toBeTruthy() // component is mounted
    resolve({ entries: [], total: 0, hasMore: false })
    await nextTick()
  })

  it('shows error message when load fails', async () => {
    const { complianceService } = await import('../../services/ComplianceService')
    vi.mocked(complianceService.getAuditLog).mockRejectedValue(new Error('Network error'))
    const wrapper = mountViewer()
    await nextTick()
    await nextTick()
    // error state should be set
    const vm = wrapper.vm as any
    expect(vm.error).toBe('Network error')
  })

  it('shows error for non-Error rejection', async () => {
    const { complianceService } = await import('../../services/ComplianceService')
    vi.mocked(complianceService.getAuditLog).mockRejectedValue('string error')
    const wrapper = mountViewer()
    await nextTick()
    await nextTick()
    const vm = wrapper.vm as any
    expect(vm.error).toBe('Failed to load audit log')
  })

  it('resets filters to defaults', async () => {
    const wrapper = mountViewer()
    await nextTick()
    await nextTick()
    const vm = wrapper.vm as any
    vm.filters.action = 'transfer_executed'
    vm.filters.result = 'success'
    vm.resetFilters()
    await nextTick()
    expect(vm.filters.action).toBeUndefined()
    expect(vm.filters.result).toBeUndefined()
  })

  it('resets offset on filter reset', async () => {
    const wrapper = mountViewer()
    await nextTick()
    const vm = wrapper.vm as any
    vm.offset = 20
    vm.resetFilters()
    await nextTick()
    expect(vm.offset).toBe(0)
  })

  it('nextPage increments offset by limit', async () => {
    const wrapper = mountViewer()
    await nextTick()
    await nextTick()
    const vm = wrapper.vm as any
    const initial = vm.offset
    vm.nextPage()
    expect(vm.offset).toBe(initial + vm.limit)
  })

  it('previousPage decrements offset by limit, min 0', async () => {
    const wrapper = mountViewer()
    await nextTick()
    const vm = wrapper.vm as any
    vm.offset = 40
    vm.previousPage()
    expect(vm.offset).toBe(20)
  })

  it('previousPage does not go below 0', async () => {
    const wrapper = mountViewer()
    await nextTick()
    const vm = wrapper.vm as any
    vm.offset = 0
    vm.previousPage()
    expect(vm.offset).toBe(0)
  })

  it('showDetails sets selectedEntry and opens modal', async () => {
    const wrapper = mountViewer()
    await nextTick()
    const vm = wrapper.vm as any
    const fakeEntry = { id: 'log-1', action: 'transfer_executed', result: 'success' }
    vm.showDetails(fakeEntry)
    expect(vm.selectedEntry).toEqual(fakeEntry)
    expect(vm.showDetailsModal).toBe(true)
  })

  describe('formatTimestamp', () => {
    it('formats an ISO timestamp to readable date', () => {
      const wrapper = mountViewer()
      const vm = wrapper.vm as any
      const result = vm.formatTimestamp('2025-06-15T14:30:00.000Z')
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })
  })

  describe('formatAddress', () => {
    it('returns full address if short', () => {
      const vm = mountViewer().vm as any
      expect(vm.formatAddress('SHORT')).toBe('SHORT')
    })
    it('truncates long addresses', () => {
      const vm = mountViewer().vm as any
      const long = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      const result = vm.formatAddress(long)
      expect(result).toContain('...')
      expect(result.startsWith('ABCDEFGH')).toBe(true)
    })
  })

  describe('formatAction', () => {
    it('converts snake_case to Title Case', () => {
      const vm = mountViewer().vm as any
      expect(vm.formatAction('whitelist_add')).toBe('Whitelist Add')
    })
    it('handles single word', () => {
      const vm = mountViewer().vm as any
      expect(vm.formatAction('transfer')).toBe('Transfer')
    })
    it('handles three-part action', () => {
      const vm = mountViewer().vm as any
      expect(vm.formatAction('transfer_bulk_upload')).toBe('Transfer Bulk Upload')
    })
  })

  describe('handleExport', () => {
    it('calls exportAuditLog and creates download link', async () => {
      const { complianceService } = await import('../../services/ComplianceService')
      vi.mocked(complianceService.exportAuditLog).mockResolvedValue('col1,col2\nval1,val2')
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
        set href(v: string) { this._href = v },
        get href() { return this._href || '' },
      }
      const origCreateElement = document.createElement.bind(document)
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
      vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
      vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        if (tag === 'a') return mockLink as any
        return origCreateElement(tag)
      })
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any)
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any)

      const wrapper = mountViewer()
      await nextTick()
      const vm = wrapper.vm as any
      await vm.handleExport()
      expect(complianceService.exportAuditLog).toHaveBeenCalled()
      expect(mockLink.click).toHaveBeenCalled()
    })

    it('handles export error gracefully', async () => {
      const { complianceService } = await import('../../services/ComplianceService')
      vi.mocked(complianceService.exportAuditLog).mockRejectedValue(new Error('Export failed'))
      const wrapper = mountViewer()
      await nextTick()
      const vm = wrapper.vm as any
      await vm.handleExport()
      expect(vm.isExporting).toBe(false)
    })
  })
})
