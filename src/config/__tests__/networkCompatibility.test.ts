import { describe, it, expect } from 'vitest'
import {
  isStandardSupportedOnNetwork,
  isWalletSupportedOnNetwork,
  isStandardCompatibleWithWallet,
  getCompatibleNetworks,
  getCompatibleStandards,
  getCompatibleWallets,
  findAlternativeNetworks,
  findAlternativeStandards,
  isConfigurationCompatible,
  getNetworkTypeDescription,
  normalizeStandardId,
  normalizeNetworkId,
  NETWORKS,
  STANDARDS,
  WALLETS,
} from '../networkCompatibility'

describe('networkCompatibility', () => {
  describe('isStandardSupportedOnNetwork', () => {
    it('should return true for AVM standard on AVM network', () => {
      expect(isStandardSupportedOnNetwork('ASA', 'VOI')).toBe(true)
      expect(isStandardSupportedOnNetwork('ARC3FT', 'Aramid')).toBe(true)
      expect(isStandardSupportedOnNetwork('ARC200', 'Algorand')).toBe(true)
    })

    it('should return true for EVM standard on EVM network', () => {
      expect(isStandardSupportedOnNetwork('ERC20', 'Ethereum')).toBe(true)
      expect(isStandardSupportedOnNetwork('ERC721', 'Arbitrum')).toBe(true)
      expect(isStandardSupportedOnNetwork('ERC20', 'Base')).toBe(true)
    })

    it('should return false for AVM standard on EVM network', () => {
      expect(isStandardSupportedOnNetwork('ASA', 'Ethereum')).toBe(false)
      expect(isStandardSupportedOnNetwork('ARC3FT', 'Arbitrum')).toBe(false)
    })

    it('should return false for EVM standard on AVM network', () => {
      expect(isStandardSupportedOnNetwork('ERC20', 'VOI')).toBe(false)
      expect(isStandardSupportedOnNetwork('ERC721', 'Aramid')).toBe(false)
    })
  })

  describe('isWalletSupportedOnNetwork', () => {
    it('should return true for AVM wallet on AVM network', () => {
      expect(isWalletSupportedOnNetwork('Pera', 'VOI')).toBe(true)
      expect(isWalletSupportedOnNetwork('Defly', 'Algorand')).toBe(true)
    })

    it('should return true for EVM wallet on EVM network', () => {
      expect(isWalletSupportedOnNetwork('MetaMask', 'Ethereum')).toBe(true)
      expect(isWalletSupportedOnNetwork('Coinbase', 'Base')).toBe(true)
    })

    it('should return false for AVM wallet on EVM network', () => {
      expect(isWalletSupportedOnNetwork('Pera', 'Ethereum')).toBe(false)
      expect(isWalletSupportedOnNetwork('AlgoSigner', 'Arbitrum')).toBe(false)
    })

    it('should return false for EVM wallet on AVM network', () => {
      expect(isWalletSupportedOnNetwork('MetaMask', 'VOI')).toBe(false)
      expect(isWalletSupportedOnNetwork('Coinbase', 'Algorand')).toBe(false)
    })

    it('should return true for Email on all networks', () => {
      expect(isWalletSupportedOnNetwork('Email', 'VOI')).toBe(true)
      expect(isWalletSupportedOnNetwork('Email', 'Ethereum')).toBe(true)
      expect(isWalletSupportedOnNetwork('Email', 'Algorand')).toBe(true)
    })

    it('should return true for WalletConnect on all networks', () => {
      expect(isWalletSupportedOnNetwork('WalletConnect', 'VOI')).toBe(true)
      expect(isWalletSupportedOnNetwork('WalletConnect', 'Ethereum')).toBe(true)
      expect(isWalletSupportedOnNetwork('WalletConnect', 'Aramid')).toBe(true)
    })
  })

  describe('isStandardCompatibleWithWallet', () => {
    it('should return true for compatible AVM standard and wallet', () => {
      expect(isStandardCompatibleWithWallet('ASA', 'Pera')).toBe(true)
      expect(isStandardCompatibleWithWallet('ARC3FT', 'Defly')).toBe(true)
    })

    it('should return true for compatible EVM standard and wallet', () => {
      expect(isStandardCompatibleWithWallet('ERC20', 'MetaMask')).toBe(true)
      expect(isStandardCompatibleWithWallet('ERC721', 'Coinbase')).toBe(true)
    })

    it('should return false for incompatible standard and wallet', () => {
      expect(isStandardCompatibleWithWallet('ASA', 'MetaMask')).toBe(false)
      expect(isStandardCompatibleWithWallet('ERC20', 'Pera')).toBe(false)
    })

    it('should return true for any standard with Email', () => {
      expect(isStandardCompatibleWithWallet('ASA', 'Email')).toBe(true)
      expect(isStandardCompatibleWithWallet('ERC20', 'Email')).toBe(true)
      expect(isStandardCompatibleWithWallet('ARC72', 'Email')).toBe(true)
    })
  })

  describe('getCompatibleNetworks', () => {
    it('should return all AVM networks for AVM standards', () => {
      const networks = getCompatibleNetworks('ASA')
      expect(networks).toContain('VOI')
      expect(networks).toContain('Aramid')
      expect(networks).toContain('Algorand')
      expect(networks).toContain('AlgorandTestnet')
      expect(networks).not.toContain('Ethereum')
    })

    it('should return all EVM networks for EVM standards', () => {
      const networks = getCompatibleNetworks('ERC20')
      expect(networks).toContain('Ethereum')
      expect(networks).toContain('Arbitrum')
      expect(networks).toContain('Base')
      expect(networks).toContain('Sepolia')
      expect(networks).not.toContain('VOI')
    })
  })

  describe('getCompatibleStandards', () => {
    it('should return all AVM standards for AVM network', () => {
      const standards = getCompatibleStandards('VOI')
      expect(standards).toContain('ASA')
      expect(standards).toContain('ARC3FT')
      expect(standards).toContain('ARC200')
      expect(standards).not.toContain('ERC20')
    })

    it('should return all EVM standards for EVM network', () => {
      const standards = getCompatibleStandards('Ethereum')
      expect(standards).toContain('ERC20')
      expect(standards).toContain('ERC721')
      expect(standards).not.toContain('ASA')
    })
  })

  describe('getCompatibleWallets', () => {
    it('should return AVM wallets for AVM network', () => {
      const wallets = getCompatibleWallets('VOI')
      expect(wallets).toContain('Pera')
      expect(wallets).toContain('Defly')
      expect(wallets).toContain('Email')
      expect(wallets).toContain('WalletConnect')
    })

    it('should return EVM wallets for EVM network', () => {
      const wallets = getCompatibleWallets('Ethereum')
      expect(wallets).toContain('MetaMask')
      expect(wallets).toContain('Coinbase')
      expect(wallets).toContain('Email')
      expect(wallets).toContain('WalletConnect')
    })

    it('should include Email for all networks', () => {
      expect(getCompatibleWallets('VOI')).toContain('Email')
      expect(getCompatibleWallets('Ethereum')).toContain('Email')
      expect(getCompatibleWallets('Algorand')).toContain('Email')
    })
  })

  describe('findAlternativeNetworks', () => {
    it('should return alternative networks for same standard', () => {
      const alternatives = findAlternativeNetworks('ASA', 'VOI')
      expect(alternatives).toContain('Aramid')
      expect(alternatives).toContain('Algorand')
      expect(alternatives).not.toContain('VOI')
    })

    it('should return empty for standard with no alternatives', () => {
      const alternatives = findAlternativeNetworks('ASA', 'VOI')
      // Should have alternatives (other AVM networks)
      expect(alternatives.length).toBeGreaterThan(0)
    })
  })

  describe('findAlternativeStandards', () => {
    it('should return alternative standards for same network', () => {
      const alternatives = findAlternativeStandards('VOI', 'ASA')
      expect(alternatives).toContain('ARC3FT')
      expect(alternatives).toContain('ARC200')
      expect(alternatives).not.toContain('ASA')
    })

    it('should return only compatible standards', () => {
      const alternatives = findAlternativeStandards('Ethereum', 'ERC20')
      expect(alternatives).toContain('ERC721')
      expect(alternatives).not.toContain('ASA')
      expect(alternatives).not.toContain('ERC20')
    })
  })

  describe('isConfigurationCompatible', () => {
    it('should return compatible for valid AVM configuration', () => {
      const result = isConfigurationCompatible('VOI', 'ASA', 'Pera')
      expect(result.compatible).toBe(true)
      expect(result.reason).toBeUndefined()
    })

    it('should return compatible for valid EVM configuration', () => {
      const result = isConfigurationCompatible('Ethereum', 'ERC20', 'MetaMask')
      expect(result.compatible).toBe(true)
      expect(result.reason).toBeUndefined()
    })

    it('should return incompatible for mismatched network and standard', () => {
      const result = isConfigurationCompatible('VOI', 'ERC20')
      expect(result.compatible).toBe(false)
      expect(result.reason).toContain('not supported')
    })

    it('should return incompatible for mismatched wallet and network', () => {
      const result = isConfigurationCompatible('Ethereum', 'ERC20', 'Pera')
      expect(result.compatible).toBe(false)
      expect(result.reason).toContain('does not support')
    })

    it('should return compatible with Email wallet on any network', () => {
      expect(isConfigurationCompatible('VOI', 'ASA', 'Email').compatible).toBe(true)
      expect(isConfigurationCompatible('Ethereum', 'ERC20', 'Email').compatible).toBe(true)
    })
  })

  describe('getNetworkTypeDescription', () => {
    it('should return description for AVM', () => {
      const desc = getNetworkTypeDescription('AVM')
      expect(desc).toContain('Algorand Virtual Machine')
    })

    it('should return description for EVM', () => {
      const desc = getNetworkTypeDescription('EVM')
      expect(desc).toContain('Ethereum Virtual Machine')
    })
  })

  describe('normalizeStandardId', () => {
    it('should normalize standard IDs with various formats', () => {
      expect(normalizeStandardId('ASA')).toBe('ASA')
      expect(normalizeStandardId('asa')).toBe('ASA')
      expect(normalizeStandardId('ARC-3FT')).toBe('ARC3FT')
      expect(normalizeStandardId('arc 3ft')).toBe('ARC3FT')
      expect(normalizeStandardId('ERC-20')).toBe('ERC20')
      expect(normalizeStandardId('erc20')).toBe('ERC20')
    })

    it('should return null for unknown standards', () => {
      expect(normalizeStandardId('UNKNOWN')).toBeNull()
      expect(normalizeStandardId('BEP20')).toBeNull()
    })
  })

  describe('normalizeNetworkId', () => {
    it('should normalize network IDs with various formats', () => {
      expect(normalizeNetworkId('VOI')).toBe('VOI')
      expect(normalizeNetworkId('voi')).toBe('VOI')
      expect(normalizeNetworkId('VOI Mainnet')).toBe('VOI')
      expect(normalizeNetworkId('Aramid')).toBe('Aramid')
      expect(normalizeNetworkId('ARAMID MAINNET')).toBe('Aramid')
      expect(normalizeNetworkId('Ethereum')).toBe('Ethereum')
      expect(normalizeNetworkId('ETHEREUM MAINNET')).toBe('Ethereum')
    })

    it('should return null for unknown networks', () => {
      expect(normalizeNetworkId('UNKNOWN')).toBeNull()
      expect(normalizeNetworkId('Polygon')).toBeNull()
    })
  })

  describe('NETWORKS constant', () => {
    it('should have correct structure for all networks', () => {
      Object.values(NETWORKS).forEach(network => {
        expect(network).toHaveProperty('id')
        expect(network).toHaveProperty('displayName')
        expect(network).toHaveProperty('type')
        expect(network).toHaveProperty('isTestnet')
        expect(network).toHaveProperty('supportedStandards')
        expect(network).toHaveProperty('description')
        expect(Array.isArray(network.supportedStandards)).toBe(true)
      })
    })

    it('should have at least 4 AVM networks', () => {
      const avmNetworks = Object.values(NETWORKS).filter(n => n.type === 'AVM')
      expect(avmNetworks.length).toBeGreaterThanOrEqual(4)
    })

    it('should have at least 4 EVM networks', () => {
      const evmNetworks = Object.values(NETWORKS).filter(n => n.type === 'EVM')
      expect(evmNetworks.length).toBeGreaterThanOrEqual(4)
    })
  })

  describe('STANDARDS constant', () => {
    it('should have correct structure for all standards', () => {
      Object.values(STANDARDS).forEach(standard => {
        expect(standard).toHaveProperty('id')
        expect(standard).toHaveProperty('name')
        expect(standard).toHaveProperty('type')
        expect(standard).toHaveProperty('networkType')
        expect(standard).toHaveProperty('description')
        expect(standard).toHaveProperty('requiresMetadata')
      })
    })

    it('should have both AVM and EVM standards', () => {
      const avmStandards = Object.values(STANDARDS).filter(s => s.networkType === 'AVM')
      const evmStandards = Object.values(STANDARDS).filter(s => s.networkType === 'EVM')
      expect(avmStandards.length).toBeGreaterThan(0)
      expect(evmStandards.length).toBeGreaterThan(0)
    })
  })

  describe('WALLETS constant', () => {
    it('should have correct structure for all wallets', () => {
      Object.values(WALLETS).forEach(wallet => {
        expect(wallet).toHaveProperty('type')
        expect(wallet).toHaveProperty('name')
        expect(wallet).toHaveProperty('supportedNetworks')
        expect(wallet).toHaveProperty('requiresConnection')
        expect(Array.isArray(wallet.supportedNetworks)).toBe(true)
      })
    })

    it('should have Email wallet supporting all networks', () => {
      const email = WALLETS.Email
      const allNetworks = Object.keys(NETWORKS)
      expect(email.supportedNetworks.length).toBe(allNetworks.length)
    })

    it('should have WalletConnect supporting all networks', () => {
      const wc = WALLETS.WalletConnect
      const allNetworks = Object.keys(NETWORKS)
      expect(wc.supportedNetworks.length).toBe(allNetworks.length)
    })
  })

  describe('Edge cases', () => {
    it('should handle undefined standard gracefully', () => {
      expect(isStandardSupportedOnNetwork('INVALID' as any, 'VOI')).toBe(false)
    })

    it('should handle undefined network gracefully', () => {
      expect(isStandardSupportedOnNetwork('ASA', 'INVALID' as any)).toBe(false)
    })

    it('should handle undefined wallet gracefully', () => {
      expect(isWalletSupportedOnNetwork('INVALID' as any, 'VOI')).toBe(false)
    })
  })
})
