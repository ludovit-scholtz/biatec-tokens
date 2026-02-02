/**
 * Minimal telemetry service for tracking user events
 * Used to monitor wallet connections and platform adoption
 */

export interface TelemetryEvent {
  event: string
  properties?: Record<string, any>
  timestamp: string
}

export class TelemetryService {
  private static instance: TelemetryService
  private events: TelemetryEvent[] = []

  private constructor() {}

  static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService()
    }
    return TelemetryService.instance
  }

  /**
   * Track a telemetry event
   */
  track(event: string, properties?: Record<string, any>): void {
    const telemetryEvent: TelemetryEvent = {
      event,
      properties,
      timestamp: new Date().toISOString(),
    }

    this.events.push(telemetryEvent)

    // Log to console for visibility
    console.log('[Telemetry]', event, properties)

    // In a production environment, this would send to an analytics service
    // For now, we just store locally and log
  }

  /**
   * Track wallet connection success
   */
  trackWalletConnect(data: {
    walletId: string
    network: string
    address: string
  }): void {
    this.track('wallet_connected', {
      wallet_id: data.walletId,
      network: data.network,
      address_prefix: data.address.slice(0, 6),
    })
  }

  /**
   * Track network switch
   */
  trackNetworkSwitch(data: { fromNetwork: string; toNetwork: string }): void {
    this.track('network_switched', {
      from_network: data.fromNetwork,
      to_network: data.toNetwork,
    })
  }

  /**
   * Track wallet state transition
   */
  trackWalletStateTransition(data: {
    fromState: string
    toState: string
    walletId?: string
    network?: string
  }): void {
    this.track('wallet_state_transition', {
      from_state: data.fromState,
      to_state: data.toState,
      wallet_id: data.walletId,
      network: data.network,
    })
  }

  /**
   * Track wallet detection attempt
   */
  trackWalletDetection(data: {
    walletId: string
    attempt: number
    success: boolean
    errorType?: string
  }): void {
    this.track('wallet_detection', {
      wallet_id: data.walletId,
      attempt: data.attempt,
      success: data.success,
      error_type: data.errorType,
    })
  }

  /**
   * Track wallet connection failure
   */
  trackWalletConnectionFailure(data: {
    walletId?: string
    errorType: string
    errorMessage: string
    diagnosticCode?: string
  }): void {
    this.track('wallet_connection_failure', {
      wallet_id: data.walletId,
      error_type: data.errorType,
      error_message: data.errorMessage,
      diagnostic_code: data.diagnosticCode,
    })
  }

  /**
   * Track network switch failure
   */
  trackNetworkSwitchFailure(data: {
    fromNetwork: string
    toNetwork: string
    errorType: string
    errorMessage: string
  }): void {
    this.track('network_switch_failure', {
      from_network: data.fromNetwork,
      to_network: data.toNetwork,
      error_type: data.errorType,
      error_message: data.errorMessage,
    })
  }

  /**
   * Track balance fetch
   */
  trackBalanceFetch(data: {
    network: string
    address: string
    success: boolean
    durationMs?: number
  }): void {
    this.track('balance_fetch', {
      network: data.network,
      address_prefix: data.address.slice(0, 6),
      success: data.success,
      duration_ms: data.durationMs,
    })
  }

  /**
   * Get all tracked events (for debugging)
   */
  getEvents(): TelemetryEvent[] {
    return [...this.events]
  }

  /**
   * Clear all tracked events
   */
  clearEvents(): void {
    this.events = []
  }
}

export const telemetryService = TelemetryService.getInstance()
