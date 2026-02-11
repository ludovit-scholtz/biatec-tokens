<template>
  <div class="current-intent-summary glass-effect rounded-lg border border-biatec-accent/30 p-4 bg-gradient-to-br from-biatec-accent/5 to-transparent">
    <div class="flex items-start justify-between mb-3">
      <h4 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <i class="pi pi-check-circle text-green-400"></i>
        Current Configuration
      </h4>
      <button
        v-if="showMatrixLink"
        @click="handleViewMatrix"
        class="text-xs text-biatec-accent hover:text-biatec-accent-light flex items-center gap-1 transition-colors"
        title="View compatibility matrix"
      >
        <i class="pi pi-table"></i>
        Matrix
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <!-- Network -->
      <div class="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
        <div class="flex items-center gap-2 mb-1">
          <i class="pi pi-globe text-blue-400 text-sm"></i>
          <span class="text-xs text-gray-400">Network</span>
        </div>
        <p v-if="network" class="text-sm font-medium text-gray-900 dark:text-white">
          {{ network }}
        </p>
        <p v-else class="text-sm text-gray-500 italic">
          Not selected
        </p>
        <p v-if="networkType" :class="[
          'text-xs mt-1 px-2 py-0.5 rounded inline-block',
          networkType === 'AVM' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
        ]">
          {{ networkType }}
        </p>
      </div>

      <!-- Standard -->
      <div class="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
        <div class="flex items-center gap-2 mb-1">
          <i class="pi pi-box text-green-400 text-sm"></i>
          <span class="text-xs text-gray-400">Token Standard</span>
        </div>
        <p v-if="standard" class="text-sm font-medium text-gray-900 dark:text-white">
          {{ standard }}
        </p>
        <p v-else class="text-sm text-gray-500 italic">
          Not selected
        </p>
        <p v-if="standardType" :class="[
          'text-xs mt-1 px-2 py-0.5 rounded inline-block',
          standardType === 'Fungible' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
        ]">
          {{ standardType }}
        </p>
      </div>

      <!-- Wallet -->
      <div class="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
        <div class="flex items-center gap-2 mb-1">
          <i class="pi pi-wallet text-yellow-400 text-sm"></i>
          <span class="text-xs text-gray-400">Wallet</span>
        </div>
        <p v-if="wallet" class="text-sm font-medium text-gray-900 dark:text-white">
          {{ wallet }}
        </p>
        <p v-else class="text-sm text-gray-500 italic">
          {{ walletNotRequiredText || 'Not selected' }}
        </p>
      </div>
    </div>

    <!-- Compatibility Status -->
    <div v-if="compatibilityStatus" class="mt-3 pt-3 border-t border-gray-700/50">
      <div :class="[
        'flex items-center gap-2 text-xs',
        compatibilityStatus.compatible ? 'text-green-400' : 'text-yellow-400'
      ]">
        <i :class="[
          'pi',
          compatibilityStatus.compatible ? 'pi-check-circle' : 'pi-exclamation-triangle'
        ]"></i>
        <span>
          {{ compatibilityStatus.message }}
        </span>
      </div>
    </div>

    <!-- Action Hint -->
    <div v-if="showActionHint && !isComplete" class="mt-3 pt-3 border-t border-gray-700/50">
      <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
        <i class="pi pi-info-circle"></i>
        {{ actionHint }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { isConfigurationCompatible, NETWORKS, STANDARDS } from '../../types/networkCompatibility'
import type { NetworkId, StandardId, WalletType } from '../../types/networkCompatibility'

interface Props {
  network?: string | NetworkId | null
  standard?: string | StandardId | null
  wallet?: string | WalletType | null
  networkType?: 'AVM' | 'EVM' | null
  standardType?: 'Fungible' | 'NFT' | null
  walletNotRequiredText?: string
  showMatrixLink?: boolean
  showActionHint?: boolean
  actionHint?: string
}

interface Emits {
  (e: 'viewMatrix'): void
}

const props = withDefaults(defineProps<Props>(), {
  network: null,
  standard: null,
  wallet: null,
  networkType: null,
  standardType: null,
  walletNotRequiredText: 'Email authentication',
  showMatrixLink: true,
  showActionHint: true,
  actionHint: 'Complete your selections to continue',
})

const emit = defineEmits<Emits>()

const isComplete = computed(() => {
  return !!(props.network && props.standard)
})

const compatibilityStatus = computed(() => {
  if (!props.network || !props.standard) {
    return null
  }

  // Try to find network and standard in our constants
  const networkId = Object.keys(NETWORKS).find(
    key => NETWORKS[key as NetworkId].displayName === props.network || key === props.network
  ) as NetworkId | undefined

  const standardId = Object.keys(STANDARDS).find(
    key => STANDARDS[key as StandardId].name === props.standard || key === props.standard
  ) as StandardId | undefined

  if (!networkId || !standardId) {
    return null
  }

  const walletType = props.wallet as WalletType | undefined

  const result = isConfigurationCompatible(networkId, standardId, walletType)

  return {
    compatible: result.compatible,
    message: result.compatible
      ? 'Configuration is compatible and ready to deploy'
      : result.reason || 'Incompatible configuration',
  }
})

const handleViewMatrix = () => {
  emit('viewMatrix')
}
</script>
