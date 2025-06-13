<template>
  <div class="token-card glass-effect rounded-xl p-6 hover:shadow-xl transition-all duration-300">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-biatec-accent to-biatec-teal flex items-center justify-center">
          <img v-if="token.imageUrl" :src="token.imageUrl" :alt="token.name" class="w-full h-full object-cover" />
          <i v-else class="pi pi-image text-white text-xl"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-white">{{ token.name }}</h3>
          <p class="text-sm text-gray-300">{{ token.symbol }}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <span class="px-2 py-1 text-xs font-medium rounded-full" :class="standardBadgeClass">
          {{ token.standard }}
        </span>
        <span class="px-2 py-1 text-xs font-medium rounded-full" :class="statusBadgeClass">
          {{ token.status }}
        </span>
      </div>
    </div>

    <p class="text-gray-300 text-sm mb-4 line-clamp-2">{{ token.description }}</p>

    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="text-center">
        <p class="text-xs text-gray-400">Type</p>
        <p class="text-sm font-semibold text-white">{{ token.type }}</p>
      </div>
      <div class="text-center">
        <p class="text-xs text-gray-400">Supply</p>
        <p class="text-sm font-semibold text-white">{{ formatSupply(token.supply) }}</p>
      </div>
    </div>

    <div v-if="token.status === 'deployed'" class="space-y-2 mb-4">
      <div v-if="token.assetId" class="flex justify-between items-center text-xs">
        <span class="text-gray-400">Asset ID:</span>
        <span class="text-biatec-accent font-mono">{{ token.assetId }}</span>
      </div>
      <div v-if="token.contractAddress" class="flex justify-between items-center text-xs">
        <span class="text-gray-400">Contract:</span>
        <span class="text-biatec-accent font-mono">{{ token.contractAddress.slice(0, 10) }}...</span>
      </div>
      <div v-if="token.txId" class="flex justify-between items-center text-xs">
        <span class="text-gray-400">Tx ID:</span>
        <span class="text-biatec-accent font-mono">{{ token.txId.slice(0, 10) }}...</span>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <span class="text-xs text-gray-400">
        {{ formatDate(token.createdAt) }}
      </span>
      <div class="flex items-center space-x-2">
        <button
          v-if="token.status === 'deployed'"
          @click="copyToClipboard"
          class="p-2 rounded-lg bg-biatec-accent/20 text-biatec-accent hover:bg-biatec-accent/30 transition-colors"
          title="Copy Details"
        >
          <i class="pi pi-copy text-sm"></i>
        </button>
        <button
          @click="$emit('delete', token.id)"
          class="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          title="Delete Token"
        >
          <i class="pi pi-trash text-sm"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Token } from '../stores/tokens'

const props = defineProps<{
  token: Token
}>()

const emit = defineEmits<{
  delete: [id: string]
}>()

const standardBadgeClass = computed(() => {
  const baseClass = 'bg-opacity-20 border'
  switch (props.token.standard) {
    case 'ARC3':
      return `${baseClass} bg-blue-500 text-blue-300 border-blue-500/30`
    case 'ARC200':
      return `${baseClass} bg-green-500 text-green-300 border-green-500/30`
    case 'ARC72':
      return `${baseClass} bg-purple-500 text-purple-300 border-purple-500/30`
    case 'ERC20':
      return `${baseClass} bg-yellow-500 text-yellow-300 border-yellow-500/30`
    case 'ERC721':
      return `${baseClass} bg-pink-500 text-pink-300 border-pink-500/30`
    default:
      return `${baseClass} bg-gray-500 text-gray-300 border-gray-500/30`
  }
})

const statusBadgeClass = computed(() => {
  const baseClass = 'bg-opacity-20 border'
  switch (props.token.status) {
    case 'deployed':
      return `${baseClass} bg-green-500 text-green-300 border-green-500/30`
    case 'deploying':
      return `${baseClass} bg-yellow-500 text-yellow-300 border-yellow-500/30`
    case 'failed':
      return `${baseClass} bg-red-500 text-red-300 border-red-500/30`
    default:
      return `${baseClass} bg-gray-500 text-gray-300 border-gray-500/30`
  }
})

const formatSupply = (supply: number) => {
  if (supply >= 1000000) {
    return (supply / 1000000).toFixed(1) + 'M'
  } else if (supply >= 1000) {
    return (supply / 1000).toFixed(1) + 'K'
  }
  return supply.toString()
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const copyToClipboard = async () => {
  const details = {
    name: props.token.name,
    symbol: props.token.symbol,
    standard: props.token.standard,
    assetId: props.token.assetId,
    contractAddress: props.token.contractAddress,
    txId: props.token.txId
  }
  
  try {
    await navigator.clipboard.writeText(JSON.stringify(details, null, 2))
    // You could show a toast notification here
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>