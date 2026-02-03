import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TelemetryService, telemetryService } from '../TelemetryService'

describe('TelemetryService', () => {
  let service: TelemetryService

  beforeEach(() => {
    service = TelemetryService.getInstance()
    service.clearEvents()
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('should be a singleton', () => {
    const instance1 = TelemetryService.getInstance()
    const instance2 = TelemetryService.getInstance()
    expect(instance1).toBe(instance2)
  })

  it('should track events', () => {
    service.track('test_event', { foo: 'bar' })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('test_event')
    expect(events[0].properties).toEqual({ foo: 'bar' })
    expect(events[0].timestamp).toBeDefined()
  })

  it('should track wallet connection', () => {
    service.trackWalletConnect({
      walletId: 'pera',
      network: 'voi-mainnet',
      address: 'ALGO123456789ABCDEF',
    })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('wallet_connected')
    expect(events[0].properties?.wallet_id).toBe('pera')
    expect(events[0].properties?.network).toBe('voi-mainnet')
    expect(events[0].properties?.address_prefix).toBe('ALGO12')
  })

  it('should track network switch', () => {
    service.trackNetworkSwitch({
      fromNetwork: 'voi-mainnet',
      toNetwork: 'aramidmain',
    })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('network_switched')
    expect(events[0].properties?.from_network).toBe('voi-mainnet')
    expect(events[0].properties?.to_network).toBe('aramidmain')
  })

  it('should track wallet state transition', () => {
    service.trackWalletStateTransition({
      fromState: 'disconnected',
      toState: 'connecting',
      walletId: 'pera',
      network: 'voi-mainnet',
    })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('wallet_state_transition')
    expect(events[0].properties?.from_state).toBe('disconnected')
    expect(events[0].properties?.to_state).toBe('connecting')
    expect(events[0].properties?.wallet_id).toBe('pera')
    expect(events[0].properties?.network).toBe('voi-mainnet')
  })

  it('should track wallet detection', () => {
    service.trackWalletDetection({
      walletId: 'pera',
      attempt: 1,
      success: true,
    })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('wallet_detection')
    expect(events[0].properties?.wallet_id).toBe('pera')
    expect(events[0].properties?.attempt).toBe(1)
    expect(events[0].properties?.success).toBe(true)
  })

  it('should track wallet detection failure', () => {
    service.trackWalletDetection({
      walletId: 'pera',
      attempt: 3,
      success: false,
      errorType: 'timeout',
    })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('wallet_detection')
    expect(events[0].properties?.wallet_id).toBe('pera')
    expect(events[0].properties?.attempt).toBe(3)
    expect(events[0].properties?.success).toBe(false)
    expect(events[0].properties?.error_type).toBe('timeout')
  })

  it('should track wallet connection failure', () => {
    service.trackWalletConnectionFailure({
      walletId: 'pera',
      errorType: 'user_rejected',
      errorMessage: 'User rejected the request',
      diagnosticCode: 'ERR_USER_REJECTED',
    })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('wallet_connection_failure')
    expect(events[0].properties?.wallet_id).toBe('pera')
    expect(events[0].properties?.error_type).toBe('user_rejected')
    expect(events[0].properties?.error_message).toBe('User rejected the request')
    expect(events[0].properties?.diagnostic_code).toBe('ERR_USER_REJECTED')
  })

  it('should track wallet connection failure without wallet ID', () => {
    service.trackWalletConnectionFailure({
      errorType: 'network_error',
      errorMessage: 'Network timeout',
    })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('wallet_connection_failure')
    expect(events[0].properties?.wallet_id).toBeUndefined()
    expect(events[0].properties?.error_type).toBe('network_error')
    expect(events[0].properties?.error_message).toBe('Network timeout')
  })

  it('should track network switch failure', () => {
    service.trackNetworkSwitchFailure({
      fromNetwork: 'voi-mainnet',
      toNetwork: 'aramidmain',
      errorType: 'wallet_not_connected',
      errorMessage: 'Wallet not connected to target network',
    })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('network_switch_failure')
    expect(events[0].properties?.from_network).toBe('voi-mainnet')
    expect(events[0].properties?.to_network).toBe('aramidmain')
    expect(events[0].properties?.error_type).toBe('wallet_not_connected')
    expect(events[0].properties?.error_message).toBe('Wallet not connected to target network')
  })

  it('should track balance fetch success', () => {
    service.trackBalanceFetch({
      network: 'voi-mainnet',
      address: 'ALGO123456789ABCDEF',
      success: true,
      durationMs: 150,
    })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('balance_fetch')
    expect(events[0].properties?.network).toBe('voi-mainnet')
    expect(events[0].properties?.address_prefix).toBe('ALGO12')
    expect(events[0].properties?.success).toBe(true)
    expect(events[0].properties?.duration_ms).toBe(150)
  })

  it('should track balance fetch failure', () => {
    service.trackBalanceFetch({
      network: 'voi-mainnet',
      address: 'ALGO123456789ABCDEF',
      success: false,
    })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('balance_fetch')
    expect(events[0].properties?.network).toBe('voi-mainnet')
    expect(events[0].properties?.address_prefix).toBe('ALGO12')
    expect(events[0].properties?.success).toBe(false)
    expect(events[0].properties?.duration_ms).toBeUndefined()
  })

  it('should track login started', () => {
    service.trackLoginStarted()

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('login_started')
    expect(events[0].properties?.source).toBe('navbar')
  })

  it('should track login started with custom source', () => {
    service.trackLoginStarted({ source: 'modal' })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('login_started')
    expect(events[0].properties?.source).toBe('modal')
  })

  it('should track login completed', () => {
    service.trackLoginCompleted({
      walletId: 'pera',
      network: 'voi-mainnet',
      durationMs: 2500,
    })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('login_completed')
    expect(events[0].properties?.wallet_id).toBe('pera')
    expect(events[0].properties?.network).toBe('voi-mainnet')
    expect(events[0].properties?.duration_ms).toBe(2500)
  })

  it('should track token wizard started', () => {
    service.trackTokenWizardStarted()

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('token_wizard_started')
    expect(events[0].properties?.source).toBe('direct')
    expect(events[0].properties?.network).toBeUndefined()
  })

  it('should track token wizard started with custom data', () => {
    service.trackTokenWizardStarted({
      source: 'dashboard',
      network: 'voi-mainnet',
    })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('token_wizard_started')
    expect(events[0].properties?.source).toBe('dashboard')
    expect(events[0].properties?.network).toBe('voi-mainnet')
  })

  it('should track token wizard completed', () => {
    service.trackTokenWizardCompleted({
      tokenStandard: 'ASA',
      tokenType: 'fungible',
      network: 'voi-mainnet',
      durationMs: 5000,
    })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('token_wizard_completed')
    expect(events[0].properties?.token_standard).toBe('ASA')
    expect(events[0].properties?.token_type).toBe('fungible')
    expect(events[0].properties?.network).toBe('voi-mainnet')
    expect(events[0].properties?.duration_ms).toBe(5000)
  })

  it('should track plan upgrade started', () => {
    service.trackPlanUpgradeStarted({
      fromPlan: 'free',
      toPlan: 'basic',
    })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('plan_upgrade_started')
    expect(events[0].properties?.from_plan).toBe('free')
    expect(events[0].properties?.to_plan).toBe('basic')
    expect(events[0].properties?.source).toBe('pricing_page')
  })

  it('should track plan upgrade started with custom source', () => {
    service.trackPlanUpgradeStarted({
      fromPlan: 'basic',
      toPlan: 'pro',
      source: 'dashboard',
    })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('plan_upgrade_started')
    expect(events[0].properties?.from_plan).toBe('basic')
    expect(events[0].properties?.to_plan).toBe('pro')
    expect(events[0].properties?.source).toBe('dashboard')
  })

  it('should track plan upgrade completed', () => {
    service.trackPlanUpgradeCompleted({
      fromPlan: 'free',
      toPlan: 'basic',
      durationMs: 30000,
    })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('plan_upgrade_completed')
    expect(events[0].properties?.from_plan).toBe('free')
    expect(events[0].properties?.to_plan).toBe('basic')
    expect(events[0].properties?.duration_ms).toBe(30000)
  })

  it('should track security center viewed', () => {
    service.trackSecurityCenterViewed()

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('security_center_viewed')
    expect(events[0].properties?.source).toBe('account_menu')
  })

  it('should track security center viewed with custom source', () => {
    service.trackSecurityCenterViewed({ source: 'notification' })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('security_center_viewed')
    expect(events[0].properties?.source).toBe('notification')
  })

  it('should track recovery started', () => {
    service.trackRecoveryStarted({
      recoveryType: 'seed_phrase',
    })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('recovery_started')
    expect(events[0].properties?.recovery_type).toBe('seed_phrase')
  })

  it('should track audit export started', () => {
    service.trackAuditExportStarted({
      format: 'csv',
    })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('audit_export_started')
    expect(events[0].properties?.format).toBe('csv')
  })

  it('should track audit export completed', () => {
    service.trackAuditExportCompleted({
      format: 'json',
      durationMs: 1500,
      recordCount: 250,
    })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('audit_export_completed')
    expect(events[0].properties?.format).toBe('json')
    expect(events[0].properties?.duration_ms).toBe(1500)
    expect(events[0].properties?.record_count).toBe(250)
  })

  it('should track activity filter applied', () => {
    service.trackActivityFilterApplied({
      filterType: 'status',
      filterValue: 'completed',
    })

    const events = service.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('activity_filter_applied')
    expect(events[0].properties?.filter_type).toBe('status')
    expect(events[0].properties?.filter_value).toBe('completed')
  })

  it('should log events to console', () => {
    service.track('test_event', { data: 'value' })

    expect(console.log).toHaveBeenCalledWith(
      '[Telemetry]',
      'test_event',
      { data: 'value' }
    )
  })

  it('should clear events', () => {
    service.track('event1')
    service.track('event2')
    expect(service.getEvents()).toHaveLength(2)

    service.clearEvents()
    expect(service.getEvents()).toHaveLength(0)
  })

  it('should include timestamp in all events', () => {
    const beforeTime = new Date().toISOString()
    service.track('timed_event')
    const afterTime = new Date().toISOString()

    const events = service.getEvents()
    expect(events[0].timestamp).toBeDefined()
    expect(events[0].timestamp >= beforeTime).toBe(true)
    expect(events[0].timestamp <= afterTime).toBe(true)
  })

  it('should export singleton instance', () => {
    expect(telemetryService).toBeInstanceOf(TelemetryService)
    expect(telemetryService).toBe(TelemetryService.getInstance())
  })
})
