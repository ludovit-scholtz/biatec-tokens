<template>
  <nav class="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Logo -->
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-biatec-accent to-biatec-teal rounded-xl flex items-center justify-center shadow-lg">
            <span class="text-white font-bold text-xl">B</span>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white">Biatec Tokens</h1>
            <p class="text-sm text-gray-300">Next-Gen Tokenization</p>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            to="/"
            class="text-white hover:text-biatec-accent transition-colors duration-200 font-medium text-lg relative group"
            :class="{ 'text-biatec-accent': $route.name === 'Home' }"
          >
            Home
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-biatec-accent transition-all duration-200 group-hover:w-full" :class="{ 'w-full': $route.name === 'Home' }"></span>
          </router-link>
          <router-link
            to="/create"
            class="text-white hover:text-biatec-accent transition-colors duration-200 font-medium text-lg relative group"
            :class="{ 'text-biatec-accent': $route.name === 'TokenCreator' }"
          >
            Create Token
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-biatec-accent transition-all duration-200 group-hover:w-full" :class="{ 'w-full': $route.name === 'TokenCreator' }"></span>
          </router-link>
          <router-link
            to="/dashboard"
            class="text-white hover:text-biatec-accent transition-colors duration-200 font-medium text-lg relative group"
            :class="{ 'text-biatec-accent': $route.name === 'TokenDashboard' }"
          >
            Dashboard
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-biatec-accent transition-all duration-200 group-hover:w-full" :class="{ 'w-full': $route.name === 'TokenDashboard' }"></span>
          </router-link>
          <router-link
            to="/settings"
            class="text-white hover:text-biatec-accent transition-colors duration-200 font-medium text-lg relative group"
            :class="{ 'text-biatec-accent': $route.name === 'Settings' }"
          >
            Settings
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-biatec-accent transition-all duration-200 group-hover:w-full" :class="{ 'w-full': $route.name === 'Settings' }"></span>
          </router-link>
        </div>

        <!-- Wallet Connection -->
        <div class="flex items-center space-x-4">
          <div class="hidden sm:flex items-center space-x-3 text-sm text-gray-300 bg-white/5 px-4 py-2 rounded-lg">
            <span class="status-dot" :class="`status-${networkStatus.toLowerCase()}`"></span>
            <span class="font-medium">{{ networkStatus }}</span>
          </div>
          <button
            @click="connectWallet"
            :disabled="isConnecting"
            class="btn-primary px-6 py-3 rounded-xl text-white font-medium text-sm flex items-center space-x-2 disabled:opacity-50"
          >
            <i class="pi pi-wallet text-lg"></i>
            <span>{{ walletButtonText }}</span>
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-3 rounded-xl text-white hover:bg-white/10 transition-colors"
        >
          <i class="pi pi-bars text-xl"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="showMobileMenu" class="md:hidden glass-effect border-t border-white/10">
      <div class="px-4 py-4 space-y-2">
        <router-link
          to="/"
          @click="toggleMobileMenu"
          class="block px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors font-medium"
        >
          Home
        </router-link>
        <router-link
          to="/create"
          @click="toggleMobileMenu"
          class="block px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors font-medium"
        >
          Create Token
        </router-link>
        <router-link
          to="/dashboard"
          @click="toggleMobileMenu"
          class="block px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors font-medium"
        >
          Dashboard
        </router-link>
        <router-link
          to="/settings"
          @click="toggleMobileMenu"
          class="block px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors font-medium"
        >
          Settings
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSettingsStore } from '../stores/settings'

const settingsStore = useSettingsStore()
const showMobileMenu = ref(false)
const isConnecting = ref(false)
const isConnected = ref(false)
const walletAddress = ref('')

const networkStatus = computed(() => {
  const network = settingsStore.settings.network
  return network.charAt(0).toUpperCase() + network.slice(1)
})

const walletButtonText = computed(() => {
  if (isConnecting.value) return 'Connecting...'
  if (isConnected.value) return `${walletAddress.value.slice(0, 6)}...${walletAddress.value.slice(-4)}`
  return 'Connect Wallet'
})

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