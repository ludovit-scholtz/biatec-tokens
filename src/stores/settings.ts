import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface NetworkConfig {
  algodUrl: string
  algodToken: string
  indexerUrl: string
  indexerToken: string
  headers?: Record<string, string>
}

export interface Settings {
  network: 'mainnet' | 'testnet' | 'dockernet'
  networkConfigs: Record<string, NetworkConfig>
  evmRpcUrl: string
  evmChainId: number
  demoMode: boolean
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Settings>({
    network: 'testnet',
    networkConfigs: {
      mainnet: {
        algodUrl: 'https://mainnet-api.algonode.cloud',
        algodToken: '',
        indexerUrl: 'https://mainnet-idx.algonode.cloud',
        indexerToken: ''
      },
      testnet: {
        algodUrl: 'https://testnet-api.algonode.cloud',
        algodToken: '',
        indexerUrl: 'https://testnet-idx.algonode.cloud',
        indexerToken: ''
      },
      dockernet: {
        algodUrl: 'http://localhost:4001',
        algodToken: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        indexerUrl: 'http://localhost:8980',
        indexerToken: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      }
    },
    evmRpcUrl: 'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
    evmChainId: 11155111,
    demoMode: true
  })

  const updateNetwork = (network: Settings['network']) => {
    settings.value.network = network
  }

  const updateNetworkConfig = (network: string, config: NetworkConfig) => {
    settings.value.networkConfigs[network] = config
  }

  const updateEvmConfig = (rpcUrl: string, chainId: number) => {
    settings.value.evmRpcUrl = rpcUrl
    settings.value.evmChainId = chainId
  }

  const toggleDemoMode = () => {
    settings.value.demoMode = !settings.value.demoMode
  }

  const exportSettings = () => {
    return JSON.stringify(settings.value, null, 2)
  }

  const importSettings = (settingsJson: string) => {
    try {
      const imported = JSON.parse(settingsJson)
      settings.value = { ...settings.value, ...imported }
      return true
    } catch (error) {
      console.error('Failed to import settings:', error)
      return false
    }
  }

  return {
    settings,
    updateNetwork,
    updateNetworkConfig,
    updateEvmConfig,
    toggleDemoMode,
    exportSettings,
    importSettings
  }
})