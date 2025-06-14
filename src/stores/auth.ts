import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface AlgorandUser {
  address: string
  name?: string
  email?: string
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AlgorandUser | null>(null)
  const loading = ref(false)
  const isConnected = ref(false)

  const isAuthenticated = computed(() => !!user.value && isConnected.value)

  const initialize = async () => {
    loading.value = true
    try {
      // Check if user was previously connected
      const savedUser = localStorage.getItem('algorand_user')
      if (savedUser) {
        user.value = JSON.parse(savedUser)
        isConnected.value = true
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
    } finally {
      loading.value = false
    }
  }

  const connectWallet = async (walletAddress: string, userInfo?: Partial<AlgorandUser>) => {
    loading.value = true
    try {
      const newUser: AlgorandUser = {
        address: walletAddress,
        name: userInfo?.name || `User ${walletAddress.slice(0, 6)}...`,
        email: userInfo?.email,
        avatar: userInfo?.avatar
      }
      
      user.value = newUser
      isConnected.value = true
      
      // Save to localStorage
      localStorage.setItem('algorand_user', JSON.stringify(newUser))
      
      return newUser
    } catch (error) {
      console.error('Error connecting wallet:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    user.value = null
    isConnected.value = false
    localStorage.removeItem('algorand_user')
  }

  const updateUser = (updates: Partial<AlgorandUser>) => {
    if (user.value) {
      user.value = { ...user.value, ...updates }
      localStorage.setItem('algorand_user', JSON.stringify(user.value))
    }
  }

  return {
    user,
    loading,
    isConnected,
    isAuthenticated,
    initialize,
    connectWallet,
    signOut,
    updateUser
  }
})