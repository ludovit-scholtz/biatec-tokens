<template>
  <div class="glass-effect rounded-xl p-6">
    <div class="mb-6">
      <h3 class="text-xl font-semibold text-white mb-2 flex items-center gap-2">
        <i class="pi pi-list text-biatec-accent"></i>
        Audit Log
      </h3>
      <p class="text-sm text-gray-400">
        View compliance activity and transaction history
      </p>
    </div>

    <!-- Filters -->
    <div class="mb-6 p-4 bg-white/5 rounded-lg space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Network Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Network</label>
          <select
            v-model="filters.network"
            class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-biatec-accent"
          >
            <option value="">All Networks</option>
            <option value="VOI">VOI</option>
            <option value="Aramid">Aramid</option>
          </select>
        </div>

        <!-- Action Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Action</label>
          <select
            v-model="filters.action"
            class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-biatec-accent"
          >
            <option value="">All Actions</option>
            <option value="whitelist_add">Whitelist Add</option>
            <option value="whitelist_remove">Whitelist Remove</option>
            <option value="whitelist_bulk_upload">Bulk Upload</option>
            <option value="transfer_validation">Transfer Validation</option>
            <option value="transfer_executed">Transfer Executed</option>
            <option value="transfer_blocked">Transfer Blocked</option>
            <option value="compliance_review">Compliance Review</option>
            <option value="kyc_verification">KYC Verification</option>
          </select>
        </div>

        <!-- Result Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Result</label>
          <select
            v-model="filters.result"
            class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-biatec-accent"
          >
            <option value="">All Results</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
          </select>
        </div>
      </div>

      <!-- Date Range -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
          <input
            v-model="filters.startDate"
            type="date"
            class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-biatec-accent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">End Date</label>
          <input
            v-model="filters.endDate"
            type="date"
            class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-biatec-accent"
          />
        </div>
      </div>

      <!-- Filter Actions -->
      <div class="flex justify-between items-center pt-2">
        <button
          @click="resetFilters"
          class="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          Reset Filters
        </button>
        <div class="flex gap-2">
          <button
            @click="loadAuditLog"
            :disabled="isLoading"
            class="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <i :class="isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"></i>
            Apply Filters
          </button>
          <button
            @click="handleExport"
            :disabled="isExporting || entries.length === 0"
            class="px-4 py-2 bg-biatec-accent/20 text-biatec-accent rounded-lg hover:bg-biatec-accent/30 transition-colors text-sm flex items-center gap-2"
          >
            <i :class="isExporting ? 'pi pi-spin pi-spinner' : 'pi pi-download'"></i>
            Export
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <i class="pi pi-spin pi-spinner text-4xl text-biatec-accent mb-4"></i>
      <p class="text-gray-400">Loading audit log...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
      <div class="flex items-start gap-2">
        <i class="pi pi-exclamation-triangle text-red-400 mt-0.5"></i>
        <div>
          <div class="text-sm font-semibold text-red-400 mb-1">Error Loading Audit Log</div>
          <div class="text-sm text-gray-300">{{ error }}</div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="entries.length === 0" class="text-center py-12">
      <i class="pi pi-inbox text-6xl text-gray-400 mb-4"></i>
      <h4 class="text-xl font-semibold text-white mb-2">No Audit Entries</h4>
      <p class="text-gray-400">No compliance activities found for the selected filters</p>
    </div>

    <!-- Audit Log Table -->
    <div v-else>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white/5 border-b border-white/10">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Timestamp
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Action
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Network
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actor
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Result
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr
              v-for="entry in entries"
              :key="entry.id"
              class="hover:bg-white/5 transition-colors"
            >
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                {{ formatTimestamp(entry.timestamp) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="text-sm text-white font-medium">
                  {{ formatAction(entry.action) }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full">
                  {{ entry.network }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-400">
                <code class="text-xs">{{ formatAddress(entry.actor) }}</code>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    entry.result === 'success'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  ]"
                >
                  {{ entry.result }}
                </span>
              </td>
              <td class="px-4 py-3">
                <button
                  @click="showDetails(entry)"
                  class="text-biatec-accent hover:text-blue-300 text-sm flex items-center gap-1"
                >
                  <i class="pi pi-info-circle"></i>
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="hasMore || offset > 0" class="mt-6 flex justify-between items-center">
        <div class="text-sm text-gray-400">
          Showing {{ offset + 1 }} - {{ Math.min(offset + limit, total) }} of {{ total }} entries
        </div>
        <div class="flex gap-2">
          <button
            @click="previousPage"
            :disabled="offset === 0"
            class="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="pi pi-chevron-left"></i>
          </button>
          <button
            @click="nextPage"
            :disabled="!hasMore"
            class="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="pi pi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <Modal :show="showDetailsModal" @close="showDetailsModal = false">
      <template #header>
        <h3 class="text-lg font-semibold text-white">Audit Entry Details</h3>
      </template>

      <div v-if="selectedEntry" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-gray-400">Timestamp</label>
            <div class="text-sm text-white">{{ formatTimestamp(selectedEntry.timestamp) }}</div>
          </div>
          <div>
            <label class="text-xs text-gray-400">Action</label>
            <div class="text-sm text-white">{{ formatAction(selectedEntry.action) }}</div>
          </div>
          <div>
            <label class="text-xs text-gray-400">Network</label>
            <div class="text-sm text-white">{{ selectedEntry.network }}</div>
          </div>
          <div>
            <label class="text-xs text-gray-400">Result</label>
            <div>
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  selectedEntry.result === 'success'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                ]"
              >
                {{ selectedEntry.result }}
              </span>
            </div>
          </div>
        </div>

        <div>
          <label class="text-xs text-gray-400 mb-1 block">Actor</label>
          <code class="block text-sm text-white bg-white/5 p-2 rounded break-all">
            {{ selectedEntry.actor }}
          </code>
        </div>

        <div v-if="selectedEntry.target">
          <label class="text-xs text-gray-400 mb-1 block">Target</label>
          <code class="block text-sm text-white bg-white/5 p-2 rounded break-all">
            {{ selectedEntry.target }}
          </code>
        </div>

        <div v-if="selectedEntry.reason">
          <label class="text-xs text-gray-400 mb-1 block">Reason</label>
          <div class="text-sm text-white bg-white/5 p-2 rounded">
            {{ selectedEntry.reason }}
          </div>
        </div>

        <div>
          <label class="text-xs text-gray-400 mb-1 block">Details</label>
          <pre class="text-xs text-white bg-white/5 p-3 rounded overflow-x-auto max-h-64 overflow-y-auto">{{ JSON.stringify(selectedEntry.details, null, 2) }}</pre>
        </div>
      </div>

      <template #footer>
        <button
          @click="showDetailsModal = false"
          class="btn-primary px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { complianceService } from '../services/ComplianceService';
import type { AuditLogEntry, AuditLogFilters } from '../types/compliance';
import Modal from './ui/Modal.vue';
import { useToast } from '../composables/useToast';

const props = defineProps<{
  tokenId: string;
  network?: string;
}>();

const toast = useToast();

// State
const entries = ref<AuditLogEntry[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const total = ref(0);
const limit = ref(20);
const offset = ref(0);
const hasMore = ref(false);
const isExporting = ref(false);

const filters = reactive<AuditLogFilters>({
  tokenId: props.tokenId,
  network: (props.network as 'VOI' | 'Aramid' | undefined) || undefined,
  action: undefined,
  result: undefined,
  startDate: '',
  endDate: '',
  limit: limit.value,
  offset: offset.value,
});

const showDetailsModal = ref(false);
const selectedEntry = ref<AuditLogEntry | null>(null);

// Methods
const loadAuditLog = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    filters.limit = limit.value;
    filters.offset = offset.value;

    const response = await complianceService.getAuditLog(filters);
    entries.value = response.entries;
    total.value = response.total;
    hasMore.value = response.hasMore;
  } catch (err: any) {
    error.value = err.message || 'Failed to load audit log';
    toast.error('Failed to load audit log');
  } finally {
    isLoading.value = false;
  }
};

const resetFilters = () => {
  filters.network = (props.network as 'VOI' | 'Aramid' | undefined) || undefined;
  filters.action = undefined;
  filters.result = undefined;
  filters.startDate = '';
  filters.endDate = '';
  offset.value = 0;
  loadAuditLog();
};

const nextPage = () => {
  offset.value += limit.value;
  loadAuditLog();
};

const previousPage = () => {
  offset.value = Math.max(0, offset.value - limit.value);
  loadAuditLog();
};

const showDetails = (entry: AuditLogEntry) => {
  selectedEntry.value = entry;
  showDetailsModal.value = true;
};

const handleExport = async () => {
  isExporting.value = true;

  try {
    const csvContent = await complianceService.exportAuditLog(filters);
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-log-${props.tokenId}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Audit log exported successfully');
  } catch (err: any) {
    toast.error('Failed to export audit log');
  } finally {
    isExporting.value = false;
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatAddress = (address: string) => {
  if (address.length > 16) {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  }
  return address;
};

const formatAction = (action: string) => {
  return action
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Lifecycle
onMounted(() => {
  loadAuditLog();
});
</script>
