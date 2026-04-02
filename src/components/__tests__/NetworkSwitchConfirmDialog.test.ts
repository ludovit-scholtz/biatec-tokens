import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import NetworkSwitchConfirmDialog from '../NetworkSwitchConfirmDialog.vue'
import type { AVMNetworkInfo, EVMNetworkInfo } from '../../stores/network'

vi.mock('../ui/Modal.vue', () => ({
  default: {
    name: 'Modal',
    template: '<div v-if="show"><slot /></div>',
    props: ['show', 'size'],
  },
}))

const avmNetwork: AVMNetworkInfo = {
  id: 'algorand-mainnet' as any,
  name: 'algorand-mainnet',
  displayName: 'Algorand Mainnet',
  isTestnet: false,
  chainType: 'AVM',
  algodUrl: 'https://mainnet-api.algonode.cloud',
  genesisId: 'mainnet-v1.0',
}

const evmNetwork: EVMNetworkInfo = {
  id: 'ethereum-mainnet' as any,
  name: 'ethereum-mainnet',
  displayName: 'Ethereum Mainnet',
  isTestnet: false,
  chainType: 'EVM',
  chainId: 1,
  rpcUrl: 'https://mainnet.infura.io',
  blockExplorerUrl: 'https://etherscan.io',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
}

const testnetNetwork: EVMNetworkInfo = {
  id: 'ethereum-sepolia' as any,
  name: 'ethereum-sepolia',
  displayName: 'Ethereum Sepolia',
  isTestnet: true,
  chainType: 'EVM',
  chainId: 11155111,
  rpcUrl: 'https://sepolia.infura.io',
  blockExplorerUrl: 'https://sepolia.etherscan.io',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
}

const defaultProps = {
  show: true,
  currentNetwork: avmNetwork,
  targetNetwork: evmNetwork,
  warnings: [],
  requiresReconnection: false,
  crossChain: false,
}

function mountDialog(props = {}) {
  setActivePinia(createPinia())
  return mount(NetworkSwitchConfirmDialog, {
    props: { ...defaultProps, ...props },
  })
}

describe('NetworkSwitchConfirmDialog', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders when show is true', () => {
    const wrapper = mountDialog({ show: true })
    expect(wrapper.text()).toContain('Switch Network')
  })

  it('does not render when show is false', () => {
    const wrapper = mountDialog({ show: false })
    expect(wrapper.text()).not.toContain('Switch Network')
  })

  it('shows current and target network names', () => {
    const wrapper = mountDialog()
    expect(wrapper.text()).toContain('Algorand Mainnet')
    expect(wrapper.text()).toContain('Ethereum Mainnet')
  })

  it('shows AVM chain type for AVM network', () => {
    const wrapper = mountDialog()
    expect(wrapper.text()).toContain('AVM Chain')
  })

  it('shows EVM chain ID for EVM target network', () => {
    const wrapper = mountDialog({ targetNetwork: evmNetwork })
    expect(wrapper.text()).toContain('Chain ID: 1')
  })

  it('shows genesisId for AVM current network', () => {
    const wrapper = mountDialog()
    expect(wrapper.text()).toContain('mainnet-v1.0')
  })

  it('shows crossChain warning when crossChain is true', () => {
    const wrapper = mountDialog({ crossChain: true })
    expect(wrapper.text()).toContain('Cross-Chain Switch Detected')
  })

  it('does not show crossChain warning when crossChain is false', () => {
    const wrapper = mountDialog({ crossChain: false })
    expect(wrapper.text()).not.toContain('Cross-Chain Switch Detected')
  })

  it('shows testnet warning for testnet target network', () => {
    const wrapper = mountDialog({ targetNetwork: testnetNetwork })
    expect(wrapper.text()).toContain('Testnet Network')
  })

  it('does not show testnet warning for mainnet target network', () => {
    const wrapper = mountDialog({ targetNetwork: evmNetwork })
    expect(wrapper.text()).not.toContain('Testnet Network')
  })

  it('shows warnings list when warnings provided', () => {
    const wrapper = mountDialog({ warnings: ['Your tokens will be frozen'] })
    expect(wrapper.text()).toContain('Your tokens will be frozen')
  })

  it('shows requires reconnection message', () => {
    const wrapper = mountDialog({ requiresReconnection: true })
    expect(wrapper.text()).toContain('disconnecting your wallet')
  })

  it('shows standard message when reconnection not required', () => {
    const wrapper = mountDialog({ requiresReconnection: false })
    expect(wrapper.text()).toContain('Switch to a different blockchain network')
  })

  it('emits confirm when confirm button clicked', async () => {
    const wrapper = mountDialog()
    const confirmBtn = wrapper.find('button[class*="biatec-accent"]')
    await confirmBtn.trigger('click')
    expect(wrapper.emitted('confirm')).toBeTruthy()
  })

  it('emits cancel when cancel button clicked', async () => {
    const wrapper = mountDialog()
    const cancelBtn = wrapper.find('button[class*="py-3"][class*="bg-white"]')
    await cancelBtn.trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('emits cancel when close icon clicked', async () => {
    const wrapper = mountDialog()
    const closeBtn = wrapper.find('button[aria-label="Close dialog"]')
    await closeBtn.trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('shows Switching... and spinner when isSwitching is true', () => {
    const wrapper = mountDialog({ isSwitching: true })
    expect(wrapper.text()).toContain('Switching...')
  })

  it('shows Confirm Switch when isSwitching is false', () => {
    const wrapper = mountDialog({ isSwitching: false })
    expect(wrapper.text()).toContain('Confirm Switch')
  })

  it('disables confirm button when isSwitching', () => {
    const wrapper = mountDialog({ isSwitching: true })
    const confirmBtn = wrapper.find('button[disabled]')
    expect(confirmBtn.exists()).toBe(true)
  })

  it('shows AVM genesisId for AVM target network', () => {
    const wrapper = mountDialog({ targetNetwork: avmNetwork, currentNetwork: evmNetwork })
    expect(wrapper.text()).toContain('mainnet-v1.0')
  })

  it('shows EVM chain ID for EVM current network', () => {
    const wrapper = mountDialog({ currentNetwork: evmNetwork, targetNetwork: avmNetwork })
    expect(wrapper.text()).toContain('Chain ID: 1')
  })
})
