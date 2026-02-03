import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Event types for account activity tracking
 */
export enum ActivityEventType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  NETWORK_SWITCH = 'network_switch',
  TOKEN_DEPLOYMENT_SUCCESS = 'token_deployment_success',
  TOKEN_DEPLOYMENT_FAILURE = 'token_deployment_failure',
  PLAN_CHANGE = 'plan_change',
  WALLET_CONNECT = 'wallet_connect',
  WALLET_DISCONNECT = 'wallet_disconnect',
  SECURITY_CENTER_VIEWED = 'security_center_viewed',
  RECOVERY_STARTED = 'recovery_started',
  AUDIT_EXPORT_STARTED = 'audit_export_started',
  AUDIT_EXPORT_COMPLETED = 'audit_export_completed',
}

/**
 * Activity event structure
 */
export interface ActivityEvent {
  id: string
  type: ActivityEventType
  timestamp: string
  description: string
  status: 'success' | 'failure' | 'pending' | 'info'
  metadata?: {
    network?: string
    tokenStandard?: string
    fromPlan?: string
    toPlan?: string
    correlationId?: string
    errorMessage?: string
    [key: string]: any
  }
}

/**
 * Transaction record structure
 */
export interface TransactionRecord {
  id: string
  txId: string
  timestamp: string
  network: string
  type: string
  tokenStandard?: string
  status: 'confirmed' | 'pending' | 'failed'
  amount?: string
  from?: string
  to?: string
}

/**
 * Recovery options available
 */
export interface RecoveryOption {
  id: string
  title: string
  description: string
  available: boolean
  actionLabel: string
}

/**
 * Audit export format
 */
export type ExportFormat = 'csv' | 'json'

/**
 * Security store for managing account security, activity, and audit data
 */
export const useSecurityStore = defineStore('security', () => {
  // State
  const activityEvents = ref<ActivityEvent[]>([])
  const transactionHistory = ref<TransactionRecord[]>([])
  const isLoadingActivity = ref(false)
  const isLoadingTransactions = ref(false)
  const isExporting = ref(false)
  const lastActivityFetch = ref<Date | null>(null)
  const lastTransactionFetch = ref<Date | null>(null)
  const activityError = ref<string | null>(null)
  const transactionError = ref<string | null>(null)

  // Computed
  const recentActivity = computed(() => {
    return activityEvents.value.slice(0, 10)
  })

  const activityByType = computed(() => {
    const byType: Record<string, ActivityEvent[]> = {}
    activityEvents.value.forEach(event => {
      if (!byType[event.type]) {
        byType[event.type] = []
      }
      byType[event.type].push(event)
    })
    return byType
  })

  const failedTransactions = computed(() => {
    return transactionHistory.value.filter(tx => tx.status === 'failed')
  })

  const pendingTransactions = computed(() => {
    return transactionHistory.value.filter(tx => tx.status === 'pending')
  })

  // Actions
  
  /**
   * Generate a unique event ID
   */
  function generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Add an activity event
   */
  function addActivityEvent(event: Omit<ActivityEvent, 'id'>): void {
    const newEvent: ActivityEvent = {
      ...event,
      id: generateEventId(),
    }
    activityEvents.value.unshift(newEvent)
    
    // Keep only last 1000 events in memory
    if (activityEvents.value.length > 1000) {
      activityEvents.value = activityEvents.value.slice(0, 1000)
    }
  }

  /**
   * Fetch activity events from backend
   * Gracefully handles missing API with fallback to local events
   */
  async function fetchActivityEvents(forceRefresh = false): Promise<void> {
    // Skip if recently fetched and not forcing refresh
    if (!forceRefresh && lastActivityFetch.value) {
      const timeSinceLastFetch = Date.now() - lastActivityFetch.value.getTime()
      if (timeSinceLastFetch < 30000) { // 30 seconds
        return
      }
    }

    isLoadingActivity.value = true
    activityError.value = null

    try {
      // TODO: Replace with actual API call when backend is ready
      // For now, we'll use local events only
      // const response = await fetch('/api/activity')
      // if (response.ok) {
      //   const data = await response.json()
      //   activityEvents.value = data.events
      // }
      
      // Simulate API unavailable - use local events
      console.info('[Security] Activity API not yet implemented, using local events')
      lastActivityFetch.value = new Date()
    } catch (error) {
      console.error('[Security] Failed to fetch activity events:', error)
      activityError.value = 'Unable to load activity history. Showing local events only.'
    } finally {
      isLoadingActivity.value = false
    }
  }

  /**
   * Fetch transaction history from backend
   */
  async function fetchTransactionHistory(
    filters?: {
      network?: string
      startDate?: string
      endDate?: string
      tokenStandard?: string
    }
  ): Promise<void> {
    isLoadingTransactions.value = true
    transactionError.value = null

    try {
      // TODO: Replace with actual API call when backend is ready
      // const params = new URLSearchParams()
      // if (filters?.network) params.append('network', filters.network)
      // if (filters?.startDate) params.append('startDate', filters.startDate)
      // if (filters?.endDate) params.append('endDate', filters.endDate)
      // if (filters?.tokenStandard) params.append('tokenStandard', filters.tokenStandard)
      // 
      // const response = await fetch(`/api/transactions?${params}`)
      // if (response.ok) {
      //   const data = await response.json()
      //   transactionHistory.value = data.transactions
      // } else if (response.status === 404) {
      //   transactionError.value = 'Transaction history API coming soon'
      // }

      // Simulate API unavailable
      console.info('[Security] Transaction history API not yet implemented')
      transactionError.value = 'Transaction history will be available soon'
      transactionHistory.value = []
      lastTransactionFetch.value = new Date()
    } catch (error) {
      console.error('[Security] Failed to fetch transaction history:', error)
      transactionError.value = 'Unable to load transaction history'
    } finally {
      isLoadingTransactions.value = false
    }
  }

  /**
   * Export audit trail in specified format
   */
  async function exportAuditTrail(format: ExportFormat): Promise<void> {
    isExporting.value = true

    try {
      // Generate export data
      const exportData = {
        exportedAt: new Date().toISOString(),
        activityEvents: activityEvents.value,
        transactionHistory: transactionHistory.value,
      }

      let blob: Blob
      let filename: string

      if (format === 'json') {
        blob = new Blob([JSON.stringify(exportData, null, 2)], { 
          type: 'application/json' 
        })
        filename = `audit-trail-${Date.now()}.json`
      } else {
        // CSV format
        const csvContent = generateCSV(activityEvents.value)
        blob = new Blob([csvContent], { type: 'text/csv' })
        filename = `audit-trail-${Date.now()}.csv`
      }

      // Download file
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Track export completion
      addActivityEvent({
        type: ActivityEventType.AUDIT_EXPORT_COMPLETED,
        timestamp: new Date().toISOString(),
        description: `Exported audit trail as ${format.toUpperCase()}`,
        status: 'success',
        metadata: { format },
      })
    } catch (error) {
      console.error('[Security] Failed to export audit trail:', error)
      throw error
    } finally {
      isExporting.value = false
    }
  }

  /**
   * Generate CSV content from activity events
   */
  function generateCSV(events: ActivityEvent[]): string {
    const headers = ['Timestamp', 'Event Type', 'Description', 'Status', 'Network', 'Correlation ID']
    const rows = events.map(event => [
      event.timestamp,
      event.type,
      event.description,
      event.status,
      event.metadata?.network || '',
      event.metadata?.correlationId || '',
    ])

    const csvLines = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ]

    return csvLines.join('\n')
  }

  /**
   * Get recovery options available to the user
   */
  function getRecoveryOptions(): RecoveryOption[] {
    return [
      {
        id: 'email-recovery',
        title: 'Email Recovery',
        description: 'Recover your account using your registered email address and password. A recovery link will be sent to your email.',
        available: true,
        actionLabel: 'Start Email Recovery',
      },
      {
        id: 'seed-phrase',
        title: 'Seed Phrase Backup',
        description: 'Export your wallet seed phrase for secure offline storage. Keep this in a safe place - it is the master key to your account.',
        available: true,
        actionLabel: 'View Seed Phrase',
      },
      {
        id: 'multi-device',
        title: 'Multi-Device Sync',
        description: 'Connect additional devices to your account for seamless access across all your devices.',
        available: false,
        actionLabel: 'Coming Soon',
      },
    ]
  }

  /**
   * Clear all local data
   */
  function clearAllData(): void {
    activityEvents.value = []
    transactionHistory.value = []
    lastActivityFetch.value = null
    lastTransactionFetch.value = null
    activityError.value = null
    transactionError.value = null
  }

  return {
    // State
    activityEvents,
    transactionHistory,
    isLoadingActivity,
    isLoadingTransactions,
    isExporting,
    lastActivityFetch,
    lastTransactionFetch,
    activityError,
    transactionError,
    
    // Computed
    recentActivity,
    activityByType,
    failedTransactions,
    pendingTransactions,
    
    // Actions
    addActivityEvent,
    fetchActivityEvents,
    fetchTransactionHistory,
    exportAuditTrail,
    getRecoveryOptions,
    clearAllData,
  }
})
