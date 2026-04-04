import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the BatchDeploymentService
vi.mock('../../services/BatchDeploymentService', () => ({
  batchDeploymentService: {
    createBatch: vi.fn(),
    getBatch: vi.fn(),
    startBatchDeployment: vi.fn(),
    getBatchStatus: vi.fn(),
    retryFailedTokens: vi.fn(),
    exportBatchAudit: vi.fn(),
  },
}))

// Mock URL APIs for download tests
const mockCreateObjectURL = vi.fn().mockReturnValue('blob:mock-url')
const mockRevokeObjectURL = vi.fn()
const mockAppendChild = vi.fn()
const mockRemoveChild = vi.fn()
const mockClick = vi.fn()

Object.defineProperty(globalThis, 'URL', {
  value: {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL,
  },
  writable: true,
})

import { useBatchDeployment } from '../useBatchDeployment'
import { batchDeploymentService } from '../../services/BatchDeploymentService'

const mockBatchConfig = {
  batchId: 'batch-001',
  name: 'Test Batch',
  status: 'draft',
  tokens: [{ id: 'tok-1', name: 'Token1' }],
}

const mockBatchSummary = {
  batchId: 'batch-001',
  status: 'pending',
  progress: 50,
  completed: 1,
  failed: 0,
  pending: 1,
  total: 2,
}

const mockValidation = {
  valid: true,
  errors: [],
  warnings: [],
}

describe('useBatchDeployment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(batchDeploymentService.getBatch as any).mockResolvedValue(mockBatchConfig)
    ;(batchDeploymentService.getBatchStatus as any).mockResolvedValue(mockBatchSummary)
    ;(batchDeploymentService.createBatch as any).mockResolvedValue({
      success: true,
      batchId: 'batch-001',
      validation: mockValidation,
      summary: mockBatchSummary,
    })
    ;(batchDeploymentService.startBatchDeployment as any).mockResolvedValue({ success: true })
    ;(batchDeploymentService.retryFailedTokens as any).mockResolvedValue({ success: true })
    ;(batchDeploymentService.exportBatchAudit as any).mockResolvedValue('audit-data-csv')
  })

  describe('initial state', () => {
    it('has null currentBatch initially', () => {
      const { currentBatch } = useBatchDeployment()
      expect(currentBatch.value).toBeNull()
    })

    it('has null batchSummary initially', () => {
      const { batchSummary } = useBatchDeployment()
      expect(batchSummary.value).toBeNull()
    })

    it('has isCreating false initially', () => {
      const { isCreating } = useBatchDeployment()
      expect(isCreating.value).toBe(false)
    })

    it('has isDeploying false initially', () => {
      const { isDeploying } = useBatchDeployment()
      expect(isDeploying.value).toBe(false)
    })

    it('has isPolling false initially', () => {
      const { isPolling } = useBatchDeployment()
      expect(isPolling.value).toBe(false)
    })

    it('has null validationResult initially', () => {
      const { validationResult } = useBatchDeployment()
      expect(validationResult.value).toBeNull()
    })

    it('has null error initially', () => {
      const { error } = useBatchDeployment()
      expect(error.value).toBeNull()
    })
  })

  describe('computed properties', () => {
    it('hasBatch is false when currentBatch is null', () => {
      const { hasBatch } = useBatchDeployment()
      expect(hasBatch.value).toBe(false)
    })

    it('isValidBatch is false when validationResult is null', () => {
      const { isValidBatch } = useBatchDeployment()
      expect(isValidBatch.value).toBe(false)
    })

    it('canStartDeployment is false when no batch', () => {
      const { canStartDeployment } = useBatchDeployment()
      expect(canStartDeployment.value).toBe(false)
    })

    it('hasErrors is false when error is null', () => {
      const { hasErrors } = useBatchDeployment()
      expect(hasErrors.value).toBe(false)
    })

    it('progressPercentage is 0 when batchSummary is null', () => {
      const { progressPercentage } = useBatchDeployment()
      expect(progressPercentage.value).toBe(0)
    })
  })

  describe('createBatch', () => {
    it('returns true and sets currentBatch on success', async () => {
      const { createBatch, currentBatch, hasBatch } = useBatchDeployment()
      const result = await createBatch({ name: 'Test', tokens: [] } as any)
      expect(result).toBe(true)
      expect(currentBatch.value).toEqual(mockBatchConfig)
      expect(hasBatch.value).toBe(true)
    })

    it('sets validationResult and batchSummary on success', async () => {
      const { createBatch, validationResult, batchSummary } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      expect(validationResult.value).toEqual(mockValidation)
      expect(batchSummary.value).toEqual(mockBatchSummary)
    })

    it('sets isCreating to false after creation', async () => {
      const { createBatch, isCreating } = useBatchDeployment()
      const promise = createBatch({ name: 'Test', tokens: [] } as any)
      await promise
      expect(isCreating.value).toBe(false)
    })

    it('returns false and sets error when service returns success=false', async () => {
      ;(batchDeploymentService.createBatch as any).mockResolvedValue({
        success: false,
        validation: mockValidation,
        summary: mockBatchSummary,
      })
      const { createBatch, error } = useBatchDeployment()
      const result = await createBatch({ name: 'Test', tokens: [] } as any)
      expect(result).toBe(false)
      expect(error.value).toBe('Batch validation failed')
    })

    it('returns false and sets error when service throws', async () => {
      ;(batchDeploymentService.createBatch as any).mockRejectedValue(new Error('Network error'))
      const { createBatch, error } = useBatchDeployment()
      const result = await createBatch({ name: 'Test', tokens: [] } as any)
      expect(result).toBe(false)
      expect(error.value).toBe('Network error')
    })

    it('returns false and sets generic error for non-Error throws', async () => {
      ;(batchDeploymentService.createBatch as any).mockRejectedValue('string error')
      const { createBatch, error } = useBatchDeployment()
      const result = await createBatch({ name: 'Test', tokens: [] } as any)
      expect(result).toBe(false)
      expect(error.value).toBe('Failed to create batch')
    })

    it('isValidBatch is true after successful creation', async () => {
      const { createBatch, isValidBatch } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      expect(isValidBatch.value).toBe(true)
    })
  })

  describe('startDeployment', () => {
    it('returns false when no current batch', async () => {
      const { startDeployment, error } = useBatchDeployment()
      const result = await startDeployment()
      expect(result).toBe(false)
      expect(error.value).toBe('No batch available to deploy')
    })

    it('returns true when batch exists and service succeeds', async () => {
      const { createBatch, startDeployment } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      const result = await startDeployment()
      expect(result).toBe(true)
    })

    it('returns false and sets error when service returns success=false', async () => {
      ;(batchDeploymentService.startBatchDeployment as any).mockResolvedValue({ success: false })
      const { createBatch, startDeployment, error } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      const result = await startDeployment()
      expect(result).toBe(false)
      expect(error.value).toBe('Failed to start deployment')
    })

    it('returns false and sets error when service throws', async () => {
      ;(batchDeploymentService.startBatchDeployment as any).mockRejectedValue(new Error('Timeout'))
      const { createBatch, startDeployment, error, isDeploying } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      const result = await startDeployment()
      expect(result).toBe(false)
      expect(error.value).toBe('Timeout')
      expect(isDeploying.value).toBe(false)
    })
  })

  describe('retryFailedTokens', () => {
    it('returns false when no current batch', async () => {
      const { retryFailedTokens, error } = useBatchDeployment()
      const result = await retryFailedTokens()
      expect(result).toBe(false)
      expect(error.value).toBe('No batch available')
    })

    it('returns true on success', async () => {
      const { createBatch, retryFailedTokens } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      const result = await retryFailedTokens(['tok-1'])
      expect(result).toBe(true)
    })

    it('calls service with batchId and tokenIds', async () => {
      const { createBatch, retryFailedTokens } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      await retryFailedTokens(['tok-1', 'tok-2'])
      expect(batchDeploymentService.retryFailedTokens).toHaveBeenCalledWith({
        batchId: 'batch-001',
        tokenIds: ['tok-1', 'tok-2'],
      })
    })

    it('returns false when service returns success=false', async () => {
      ;(batchDeploymentService.retryFailedTokens as any).mockResolvedValue({ success: false })
      const { createBatch, retryFailedTokens, error } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      const result = await retryFailedTokens()
      expect(result).toBe(false)
      expect(error.value).toBe('Failed to retry tokens')
    })

    it('returns false when service throws', async () => {
      ;(batchDeploymentService.retryFailedTokens as any).mockRejectedValue(new Error('Server error'))
      const { createBatch, retryFailedTokens, error } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      const result = await retryFailedTokens()
      expect(result).toBe(false)
      expect(error.value).toBe('Server error')
    })
  })

  describe('exportAudit', () => {
    it('returns null when no current batch', async () => {
      const { exportAudit, error } = useBatchDeployment()
      const result = await exportAudit('csv')
      expect(result).toBeNull()
      expect(error.value).toBe('No batch available')
    })

    it('returns audit data string on success', async () => {
      const { createBatch, exportAudit } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      const result = await exportAudit('csv')
      expect(result).toBe('audit-data-csv')
    })

    it('returns null when service throws', async () => {
      ;(batchDeploymentService.exportBatchAudit as any).mockRejectedValue(new Error('Export failed'))
      const { createBatch, exportAudit, error } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      const result = await exportAudit('json')
      expect(result).toBeNull()
      expect(error.value).toBe('Export failed')
    })

    it('calls service with batchId and format', async () => {
      const { createBatch, exportAudit } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      await exportAudit('json')
      expect(batchDeploymentService.exportBatchAudit).toHaveBeenCalledWith('batch-001', 'json')
    })
  })

  describe('downloadAudit', () => {
    it('does nothing when exportAudit returns null (no batch)', async () => {
      const { downloadAudit } = useBatchDeployment()
      await downloadAudit('csv')
      expect(mockCreateObjectURL).not.toHaveBeenCalled()
    })

    it('creates download link when audit data available', async () => {
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild)
      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild)
      
      const linkClickSpy = vi.fn()
      const origCreateElement = document.createElement.bind(document)
      const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        if (tag === 'a') {
          const el = origCreateElement(tag)
          el.click = linkClickSpy
          return el
        }
        return origCreateElement(tag)
      })

      const { createBatch, downloadAudit } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      await downloadAudit('csv')

      expect(mockCreateObjectURL).toHaveBeenCalled()
      expect(mockRevokeObjectURL).toHaveBeenCalled()
      expect(linkClickSpy).toHaveBeenCalled()

      appendChildSpy.mockRestore()
      removeChildSpy.mockRestore()
      createElementSpy.mockRestore()
    })
  })

  describe('reset', () => {
    it('resets all state to initial values', async () => {
      const { createBatch, reset, currentBatch, batchSummary, error, isCreating } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      reset()
      expect(currentBatch.value).toBeNull()
      expect(batchSummary.value).toBeNull()
      expect(error.value).toBeNull()
      expect(isCreating.value).toBe(false)
    })
  })

  describe('loadBatch', () => {
    it('returns true and loads batch on success', async () => {
      const { loadBatch, currentBatch, batchSummary } = useBatchDeployment()
      const result = await loadBatch('batch-001')
      expect(result).toBe(true)
      expect(currentBatch.value).toEqual(mockBatchConfig)
      expect(batchSummary.value).toEqual(mockBatchSummary)
    })

    it('returns false and sets error when getBatch throws', async () => {
      ;(batchDeploymentService.getBatch as any).mockRejectedValue(new Error('Not found'))
      const { loadBatch, error } = useBatchDeployment()
      const result = await loadBatch('batch-999')
      expect(result).toBe(false)
      expect(error.value).toBe('Not found')
    })

    it('starts polling when batch is still deploying', async () => {
      ;(batchDeploymentService.getBatchStatus as any).mockResolvedValue({
        ...mockBatchSummary,
        status: 'deploying',
      })
      const { loadBatch, isPolling } = useBatchDeployment()
      await loadBatch('batch-001')
      expect(isPolling.value).toBe(true)
    })

    it('does not start polling when batch is completed', async () => {
      ;(batchDeploymentService.getBatchStatus as any).mockResolvedValue({
        ...mockBatchSummary,
        status: 'completed',
      })
      const { loadBatch, isPolling } = useBatchDeployment()
      await loadBatch('batch-001')
      expect(isPolling.value).toBe(false)
    })
  })

  describe('updateBatchStatus', () => {
    it('does nothing when no current batch', async () => {
      const { updateBatchStatus } = useBatchDeployment()
      await updateBatchStatus()
      expect(batchDeploymentService.getBatchStatus).not.toHaveBeenCalled()
    })

    it('updates batchSummary when called with active batch', async () => {
      const { createBatch, updateBatchStatus, batchSummary } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      ;(batchDeploymentService.getBatchStatus as any).mockResolvedValue({
        ...mockBatchSummary,
        progress: 75,
      })
      await updateBatchStatus()
      expect(batchSummary.value!.progress).toBe(75)
    })

    it('stops polling when batch status is completed', async () => {
      ;(batchDeploymentService.getBatchStatus as any).mockResolvedValue({
        ...mockBatchSummary,
        status: 'completed',
      })
      const { createBatch, updateBatchStatus, isPolling } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      await updateBatchStatus()
      expect(isPolling.value).toBe(false)
    })

    it('stops polling when batch status is failed', async () => {
      ;(batchDeploymentService.getBatchStatus as any).mockResolvedValue({
        ...mockBatchSummary,
        status: 'failed',
      })
      const { createBatch, updateBatchStatus, isDeploying } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      await updateBatchStatus()
      expect(isDeploying.value).toBe(false)
    })
  })

  describe('stopPolling', () => {
    it('sets isPolling to false', () => {
      const { stopPolling, isPolling } = useBatchDeployment()
      stopPolling()
      expect(isPolling.value).toBe(false)
    })
  })

  describe('canStartDeployment computed', () => {
    it('is true when batch is in draft state, valid, and not deploying', async () => {
      const { createBatch, canStartDeployment } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      expect(canStartDeployment.value).toBe(true)
    })

    it('is false when batch is not in draft or partial status', async () => {
      ;(batchDeploymentService.getBatch as any).mockResolvedValue({
        ...mockBatchConfig,
        status: 'completed',
      })
      const { createBatch, canStartDeployment } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      expect(canStartDeployment.value).toBe(false)
    })
  })

  describe('hasErrors computed', () => {
    it('is true when error is set', async () => {
      ;(batchDeploymentService.createBatch as any).mockRejectedValue(new Error('fail'))
      const { createBatch, hasErrors } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      expect(hasErrors.value).toBe(true)
    })
  })

  describe('progressPercentage computed', () => {
    it('returns batchSummary.progress when available', async () => {
      const { createBatch, progressPercentage } = useBatchDeployment()
      await createBatch({ name: 'Test', tokens: [] } as any)
      expect(progressPercentage.value).toBe(50)
    })
  })
})
