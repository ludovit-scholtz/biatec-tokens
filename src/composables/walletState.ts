/**
 * Wallet connection state machine and utilities
 * Implements explicit states for reliable wallet lifecycle management
 */

/**
 * Explicit wallet connection states
 * States are mutually exclusive and deterministic
 */
export enum WalletConnectionState {
  DISCONNECTED = 'disconnected',
  DETECTING = 'detecting',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  SWITCHING_NETWORK = 'switching_network',
  FETCHING_BALANCE = 'fetching_balance',
  FAILED = 'failed',
  RECONNECTING = 'reconnecting',
}

/**
 * Error types for wallet operations
 */
export enum WalletErrorType {
  PROVIDER_NOT_FOUND = 'provider_not_found',
  CONNECTION_REJECTED = 'connection_rejected',
  CONNECTION_TIMEOUT = 'connection_timeout',
  NETWORK_SWITCH_FAILED = 'network_switch_failed',
  NETWORK_MISMATCH = 'network_mismatch',
  WALLET_LOCKED = 'wallet_locked',
  PERMISSION_DENIED = 'permission_denied',
  UNKNOWN = 'unknown',
}

/**
 * Wallet error with diagnostic information
 */
export interface WalletError {
  type: WalletErrorType
  message: string
  originalError?: Error
  timestamp: Date
  diagnosticCode?: string
}

/**
 * Provider detection result
 */
export interface ProviderDetectionResult {
  detected: boolean
  providerId?: string
  retries: number
  timestamp: Date
}

/**
 * Retry configuration for provider detection
 */
export interface RetryConfig {
  maxRetries: number
  initialDelayMs: number
  maxDelayMs: number
  backoffMultiplier: number
}

/**
 * Default retry configuration with exponential backoff
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 5,
  initialDelayMs: 200,
  maxDelayMs: 5000,
  backoffMultiplier: 2,
}

/**
 * Exponential backoff utility for retries
 */
export function calculateBackoffDelay(
  attempt: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): number {
  const delay = config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt - 1)
  return Math.min(delay, config.maxDelayMs)
}

/**
 * Sleep utility for async delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  onRetry?: (attempt: number, error: Error) => void
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (attempt < config.maxRetries) {
        const delay = calculateBackoffDelay(attempt, config)
        onRetry?.(attempt, lastError)
        await sleep(delay)
      }
    }
  }

  throw lastError || new Error('Retry failed')
}

/**
 * Create a user-friendly error message from wallet error
 */
export function formatWalletError(error: WalletError): string {
  const baseMessage = error.message

  const troubleshooting: Record<WalletErrorType, string[]> = {
    [WalletErrorType.PROVIDER_NOT_FOUND]: [
      'Ensure your wallet extension is installed and enabled',
      'Try refreshing the page',
      'Check if your wallet supports this network',
    ],
    [WalletErrorType.CONNECTION_REJECTED]: [
      'Open your wallet and approve the connection request',
      'Make sure your wallet is unlocked',
      'Try connecting again',
    ],
    [WalletErrorType.CONNECTION_TIMEOUT]: [
      'Check your internet connection',
      'Make sure your wallet app is responding',
      'Try again in a few moments',
    ],
    [WalletErrorType.NETWORK_SWITCH_FAILED]: [
      'Verify the network is supported by your wallet',
      'Try manually switching networks in your wallet',
      'Refresh and reconnect',
    ],
    [WalletErrorType.NETWORK_MISMATCH]: [
      'Switch to the correct network in your wallet',
      'The UI network must match your wallet network',
      'Try disconnecting and reconnecting',
    ],
    [WalletErrorType.WALLET_LOCKED]: [
      'Unlock your wallet',
      'Enter your password in the wallet app',
      'Try again after unlocking',
    ],
    [WalletErrorType.PERMISSION_DENIED]: [
      'Grant the necessary permissions in your wallet',
      'Check wallet settings for blocked sites',
      'Try resetting permissions and reconnecting',
    ],
    [WalletErrorType.UNKNOWN]: [
      'Try refreshing the page',
      'Check your wallet app for errors',
      'Contact support if the issue persists',
    ],
  }

  return baseMessage
}

/**
 * Get troubleshooting steps for wallet error
 */
export function getTroubleshootingSteps(errorType: WalletErrorType): string[] {
  const troubleshooting: Record<WalletErrorType, string[]> = {
    [WalletErrorType.PROVIDER_NOT_FOUND]: [
      'Ensure your wallet extension is installed and enabled',
      'Try refreshing the page',
      'Check if your wallet supports this network',
    ],
    [WalletErrorType.CONNECTION_REJECTED]: [
      'Open your wallet and approve the connection request',
      'Make sure your wallet is unlocked',
      'Try connecting again',
    ],
    [WalletErrorType.CONNECTION_TIMEOUT]: [
      'Check your internet connection',
      'Make sure your wallet app is responding',
      'Try again in a few moments',
    ],
    [WalletErrorType.NETWORK_SWITCH_FAILED]: [
      'Verify the network is supported by your wallet',
      'Try manually switching networks in your wallet',
      'Refresh and reconnect',
    ],
    [WalletErrorType.NETWORK_MISMATCH]: [
      'Switch to the correct network in your wallet',
      'The UI network must match your wallet network',
      'Try disconnecting and reconnecting',
    ],
    [WalletErrorType.WALLET_LOCKED]: [
      'Unlock your wallet',
      'Enter your password in the wallet app',
      'Try again after unlocking',
    ],
    [WalletErrorType.PERMISSION_DENIED]: [
      'Grant the necessary permissions in your wallet',
      'Check wallet settings for blocked sites',
      'Try resetting permissions and reconnecting',
    ],
    [WalletErrorType.UNKNOWN]: [
      'Try refreshing the page',
      'Check your wallet app for errors',
      'Contact support if the issue persists',
    ],
  }

  return troubleshooting[errorType] || troubleshooting[WalletErrorType.UNKNOWN]
}

/**
 * Parse error into WalletError
 */
export function parseWalletError(error: unknown, context?: string): WalletError {
  const originalError = error instanceof Error ? error : new Error(String(error))
  const message = originalError.message.toLowerCase()

  // Determine error type based on message content
  let type = WalletErrorType.UNKNOWN
  
  if (message.includes('not found') || message.includes('not available') || message.includes('not detected')) {
    type = WalletErrorType.PROVIDER_NOT_FOUND
  } else if (message.includes('rejected') || message.includes('denied') || message.includes('cancelled')) {
    type = WalletErrorType.CONNECTION_REJECTED
  } else if (message.includes('timeout') || message.includes('timed out')) {
    type = WalletErrorType.CONNECTION_TIMEOUT
  } else if (message.includes('network') && message.includes('switch')) {
    type = WalletErrorType.NETWORK_SWITCH_FAILED
  } else if (message.includes('network') && message.includes('mismatch')) {
    type = WalletErrorType.NETWORK_MISMATCH
  } else if (message.includes('locked')) {
    type = WalletErrorType.WALLET_LOCKED
  } else if (message.includes('permission')) {
    type = WalletErrorType.PERMISSION_DENIED
  }

  return {
    type,
    message: context ? `${context}: ${originalError.message}` : originalError.message,
    originalError,
    timestamp: new Date(),
    diagnosticCode: `${type}_${Date.now()}`,
  }
}
