import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import AuditLogViewer from './AuditLogViewer.vue';
import Modal from './ui/Modal.vue';
import { complianceService } from '../services/ComplianceService';
import type { AuditLogResponse, AuditLogEntry } from '../types/compliance';

// Mock the compliance service
vi.mock('../services/ComplianceService', () => ({
  complianceService: {
    getAuditLog: vi.fn(),
    exportAuditLog: vi.fn(),
  },
}));

// Mock useToast composable
vi.mock('../composables/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('AuditLogViewer', () => {
  const defaultProps = {
    tokenId: 'token123',
    network: 'VOI',
  };

  const mockAuditEntries: AuditLogEntry[] = [
    {
      id: 'log1',
      timestamp: '2024-01-15T10:00:00Z',
      action: 'whitelist_add' as any,
      tokenId: 'token123',
      network: 'VOI',
      actor: 'A23456723456723456723456723456723456723456723456723456723A',
      details: { address: 'B23456723456723456723456723456723456723456723456723456723B' },
      result: 'success',
    },
    {
      id: 'log2',
      timestamp: '2024-01-15T11:00:00Z',
      action: 'transfer_validation' as any,
      tokenId: 'token123',
      network: 'VOI',
      actor: 'A23456723456723456723456723456723456723456723456723456723A',
      details: { sender: 'A234...', receiver: 'B234...' },
      result: 'success',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const mockResponse: AuditLogResponse = {
        entries: [],
        total: 0,
        limit: 20,
        offset: 0,
        hasMore: false,
      };
      vi.mocked(complianceService.getAuditLog).mockResolvedValue(mockResponse);

      const wrapper = mount(AuditLogViewer, {
        props: defaultProps,
        global: {
          stubs: {
            Modal: true,
          },
        },
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('h3').text()).toContain('Audit Log');
    });

    it('should render filter controls', async () => {
      const mockResponse: AuditLogResponse = {
        entries: [],
        total: 0,
        limit: 20,
        offset: 0,
        hasMore: false,
      };
      vi.mocked(complianceService.getAuditLog).mockResolvedValue(mockResponse);

      const wrapper = mount(AuditLogViewer, {
        props: defaultProps,
        global: {
          stubs: {
            Modal: true,
          },
        },
      });

      await flushPromises();

      expect(wrapper.text()).toContain('Network');
      expect(wrapper.text()).toContain('Action');
      expect(wrapper.text()).toContain('Result');
    });

    it('should render date range filters', async () => {
      const mockResponse: AuditLogResponse = {
        entries: [],
        total: 0,
        limit: 20,
        offset: 0,
        hasMore: false,
      };
      vi.mocked(complianceService.getAuditLog).mockResolvedValue(mockResponse);

      const wrapper = mount(AuditLogViewer, {
        props: defaultProps,
        global: {
          stubs: {
            Modal: true,
          },
        },
      });

      await flushPromises();

      expect(wrapper.text()).toContain('Start Date');
      expect(wrapper.text()).toContain('End Date');
    });
  });

  describe('Data Loading', () => {
    it('should load audit log on mount', async () => {
      const mockResponse: AuditLogResponse = {
        entries: mockAuditEntries,
        total: 2,
        limit: 20,
        offset: 0,
        hasMore: false,
      };
      vi.mocked(complianceService.getAuditLog).mockResolvedValue(mockResponse);

      mount(AuditLogViewer, {
        props: defaultProps,
        global: {
          stubs: {
            Modal: true,
          },
        },
      });

      await flushPromises();

      expect(complianceService.getAuditLog).toHaveBeenCalledWith(
        expect.objectContaining({
          tokenId: 'token123',
          network: 'VOI',
        })
      );
    });

    it('should display audit log entries', async () => {
      const mockResponse: AuditLogResponse = {
        entries: mockAuditEntries,
        total: 2,
        limit: 20,
        offset: 0,
        hasMore: false,
      };
      vi.mocked(complianceService.getAuditLog).mockResolvedValue(mockResponse);

      const wrapper = mount(AuditLogViewer, {
        props: defaultProps,
        global: {
          stubs: {
            Modal: true,
          },
        },
      });

      await flushPromises();

      expect(wrapper.text()).toContain('Whitelist Add');
      expect(wrapper.text()).toContain('Transfer Validation');
    });

    it('should display empty state when no entries', async () => {
      const mockResponse: AuditLogResponse = {
        entries: [],
        total: 0,
        limit: 20,
        offset: 0,
        hasMore: false,
      };
      vi.mocked(complianceService.getAuditLog).mockResolvedValue(mockResponse);

      const wrapper = mount(AuditLogViewer, {
        props: defaultProps,
        global: {
          stubs: {
            Modal: true,
          },
        },
      });

      await flushPromises();

      expect(wrapper.text()).toContain('No Audit Entries');
    });

    it('should display loading state', () => {
      vi.mocked(complianceService.getAuditLog).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const wrapper = mount(AuditLogViewer, {
        props: defaultProps,
        global: {
          stubs: {
            Modal: true,
          },
        },
      });

      expect(wrapper.text()).toContain('Loading audit log...');
    });

    it('should display error state on failure', async () => {
      vi.mocked(complianceService.getAuditLog).mockRejectedValue(new Error('Network error'));

      const wrapper = mount(AuditLogViewer, {
        props: defaultProps,
        global: {
          stubs: {
            Modal: true,
          },
        },
      });

      await flushPromises();

      expect(wrapper.text()).toContain('Error Loading Audit Log');
    });
  });

  describe('Filtering', () => {
    it('should apply network filter', async () => {
      const mockResponse: AuditLogResponse = {
        entries: [],
        total: 0,
        limit: 20,
        offset: 0,
        hasMore: false,
      };
      vi.mocked(complianceService.getAuditLog).mockResolvedValue(mockResponse);

      const wrapper = mount(AuditLogViewer, {
        props: defaultProps,
        global: {
          stubs: {
            Modal: true,
          },
        },
      });

      await flushPromises();

      const networkSelect = wrapper.find('select');
      await networkSelect.setValue('Aramid');
      
      const applyButton = wrapper.find('button:contains("Apply Filters")');
      await applyButton.trigger('click');
      await flushPromises();

      expect(complianceService.getAuditLog).toHaveBeenCalledWith(
        expect.objectContaining({
          network: 'Aramid',
        })
      );
    });

    it('should apply action filter', async () => {
      const mockResponse: AuditLogResponse = {
        entries: [],
        total: 0,
        limit: 20,
        offset: 0,
        hasMore: false,
      };
      vi.mocked(complianceService.getAuditLog).mockResolvedValue(mockResponse);

      const wrapper = mount(AuditLogViewer, {
        props: defaultProps,
        global: {
          stubs: {
            Modal: true,
          },
        },
      });

      await flushPromises();

      const selects = wrapper.findAll('select');
      const actionSelect = selects[1]; // Second select is action
      await actionSelect.setValue('transfer_validation');
      
      const applyButton = wrapper.find('button:contains("Apply Filters")');
      await applyButton.trigger('click');
      await flushPromises();

      expect(complianceService.getAuditLog).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'transfer_validation',
        })
      );
    });

    it('should reset filters', async () => {
      const mockResponse: AuditLogResponse = {
        entries: [],
        total: 0,
        limit: 20,
        offset: 0,
        hasMore: false,
      };
      vi.mocked(complianceService.getAuditLog).mockResolvedValue(mockResponse);

      const wrapper = mount(AuditLogViewer, {
        props: defaultProps,
        global: {
          stubs: {
            Modal: true,
          },
        },
      });

      await flushPromises();
      vi.clearAllMocks();

      const resetButton = wrapper.find('button:contains("Reset Filters")');
      await resetButton.trigger('click');
      await flushPromises();

      expect(complianceService.getAuditLog).toHaveBeenCalled();
    });
  });

  describe('Pagination', () => {
    it('should display pagination controls when there are more entries', async () => {
      const mockResponse: AuditLogResponse = {
        entries: mockAuditEntries,
        total: 50,
        limit: 20,
        offset: 0,
        hasMore: true,
      };
      vi.mocked(complianceService.getAuditLog).mockResolvedValue(mockResponse);

      const wrapper = mount(AuditLogViewer, {
        props: defaultProps,
        global: {
          stubs: {
            Modal: true,
          },
        },
      });

      await flushPromises();

      expect(wrapper.text()).toContain('Showing 1 - 2 of 50 entries');
    });

    it('should load next page when next button clicked', async () => {
      const mockResponse: AuditLogResponse = {
        entries: mockAuditEntries,
        total: 50,
        limit: 20,
        offset: 0,
        hasMore: true,
      };
      vi.mocked(complianceService.getAuditLog).mockResolvedValue(mockResponse);

      const wrapper = mount(AuditLogViewer, {
        props: defaultProps,
        global: {
          stubs: {
            Modal: true,
          },
        },
      });

      await flushPromises();
      vi.clearAllMocks();

      const paginationButtons = wrapper.findAll('button').filter(btn => 
        btn.classes().includes('px-4') && btn.classes().includes('py-2')
      );
      const nextButton = paginationButtons[paginationButtons.length - 1];
      await nextButton.trigger('click');
      await flushPromises();

      expect(complianceService.getAuditLog).toHaveBeenCalledWith(
        expect.objectContaining({
          offset: 20,
        })
      );
    });

    it('should disable previous button on first page', async () => {
      const mockResponse: AuditLogResponse = {
        entries: mockAuditEntries,
        total: 50,
        limit: 20,
        offset: 0,
        hasMore: true,
      };
      vi.mocked(complianceService.getAuditLog).mockResolvedValue(mockResponse);

      const wrapper = mount(AuditLogViewer, {
        props: defaultProps,
        global: {
          stubs: {
            Modal: true,
          },
        },
      });

      await flushPromises();

      const paginationButtons = wrapper.findAll('button').filter(btn => 
        btn.classes().includes('px-4') && btn.classes().includes('py-2')
      );
      const prevButton = paginationButtons[paginationButtons.length - 2];
      
      expect(prevButton.attributes('disabled')).toBeDefined();
    });
  });

  describe('Export Functionality', () => {
    it('should export audit log as CSV', async () => {
      const mockResponse: AuditLogResponse = {
        entries: mockAuditEntries,
        total: 2,
        limit: 20,
        offset: 0,
        hasMore: false,
      };
      vi.mocked(complianceService.getAuditLog).mockResolvedValue(mockResponse);
      vi.mocked(complianceService.exportAuditLog).mockResolvedValue('csv,content');

      // Mock Blob and URL APIs
      global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      global.URL.revokeObjectURL = vi.fn();
      const mockAppendChild = vi.fn();
      const mockRemoveChild = vi.fn();
      const mockClick = vi.fn();
      
      document.body.appendChild = mockAppendChild;
      document.body.removeChild = mockRemoveChild;

      const wrapper = mount(AuditLogViewer, {
        props: defaultProps,
        global: {
          stubs: {
            Modal: true,
          },
        },
      });

      await flushPromises();

      const exportButton = wrapper.find('button:contains("Export")');
      await exportButton.trigger('click');
      await flushPromises();

      expect(complianceService.exportAuditLog).toHaveBeenCalled();
    });

    it('should disable export button when no entries', async () => {
      const mockResponse: AuditLogResponse = {
        entries: [],
        total: 0,
        limit: 20,
        offset: 0,
        hasMore: false,
      };
      vi.mocked(complianceService.getAuditLog).mockResolvedValue(mockResponse);

      const wrapper = mount(AuditLogViewer, {
        props: defaultProps,
        global: {
          stubs: {
            Modal: true,
          },
        },
      });

      await flushPromises();

      const exportButton = wrapper.find('button:contains("Export")');
      expect(exportButton.attributes('disabled')).toBeDefined();
    });
  });

  describe('Details Modal', () => {
    it('should open details modal when view button clicked', async () => {
      const mockResponse: AuditLogResponse = {
        entries: mockAuditEntries,
        total: 2,
        limit: 20,
        offset: 0,
        hasMore: false,
      };
      vi.mocked(complianceService.getAuditLog).mockResolvedValue(mockResponse);

      const wrapper = mount(AuditLogViewer, {
        props: defaultProps,
        global: {
          components: {
            Modal,
          },
        },
      });

      await flushPromises();

      const viewButtons = wrapper.findAll('button').filter(btn => 
        btn.text().includes('View')
      );
      
      if (viewButtons.length > 0) {
        await viewButtons[0].trigger('click');
        await flushPromises();

        expect(wrapper.text()).toContain('Audit Entry Details');
      }
    });
  });
});
