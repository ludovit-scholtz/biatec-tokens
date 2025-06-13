import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Token {
  id: string
  name: string
  symbol: string
  standard: 'ARC3' | 'ARC200' | 'ARC72' | 'ERC20' | 'ERC721'
  type: 'FT' | 'NFT'
  supply: number
  decimals?: number
  description: string
  imageUrl?: string
  attributes?: Array<{ trait_type: string; value: string }>
  status: 'created' | 'deploying' | 'deployed' | 'failed'
  createdAt: Date
  txId?: string
  assetId?: number
  contractAddress?: string
}

export const useTokenStore = defineStore('tokens', () => {
  const tokens = ref<Token[]>([])
  const isLoading = ref(false)

  const tokensByStandard = computed(() => {
    const grouped = tokens.value.reduce((acc, token) => {
      if (!acc[token.standard]) {
        acc[token.standard] = []
      }
      acc[token.standard].push(token)
      return acc
    }, {} as Record<string, Token[]>)
    return grouped
  })

  const totalTokens = computed(() => tokens.value.length)
  const deployedTokens = computed(() => tokens.value.filter(t => t.status === 'deployed').length)
  const failedTokens = computed(() => tokens.value.filter(t => t.status === 'failed').length)

  const createToken = async (tokenData: Omit<Token, 'id' | 'status' | 'createdAt'>) => {
    isLoading.value = true
    
    try {
      const newToken: Token = {
        ...tokenData,
        id: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'deploying',
        createdAt: new Date()
      }

      tokens.value.push(newToken)

      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock successful deployment
      const tokenIndex = tokens.value.findIndex(t => t.id === newToken.id)
      if (tokenIndex !== -1) {
        tokens.value[tokenIndex].status = 'deployed'
        tokens.value[tokenIndex].txId = `tx_${Math.random().toString(36).substr(2, 20)}`
        
        if (newToken.standard.startsWith('ARC')) {
          tokens.value[tokenIndex].assetId = Math.floor(Math.random() * 1000000) + 100000
        } else {
          tokens.value[tokenIndex].contractAddress = `0x${Math.random().toString(16).substr(2, 40)}`
        }
      }

      return newToken
    } catch (error) {
      console.error('Failed to create token:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteToken = (tokenId: string) => {
    const index = tokens.value.findIndex(t => t.id === tokenId)
    if (index !== -1) {
      tokens.value.splice(index, 1)
    }
  }

  const updateTokenStatus = (tokenId: string, status: Token['status']) => {
    const token = tokens.value.find(t => t.id === tokenId)
    if (token) {
      token.status = status
    }
  }

  return {
    tokens,
    tokensByStandard,
    isLoading,
    totalTokens,
    deployedTokens,
    failedTokens,
    createToken,
    deleteToken,
    updateTokenStatus
  }
})