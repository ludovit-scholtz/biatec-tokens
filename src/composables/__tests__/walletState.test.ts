import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  WalletConnectionState,
  WalletErrorType,
  calculateBackoffDelay,
  DEFAULT_RETRY_CONFIG,
  sleep,
  retryWithBackoff,
  parseWalletError,
  getTroubleshootingSteps,
  formatWalletError,
} from '../walletState'

describe('walletState utilities', () => {
  describe('WalletConnectionState enum', () => {
    it('should have all required states', () => {
      expect(WalletConnectionState.DISCONNECTED).toBe('disconnected')
      expect(WalletConnectionState.DETECTING).toBe('detecting')
      expect(WalletConnectionState.CONNECTING).toBe('connecting')
      expect(WalletConnectionState.CONNECTED).toBe('connected')
      expect(WalletConnectionState.SWITCHING_NETWORK).toBe('switching_network')
      expect(WalletConnectionState.FETCHING_BALANCE).toBe('fetching_balance')
      expect(WalletConnectionState.FAILED).toBe('failed')
      expect(WalletConnectionState.RECONNECTING).toBe('reconnecting')
    })
  })

  describe('WalletErrorType enum', () => {
    it('should have all required error types', () => {
      expect(WalletErrorType.PROVIDER_NOT_FOUND).toBe('provider_not_found')
      expect(WalletErrorType.CONNECTION_REJECTED).toBe('connection_rejected')
      expect(WalletErrorType.CONNECTION_TIMEOUT).toBe('connection_timeout')
      expect(WalletErrorType.NETWORK_SWITCH_FAILED).toBe('network_switch_failed')
      expect(WalletErrorType.NETWORK_MISMATCH).toBe('network_mismatch')
      expect(WalletErrorType.WALLET_LOCKED).toBe('wallet_locked')
      expect(WalletErrorType.PERMISSION_DENIED).toBe('permission_denied')
      expect(WalletErrorType.UNKNOWN).toBe('unknown')
    })
  })

  describe('calculateBackoffDelay', () => {
    it('should calculate exponential backoff correctly', () => {
      const config = DEFAULT_RETRY_CONFIG
      
      // First retry: 200ms
      expect(calculateBackoffDelay(1, config)).toBe(200)
      
      // Second retry: 400ms
      expect(calculateBackoffDelay(2, config)).toBe(400)
      
      // Third retry: 800ms
      expect(calculateBackoffDelay(3, config)).toBe(800)
      
      // Fourth retry: 1600ms
      expect(calculateBackoffDelay(4, config)).toBe(1600)
      
      // Fifth retry: 3200ms
      expect(calculateBackoffDelay(5, config)).toBe(3200)
    })

    it('should respect maxDelayMs', () => {
      const config = DEFAULT_RETRY_CONFIG
      
      // Sixth retry would be 6400ms, but max is 5000ms
      expect(calculateBackoffDelay(6, config)).toBe(5000)
      
      // Tenth retry would be much higher, but max is 5000ms
      expect(calculateBackoffDelay(10, config)).toBe(5000)
    })

    it('should use custom config', () => {
      const customConfig = {
        maxRetries: 3,
        initialDelayMs: 100,
        maxDelayMs: 2000,
        backoffMultiplier: 3,
      }
      
      // First retry: 100ms
      expect(calculateBackoffDelay(1, customConfig)).toBe(100)
      
      // Second retry: 300ms
      expect(calculateBackoffDelay(2, customConfig)).toBe(300)
      
      // Third retry: 900ms
      expect(calculateBackoffDelay(3, customConfig)).toBe(900)
      
      // Fourth retry would be 2700ms, but max is 2000ms
      expect(calculateBackoffDelay(4, customConfig)).toBe(2000)
    })
  })

  describe('sleep', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should delay for specified milliseconds', async () => {
      const promise = sleep(1000)
      vi.advanceTimersByTime(1000)
      await promise
      expect(true).toBe(true) // If we reach here, sleep worked
    })
  })

  describe('retryWithBackoff', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should succeed on first attempt', async () => {
      const operation = vi.fn().mockResolvedValue('success')
      
      const resultPromise = retryWithBackoff(operation, DEFAULT_RETRY_CONFIG)
      const result = await resultPromise
      
      expect(result).toBe('success')
      expect(operation).toHaveBeenCalledTimes(1)
    })

    it('should retry on failure and eventually succeed', async () => {
      const operation = vi.fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockRejectedValueOnce(new Error('Second failure'))
        .mockResolvedValue('success')
      
      const onRetry = vi.fn()
      
      const resultPromise = retryWithBackoff(operation, DEFAULT_RETRY_CONFIG, onRetry)
      
      // First attempt fails
      await vi.runAllTimersAsync()
      
      const result = await resultPromise
      
      expect(result).toBe('success')
      expect(operation).toHaveBeenCalledTimes(3)
      expect(onRetry).toHaveBeenCalledTimes(2)
    })

    it('should throw error after max retries', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('Always fails'))
      
      const config = {
        ...DEFAULT_RETRY_CONFIG,
        maxRetries: 3,
      }
      
      const resultPromise = retryWithBackoff(operation, config)
      
      await vi.runAllTimersAsync()
      
      await expect(resultPromise).rejects.toThrow('Always fails')
      expect(operation).toHaveBeenCalledTimes(3)
    })
  })

  describe('parseWalletError', () => {
    it('should parse provider not found error', () => {
      const error = new Error('Wallet provider not found')
      const walletError = parseWalletError(error, 'Test context')
      
      expect(walletError.type).toBe(WalletErrorType.PROVIDER_NOT_FOUND)
      expect(walletError.message).toContain('Test context')
      expect(walletError.message).toContain('not found')
      expect(walletError.originalError).toBe(error)
      expect(walletError.timestamp).toBeInstanceOf(Date)
      expect(walletError.diagnosticCode).toMatch(/provider_not_found_\d+/)
    })

    it('should parse connection rejected error', () => {
      const error = new Error('User rejected the connection')
      const walletError = parseWalletError(error)
      
      expect(walletError.type).toBe(WalletErrorType.CONNECTION_REJECTED)
      expect(walletError.message).toContain('rejected')
    })

    it('should parse connection timeout error', () => {
      const error = new Error('Connection timed out')
      const walletError = parseWalletError(error)
      
      expect(walletError.type).toBe(WalletErrorType.CONNECTION_TIMEOUT)
    })

    it('should parse network switch failed error', () => {
      const error = new Error('Failed to switch network')
      const walletError = parseWalletError(error)
      
      expect(walletError.type).toBe(WalletErrorType.NETWORK_SWITCH_FAILED)
    })

    it('should parse network mismatch error', () => {
      const error = new Error('Network mismatch detected')
      const walletError = parseWalletError(error)
      
      expect(walletError.type).toBe(WalletErrorType.NETWORK_MISMATCH)
    })

    it('should parse wallet locked error', () => {
      const error = new Error('Wallet is locked')
      const walletError = parseWalletError(error)
      
      expect(walletError.type).toBe(WalletErrorType.WALLET_LOCKED)
    })

    it('should parse permission denied error', () => {
      const error = new Error('Permission denied by user')
      const walletError = parseWalletError(error)
      
      expect(walletError.type).toBe(WalletErrorType.PERMISSION_DENIED)
    })

    it('should default to unknown error type', () => {
      const error = new Error('Some unknown error')
      const walletError = parseWalletError(error)
      
      expect(walletError.type).toBe(WalletErrorType.UNKNOWN)
    })

    it('should handle non-Error objects', () => {
      const walletError = parseWalletError('String error')
      
      expect(walletError.type).toBe(WalletErrorType.UNKNOWN)
      expect(walletError.message).toBe('String error')
    })
  })

  describe('getTroubleshootingSteps', () => {
    it('should return steps for provider not found', () => {
      const steps = getTroubleshootingSteps(WalletErrorType.PROVIDER_NOT_FOUND)
      
      expect(steps).toBeInstanceOf(Array)
      expect(steps.length).toBeGreaterThan(0)
      expect(steps[0]).toContain('wallet')
    })

    it('should return steps for connection rejected', () => {
      const steps = getTroubleshootingSteps(WalletErrorType.CONNECTION_REJECTED)
      
      expect(steps).toBeInstanceOf(Array)
      expect(steps.length).toBeGreaterThan(0)
    })

    it('should return steps for connection timeout', () => {
      const steps = getTroubleshootingSteps(WalletErrorType.CONNECTION_TIMEOUT)
      
      expect(steps).toBeInstanceOf(Array)
      expect(steps.length).toBeGreaterThan(0)
    })

    it('should return steps for all error types', () => {
      const errorTypes = [
        WalletErrorType.PROVIDER_NOT_FOUND,
        WalletErrorType.CONNECTION_REJECTED,
        WalletErrorType.CONNECTION_TIMEOUT,
        WalletErrorType.NETWORK_SWITCH_FAILED,
        WalletErrorType.NETWORK_MISMATCH,
        WalletErrorType.WALLET_LOCKED,
        WalletErrorType.PERMISSION_DENIED,
        WalletErrorType.UNKNOWN,
      ]
      
      errorTypes.forEach(errorType => {
        const steps = getTroubleshootingSteps(errorType)
        expect(steps).toBeInstanceOf(Array)
        expect(steps.length).toBeGreaterThan(0)
      })
    })
  })

  describe('formatWalletError', () => {
    it('should format error with message', () => {
      const walletError = {
        type: WalletErrorType.PROVIDER_NOT_FOUND,
        message: 'Wallet not detected',
        timestamp: new Date(),
        diagnosticCode: 'test_123',
      }
      
      const formatted = formatWalletError(walletError)
      
      expect(formatted).toBe('Wallet not detected')
    })
  })

  describe('DEFAULT_RETRY_CONFIG', () => {
    it('should have sensible defaults', () => {
      expect(DEFAULT_RETRY_CONFIG.maxRetries).toBe(5)
      expect(DEFAULT_RETRY_CONFIG.initialDelayMs).toBe(200)
      expect(DEFAULT_RETRY_CONFIG.maxDelayMs).toBe(5000)
      expect(DEFAULT_RETRY_CONFIG.backoffMultiplier).toBe(2)
    })
  })
})
