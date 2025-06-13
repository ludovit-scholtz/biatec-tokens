<template>
  <div class="container-padding">
    <div class="max-w-7xl mx-auto">
      <!-- Hero Section -->
      <div class="text-center section-padding">
        <div class="animate-fade-in">
          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 text-balance">
            Next-Generation
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block mt-2">
              Tokenization Platform
            </span>
          </h1>
          <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 text-balance">
            Create, manage, and deploy tokens across multiple standards with enterprise-grade security and lightning-fast performance.
          </p>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              @click="$router.push('/create')"
              variant="primary"
              size="lg"
              class="text-lg px-8 py-4"
            >
              <template #icon>
                <PlusCircleIcon class="w-6 h-6" />
              </template>
              Create Your First Token
            </Button>
            <Button
              @click="$router.push('/dashboard')"
              variant="outline"
              size="lg"
              class="text-lg px-8 py-4"
            >
              <template #icon>
                <ChartBarIcon class="w-6 h-6" />
              </template>
              View Dashboard
            </Button>
          </div>
        </div>

        <!-- Feature Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card
            v-for="(feature, index) in features"
            :key="feature.title"
            variant="glass"
            hover
            class="animate-slide-up"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <component :is="feature.icon" class="w-8 h-8 text-white" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ feature.title }}</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">{{ feature.description }}</p>
            </div>
          </Card>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <Card
            v-for="stat in stats"
            :key="stat.label"
            variant="elevated"
            class="text-center hover:scale-105 transition-transform duration-200"
          >
            <div class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {{ stat.value }}
            </div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.label }}</div>
          </Card>
        </div>
      </div>

      <!-- Token Standards Section -->
      <div class="section-padding border-t border-gray-200 dark:border-gray-800">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Supported Token Standards</h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create tokens across multiple blockchain standards with a unified interface
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            v-for="standard in tokenStandards"
            :key="standard.name"
            variant="default"
            hover
            class="group"
          >
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="standard.bgClass">
                <component :is="standard.icon" class="w-6 h-6 text-white" />
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ standard.name }}</h3>
                  <Badge :variant="standard.badgeVariant" size="sm">{{ standard.type }}</Badge>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">{{ standard.description }}</p>
                <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span class="w-2 h-2 rounded-full mr-2" :class="standard.statusColor"></span>
                  {{ standard.network }}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTokenStore } from '../stores/tokens'
import Button from '../components/ui/Button.vue'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import {
  PlusCircleIcon,
  ChartBarIcon,
  BoltIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CubeIcon,
  CurrencyDollarIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline'

const tokenStore = useTokenStore()

const features = [
  {
    title: 'Lightning Fast',
    description: 'Deploy any token in under 60 seconds with our streamlined creation wizard.',
    icon: BoltIcon
  },
  {
    title: 'Enterprise Security',
    description: 'Built-in whitelisting, permission controls, and audit-ready compliance.',
    icon: ShieldCheckIcon
  },
  {
    title: 'Multi-Standard',
    description: 'Support for ARC3, ARC200, ARC72, ERC20, and ERC721 in one platform.',
    icon: GlobeAltIcon
  }
]

const stats = computed(() => [
  { label: 'Total Tokens', value: tokenStore.totalTokens || '0' },
  { label: 'Deployed', value: tokenStore.deployedTokens || '0' },
  { label: 'Standards', value: '5' },
  { label: 'Uptime', value: '99.9%' }
])

const tokenStandards = [
  {
    name: 'ARC3',
    type: 'ASA',
    description: 'Native Algorand Standard Assets with built-in metadata support for both fungible and non-fungible tokens.',
    icon: CubeIcon,
    bgClass: 'bg-blue-500',
    badgeVariant: 'info' as const,
    statusColor: 'bg-green-500',
    network: 'Algorand'
  },
  {
    name: 'ARC200',
    type: 'Smart Contract',
    description: 'Algorand smart contract tokens compatible with ERC20 standards and functionality.',
    icon: CurrencyDollarIcon,
    bgClass: 'bg-green-500',
    badgeVariant: 'success' as const,
    statusColor: 'bg-green-500',
    network: 'Algorand'
  },
  {
    name: 'ARC72',
    type: 'NFT',
    description: 'Algorand NFT standard with Ethereum-style functionality and metadata handling.',
    icon: PhotoIcon,
    bgClass: 'bg-purple-500',
    badgeVariant: 'default' as const,
    statusColor: 'bg-green-500',
    network: 'Algorand'
  },
  {
    name: 'ERC20',
    type: 'Fungible',
    description: 'Standard Ethereum fungible tokens with full EVM compatibility and features.',
    icon: CurrencyDollarIcon,
    bgClass: 'bg-yellow-500',
    badgeVariant: 'warning' as const,
    statusColor: 'bg-yellow-500',
    network: 'Ethereum'
  },
  {
    name: 'ERC721',
    type: 'NFT',
    description: 'Ethereum non-fungible tokens with rich metadata and ownership tracking capabilities.',
    icon: PhotoIcon,
    bgClass: 'bg-pink-500',
    badgeVariant: 'error' as const,
    statusColor: 'bg-yellow-500',
    network: 'Ethereum'
  }
]
</script>