import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import CSVImportDialog from '../CSVImportDialog.vue'
import type { CsvValidationResult, BulkImportResponse } from '../../../types/whitelist'

const MOCK_VALIDATION: CsvValidationResult = {
  valid: true,
  totalRows: 3,
  validRows: 2,
  errorRows: 1,
  errors: [{ row: 3, field: 'email', value: 'bad', message: 'Invalid email', severity: 'error' }],
  preview: [
    {
      row: 1,
      name: 'Alice',
      email: 'alice@example.com',
      walletAddress: 'WALLETABC',
      organizationName: 'Acme',
      entityType: 'individual',
      jurisdictionCode: 'US',
      hasErrors: false,
      errors: [],
      warnings: [],
    },
    {
      row: 2,
      name: 'Bob',
      email: 'bob@example.com',
      entityType: 'corporate',
      jurisdictionCode: 'DE',
      hasErrors: false,
      errors: [],
      warnings: [],
    },
    {
      row: 3,
      name: 'Bad',
      email: 'bad',
      entityType: 'individual',
      jurisdictionCode: 'XX',
      hasErrors: true,
      errors: ['Invalid email'],
      warnings: [],
    },
  ],
}

const MOCK_IMPORT_RESULT: BulkImportResponse = {
  success: true,
  totalProcessed: 2,
  successCount: 2,
  failureCount: 0,
  skippedCount: 0,
  errors: [],
  createdIds: ['id-1', 'id-2'],
}

const STUBS = {
  Modal: {
    template: `<div v-if="show"><slot name="header"/><slot/><slot name="footer"/></div>`,
    props: ['show', 'size'],
    emits: ['close'],
  },
  Badge: { template: '<span><slot/></span>', props: ['variant'] },
  Button: {
    template: '<button type="button" @click="$emit(\'click\')"><slot/></button>',
    props: ['variant', 'size', 'loading', 'disabled'],
    emits: ['click'],
  },
}

function mountDialog(show = true, storeOverrides: Record<string, any> = {}) {
  return mount(CSVImportDialog, {
    props: { show },
    attachTo: document.body,
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: { whitelist: {} },
          stubActions: false,
          ...storeOverrides,
        }),
      ],
      stubs: STUBS,
    },
  })
}

describe('CSVImportDialog helper functions', () => {
  describe('formatFileSize', () => {
    it('formats bytes', () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      expect(vm.formatFileSize(512)).toBe('512 B')
    })

    it('formats kilobytes', () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      expect(vm.formatFileSize(2048)).toBe('2.00 KB')
    })

    it('formats megabytes', () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      expect(vm.formatFileSize(2 * 1024 * 1024)).toBe('2.00 MB')
    })

    it('formats exactly 1024 bytes as KB', () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      expect(vm.formatFileSize(1024)).toBe('1.00 KB')
    })
  })

  describe('selectFile', () => {
    it('rejects non-CSV files', async () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      const file = new File(['data'], 'test.txt', { type: 'text/plain' })
      vm.selectFile(file)
      await nextTick()
      expect(vm.selectedFile).toBeNull()
      expect(vm.error).toContain('CSV')
    })

    it('accepts CSV files', async () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      const file = new File(['data'], 'import.csv', { type: 'text/csv' })
      vm.selectFile(file)
      await nextTick()
      expect(vm.selectedFile).toStrictEqual(file)
      expect(vm.error).toBe('')
    })
  })

  describe('removeFile', () => {
    it('clears the selected file', async () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      vm.selectedFile = new File(['data'], 'import.csv', { type: 'text/csv' })
      vm.removeFile()
      await nextTick()
      expect(vm.selectedFile).toBeNull()
    })
  })

  describe('handleFileSelect', () => {
    it('selects file from input event', async () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      const file = new File(['data'], 'import.csv', { type: 'text/csv' })
      const event = { target: { files: [file] } } as unknown as Event
      vm.handleFileSelect(event)
      await nextTick()
      expect(vm.selectedFile).toStrictEqual(file)
    })

    it('does nothing when no files in event', async () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      const event = { target: { files: null } } as unknown as Event
      vm.handleFileSelect(event)
      await nextTick()
      expect(vm.selectedFile).toBeNull()
    })
  })

  describe('handleDrop', () => {
    it('selects dropped CSV file', async () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      const file = new File(['data'], 'drop.csv', { type: 'text/csv' })
      const event = {
        dataTransfer: { files: [file] },
      } as unknown as DragEvent
      vm.handleDrop(event)
      await nextTick()
      expect(vm.isDragging).toBe(false)
      expect(vm.selectedFile).toStrictEqual(file)
    })

    it('does nothing when no dataTransfer files', async () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      const event = { dataTransfer: null } as unknown as DragEvent
      vm.handleDrop(event)
      await nextTick()
      expect(vm.selectedFile).toBeNull()
    })
  })

  describe('validateFile', () => {
    it('returns early when no file selected', async () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      vm.selectedFile = null
      await vm.validateFile()
      expect(vm.isValidating).toBe(false)
      expect(vm.currentStep).toBe(1)
    })

    it('advances to step 2 on successful validation', async () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      const { useWhitelistStore } = await import('../../../stores/whitelist')
      const store = useWhitelistStore()
      ;(store.validateCsv as any).mockResolvedValue(MOCK_VALIDATION)

      vm.selectedFile = new File(['data'], 'import.csv', { type: 'text/csv' })
      await vm.validateFile()
      await nextTick()

      expect(vm.currentStep).toBe(2)
      expect(vm.validationResult).toEqual(MOCK_VALIDATION)
    })

    it('sets error on validation failure', async () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      const { useWhitelistStore } = await import('../../../stores/whitelist')
      const store = useWhitelistStore()
      ;(store.validateCsv as any).mockRejectedValue(new Error('Network error'))

      vm.selectedFile = new File(['data'], 'import.csv', { type: 'text/csv' })
      await vm.validateFile()
      await nextTick()

      expect(vm.error).toBe('Network error')
      expect(vm.currentStep).toBe(1)
    })

    it('sets generic error when exception has no message', async () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      const { useWhitelistStore } = await import('../../../stores/whitelist')
      const store = useWhitelistStore()
      ;(store.validateCsv as any).mockRejectedValue('string error')

      vm.selectedFile = new File(['data'], 'import.csv', { type: 'text/csv' })
      await vm.validateFile()
      await nextTick()

      expect(vm.error).toBe('Failed to validate CSV')
    })
  })

  describe('proceedToImport', () => {
    it('advances to step 3', async () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      vm.currentStep = 2
      vm.proceedToImport()
      await nextTick()
      expect(vm.currentStep).toBe(3)
    })
  })

  describe('goBack', () => {
    it('decrements step when above 1', async () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      vm.currentStep = 3
      vm.goBack()
      await nextTick()
      expect(vm.currentStep).toBe(2)
    })

    it('does not decrement below step 1', async () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      vm.currentStep = 1
      vm.goBack()
      await nextTick()
      expect(vm.currentStep).toBe(1)
    })
  })

  describe('startImport', () => {
    it('returns early when no validationResult', async () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      vm.validationResult = null
      await vm.startImport()
      expect(vm.isImporting).toBe(false)
    })

    it('emits imported event on success', async () => {
      vi.useFakeTimers()
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      const { useWhitelistStore } = await import('../../../stores/whitelist')
      const store = useWhitelistStore()
      ;(store.bulkImport as any).mockResolvedValue(MOCK_IMPORT_RESULT)

      vm.validationResult = MOCK_VALIDATION
      const importPromise = vm.startImport()
      vi.advanceTimersByTime(2000)
      await importPromise
      await nextTick()

      expect(wrapper.emitted('imported')).toBeTruthy()
      expect(wrapper.emitted('imported')![0]).toEqual([2])
      expect(vm.importResult).toEqual(MOCK_IMPORT_RESULT)
      expect(vm.importProgress).toBe(100)
      vi.useRealTimers()
    })

    it('sets error on import failure', async () => {
      vi.useFakeTimers()
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      const { useWhitelistStore } = await import('../../../stores/whitelist')
      const store = useWhitelistStore()
      ;(store.bulkImport as any).mockRejectedValue(new Error('Import failed'))

      vm.validationResult = MOCK_VALIDATION
      const importPromise = vm.startImport()
      vi.advanceTimersByTime(2000)
      await importPromise
      await nextTick()

      expect(vm.error).toBe('Import failed')
      vi.useRealTimers()
    })

    it('sets generic error when thrown value is not Error', async () => {
      vi.useFakeTimers()
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      const { useWhitelistStore } = await import('../../../stores/whitelist')
      const store = useWhitelistStore()
      ;(store.bulkImport as any).mockRejectedValue('bad')

      vm.validationResult = MOCK_VALIDATION
      const importPromise = vm.startImport()
      vi.advanceTimersByTime(2000)
      await importPromise
      await nextTick()

      expect(vm.error).toBe('Failed to import entries')
      vi.useRealTimers()
    })
  })

  describe('handleClose', () => {
    it('emits close and resets state when idle', async () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      vm.currentStep = 3
      vm.selectedFile = new File(['x'], 'f.csv', { type: 'text/csv' })
      vm.validationResult = MOCK_VALIDATION
      vm.importResult = MOCK_IMPORT_RESULT
      vm.error = 'some error'

      vm.handleClose()
      await nextTick()

      expect(wrapper.emitted('close')).toBeTruthy()
      expect(vm.currentStep).toBe(1)
      expect(vm.selectedFile).toBeNull()
      expect(vm.validationResult).toBeNull()
      expect(vm.importResult).toBeNull()
      expect(vm.error).toBe('')
    })

    it('does not emit close while validating', async () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      vm.isValidating = true
      vm.handleClose()
      await nextTick()
      expect(wrapper.emitted('close')).toBeFalsy()
    })

    it('does not emit close while importing', async () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      vm.isImporting = true
      vm.handleClose()
      await nextTick()
      expect(wrapper.emitted('close')).toBeFalsy()
    })
  })

  describe('triggerFileSelect', () => {
    it('calls click on the fileInput ref when present', async () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      const mockInput = { click: vi.fn() }
      vm.fileInput = mockInput
      vm.triggerFileSelect()
      expect(mockInput.click).toHaveBeenCalledOnce()
    })

    it('does not throw when fileInput ref is null', () => {
      const wrapper = mountDialog()
      const vm = wrapper.vm as any
      vm.fileInput = null
      expect(() => vm.triggerFileSelect()).not.toThrow()
    })
  })
})
