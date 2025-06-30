import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface Token {
  id: string;
  name: string;
  symbol: string;
  standard: "ASA" | "ARC3FT" | "ARC3NFT" | "ARC3FNFT" | "ARC200" | "ARC72" | "ERC20" | "ERC721";
  type: "FT" | "NFT";
  supply: number;
  decimals?: number;
  description: string;
  imageUrl?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
  status: "created" | "deploying" | "deployed" | "failed";
  createdAt: Date;
  txId?: string;
  assetId?: number;
  contractAddress?: string;
}
import { CubeIcon, CurrencyDollarIcon, PhotoIcon } from "@heroicons/vue/24/outline";

export const useTokenStore = defineStore("tokens", () => {
  const tokens = ref<Token[]>([]);
  const isLoading = ref(false);

  const tokensByStandard = computed(() => {
    const grouped = tokens.value.reduce(
      (acc, token) => {
        if (!acc[token.standard]) {
          acc[token.standard] = [];
        }
        acc[token.standard].push(token);
        return acc;
      },
      {} as Record<string, Token[]>
    );
    return grouped;
  });

  const totalTokens = computed(() => tokens.value.length);
  const deployedTokens = computed(() => tokens.value.filter((t) => t.status === "deployed").length);
  const failedTokens = computed(() => tokens.value.filter((t) => t.status === "failed").length);

  const createToken = async (tokenData: Omit<Token, "id" | "status" | "createdAt">) => {
    isLoading.value = true;

    try {
      const newToken: Token = {
        ...tokenData,
        id: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: "deploying",
        createdAt: new Date(),
      };

      tokens.value.push(newToken);

      // Simulate deployment process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful deployment
      const tokenIndex = tokens.value.findIndex((t) => t.id === newToken.id);
      if (tokenIndex !== -1) {
        tokens.value[tokenIndex].status = "deployed";
        tokens.value[tokenIndex].txId = `tx_${Math.random().toString(36).substr(2, 20)}`;

        if (newToken.standard.startsWith("ARC")) {
          tokens.value[tokenIndex].assetId = Math.floor(Math.random() * 1000000) + 100000;
        } else {
          tokens.value[tokenIndex].contractAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
        }
      }

      return newToken;
    } catch (error) {
      console.error("Failed to create token:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteToken = (tokenId: string) => {
    const index = tokens.value.findIndex((t) => t.id === tokenId);
    if (index !== -1) {
      tokens.value.splice(index, 1);
    }
  };

  const updateTokenStatus = (tokenId: string, status: Token["status"]) => {
    const token = tokens.value.find((t) => t.id === tokenId);
    if (token) {
      token.status = status;
    }
  };
  const tokenStandards = [
    {
      name: "ASA",
      type: "Fungible",
      description: "Native Algorand ASA token without ARC3 metadata.",
      icon: CubeIcon,
      bgClass: "bg-gray-500",
      badgeVariant: "default" as const,
      statusColor: "bg-gray-500",
      network: "Algorand",
      count: 0,
    },
    {
      name: "ARC3 Fungible Token",
      type: "Fungible",
      description: "Native Algorand Standard Assets with built-in metadata support.",
      icon: CurrencyDollarIcon,
      bgClass: "bg-blue-500",
      badgeVariant: "info" as const,
      statusColor: "bg-blue-500",
      network: "Algorand",
      count: 0,
    },
    {
      name: "ARC3 NFT",
      type: "NFT",
      description: "Native Algorand ASA NFT with metadata like picture, project description and project URL stored in IPFS. The total supply is 1.",
      icon: CubeIcon,
      bgClass: "bg-orange-500",
      badgeVariant: "info" as const,
      statusColor: "bg-orange-500",
      network: "Algorand",
      count: 0,
    },
    {
      name: "ARC3 Fractional NFT",
      type: "NFT",
      description: "Native Algorand ASA NFT with metadata like picture, project description and project URL stored in IPFS. The total supply must be 10^decimals representation.",
      icon: CubeIcon,
      bgClass: "bg-orange-200",
      badgeVariant: "info" as const,
      statusColor: "bg-orange-200",
      network: "Algorand",
      count: 0,
    },
    {
      name: "ARC200",
      type: "Fungible",
      description: "Algorand smart contract tokens compatible with ERC20 standards and functionality.",
      icon: CurrencyDollarIcon,
      bgClass: "bg-green-500",
      badgeVariant: "success" as const,
      statusColor: "bg-green-500",
      network: "Algorand",
      count: 0,
    },
    {
      name: "ARC72",
      type: "NFT",
      description: "Algorand NFT standard with Ethereum-style functionality and metadata handling.",
      icon: PhotoIcon,
      bgClass: "bg-purple-500",
      badgeVariant: "default" as const,
      statusColor: "bg-green-500",
      network: "Algorand",
      count: 0,
    },
    {
      name: "ERC20",
      type: "Fungible",
      description: "Standard Ethereum fungible tokens with full EVM compatibility and features.",
      icon: CurrencyDollarIcon,
      bgClass: "bg-yellow-500",
      badgeVariant: "warning" as const,
      statusColor: "bg-yellow-500",
      network: "Ethereum",
      count: 0,
    },
    {
      name: "ERC721",
      type: "NFT",
      description: "Ethereum non-fungible tokens with rich metadata and ownership tracking capabilities.",
      icon: PhotoIcon,
      bgClass: "bg-pink-500",
      badgeVariant: "error" as const,
      statusColor: "bg-yellow-500",
      network: "Ethereum",
      count: 0,
    },
  ];
  return {
    tokens,
    tokensByStandard,
    isLoading,
    totalTokens,
    deployedTokens,
    failedTokens,
    createToken,
    deleteToken,
    updateTokenStatus,
    tokenStandards,
  };
});
