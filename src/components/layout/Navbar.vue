<template>
  <nav class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-3 group">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <span class="text-white font-bold text-lg">B</span>
          </div>
          <div class="hidden sm:block">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">Biatec Tokens</h1>
          </div>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.path"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors relative group"
            :class="isActiveRoute(item.path) 
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'"
          >
            <component :is="item.icon" class="w-4 h-4 inline mr-2" />
            {{ item.name }}
          </router-link>
        </div>

        <!-- Right Side Actions -->
        <div class="flex items-center space-x-3">
          <!-- Theme Toggle -->
          <button
            @click="themeStore.toggleTheme()"
            class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            :title="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <SunIcon v-if="themeStore.isDark" class="w-5 h-5" />
            <MoonIcon v-else class="w-5 h-5" />
          </button>

          <!-- Network Status -->
          <div class="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
            <div class="w-2 h-2 rounded-full" :class="networkStatusColor"></div>
            <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ networkStatus }}</span>
          </div>

          <!-- Wallet Connection -->
          <Button
            @click="connectWallet"
            :loading="isConnecting"
            :variant="isConnected ? 'secondary' : 'primary'"
            size="sm"
          >
            <template #icon>
              <WalletIcon class="w-4 h-4" />
            </template>
            {{ walletButtonText }}
          </Button>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Bars3Icon v-if="!showMobileMenu" class="w-6 h-6" />
            <XMarkIcon v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div class="px-4 py-3 space-y-1">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.path"
            @click="showMobileMenu = false"
            class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="isActiveRoute(item.path) 
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '../../stores/theme'
import { useSettingsStore } from '../../stores/settings'
import Button from '../ui/Button.vue'
import {
  HomeIcon,
  PlusCircleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  WalletIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const themeStore = useThemeStore()
const settingsStore = useSettingsStore()

const showMobileMenu = ref(false)
const isConnecting = ref(false)
const isConnected = ref(false)
const walletAddress = ref('')

const navigationItems = [
  { name: 'Home', path: '/', icon: HomeIcon },
  { name: 'Create', path: '/create', icon: PlusCircleIcon },
  { name: 'Dashboard', path: '/dashboard', icon: ChartBarIcon },
  { name: 'Settings', path: '/settings', icon: Cog6ToothIcon }
]

const networkStatus = computed(() => {
  const network = settingsStore.settings.network
  return network.charAt(0).toUpperCase() + network.slice(1)
})

const networkStatusColor = computed(() => {
  switch (settingsStore.settings.network) {
    case 'mainnet':
      return 'bg-green-500'
    case 'testnet':
      return 'bg-yellow-500'
    case 'dockernet':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
})

const walletButtonText = computed(() => {
  if (isConnecting.value) return 'Connecting...'
  if (isConnected.value) return `${walletAddress.value.slice(0, 6)}...${walletAddress.value.slice(-4)}`
  return 'Connect'
})

const isActiveRoute = (path: string) => {
  return route.path === path
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const connectWallet = async () => {
  if (isConnected.value) return
  
  isConnecting.value = true
  
  try {
    // Mock wallet connection
    await new Promise(resolve => setTimeout(resolve, 1500))
    isConnected.value = true
    walletAddress.value = 'DEMO' + Math.random().toString(36).substr(2, 54).toUpperCase()
  } catch (error) {
    console.error('Failed to connect wallet:', error)
  } finally {
    isConnecting.value = false
  }
}
</script>