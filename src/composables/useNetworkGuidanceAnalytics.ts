/**
 * Composable for tracking network and standard selection analytics
 * Provides consistent event tracking for compatibility-related user actions
 */

export interface NetworkSwitchEvent {
  fromNetwork: string | null
  toNetwork: string
  currentStandard: string | null
  compatible: boolean
  timestamp: Date
}

export interface StandardSelectionEvent {
  standard: string
  network: string | null
  previousStandard: string | null
  compatible: boolean
  timestamp: Date
}

export interface IncompatibilityEvent {
  type: 'network-standard' | 'wallet-network' | 'wallet-standard'
  network: string | null
  standard: string | null
  wallet: string | null
  reason: string
  alternativesShown: number
  timestamp: Date
}

export interface AlternativeActionEvent {
  action: 'accepted' | 'rejected' | 'dismissed'
  alternativeType: 'network' | 'standard' | 'wallet'
  fromValue: string
  toValue: string | null
  timestamp: Date
}

export interface MatrixViewEvent {
  source: 'warning-modal' | 'intent-summary' | 'onboarding' | 'help-link'
  timestamp: Date
}

export interface LearnMoreEvent {
  source: 'warning-modal' | 'compatibility-matrix' | 'tooltip'
  topic: string
  timestamp: Date
}

/**
 * Analytics tracking hook for network-aware guidance
 */
export function useNetworkGuidanceAnalytics() {
  /**
   * Track network switch initiation
   */
  const trackNetworkSwitch = (event: NetworkSwitchEvent) => {
    if (typeof window === 'undefined' || !window.gtag) {
      console.log('[Analytics] Network switch:', event)
      return
    }

    window.gtag('event', 'network_switch', {
      event_category: 'token_creation',
      event_label: `${event.fromNetwork || 'none'}_to_${event.toNetwork}`,
      from_network: event.fromNetwork,
      to_network: event.toNetwork,
      current_standard: event.currentStandard,
      compatible: event.compatible,
      timestamp: event.timestamp.toISOString(),
    })
  }

  /**
   * Track standard selection
   */
  const trackStandardSelection = (event: StandardSelectionEvent) => {
    if (typeof window === 'undefined' || !window.gtag) {
      console.log('[Analytics] Standard selection:', event)
      return
    }

    window.gtag('event', 'standard_selection', {
      event_category: 'token_creation',
      event_label: event.standard,
      standard: event.standard,
      network: event.network,
      previous_standard: event.previousStandard,
      compatible: event.compatible,
      timestamp: event.timestamp.toISOString(),
    })
  }

  /**
   * Track incompatibility warning shown
   */
  const trackIncompatibilityWarning = (event: IncompatibilityEvent) => {
    if (typeof window === 'undefined' || !window.gtag) {
      console.log('[Analytics] Incompatibility warning:', event)
      return
    }

    window.gtag('event', 'incompatibility_warning', {
      event_category: 'token_creation',
      event_label: event.type,
      type: event.type,
      network: event.network,
      standard: event.standard,
      wallet: event.wallet,
      reason: event.reason,
      alternatives_shown: event.alternativesShown,
      timestamp: event.timestamp.toISOString(),
    })
  }

  /**
   * Track user action on alternative suggestion
   */
  const trackAlternativeAction = (event: AlternativeActionEvent) => {
    if (typeof window === 'undefined' || !window.gtag) {
      console.log('[Analytics] Alternative action:', event)
      return
    }

    window.gtag('event', 'alternative_action', {
      event_category: 'token_creation',
      event_label: `${event.action}_${event.alternativeType}`,
      action: event.action,
      alternative_type: event.alternativeType,
      from_value: event.fromValue,
      to_value: event.toValue,
      timestamp: event.timestamp.toISOString(),
    })
  }

  /**
   * Track compatibility matrix view
   */
  const trackMatrixView = (event: MatrixViewEvent) => {
    if (typeof window === 'undefined' || !window.gtag) {
      console.log('[Analytics] Matrix view:', event)
      return
    }

    window.gtag('event', 'compatibility_matrix_view', {
      event_category: 'token_creation',
      event_label: event.source,
      source: event.source,
      timestamp: event.timestamp.toISOString(),
    })
  }

  /**
   * Track learn more click
   */
  const trackLearnMore = (event: LearnMoreEvent) => {
    if (typeof window === 'undefined' || !window.gtag) {
      console.log('[Analytics] Learn more:', event)
      return
    }

    window.gtag('event', 'learn_more_click', {
      event_category: 'token_creation',
      event_label: `${event.source}_${event.topic}`,
      source: event.source,
      topic: event.topic,
      timestamp: event.timestamp.toISOString(),
    })
  }

  /**
   * Track completion of network and standard alignment checkpoint
   */
  const trackAlignmentCheckpoint = (data: {
    network: string
    standard: string
    wallet: string | null
    compatible: boolean
    timeSpent: number
  }) => {
    if (typeof window === 'undefined' || !window.gtag) {
      console.log('[Analytics] Alignment checkpoint:', data)
      return
    }

    window.gtag('event', 'alignment_checkpoint_complete', {
      event_category: 'onboarding',
      event_label: `${data.network}_${data.standard}`,
      network: data.network,
      standard: data.standard,
      wallet: data.wallet,
      compatible: data.compatible,
      time_spent_seconds: data.timeSpent,
      timestamp: new Date().toISOString(),
    })
  }

  return {
    trackNetworkSwitch,
    trackStandardSelection,
    trackIncompatibilityWarning,
    trackAlternativeAction,
    trackMatrixView,
    trackLearnMore,
    trackAlignmentCheckpoint,
  }
}

// Global type augmentation for window.gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, any>
    ) => void
  }
}
