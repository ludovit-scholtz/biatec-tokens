import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComplianceService } from '../ComplianceService';
import type {
  TransferValidationRequest,
  TransferValidationResponse,
  AuditLogFilters,
  AuditLogResponse,
  ComplianceStatus,
} from '../../types/compliance';

// Mock the API client
vi.mock('../BiatecTokensApiClient', () => {
  const mockApiClient = {
    get: vi.fn(),
    post: vi.fn(),
  };
  
  return {
    BiatecTokensApiClient: vi.fn(() => mockApiClient),
    getApiClient: vi.fn(() => mockApiClient),
  };
});

describe('ComplianceService', () => {
  let service: ComplianceService;
  let mockApiClient: any;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ComplianceService();
    mockApiClient = (service as any).apiClient;
  });

  describe('validateTransfer', () => {
    it('should validate a transfer successfully', async () => {
      const request: TransferValidationRequest = {
        tokenId: 'token123',
        network: 'VOI',
        sender: 'A23456723456723456723456723456723456723456723456723456723A',
        receiver: 'B23456723456723456723456723456723456723456723456723456723B',
        amount: '100',
      };

      const mockResponse: TransferValidationResponse = {
        allowed: true,
        reasons: ['Both addresses are whitelisted'],
        senderStatus: {
          address: request.sender,
          whitelisted: true,
          status: 'active',
          kycVerified: true,
          jurisdictionAllowed: true,
          sanctioned: false,
        },
        receiverStatus: {
          address: request.receiver,
          whitelisted: true,
          status: 'active',
          kycVerified: true,
          jurisdictionAllowed: true,
          sanctioned: false,
        },
        timestamp: '2024-01-15T10:00:00Z',
        details: {
          senderCompliant: true,
          receiverCompliant: true,
          jurisdictionCheck: true,
          sanctionsCheck: true,
        },
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await service.validateTransfer(request);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/v1/whitelist/validate-transfer',
        request
      );
      expect(result).toEqual(mockResponse);
      expect(result.allowed).toBe(true);
    });

    it('should return denied validation when addresses are not whitelisted', async () => {
      const request: TransferValidationRequest = {
        tokenId: 'token123',
        network: 'VOI',
        sender: 'A23456723456723456723456723456723456723456723456723456723A',
        receiver: 'B23456723456723456723456723456723456723456723456723456723B',
      };

      const mockResponse: TransferValidationResponse = {
        allowed: false,
        reasons: ['Sender is not whitelisted', 'Receiver is not whitelisted'],
        senderStatus: {
          address: request.sender,
          whitelisted: false,
          status: 'not_listed',
        },
        receiverStatus: {
          address: request.receiver,
          whitelisted: false,
          status: 'not_listed',
        },
        timestamp: '2024-01-15T10:00:00Z',
        details: {
          senderCompliant: false,
          receiverCompliant: false,
        },
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await service.validateTransfer(request);

      expect(result.allowed).toBe(false);
      expect(result.reasons).toHaveLength(2);
    });

    it('should validate transfer without amount', async () => {
      const request: TransferValidationRequest = {
        tokenId: 'token123',
        network: 'Aramid',
        sender: 'A23456723456723456723456723456723456723456723456723456723A',
        receiver: 'B23456723456723456723456723456723456723456723456723456723B',
      };

      const mockResponse: TransferValidationResponse = {
        allowed: true,
        reasons: [],
        senderStatus: {
          address: request.sender,
          whitelisted: true,
          status: 'active',
        },
        receiverStatus: {
          address: request.receiver,
          whitelisted: true,
          status: 'active',
        },
        timestamp: '2024-01-15T10:00:00Z',
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await service.validateTransfer(request);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/v1/whitelist/validate-transfer',
        request
      );
      expect(result.allowed).toBe(true);
    });
  });

  describe('getAuditLog', () => {
    it('should fetch audit log without filters', async () => {
      const mockResponse: AuditLogResponse = {
        entries: [],
        total: 0,
        limit: 20,
        offset: 0,
        hasMore: false,
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await service.getAuditLog({});

      expect(mockApiClient.get).toHaveBeenCalledWith('/v1/audit-log');
      expect(result).toEqual(mockResponse);
    });

    it('should fetch audit log with tokenId filter', async () => {
      const filters: AuditLogFilters = {
        tokenId: 'token123',
      };

      const mockResponse: AuditLogResponse = {
        entries: [
          {
            id: 'log1',
            timestamp: '2024-01-15T10:00:00Z',
            action: 'whitelist_add' as any,
            tokenId: 'token123',
            network: 'VOI',
            actor: 'A23456723456723456723456723456723456723456723456723456723A',
            details: {},
            result: 'success',
          },
        ],
        total: 1,
        limit: 20,
        offset: 0,
        hasMore: false,
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await service.getAuditLog(filters);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/v1/audit-log?tokenId=token123'
      );
      expect(result.entries).toHaveLength(1);
    });

    it('should fetch audit log with multiple filters', async () => {
      const filters: AuditLogFilters = {
        tokenId: 'token123',
        network: 'VOI',
        action: 'transfer_validation' as any,
        result: 'success',
        limit: 10,
        offset: 0,
      };

      const mockResponse: AuditLogResponse = {
        entries: [],
        total: 0,
        limit: 10,
        offset: 0,
        hasMore: false,
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await service.getAuditLog(filters);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/v1/audit-log?tokenId=token123&network=VOI&action=transfer_validation&result=success&limit=10&offset=0'
      );
      expect(result.limit).toBe(10);
    });

    it('should fetch audit log with date range filters', async () => {
      const filters: AuditLogFilters = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      const mockResponse: AuditLogResponse = {
        entries: [],
        total: 0,
        limit: 20,
        offset: 0,
        hasMore: false,
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      await service.getAuditLog(filters);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/v1/audit-log?startDate=2024-01-01&endDate=2024-01-31'
      );
    });
  });

  describe('getComplianceStatus', () => {
    it('should fetch compliance status for a token', async () => {
      const mockStatus: ComplianceStatus = {
        tokenId: 'token123',
        network: 'VOI',
        whitelistEnabled: true,
        whitelistCount: 50,
        lastAuditTimestamp: '2024-01-15T10:00:00Z',
        complianceScore: 85,
        issues: [],
      };

      mockApiClient.get.mockResolvedValue(mockStatus);

      const result = await service.getComplianceStatus('token123', 'VOI');

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/v1/compliance/status/token123?network=VOI'
      );
      expect(result).toEqual(mockStatus);
      expect(result.whitelistCount).toBe(50);
    });

    it('should fetch compliance status with issues', async () => {
      const mockStatus: ComplianceStatus = {
        tokenId: 'token123',
        network: 'Aramid',
        whitelistEnabled: true,
        whitelistCount: 10,
        complianceScore: 60,
        issues: [
          {
            severity: 'high',
            category: 'kyc',
            message: 'KYC verification pending for 5 addresses',
            timestamp: '2024-01-15T10:00:00Z',
          },
        ],
      };

      mockApiClient.get.mockResolvedValue(mockStatus);

      const result = await service.getComplianceStatus('token123', 'Aramid');

      expect(result.issues).toHaveLength(1);
      expect(result.issues![0].severity).toBe('high');
    });
  });

  describe('exportAuditLog', () => {
    it('should export audit log as CSV', async () => {
      const filters: AuditLogFilters = {
        tokenId: 'token123',
        network: 'VOI',
      };

      const mockCsv = 'timestamp,action,network,actor,result\n2024-01-15T10:00:00Z,whitelist_add,VOI,A234567...,success';

      mockApiClient.get.mockResolvedValue(mockCsv);

      const result = await service.exportAuditLog(filters);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/v1/audit-log/export?tokenId=token123&network=VOI&format=csv'
      );
      expect(result).toBe(mockCsv);
    });

    it('should export audit log with date filters', async () => {
      const filters: AuditLogFilters = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      const mockCsv = 'timestamp,action,network,actor,result';

      mockApiClient.get.mockResolvedValue(mockCsv);

      await service.exportAuditLog(filters);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/v1/audit-log/export?startDate=2024-01-01&endDate=2024-01-31&format=csv'
      );
    });
  });
});
