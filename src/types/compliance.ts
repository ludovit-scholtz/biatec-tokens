/**
 * Compliance-related type definitions for RWA tokens
 * Supports MICA-aligned compliance workflows
 */

/**
 * Network types supported by the platform
 */
export type Network = 'VOI' | 'Aramid';

/**
 * Transfer validation request
 */
export interface TransferValidationRequest {
  tokenId: string;
  network: Network;
  sender: string;
  receiver: string;
  amount?: string;
}

/**
 * Transfer validation response
 */
export interface TransferValidationResponse {
  allowed: boolean;
  reasons: string[];
  senderStatus: WhitelistStatus;
  receiverStatus: WhitelistStatus;
  timestamp: string;
  details?: {
    senderCompliant: boolean;
    receiverCompliant: boolean;
    jurisdictionCheck?: boolean;
    sanctionsCheck?: boolean;
    additionalInfo?: string;
  };
}

/**
 * Whitelist status for an address
 */
export interface WhitelistStatus {
  address: string;
  whitelisted: boolean;
  status: 'active' | 'pending' | 'removed' | 'not_listed';
  kycVerified?: boolean;
  jurisdictionAllowed?: boolean;
  sanctioned?: boolean;
  notes?: string;
}

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  tokenId: string;
  network: Network;
  actor: string;
  target?: string;
  details: Record<string, any>;
  result: 'success' | 'failure';
  reason?: string;
}

/**
 * Audit actions tracked in the system
 */
export enum AuditAction {
  WHITELIST_ADD = 'whitelist_add',
  WHITELIST_REMOVE = 'whitelist_remove',
  WHITELIST_BULK_UPLOAD = 'whitelist_bulk_upload',
  TRANSFER_VALIDATION = 'transfer_validation',
  TRANSFER_EXECUTED = 'transfer_executed',
  TRANSFER_BLOCKED = 'transfer_blocked',
  COMPLIANCE_REVIEW = 'compliance_review',
  KYC_VERIFICATION = 'kyc_verification',
}

/**
 * Audit log filter options
 */
export interface AuditLogFilters {
  tokenId?: string;
  network?: Network;
  action?: AuditAction;
  actor?: string;
  startDate?: string;
  endDate?: string;
  result?: 'success' | 'failure';
  limit?: number;
  offset?: number;
}

/**
 * Paginated audit log response
 */
export interface AuditLogResponse {
  entries: AuditLogEntry[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

/**
 * Compliance status for a token
 */
export interface ComplianceStatus {
  tokenId: string;
  network: Network;
  whitelistEnabled: boolean;
  whitelistCount: number;
  lastAuditTimestamp?: string;
  complianceScore?: number;
  issues?: ComplianceIssue[];
}

/**
 * Compliance issue detected in the system
 */
export interface ComplianceIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'kyc' | 'jurisdiction' | 'sanctions' | 'other';
  message: string;
  affectedAddresses?: string[];
  timestamp: string;
}
