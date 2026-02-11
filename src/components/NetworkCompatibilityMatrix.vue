<template>
  <div class="network-compatibility-matrix glass-effect rounded-xl border border-white/10 p-6">
    <div class="mb-6">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
        <i class="pi pi-table text-biatec-accent"></i>
        Network & Standard Compatibility Matrix
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        This matrix shows which token standards are supported on each network and which wallets can be used.
      </p>
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filter by Network Type
        </label>
        <div class="flex gap-2">
          <button
            v-for="type in ['All', 'AVM', 'EVM']"
            :key="type"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              filterNetworkType === type
                ? 'bg-biatec-accent text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            ]"
            @click="filterNetworkType = type"
          >
            {{ type }}
          </button>
        </div>
      </div>
      
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filter by Token Type
        </label>
        <div class="flex gap-2">
          <button
            v-for="type in ['All', 'Fungible', 'NFT']"
            :key="type"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              filterTokenType === type
                ? 'bg-biatec-accent text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            ]"
            @click="filterTokenType = type"
          >
            {{ type }}
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden lg:block overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-gray-700">
            <th class="text-left p-3 text-sm font-semibold text-gray-900 dark:text-white">
              Standard
            </th>
            <th class="text-left p-3 text-sm font-semibold text-gray-900 dark:text-white">
              Type
            </th>
            <th
              v-for="network in filteredNetworks"
              :key="network.id"
              class="text-center p-3 text-sm font-semibold text-gray-900 dark:text-white"
            >
              <div class="flex flex-col items-center gap-1">
                <span>{{ network.displayName }}</span>
                <span :class="[
                  'px-2 py-0.5 rounded text-xs',
                  network.type === 'AVM' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                ]">
                  {{ network.type }}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="standard in filteredStandards"
            :key="standard.id"
            class="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
          >
            <td class="p-3">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ standard.name }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ standard.description }}
                </span>
              </div>
            </td>
            <td class="p-3">
              <span :class="[
                'inline-flex px-2 py-1 rounded text-xs font-medium',
                standard.type === 'Fungible' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
              ]">
                {{ standard.type }}
              </span>
            </td>
            <td
              v-for="network in filteredNetworks"
              :key="network.id"
              class="p-3 text-center"
            >
              <div v-if="isStandardSupportedOnNetwork(standard.id, network.id)" class="flex justify-center">
                <i class="pi pi-check-circle text-green-400 text-xl"></i>
              </div>
              <div v-else class="flex justify-center">
                <i class="pi pi-times-circle text-red-400 text-xl opacity-30"></i>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div class="lg:hidden space-y-4">
      <div
        v-for="standard in filteredStandards"
        :key="standard.id"
        class="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
      >
        <div class="mb-3">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-md font-semibold text-gray-900 dark:text-white">
              {{ standard.name }}
            </h4>
            <span :class="[
              'px-2 py-1 rounded text-xs font-medium',
              standard.type === 'Fungible' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
            ]">
              {{ standard.type }}
            </span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ standard.description }}
          </p>
        </div>

        <div class="space-y-2">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Supported Networks:
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="network in filteredNetworks"
              :key="network.id"
              :class="[
                'px-3 py-1 rounded-lg text-xs font-medium',
                isStandardSupportedOnNetwork(standard.id, network.id)
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-gray-700/50 text-gray-500 border border-gray-700'
              ]"
            >
              {{ network.displayName }}
              <i
                :class="[
                  'pi ml-1',
                  isStandardSupportedOnNetwork(standard.id, network.id) ? 'pi-check' : 'pi-times'
                ]"
              ></i>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="mt-6 pt-6 border-t border-gray-700">
      <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Legend:
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div class="flex items-center gap-2">
          <i class="pi pi-check-circle text-green-400"></i>
          <span class="text-gray-600 dark:text-gray-400">Standard is supported on this network</span>
        </div>
        <div class="flex items-center gap-2">
          <i class="pi pi-times-circle text-red-400 opacity-30"></i>
          <span class="text-gray-600 dark:text-gray-400">Standard is not supported on this network</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400">AVM</span>
          <span class="text-gray-600 dark:text-gray-400">Algorand Virtual Machine networks</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-400">EVM</span>
          <span class="text-gray-600 dark:text-gray-400">Ethereum Virtual Machine networks</span>
        </div>
      </div>
    </div>

    <!-- Help Text -->
    <div class="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
      <div class="flex items-start gap-3">
        <i class="pi pi-info-circle text-blue-400 text-xl mt-0.5"></i>
        <div class="flex-1">
          <h5 class="text-sm font-semibold text-blue-400 mb-1">
            How to use this matrix
          </h5>
          <p class="text-xs text-gray-600 dark:text-gray-400">
            Choose a token standard based on your needs, then select a compatible network.
            AVM standards (like ASA, ARC-3, ARC-200) only work on Algorand-based networks (VOI, Aramid, Algorand).
            EVM standards (like ERC-20, ERC-721) only work on Ethereum-compatible networks (Ethereum, Arbitrum, Base).
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  isStandardSupportedOnNetwork,
  NETWORKS,
  STANDARDS,
  type StandardId,
  type NetworkId,
} from '../../config/networkCompatibility'

const filterNetworkType = ref<'All' | 'AVM' | 'EVM'>('All')
const filterTokenType = ref<'All' | 'Fungible' | 'NFT'>('All')

const filteredNetworks = computed(() => {
  const networks = Object.values(NETWORKS)
  if (filterNetworkType.value === 'All') {
    return networks
  }
  return networks.filter(n => n.type === filterNetworkType.value)
})

const filteredStandards = computed(() => {
  let standards = Object.values(STANDARDS)
  
  // Filter by network type
  if (filterNetworkType.value !== 'All') {
    standards = standards.filter(s => s.networkType === filterNetworkType.value)
  }
  
  // Filter by token type
  if (filterTokenType.value !== 'All') {
    standards = standards.filter(s => s.type === filterTokenType.value)
  }
  
  return standards
})
</script>

<style scoped>
.network-compatibility-matrix {
  max-width: 100%;
}

table {
  min-width: 800px;
}

@media (max-width: 1024px) {
  table {
    min-width: 600px;
  }
}
</style>
