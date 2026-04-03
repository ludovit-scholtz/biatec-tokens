import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import WhitelistJurisdictionView from '../WhitelistJurisdictionView.vue';
import { nextTick } from 'vue';

function mountView(storeOverrides = {}) {
  return mount(WhitelistJurisdictionView, {
    global: {
      stubs: {
        WhitelistTable: true,
        WhitelistDetailPanel: true,
        WhitelistEntryForm: true,
        JurisdictionRulesEditor: true,
        CSVImportDialog: true,
        Modal: {
          template: '<div v-if="show"><slot /></div>',
          props: ['show', 'title', 'size'],
          emits: ['close'],
        },
        Button: {
          template: '<button @click="$emit(\'click\')"><slot /></button>',
          props: ['variant'],
          emits: ['click'],
        },
        Badge: {
          template: '<span><slot /></span>',
          props: ['variant'],
        },
      },
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            whitelist: {
              entries: [],
              isLoading: false,
              summary: null,
              jurisdictionCoverage: null,
              conflicts: [],
              pagination: { page: 1, perPage: 20, total: 0, totalPages: 1 },
              filters: { sortBy: undefined, sortOrder: 'asc' },
              ...storeOverrides,
            },
          },
        }),
      ],
    },
  });
}

describe('WhitelistJurisdictionView', () => {
  describe('rendering', () => {
    it('renders the page heading', () => {
      const wrapper = mountView();
      expect(wrapper.text()).toContain('Whitelist & Jurisdiction Management');
    });

    it('renders summary cards', () => {
      const wrapper = mountView();
      expect(wrapper.text()).toContain('Approved');
      expect(wrapper.text()).toContain('Pending Review');
      expect(wrapper.text()).toContain('Rejected');
      expect(wrapper.text()).toContain('Jurisdictions');
    });

    it('renders tabs for whitelist and jurisdictions', () => {
      const wrapper = mountView();
      expect(wrapper.text()).toContain('Whitelist Entries');
      expect(wrapper.text()).toContain('Jurisdiction Rules');
    });
  });

  describe('summary cards', () => {
    it('shows zero counts when summary is null', () => {
      const wrapper = mountView({ summary: null });
      expect(wrapper.text()).toContain('0');
    });

    it('shows approved count from summary', () => {
      const wrapper = mountView({
        summary: { approvedCount: 42, pendingCount: 5, rejectedCount: 2, jurisdictionsCovered: 10, totalEntries: 49 },
      });
      expect(wrapper.text()).toContain('42');
    });

    it('shows pending count from summary', () => {
      const wrapper = mountView({
        summary: { approvedCount: 10, pendingCount: 7, rejectedCount: 1, jurisdictionsCovered: 3, totalEntries: 18 },
      });
      expect(wrapper.text()).toContain('7');
    });
  });

  describe('conflict alert', () => {
    it('does not show conflict alert when no critical conflicts', () => {
      const wrapper = mountView({ conflicts: [] });
      expect(wrapper.text()).not.toContain('Jurisdiction Conflicts Detected');
    });

    it('shows conflict alert when critical conflicts exist', () => {
      const wrapper = mountView({
        conflicts: [
          { entryId: 'e1', entryName: 'John Doe', severity: 'error', message: 'Blocked jurisdiction', jurisdictionCode: 'OFAC' },
        ],
      });
      expect(wrapper.text()).toContain('Jurisdiction Conflicts Detected');
    });

    it('shows conflict details in the alert', () => {
      const wrapper = mountView({
        conflicts: [
          { entryId: 'e1', entryName: 'John Doe', severity: 'error', message: 'Blocked jurisdiction', jurisdictionCode: 'OFAC' },
        ],
      });
      expect(wrapper.text()).toContain('John Doe');
      expect(wrapper.text()).toContain('Blocked jurisdiction');
    });

    it('does not show warning-level conflicts in alert (only error)', () => {
      const wrapper = mountView({
        conflicts: [
          { entryId: 'e2', entryName: 'Jane Doe', severity: 'warning', message: 'Restricted area', jurisdictionCode: 'CN' },
        ],
      });
      expect(wrapper.text()).not.toContain('Jurisdiction Conflicts Detected');
    });
  });

  describe('tabs', () => {
    it('shows whitelist tab content by default', () => {
      const wrapper = mountView();
      const vm = wrapper.vm as any;
      expect(vm.activeTab).toBe('whitelist');
    });

    it('switches to jurisdictions tab on click', async () => {
      const wrapper = mountView();
      const buttons = wrapper.findAll('button');
      const jurisdictionBtn = buttons.find(b => b.text().includes('Jurisdiction Rules'));
      if (jurisdictionBtn) {
        await jurisdictionBtn.trigger('click');
        await nextTick();
        const vm = wrapper.vm as any;
        expect(vm.activeTab).toBe('jurisdictions');
      }
    });
  });

  describe('entry form dialog', () => {
    it('showEntryForm is false by default', () => {
      const wrapper = mountView();
      const vm = wrapper.vm as any;
      expect(vm.showEntryForm).toBe(false);
    });

    it('opens entry form when Add Entry button clicked', async () => {
      const wrapper = mountView();
      const buttons = wrapper.findAll('button');
      const addBtn = buttons.find(b => b.text().includes('Add Entry'));
      if (addBtn) {
        await addBtn.trigger('click');
        await nextTick();
        const vm = wrapper.vm as any;
        expect(vm.showEntryForm).toBe(true);
      }
    });
  });

  describe('approve/reject workflow', () => {
    it('handleApprove sets pendingApprovalEntry and shows dialog', async () => {
      const wrapper = mountView();
      const vm = wrapper.vm as any;
      const entry = { id: 'e1', name: 'John', email: 'john@example.com' };
      vm.handleApprove(entry);
      await nextTick();
      expect(vm.pendingApprovalEntry).toEqual(entry);
      expect(vm.showApproveDialog).toBe(true);
    });

    it('handleReject sets pendingRejectionEntry and shows dialog', async () => {
      const wrapper = mountView();
      const vm = wrapper.vm as any;
      const entry = { id: 'e1', name: 'Jane', email: 'jane@example.com' };
      vm.handleReject(entry);
      await nextTick();
      expect(vm.pendingRejectionEntry).toEqual(entry);
      expect(vm.showRejectDialog).toBe(true);
    });

    it('handleViewDetails sets selectedEntry', () => {
      const wrapper = mountView();
      const vm = wrapper.vm as any;
      const entry = { id: 'e1', name: 'Test', email: 'test@test.com' };
      vm.handleViewDetails(entry);
      expect(vm.selectedEntry).toEqual(entry);
    });

    it('confirmReject sets error when reason is empty', async () => {
      const wrapper = mountView();
      const vm = wrapper.vm as any;
      vm.pendingRejectionEntry = { id: 'e1', name: 'John', email: 'john@example.com' };
      vm.rejectionReason = '';
      await vm.confirmReject();
      expect(vm.rejectionError).toBeTruthy();
    });
  });

  describe('import dialog', () => {
    it('showImportDialog is false by default', () => {
      const wrapper = mountView();
      const vm = wrapper.vm as any;
      expect(vm.showImportDialog).toBe(false);
    });

    it('handleImported closes import dialog', () => {
      const wrapper = mountView();
      const vm = wrapper.vm as any;
      vm.showImportDialog = true;
      vm.handleImported();
      expect(vm.showImportDialog).toBe(false);
    });
  });

  describe('conflictIds computed', () => {
    it('returns empty array when no conflicts', () => {
      const wrapper = mountView({ conflicts: [] });
      const vm = wrapper.vm as any;
      expect(vm.conflictIds).toEqual([]);
    });

    it('extracts entryIds from conflicts', () => {
      const wrapper = mountView({
        conflicts: [
          { entryId: 'abc', entryName: 'Test', severity: 'error', message: 'msg', jurisdictionCode: 'X' },
        ],
      });
      const vm = wrapper.vm as any;
      expect(vm.conflictIds).toContain('abc');
    });
  });

  describe('entry approved/rejected handlers', () => {
    it('handleEntryApproved clears selectedEntry', () => {
      const wrapper = mountView();
      const vm = wrapper.vm as any;
      vm.selectedEntry = { id: 'e1', name: 'Test' };
      vm.handleEntryApproved();
      expect(vm.selectedEntry).toBeNull();
    });

    it('handleEntryRejected clears selectedEntry', () => {
      const wrapper = mountView();
      const vm = wrapper.vm as any;
      vm.selectedEntry = { id: 'e1', name: 'Test' };
      vm.handleEntryRejected();
      expect(vm.selectedEntry).toBeNull();
    });
  });

  describe('confirmApprove', () => {
    it('does nothing when pendingApprovalEntry is null', async () => {
      const wrapper = mountView();
      const vm = wrapper.vm as any;
      vm.pendingApprovalEntry = null;
      await vm.confirmApprove();
      expect(vm.showApproveDialog).toBe(false);
    });

    it('calls approveWhitelistEntry and closes dialog on success', async () => {
      const wrapper = mountView();
      const vm = wrapper.vm as any;
      const whitelistStore = vm.whitelistStore;
      whitelistStore.approveWhitelistEntry = vi.fn().mockResolvedValue(true);
      vm.pendingApprovalEntry = { id: 'e1', name: 'Alice' };
      vm.approvalNotes = 'Looks good';
      vm.showApproveDialog = true;
      await vm.confirmApprove();
      expect(whitelistStore.approveWhitelistEntry).toHaveBeenCalledWith({ id: 'e1', notes: 'Looks good' });
      expect(vm.showApproveDialog).toBe(false);
      expect(vm.pendingApprovalEntry).toBeNull();
      expect(vm.approvalNotes).toBe('');
    });

    it('passes undefined notes when approvalNotes is empty', async () => {
      const wrapper = mountView();
      const vm = wrapper.vm as any;
      const whitelistStore = vm.whitelistStore;
      whitelistStore.approveWhitelistEntry = vi.fn().mockResolvedValue(true);
      vm.pendingApprovalEntry = { id: 'e2', name: 'Bob' };
      vm.approvalNotes = '';
      await vm.confirmApprove();
      expect(whitelistStore.approveWhitelistEntry).toHaveBeenCalledWith({ id: 'e2', notes: undefined });
    });

    it('does not close dialog when approval fails', async () => {
      const wrapper = mountView();
      const vm = wrapper.vm as any;
      const whitelistStore = vm.whitelistStore;
      whitelistStore.approveWhitelistEntry = vi.fn().mockResolvedValue(false);
      vm.pendingApprovalEntry = { id: 'e3', name: 'Carol' };
      vm.showApproveDialog = true;
      await vm.confirmApprove();
      expect(vm.showApproveDialog).toBe(true);
    });
  });

  describe('confirmReject', () => {
    it('does nothing when pendingRejectionEntry is null', async () => {
      const wrapper = mountView();
      const vm = wrapper.vm as any;
      vm.pendingRejectionEntry = null;
      await vm.confirmReject();
      expect(vm.showRejectDialog).toBe(false);
    });

    it('sets rejectionError when rejection reason is empty', async () => {
      const wrapper = mountView();
      const vm = wrapper.vm as any;
      vm.pendingRejectionEntry = { id: 'e1', name: 'Alice' };
      vm.rejectionReason = '   ';
      await vm.confirmReject();
      expect(vm.rejectionError).toBe('Rejection reason is required');
    });

    it('calls rejectWhitelistEntry and closes dialog on success', async () => {
      const wrapper = mountView();
      const vm = wrapper.vm as any;
      const whitelistStore = vm.whitelistStore;
      whitelistStore.rejectWhitelistEntry = vi.fn().mockResolvedValue(true);
      vm.pendingRejectionEntry = { id: 'e1', name: 'Alice' };
      vm.rejectionReason = 'Does not meet criteria';
      vm.showRejectDialog = true;
      await vm.confirmReject();
      expect(whitelistStore.rejectWhitelistEntry).toHaveBeenCalled();
      expect(vm.showRejectDialog).toBe(false);
      expect(vm.pendingRejectionEntry).toBeNull();
      expect(vm.rejectionReason).toBe('');
      expect(vm.rejectionError).toBe('');
    });

    it('does not close dialog when rejection fails', async () => {
      const wrapper = mountView();
      const vm = wrapper.vm as any;
      const whitelistStore = vm.whitelistStore;
      whitelistStore.rejectWhitelistEntry = vi.fn().mockResolvedValue(false);
      vm.pendingRejectionEntry = { id: 'e2', name: 'Bob' };
      vm.rejectionReason = 'Reason';
      vm.showRejectDialog = true;
      await vm.confirmReject();
      expect(vm.showRejectDialog).toBe(true);
    });
  });

  describe('handleCreateEntry', () => {
    it('closes entry form when createWhitelistEntry succeeds', async () => {
      const wrapper = mountView();
      const vm = wrapper.vm as any;
      const whitelistStore = vm.whitelistStore;
      whitelistStore.createWhitelistEntry = vi.fn().mockResolvedValue({ id: 'new1' });
      vm.showEntryForm = true;
      await vm.handleCreateEntry({ name: 'Test', email: 'test@example.com' });
      expect(vm.showEntryForm).toBe(false);
    });

    it('keeps entry form open when createWhitelistEntry returns falsy', async () => {
      const wrapper = mountView();
      const vm = wrapper.vm as any;
      const whitelistStore = vm.whitelistStore;
      whitelistStore.createWhitelistEntry = vi.fn().mockResolvedValue(null);
      vm.showEntryForm = true;
      await vm.handleCreateEntry({ name: 'Test', email: 'test@example.com' });
      expect(vm.showEntryForm).toBe(true);
    });
  });
});
