/**
 * Network Compatibility Configuration
 * 
 * Defines which token standards, networks, and wallets are compatible.
 * This is the single source of truth for compatibility validation across the app.
 */

export type StandardId = 
  // AVM standards (Algorand-based)
  | 'ASA' 
  | 'ARC3FT' 
  | 'ARC3NFT' 
  | 'ARC3FNFT' 
  | 'ARC19' 
  | 'ARC69' 
  | 'ARC200' 
  | 'ARC72'
  // EVM standards (Ethereum-based)
  | 'ERC20' 
  | 'ERC721'

export type NetworkId = 
  // AVM networks
  | 'VOI' 
  | 'Aramid' 
  | 'Algorand' 
  | 'AlgorandTestnet'
  // EVM networks
  | 'Ethereum' 
  | 'Arbitrum' 
  | 'Base'
  | 'Sepolia'

export type WalletType = 
  // AVM wallets
  | 'Pera' 
  | 'Defly' 
  | 'Exodus' 
  | 'AlgoSigner'
  // EVM wallets
  | 'MetaMask' 
  | 'WalletConnect' 
  | 'Coinbase'
  // Wallet-free
  | 'Email'

export interface NetworkInfo {
  id: NetworkId
  displayName: string
  type: 'AVM' | 'EVM'
  isTestnet: boolean
  supportedStandards: StandardId[]
  description: string
}

export interface StandardInfo {
  id: StandardId
  name: string
  type: 'Fungible' | 'NFT'
  networkType: 'AVM' | 'EVM'
  description: string
  requiresMetadata: boolean
}

export interface WalletInfo {
  type: WalletType
  name: string
  supportedNetworks: NetworkId[]
  requiresConnection: boolean
}

/**
 * Network definitions with supported standards
 */
export const NETWORKS: Record<NetworkId, NetworkInfo> = {
  // AVM Networks
  VOI: {
    id: 'VOI',
    displayName: 'VOI Network',
    type: 'AVM',
    isTestnet: false,
    supportedStandards: ['ASA', 'ARC3FT', 'ARC3NFT', 'ARC3FNFT', 'ARC19', 'ARC69', 'ARC200', 'ARC72'],
    description: 'High-performance blockchain optimized for DeFi and utility tokens with fast finality',
  },
  Aramid: {
    id: 'Aramid',
    displayName: 'Aramid Network',
    type: 'AVM',
    isTestnet: false,
    supportedStandards: ['ASA', 'ARC3FT', 'ARC3NFT', 'ARC3FNFT', 'ARC19', 'ARC69', 'ARC200', 'ARC72'],
    description: 'Enterprise-grade blockchain designed for regulated assets and cross-border payments',
  },
  Algorand: {
    id: 'Algorand',
    displayName: 'Algorand Mainnet',
    type: 'AVM',
    isTestnet: false,
    supportedStandards: ['ASA', 'ARC3FT', 'ARC3NFT', 'ARC3FNFT', 'ARC19', 'ARC69', 'ARC200', 'ARC72'],
    description: 'Algorand mainnet - pure proof-of-stake blockchain with instant finality',
  },
  AlgorandTestnet: {
    id: 'AlgorandTestnet',
    displayName: 'Algorand Testnet',
    type: 'AVM',
    isTestnet: true,
    supportedStandards: ['ASA', 'ARC3FT', 'ARC3NFT', 'ARC3FNFT', 'ARC19', 'ARC69', 'ARC200', 'ARC72'],
    description: 'Algorand testnet for development and testing',
  },
  
  // EVM Networks
  Ethereum: {
    id: 'Ethereum',
    displayName: 'Ethereum Mainnet',
    type: 'EVM',
    isTestnet: false,
    supportedStandards: ['ERC20', 'ERC721'],
    description: 'The world\'s leading smart contract platform',
  },
  Arbitrum: {
    id: 'Arbitrum',
    displayName: 'Arbitrum One',
    type: 'EVM',
    isTestnet: false,
    supportedStandards: ['ERC20', 'ERC721'],
    description: 'Layer 2 scaling solution for Ethereum with lower fees',
  },
  Base: {
    id: 'Base',
    displayName: 'Base',
    type: 'EVM',
    isTestnet: false,
    supportedStandards: ['ERC20', 'ERC721'],
    description: 'Coinbase\'s Ethereum L2 built on OP Stack',
  },
  Sepolia: {
    id: 'Sepolia',
    displayName: 'Sepolia Testnet',
    type: 'EVM',
    isTestnet: true,
    supportedStandards: ['ERC20', 'ERC721'],
    description: 'Ethereum testnet for development and testing',
  },
}

/**
 * Token standard definitions
 */
export const STANDARDS: Record<StandardId, StandardInfo> = {
  // AVM Standards
  ASA: {
    id: 'ASA',
    name: 'ASA (Simple Token)',
    type: 'Fungible',
    networkType: 'AVM',
    description: 'Native Algorand Standard Asset - lightweight, fast, and cost-effective',
    requiresMetadata: false,
  },
  ARC3FT: {
    id: 'ARC3FT',
    name: 'ARC-3 (Token with Info)',
    type: 'Fungible',
    networkType: 'AVM',
    description: 'Fungible token with rich metadata support (logo, description)',
    requiresMetadata: true,
  },
  ARC3NFT: {
    id: 'ARC3NFT',
    name: 'ARC-3 NFT (Unique Item)',
    type: 'NFT',
    networkType: 'AVM',
    description: 'True NFT with unique supply of 1',
    requiresMetadata: true,
  },
  ARC3FNFT: {
    id: 'ARC3FNFT',
    name: 'ARC-3 Fractional NFT',
    type: 'NFT',
    networkType: 'AVM',
    description: 'Fractional NFT enabling shared ownership',
    requiresMetadata: true,
  },
  ARC19: {
    id: 'ARC19',
    name: 'ARC-19 (Mutable NFT)',
    type: 'NFT',
    networkType: 'AVM',
    description: 'Mutable NFT with updatable metadata',
    requiresMetadata: true,
  },
  ARC69: {
    id: 'ARC69',
    name: 'ARC-69 (On-chain NFT)',
    type: 'NFT',
    networkType: 'AVM',
    description: 'On-chain metadata NFT stored in transaction notes',
    requiresMetadata: true,
  },
  ARC200: {
    id: 'ARC200',
    name: 'ARC-200 (Smart Contract Token)',
    type: 'Fungible',
    networkType: 'AVM',
    description: 'Smart contract-based fungible token with advanced features',
    requiresMetadata: true,
  },
  ARC72: {
    id: 'ARC72',
    name: 'ARC-72 (Smart Contract NFT)',
    type: 'NFT',
    networkType: 'AVM',
    description: 'Smart contract-based NFT with advanced features',
    requiresMetadata: true,
  },
  
  // EVM Standards
  ERC20: {
    id: 'ERC20',
    name: 'ERC-20 (Standard Token)',
    type: 'Fungible',
    networkType: 'EVM',
    description: 'The most common token standard on Ethereum networks',
    requiresMetadata: false,
  },
  ERC721: {
    id: 'ERC721',
    name: 'ERC-721 (NFT)',
    type: 'NFT',
    networkType: 'EVM',
    description: 'Non-fungible tokens for unique digital items',
    requiresMetadata: true,
  },
}

/**
 * Wallet definitions with supported networks
 */
export const WALLETS: Record<WalletType, WalletInfo> = {
  // AVM Wallets
  Pera: {
    type: 'Pera',
    name: 'Pera Wallet',
    supportedNetworks: ['VOI', 'Aramid', 'Algorand', 'AlgorandTestnet'],
    requiresConnection: true,
  },
  Defly: {
    type: 'Defly',
    name: 'Defly Wallet',
    supportedNetworks: ['VOI', 'Aramid', 'Algorand', 'AlgorandTestnet'],
    requiresConnection: true,
  },
  Exodus: {
    type: 'Exodus',
    name: 'Exodus Wallet',
    supportedNetworks: ['VOI', 'Algorand', 'AlgorandTestnet', 'Ethereum', 'Arbitrum', 'Base'],
    requiresConnection: true,
  },
  AlgoSigner: {
    type: 'AlgoSigner',
    name: 'AlgoSigner',
    supportedNetworks: ['Algorand', 'AlgorandTestnet'],
    requiresConnection: true,
  },
  
  // EVM Wallets
  MetaMask: {
    type: 'MetaMask',
    name: 'MetaMask',
    supportedNetworks: ['Ethereum', 'Arbitrum', 'Base', 'Sepolia'],
    requiresConnection: true,
  },
  WalletConnect: {
    type: 'WalletConnect',
    name: 'WalletConnect',
    supportedNetworks: ['VOI', 'Aramid', 'Algorand', 'AlgorandTestnet', 'Ethereum', 'Arbitrum', 'Base', 'Sepolia'],
    requiresConnection: true,
  },
  Coinbase: {
    type: 'Coinbase',
    name: 'Coinbase Wallet',
    supportedNetworks: ['Ethereum', 'Arbitrum', 'Base', 'Sepolia'],
    requiresConnection: true,
  },
  
  // Wallet-free
  Email: {
    type: 'Email',
    name: 'Email Authentication',
    supportedNetworks: ['VOI', 'Aramid', 'Algorand', 'AlgorandTestnet', 'Ethereum', 'Arbitrum', 'Base', 'Sepolia'],
    requiresConnection: false,
  },
}

/**
 * Compatibility checking utilities
 */

/**
 * Check if a standard is supported on a network
 */
export function isStandardSupportedOnNetwork(
  standardId: StandardId,
  networkId: NetworkId
): boolean {
  const network = NETWORKS[networkId]
  return network?.supportedStandards.includes(standardId) ?? false
}

/**
 * Check if a wallet supports a network
 */
export function isWalletSupportedOnNetwork(
  walletType: WalletType,
  networkId: NetworkId
): boolean {
  const wallet = WALLETS[walletType]
  return wallet?.supportedNetworks.includes(networkId) ?? false
}

/**
 * Check if a standard and wallet are compatible (via a common network)
 */
export function isStandardCompatibleWithWallet(
  standardId: StandardId,
  walletType: WalletType
): boolean {
  const standard = STANDARDS[standardId]
  const wallet = WALLETS[walletType]
  
  if (!standard || !wallet) return false
  
  // Check if any of the wallet's supported networks support this standard
  return wallet.supportedNetworks.some(networkId => 
    isStandardSupportedOnNetwork(standardId, networkId)
  )
}

/**
 * Get compatible networks for a standard
 */
export function getCompatibleNetworks(standardId: StandardId): NetworkId[] {
  return Object.values(NETWORKS)
    .filter(network => network.supportedStandards.includes(standardId))
    .map(network => network.id)
}

/**
 * Get compatible standards for a network
 */
export function getCompatibleStandards(networkId: NetworkId): StandardId[] {
  const network = NETWORKS[networkId]
  return network?.supportedStandards ?? []
}

/**
 * Get compatible wallets for a network
 */
export function getCompatibleWallets(networkId: NetworkId): WalletType[] {
  return Object.values(WALLETS)
    .filter(wallet => wallet.supportedNetworks.includes(networkId))
    .map(wallet => wallet.type)
}

/**
 * Find alternative networks that support a standard
 */
export function findAlternativeNetworks(
  standardId: StandardId,
  currentNetwork: NetworkId
): NetworkId[] {
  return getCompatibleNetworks(standardId).filter(id => id !== currentNetwork)
}

/**
 * Find alternative standards that work on a network
 */
export function findAlternativeStandards(
  networkId: NetworkId,
  currentStandard: StandardId
): StandardId[] {
  return getCompatibleStandards(networkId).filter(id => id !== currentStandard)
}

/**
 * Check if a full configuration (network + standard + wallet) is compatible
 */
export function isConfigurationCompatible(
  networkId: NetworkId,
  standardId: StandardId,
  walletType?: WalletType
): { compatible: boolean; reason?: string } {
  // Check network and standard compatibility
  if (!isStandardSupportedOnNetwork(standardId, networkId)) {
    const standard = STANDARDS[standardId]
    const network = NETWORKS[networkId]
    return {
      compatible: false,
      reason: `${standard?.name} is not supported on ${network?.displayName}. This standard is ${standard?.networkType}-based, but you selected a ${network?.type} network.`,
    }
  }
  
  // Check wallet compatibility if provided
  if (walletType && walletType !== 'Email') {
    if (!isWalletSupportedOnNetwork(walletType, networkId)) {
      const wallet = WALLETS[walletType]
      const network = NETWORKS[networkId]
      return {
        compatible: false,
        reason: `${wallet?.name} does not support ${network?.displayName}. Please select a different wallet or network.`,
      }
    }
  }
  
  return { compatible: true }
}

/**
 * Get user-friendly description of network type
 */
export function getNetworkTypeDescription(type: 'AVM' | 'EVM'): string {
  if (type === 'AVM') {
    return 'Algorand Virtual Machine - Algorand-based networks with native Layer-1 assets'
  }
  return 'Ethereum Virtual Machine - Ethereum-compatible networks with smart contracts'
}

/**
 * Normalize standard identifier from various input formats
 */
export function normalizeStandardId(input: string): StandardId | null {
  const normalized = input.toUpperCase().replace(/[-\s]/g, '')
  
  // Direct mapping
  const standardMap: Record<string, StandardId> = {
    'ASA': 'ASA',
    'ARC3FT': 'ARC3FT',
    'ARC3NFT': 'ARC3NFT',
    'ARC3FNFT': 'ARC3FNFT',
    'ARC19': 'ARC19',
    'ARC69': 'ARC69',
    'ARC200': 'ARC200',
    'ARC72': 'ARC72',
    'ERC20': 'ERC20',
    'ERC721': 'ERC721',
  }
  
  return standardMap[normalized] || null
}

/**
 * Normalize network identifier from various input formats
 */
export function normalizeNetworkId(input: string): NetworkId | null {
  const normalized = input.toUpperCase().replace(/[-\s]/g, '')
  
  const networkMap: Record<string, NetworkId> = {
    'VOI': 'VOI',
    'VOIMAINNET': 'VOI',
    'ARAMID': 'Aramid',
    'ARAMIDMAINNET': 'Aramid',
    'ALGORAND': 'Algorand',
    'ALGORANDMAINNET': 'Algorand',
    'ALGORANDTESTNET': 'AlgorandTestnet',
    'ETHEREUM': 'Ethereum',
    'ETHEREUMMAINNET': 'Ethereum',
    'ARBITRUM': 'Arbitrum',
    'ARBITRUMONE': 'Arbitrum',
    'BASE': 'Base',
    'SEPOLIA': 'Sepolia',
    'SEPOLIATESTNET': 'Sepolia',
  }
  
  return networkMap[normalized] || null
}
