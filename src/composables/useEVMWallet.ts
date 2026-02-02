import { ref, computed } from "vue";
import type { EVMNetworkId, EVMNetworkInfo } from "./useWalletManager";
import { EVM_NETWORKS } from "./useWalletManager";
import {
  WalletConnectionState,
  WalletErrorType,
  type WalletError,
  parseWalletError,
  retryWithBackoff,
  DEFAULT_RETRY_CONFIG,
  getTroubleshootingSteps,
} from "./walletState";
import { telemetryService } from "../services/TelemetryService";

export interface EVMWalletState {
  isConnected: boolean;
  activeAddress: string | null;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
  connectionState: WalletConnectionState;
  lastError: WalletError | null;
  balanceLastUpdated: Date | null;
}

/**
 * Composable for managing EVM wallet connections (MetaMask, etc.)
 * Uses the browser's native ethereum provider (window.ethereum)
 */
export function useEVMWallet() {
  const walletState = ref<EVMWalletState>({
    isConnected: false,
    activeAddress: null,
    chainId: null,
    isConnecting: false,
    error: null,
    connectionState: WalletConnectionState.DISCONNECTED,
    lastError: null,
    balanceLastUpdated: null,
  });

  const previousState = ref<WalletConnectionState>(WalletConnectionState.DISCONNECTED);

  // Check if ethereum provider is available
  const isEthereumAvailable = computed(() => {
    return typeof window !== "undefined" && typeof window.ethereum !== "undefined";
  });

  // Computed properties
  const isConnected = computed(() => walletState.value.isConnected);
  const activeAddress = computed(() => walletState.value.activeAddress);
  const chainId = computed(() => walletState.value.chainId);
  const formattedAddress = computed(() => {
    if (!activeAddress.value) return null;
    return `${activeAddress.value.slice(0, 6)}...${activeAddress.value.slice(-4)}`;
  });

  // Get current network info
  const currentNetwork = computed((): EVMNetworkInfo | null => {
    if (!chainId.value) return null;
    const network = Object.values(EVM_NETWORKS).find((n) => n.chainId === chainId.value);
    return network || null;
  });

  /**
   * Transition wallet state and track telemetry
   */
  const transitionState = (newState: WalletConnectionState, error?: WalletError) => {
    const oldState = walletState.value.connectionState;
    previousState.value = oldState;
    walletState.value.connectionState = newState;

    if (error) {
      walletState.value.lastError = error;
      walletState.value.error = error.message;
    } else if (newState !== WalletConnectionState.FAILED) {
      walletState.value.lastError = null;
      walletState.value.error = null;
    }

    // Track state transition
    telemetryService.trackWalletStateTransition({
      fromState: oldState,
      toState: newState,
      walletId: 'metamask',
      network: currentNetwork.value?.id,
    });

    console.log(`[EVM Wallet] State transition: ${oldState} → ${newState}`);
  };

  /**
   * Detect Ethereum provider with retry logic
   */
  const detectProvider = async (): Promise<boolean> => {
    transitionState(WalletConnectionState.DETECTING);

    try {
      const result = await retryWithBackoff(
        async () => {
          if (!isEthereumAvailable.value) {
            throw new Error("No Ethereum provider detected");
          }
          return true;
        },
        DEFAULT_RETRY_CONFIG,
        (attempt, error) => {
          telemetryService.trackWalletDetection({
            walletId: 'metamask',
            attempt,
            success: false,
            errorType: error.message,
          });
          console.log(`[EVM Wallet] Detection retry ${attempt}: ${error.message}`);
        }
      );

      telemetryService.trackWalletDetection({
        walletId: 'metamask',
        attempt: DEFAULT_RETRY_CONFIG.maxRetries,
        success: true,
      });

      return result;
    } catch (error) {
      const walletError = parseWalletError(error, "Detect Ethereum provider");
      transitionState(WalletConnectionState.FAILED, walletError);
      
      telemetryService.trackWalletConnectionFailure({
        walletId: 'metamask',
        errorType: walletError.type,
        errorMessage: walletError.message,
        diagnosticCode: walletError.diagnosticCode,
      });

      return false;
    }
  };

  /**
   * Connect to MetaMask or other EVM wallet
   */
  const connect = async () => {
    // Detect provider first
    const detected = await detectProvider();
    if (!detected) {
      const error = parseWalletError(
        new Error("No Ethereum wallet detected. Please install MetaMask or another EVM wallet."),
        "Connect EVM wallet"
      );
      transitionState(WalletConnectionState.FAILED, error);
      throw new Error(error.message);
    }

    walletState.value.isConnecting = true;
    transitionState(WalletConnectionState.CONNECTING);

    try {
      // Request account access
      const accounts = await window.ethereum!.request({
        method: "eth_requestAccounts",
      });

      // Get chain ID
      const chainIdHex = await window.ethereum!.request({
        method: "eth_chainId",
      });
      const chainIdNum = parseInt(chainIdHex, 16);

      walletState.value = {
        ...walletState.value,
        isConnected: true,
        activeAddress: accounts[0],
        chainId: chainIdNum,
        isConnecting: false,
      };

      transitionState(WalletConnectionState.CONNECTED);

      // Setup event listeners
      setupEventListeners();

      // Track successful connection
      telemetryService.trackWalletConnect({
        walletId: 'metamask',
        network: currentNetwork.value?.id || 'unknown',
        address: accounts[0],
      });
    } catch (error) {
      console.error("Failed to connect EVM wallet:", error);
      const walletError = parseWalletError(error, "Connect EVM wallet");
      transitionState(WalletConnectionState.FAILED, walletError);

      telemetryService.trackWalletConnectionFailure({
        walletId: 'metamask',
        errorType: walletError.type,
        errorMessage: walletError.message,
        diagnosticCode: walletError.diagnosticCode,
      });

      walletState.value.isConnecting = false;
      throw error;
    }
  };

  /**
   * Disconnect EVM wallet
   */
  const disconnect = async () => {
    walletState.value = {
      isConnected: false,
      activeAddress: null,
      chainId: null,
      isConnecting: false,
      error: null,
      connectionState: WalletConnectionState.DISCONNECTED,
      lastError: null,
      balanceLastUpdated: null,
    };
    transitionState(WalletConnectionState.DISCONNECTED);
  };

  /**
   * Switch to a different EVM network
   */
  const switchNetwork = async (networkId: EVMNetworkId) => {
    if (!isEthereumAvailable.value || !isConnected.value) {
      const error = parseWalletError(new Error("Wallet not connected"), "Switch EVM network");
      transitionState(WalletConnectionState.FAILED, error);
      throw new Error(error.message);
    }

    const network = EVM_NETWORKS[networkId];
    if (!network) {
      const error = parseWalletError(new Error(`Network ${networkId} not found`), "Switch EVM network");
      transitionState(WalletConnectionState.FAILED, error);
      throw new Error(error.message);
    }

    const fromNetwork = currentNetwork.value?.id || 'unknown';
    transitionState(WalletConnectionState.SWITCHING_NETWORK);

    try {
      // Try to switch to the network
      await window.ethereum!.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${network.chainId.toString(16)}` }],
      });

      walletState.value.chainId = network.chainId;
      transitionState(WalletConnectionState.CONNECTED);

      telemetryService.trackNetworkSwitch({
        fromNetwork,
        toNetwork: networkId,
      });
    } catch (error: any) {
      // If the network is not added to the wallet, add it
      if (error.code === 4902) {
        try {
          await window.ethereum!.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${network.chainId.toString(16)}`,
                chainName: network.displayName,
                nativeCurrency: network.nativeCurrency,
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: [network.blockExplorerUrl],
              },
            ],
          });

          walletState.value.chainId = network.chainId;
          transitionState(WalletConnectionState.CONNECTED);

          telemetryService.trackNetworkSwitch({
            fromNetwork,
            toNetwork: networkId,
          });
        } catch (addError) {
          console.error("Failed to add network:", addError);
          const walletError = parseWalletError(addError, "Add EVM network");
          transitionState(WalletConnectionState.FAILED, walletError);

          telemetryService.trackNetworkSwitchFailure({
            fromNetwork,
            toNetwork: networkId,
            errorType: walletError.type,
            errorMessage: walletError.message,
          });

          throw addError;
        }
      } else {
        console.error("Failed to switch network:", error);
        const walletError = parseWalletError(error, "Switch EVM network");
        transitionState(WalletConnectionState.FAILED, walletError);

        telemetryService.trackNetworkSwitchFailure({
          fromNetwork,
          toNetwork: networkId,
          errorType: walletError.type,
          errorMessage: walletError.message,
        });

        throw error;
      }
    }
  };

  /**
   * Setup event listeners for account and network changes
   */
  const setupEventListeners = () => {
    if (!isEthereumAvailable.value) return;

    // Listen for account changes
    window.ethereum!.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        disconnect();
      } else {
        walletState.value.activeAddress = accounts[0];
      }
    });

    // Listen for chain changes
    window.ethereum!.on("chainChanged", (chainIdHex: string) => {
      const chainIdNum = parseInt(chainIdHex, 16);
      walletState.value.chainId = chainIdNum;
      
      // Note: MetaMask recommends page reload on chain change
      // to avoid any inconsistent state. This is the recommended practice.
      console.warn("Network changed. Reloading page to ensure consistent state...");
      window.location.reload();
    });
  };

  /**
   * Attempt to reconnect on page load
   */
  const attemptReconnect = async () => {
    if (!isEthereumAvailable.value) return;

    try {
      // Check if already connected
      const accounts = await window.ethereum!.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        const chainIdHex = await window.ethereum!.request({
          method: "eth_chainId",
        });
        const chainIdNum = parseInt(chainIdHex, 16);

        walletState.value = {
          ...walletState.value,
          isConnected: true,
          activeAddress: accounts[0],
          chainId: chainIdNum,
          isConnecting: false,
        };

        transitionState(WalletConnectionState.CONNECTED);

        setupEventListeners();
      }
    } catch (error) {
      console.warn("Failed to reconnect EVM wallet:", error);
      const walletError = parseWalletError(error, "Reconnect EVM wallet");
      transitionState(WalletConnectionState.FAILED, walletError);
    }
  };

  /**
   * Retry connection after failure
   */
  const retryConnection = async () => {
    // Clear previous error
    walletState.value.error = null;
    walletState.value.lastError = null;

    await connect();
  };

  return {
    // State
    walletState,
    isConnected,
    activeAddress,
    chainId,
    formattedAddress,
    currentNetwork,
    isEthereumAvailable,

    // Actions
    connect,
    disconnect,
    switchNetwork,
    attemptReconnect,
    retryConnection,

    // Helper functions
    getTroubleshootingSteps: (errorType: WalletErrorType) => getTroubleshootingSteps(errorType),
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}
