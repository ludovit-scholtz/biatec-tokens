# Token Standards Comprehensive Guide

## Executive Summary

Biatec Tokens platform supports **8 comprehensive token standards** across both Algorand (AVM) and Ethereum (EVM) blockchain ecosystems. This guide provides complete documentation for developers, issuers, and integrators.

**Platform Architecture:** Email/password authentication only - **NO wallet connectors**. All blockchain interactions are handled by backend services via ARC76 account derivation.

**Target Audience:** Non-crypto native persons and traditional businesses who need regulated token issuance without blockchain or wallet expertise.

---

## Supported Token Standards Overview

### Algorand Standards (AVM Chains)

| Standard | Type | Use Case | Metadata | Mutability |
|----------|------|----------|----------|------------|
| **ASA** | Fungible/NFT | Basic tokens | None | Configurable |
| **ARC-3** | Fungible/NFT | Rich metadata tokens | External JSON | Immutable (with hash) |
| **ARC-19** | NFT | Mutable NFTs | Template IPFS | Mutable |
| **ARC-69** | NFT | On-chain metadata | Inline JSON (1KB) | Mutable |
| **ARC-200** | Fungible | Smart contract tokens | JSON | Immutable |
| **ARC-72** | NFT | Advanced NFTs | JSON | Configurable |

### Ethereum Standards (EVM Chains)

| Standard | Type | Use Case | Metadata | Networks Supported |
|----------|------|----------|----------|-------------------|
| **ERC-20** | Fungible | Fungible tokens | None | Ethereum, Arbitrum, Base |
| **ERC-721** | NFT | Non-fungible tokens | Token URI | Ethereum, Arbitrum, Base |

---

## Detailed Standard Specifications

### 1. ASA (Algorand Standard Asset)

**Description:** Native Algorand asset without metadata standards. Simple, efficient, and widely compatible.

**Key Features:**
- Native blockchain support (no smart contract overhead)
- Low transaction fees (0.001 ALGO)
- Freezing and clawback capabilities
- Configurable decimals for fungible tokens
- Reserve address for fund management

**Best For:**
- Simple fungible tokens without metadata requirements
- High-volume transactions requiring low fees
- Tokens requiring freeze/clawback controls
- Internal company tokens or credits

**Configuration Parameters:**
```typescript
{
  name: string;           // Asset name (max 32 bytes)
  unitName: string;       // Ticker symbol (max 8 bytes)
  total: number;          // Total supply
  decimals: number;       // Decimal places (0-19)
  url?: string;           // Optional asset URL (max 96 bytes)
  reserve?: string;       // Reserve address
  freeze?: string;        // Freeze address
  clawback?: string;      // Clawback address
  manager?: string;       // Manager address
}
```

**Wallet Compatibility:**
- ✅ Pera Wallet: Good display
- ✅ Defly Wallet: Good display
- ✅ Lute Wallet: Good display
- ✅ Exodus Wallet: Good display

**Migration Path:**
- To ARC-3: Add metadata URL and optional hash
- To ARC-19: Use template-ipfs:// URL with reserve
- To ARC-69: Add inline metadata in note field

---

### 2. ARC-3 (Rich Metadata Standard)

**Description:** External metadata standard using JSON hosted on HTTPS or IPFS. Provides rich display in wallets and marketplaces.

**Key Features:**
- External JSON metadata with image support
- Optional SHA-256 hash for immutability verification
- IPFS or HTTPS hosting
- Full compatibility with major wallets
- Supports both fungible and NFT use cases

**Best For:**
- NFT collections with images and descriptions
- Fractional NFTs (total > 1, decimals > 0)
- Tokens requiring rich metadata display
- Marketplace-ready tokens

**Configuration Parameters:**
```typescript
{
  // Base ASA params
  name: string;
  unitName: string;
  total: number;
  decimals: number;
  
  // ARC-3 specific
  url: string;            // Must end with #arc3
  metadata?: {
    name: string;
    description?: string;
    image?: string;
    image_integrity?: string;
    image_mimetype?: string;
    external_url?: string;
    animation_url?: string;
    properties?: Record<string, any>;
  };
  metadataHash?: string;  // SHA-256 hash (recommended)
}
```

**Metadata JSON Structure:**
```json
{
  "name": "My NFT #1",
  "description": "A unique digital collectible",
  "image": "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
  "image_integrity": "sha256-...",
  "image_mimetype": "image/png",
  "external_url": "https://example.com/token/1",
  "properties": {
    "trait_type": "Rarity",
    "value": "Legendary"
  }
}
```

**Validation Requirements:**
- ✅ URL must end with `#arc3`
- ✅ URL should use `https://` or `ipfs://` scheme
- ✅ Metadata hash recommended for immutability
- ✅ For NFTs: `total=1` and `decimals=0`

**Wallet Compatibility:**
- ✅ Pera Wallet: Excellent (images, metadata, IPFS)
- ✅ Defly Wallet: Excellent (NFT collections, marketplace)
- ✅ Lute Wallet: Good (HTTPS preferred over IPFS)
- ❌ Exodus Wallet: Poor (displays as plain ASA)

**Reference:** [ARC-3 Specification](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0003.md)

---

### 3. ARC-19 (Mutable NFT Standard)

**Description:** Template-based metadata URL that resolves dynamically using reserve address. Enables metadata updates without redeployment.

**Key Features:**
- Mutable metadata via reserve address updates
- Template IPFS URL with placeholder
- Dynamic metadata resolution
- Creator can update metadata post-mint
- Useful for evolving NFTs

**Best For:**
- Gaming NFTs with upgradeable attributes
- Dynamic art NFTs
- Tokens where metadata may need updates
- Experimental/iterative NFT projects

**Configuration Parameters:**
```typescript
{
  // Base ASA params
  name: string;
  unitName: string;
  total: 1;              // Typically 1 for NFTs
  decimals: 0;           // Typically 0 for NFTs
  
  // ARC-19 specific
  url: string;           // template-ipfs://{ipfscid:...}
  reserve: string;       // REQUIRED - contains metadata CID
  manager?: string;      // Allows reserve updates
}
```

**Template URL Format:**
```
template-ipfs://{ipfscid:0:dag-pb:reserve:sha2-256}
template-ipfs://{ipfscid:1:raw:reserve:sha2-256}
```

**How It Works:**
1. Reserve address is set to contain IPFS CID
2. Wallet resolves `{ipfscid:...}` placeholder using reserve
3. Metadata is fetched from resolved IPFS URL
4. Manager can update reserve address to change metadata

**Validation Requirements:**
- ✅ URL must start with `template-ipfs://`
- ✅ Reserve address must be set
- ✅ URL should contain `{ipfscid:...}` placeholder
- ⚠️ Manager address enables mutability (document policy)

**Wallet Compatibility:**
- ✅ Pera Wallet: Excellent (dynamic resolution)
- ✅ Defly Wallet: Good (may have update delays)
- ⚠️ Lute Wallet: Partial (may not resolve template)
- ❌ Exodus Wallet: Poor (displays as plain ASA)

**Reference:** [ARC-19 Specification](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0019.md)

---

### 4. ARC-69 (On-Chain Metadata Standard)

**Description:** Inline metadata stored in transaction note field. All metadata lives on-chain with 1KB limit.

**Key Features:**
- On-chain metadata (no external hosting)
- 1024 byte limit
- Stored in asset configuration transaction note
- Mutable via manager
- Lower display quality than ARC-3/19

**Best For:**
- Simple NFTs with basic metadata
- Tokens requiring censorship resistance
- Applications needing fully on-chain data
- Low-budget projects (no hosting costs)

**Configuration Parameters:**
```typescript
{
  // Base ASA params
  name: string;
  unitName: string;
  total: number;
  decimals: number;
  
  // ARC-69 specific
  inlineMetadata: string;  // JSON string (max 1024 bytes)
}
```

**Metadata JSON Structure:**
```json
{
  "standard": "arc69",
  "description": "A simple on-chain NFT",
  "media_url": "ipfs://...",
  "properties": {
    "trait": "value"
  }
}
```

**Validation Requirements:**
- ✅ Metadata must be valid JSON
- ✅ Size must be ≤ 1024 bytes
- ✅ Should include `"standard": "arc69"` field
- ✅ Description recommended

**Wallet Compatibility:**
- ✅ Pera Wallet: Good (displays media_url)
- ✅ Defly Wallet: Good (parses note JSON)
- ⚠️ Lute Wallet: Partial (limited parsing)
- ❌ Exodus Wallet: Poor (displays as plain ASA)

**Reference:** [ARC-69 Specification](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0069.md)

---

### 5. ARC-200 (Fungible Token Smart Contract)

**Description:** Smart contract-based fungible token standard with MICA compliance metadata support.

**Key Features:**
- Smart contract implementation
- Built-in compliance metadata
- MICA regulation support
- Transfer restrictions capability
- KYC/whitelist integration

**Best For:**
- Regulated tokens (securities, e-money)
- Compliance-first issuers
- Tokens requiring transfer restrictions
- MICA-compliant European tokens

**Configuration Parameters:**
```typescript
{
  // Base params
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  
  // MICA compliance
  micaCompliance?: {
    issuerLegalName: string;
    issuerRegistrationNumber: string;
    issuerJurisdiction: string;
    regulatoryLicense?: string;
    micaTokenClassification: 'utility' | 'e-money' | 'asset-referenced';
    tokenPurpose: string;
    kycRequired: boolean;
    restrictedJurisdictions?: string[];
    complianceContactEmail: string;
    whitepaperUrl?: string;
  };
}
```

**Wallet Compatibility:**
- ⚠️ Limited wallet support (emerging standard)
- ✅ Backend integration for transfers
- ✅ Compliance dashboard in Biatec platform

**Reference:** [ARC-200 Specification](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0200.md)

---

### 6. ARC-72 (Advanced NFT Standard)

**Description:** Advanced NFT standard with comprehensive metadata and royalty support.

**Key Features:**
- Rich metadata support
- Royalty management
- Collection-level metadata
- Enhanced marketplace integration
- Advanced property structures

**Best For:**
- Professional NFT collections
- Tokens requiring royalty splits
- Complex metadata requirements
- Marketplace-optimized NFTs

**Configuration Parameters:**
```typescript
{
  name: string;
  symbol: string;
  baseURI: string;
  royaltyRecipient?: string;
  royaltyPercentage?: number;
  metadata: {
    name: string;
    description: string;
    image: string;
    properties?: Record<string, any>;
    attributes?: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
}
```

**Wallet Compatibility:**
- ⚠️ Emerging standard - wallet support varies
- ✅ Supported by major NFT marketplaces
- ✅ Backend integration available

**Reference:** [ARC-72 Specification](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0072.md)

---

### 7. ERC-20 (Ethereum Fungible Token)

**Description:** Industry-standard fungible token on Ethereum and EVM-compatible chains.

**Key Features:**
- Widely adopted standard (since 2015)
- Massive ecosystem support
- Cross-chain bridges available
- DeFi integration ready
- High liquidity potential

**Best For:**
- Multi-chain token strategies
- DeFi integrations
- Maximum ecosystem compatibility
- Large-scale token launches

**Configuration Parameters:**
```typescript
{
  standard: 'ERC20';
  name: string;
  symbol: string;
  decimals: number;         // Typically 18
  totalSupply: string;      // In wei (smallest unit)
  walletAddress: string;    // Deployer address
}
```

**Networks Supported:**
- Ethereum Mainnet
- Arbitrum (Layer 2)
- Base (Coinbase Layer 2)
- Sepolia Testnet

**Wallet Compatibility:**
- ✅ MetaMask: Excellent
- ✅ Coinbase Wallet: Excellent
- ✅ WalletConnect: Excellent
- ✅ All major EVM wallets

**Reference:** [ERC-20 Specification](https://eips.ethereum.org/EIPS/eip-20)

---

### 8. ERC-721 (Ethereum NFT Standard)

**Description:** Non-fungible token standard for unique digital assets on Ethereum.

**Key Features:**
- Each token is unique
- Rich metadata via tokenURI
- Marketplace integration (OpenSea, Rarible)
- Royalty support (ERC-2981 extension)
- Transfer history tracking

**Best For:**
- Digital art and collectibles
- Gaming assets
- Real-world asset tokenization
- Membership tokens

**Configuration Parameters:**
```typescript
{
  standard: 'ERC721';
  name: string;
  symbol: string;
  baseURI: string;          // Metadata base URL
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes?: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
}
```

**Networks Supported:**
- Ethereum Mainnet
- Arbitrum (Layer 2)
- Base (Coinbase Layer 2)
- Sepolia Testnet

**Wallet Compatibility:**
- ✅ MetaMask: Excellent
- ✅ Coinbase Wallet: Excellent
- ✅ Rainbow Wallet: Excellent
- ✅ All major EVM wallets

**Reference:** [ERC-721 Specification](https://eips.ethereum.org/EIPS/eip-721)

---

## Standards Comparison Matrix

### Feature Comparison

| Feature | ASA | ARC-3 | ARC-19 | ARC-69 | ARC-200 | ARC-72 | ERC-20 | ERC-721 |
|---------|-----|-------|--------|--------|---------|--------|--------|---------|
| **Metadata** | None | External | Template | On-chain | JSON | JSON | None | URI |
| **Mutability** | Config | Immutable* | Mutable | Mutable | Immutable | Config | Immutable | Mutable |
| **Hosting Cost** | None | External | External | None | None | External | None | External |
| **Wallet Support** | ★★★★ | ★★★★★ | ★★★★ | ★★★ | ★★ | ★★★ | ★★★★★ | ★★★★★ |
| **Gas/Fees** | Low | Low | Low | Low | Medium | Medium | High | High |
| **Compliance** | Basic | Basic | Basic | Basic | ★★★★★ | ★★★ | Basic | Basic |
| **Best For** | Simple | NFTs | Dynamic | On-chain | Regulated | Advanced | DeFi | Art/Gaming |

*Immutable if metadata hash provided

### Cost Comparison

| Standard | Creation Cost | Transfer Cost | Hosting Cost |
|----------|---------------|---------------|--------------|
| ASA | 0.1 ALGO | 0.001 ALGO | $0 |
| ARC-3 | 0.1 ALGO | 0.001 ALGO | $0-5/month |
| ARC-19 | 0.1 ALGO | 0.001 ALGO | $0-5/month |
| ARC-69 | 0.1 ALGO | 0.001 ALGO | $0 |
| ARC-200 | ~0.5 ALGO | 0.002 ALGO | $0 |
| ARC-72 | ~0.5 ALGO | 0.002 ALGO | $0-5/month |
| ERC-20 | $5-50 | $1-10 | $0 |
| ERC-721 | $20-200 | $2-20 | $0-10/month |

*Ethereum costs vary significantly with gas prices

---

## Standard Selection Guide

### Decision Tree

```
START
  │
  ├─ Need EVM compatibility? → YES → ERC-20 (fungible) or ERC-721 (NFT)
  │                            NO ↓
  │
  ├─ Need compliance/MICA? → YES → ARC-200
  │                         NO ↓
  │
  ├─ Need metadata? → NO → ASA (simple, efficient)
  │                  YES ↓
  │
  ├─ Metadata must be on-chain? → YES → ARC-69 (1KB limit)
  │                                NO ↓
  │
  ├─ Metadata may change? → YES → ARC-19 (mutable via reserve)
  │                         NO ↓
  │
  └─ Rich metadata, immutable → ARC-3 (recommended for NFTs)
```

### Use Case Recommendations

**Internal Company Tokens:**
- Recommended: ASA or ARC-200 (with compliance)
- Why: Low cost, simple, configurable controls

**NFT Art Collections:**
- Recommended: ARC-3 or ERC-721
- Why: Rich metadata, excellent wallet support, marketplace ready

**Gaming Assets:**
- Recommended: ARC-19 (upgradeable) or ARC-72 (advanced)
- Why: Mutable metadata for attribute changes

**Regulated Securities:**
- Recommended: ARC-200 only
- Why: Built-in MICA compliance, transfer restrictions

**Simple Utility Tokens:**
- Recommended: ASA (Algorand) or ERC-20 (Ethereum)
- Why: Maximum compatibility, lowest complexity

**High-Volume Transactions:**
- Recommended: ASA or ARC-200
- Why: Algorand's low fees and high throughput

---

## Validation and Best Practices

### Pre-Deployment Checklist

**All Standards:**
- [ ] Token name is clear and professional
- [ ] Unit name/symbol follows conventions (3-8 characters)
- [ ] Decimals set correctly (0 for NFTs, 18 for ERC-20)
- [ ] Total supply matches business requirements
- [ ] Manager addresses set appropriately
- [ ] Compliance requirements reviewed

**ARC-3 Specific:**
- [ ] Metadata URL ends with `#arc3`
- [ ] URL uses https:// or ipfs:// scheme
- [ ] Metadata JSON is valid and hosted
- [ ] Metadata hash calculated (if immutability required)
- [ ] Images tested in wallets

**ARC-19 Specific:**
- [ ] URL uses `template-ipfs://` scheme
- [ ] Reserve address contains valid CID
- [ ] Template placeholder correct format
- [ ] Mutability policy documented

**ARC-69 Specific:**
- [ ] Metadata JSON is valid
- [ ] Size ≤ 1024 bytes
- [ ] Standard field included
- [ ] Media URLs accessible

**ERC-20/721 Specific:**
- [ ] Gas estimation performed
- [ ] Testnet deployment verified
- [ ] Smart contract audited (if significant value)

### Common Pitfalls to Avoid

❌ **ARC-3: Missing #arc3 suffix**
- Wallets won't recognize standard
- Fix: Always append `#arc3` to URL

❌ **ARC-19: No reserve address**
- Template cannot resolve
- Fix: Set reserve with valid CID

❌ **ARC-69: Metadata too large**
- Transaction will fail
- Fix: Keep under 1KB or use ARC-3

❌ **NFTs: Decimals > 0**
- Marketplaces won't recognize as NFT
- Fix: Set `decimals=0` and `total=1` for unique NFTs

❌ **ERC-20: Wrong decimal places**
- Display issues in wallets
- Fix: Use 18 decimals (standard) unless specific reason

---

## API Integration Examples

### Creating ASA Token

```typescript
import { TokenStandard } from '@/types/api';
import { tokenDeploymentService } from '@/services/TokenDeploymentService';

const asaRequest = {
  standard: TokenStandard.ASA,
  name: 'My Utility Token',
  unitName: 'MUT',
  total: 1000000,
  decimals: 6,
  walletAddress: 'ALGORAND_ADDRESS',
  description: 'Platform utility token'
};

const result = await tokenDeploymentService.deployToken(asaRequest);
console.log(`Token created: ${result.tokenId}`);
```

### Creating ARC-3 NFT

```typescript
const arc3Request = {
  standard: TokenStandard.ARC3,
  name: 'Biatec Genesis NFT',
  unitName: 'BGNFT',
  total: 1,
  decimals: 0,
  url: 'ipfs://QmXoypiz...#arc3',
  metadata: {
    name: 'Genesis #1',
    description: 'First NFT in Biatec collection',
    image: 'ipfs://QmXoypiz...',
    properties: {
      rarity: 'Legendary',
      edition: 1
    }
  },
  metadataHash: 'sha256-...',
  walletAddress: 'ALGORAND_ADDRESS'
};

const result = await tokenDeploymentService.deployToken(arc3Request);
```

### Creating ERC-20 Token

```typescript
const erc20Request = {
  standard: TokenStandard.ERC20,
  name: 'Biatec Utility',
  symbol: 'BIAT',
  decimals: 18,
  totalSupply: '1000000000000000000000000', // 1M tokens in wei
  walletAddress: '0x1234...', // EVM address
  description: 'Multi-chain utility token'
};

const result = await tokenDeploymentService.deployToken(erc20Request);
```

---

## Migration Guides

### ASA to ARC-3 Migration

**Scenario:** You have a plain ASA and want to add rich metadata.

**Steps:**
1. Create new ARC-3 token with metadata
2. Communicate migration to community
3. Set up token swap mechanism:
   - Users send old ASA to burn address
   - Receive new ARC-3 token in return
4. Update all integrations to use new asset ID

**Code Example:**
```typescript
// Old ASA config
const oldToken = {
  standard: TokenStandard.ASA,
  name: 'Old Token',
  unitName: 'OLD'
};

// New ARC-3 config (maintain same economics)
const newToken = {
  standard: TokenStandard.ARC3,
  name: 'Old Token', // Same name
  unitName: 'OLD', // Same unit
  total: oldToken.total,
  decimals: oldToken.decimals,
  url: 'ipfs://metadata#arc3',
  metadata: { /* rich metadata */ }
};
```

### ARC-3 to ARC-19 Migration

**Scenario:** Need to make immutable NFT metadata mutable.

**Note:** This requires creating a new token. NFTs cannot be "upgraded" in place.

**Considerations:**
- Explain to holders why metadata might change
- Document update policy clearly
- Consider community governance for updates

### Algorand to Ethereum Bridge

**Scenario:** Want to offer token on both ecosystems.

**Options:**
1. **Dual Deployment:** Independent tokens on each chain
   - No bridge required
   - Manual synchronization
   - Lower technical complexity

2. **Bridge Service:** Use third-party bridge
   - Wormhole Bridge
   - Portal Bridge
   - Requires liquidity on both sides

**Considerations:**
- Regulatory implications of multi-chain
- Liquidity management
- Security risks of bridges

---

## Standards Validator Service

The platform includes a comprehensive standards validator that provides:

- ✅ Pre-deployment validation with severity levels
- ✅ Actionable remediation guidance
- ✅ User story context for requirements
- ✅ Readiness scoring (0-100)
- ✅ Wallet compatibility assessment

**Validation Severities:**
- **Blocker:** Prevents deployment, must fix
- **Major:** Strong warning, affects functionality
- **Minor:** Recommendation, best practice

**Example Usage:**
```typescript
import { validateStandard } from '@/services/standardsValidator';

const validationResult = validateStandard('ARC3', {
  standard: 'ARC3',
  tokenConfig: {
    name: 'My Token',
    unitName: 'MT',
    decimals: 0,
    total: 1,
    url: 'ipfs://QmXyz#arc3'
  }
});

console.log(validationResult.readiness.score); // 95
console.log(validationResult.readiness.level); // 'excellent'
```

---

## Testing Your Token Standard

### Unit Testing Example

```typescript
import { describe, it, expect } from 'vitest';
import { validateARC3 } from '@/services/standardsValidator';

describe('ARC-3 Token Validation', () => {
  it('should require #arc3 suffix', () => {
    const issues = validateARC3({
      standard: 'ARC3',
      tokenConfig: {
        url: 'ipfs://QmXyz', // Missing #arc3
        name: 'Test',
        unitName: 'TST',
        decimals: 0,
        total: 1
      }
    });
    
    expect(issues).toContainEqual(
      expect.objectContaining({
        id: 'arc3-url-suffix',
        severity: 'blocker'
      })
    );
  });
});
```

### Integration Testing

```typescript
// Test full token creation flow
it('should create ARC-3 NFT end-to-end', async () => {
  const request = {
    standard: TokenStandard.ARC3,
    name: 'Test NFT',
    unitName: 'TNFT',
    total: 1,
    decimals: 0,
    url: 'https://example.com/metadata#arc3',
    walletAddress: testAddress
  };
  
  const result = await tokenDeploymentService.deployToken(request);
  
  expect(result.status).toBe('success');
  expect(result.tokenId).toBeDefined();
  expect(result.transactionId).toBeDefined();
});
```

---

## Troubleshooting Common Issues

### ARC-3: Wallet Not Showing Image

**Problem:** Token created but wallet shows no image.

**Solutions:**
1. Check URL ends with `#arc3`
2. Verify metadata JSON is valid
3. Ensure image URL is accessible (CORS headers)
4. Test IPFS URLs in multiple gateways
5. Confirm wallet has latest version

### ARC-19: Metadata Not Updating

**Problem:** Changed reserve but metadata still shows old content.

**Solutions:**
1. Wait 5-10 minutes for wallet cache refresh
2. Verify reserve address contains correct CID
3. Check CID format matches template spec
4. Test metadata URL resolution manually
5. Try force-refresh in wallet

### ERC-20: High Gas Fees

**Problem:** Deployment costs prohibitive.

**Solutions:**
1. Deploy on Layer 2 (Arbitrum, Base) for 10-100x lower fees
2. Deploy during off-peak hours
3. Use gas optimization tools
4. Consider Algorand for similar use case (1000x lower fees)

### General: Transaction Failing

**Problem:** Token creation transaction fails.

**Solutions:**
1. Check account has sufficient balance
2. Verify all addresses are valid
3. Review validation errors from API
4. Test on testnet first
5. Check network status

---

## Resources and References

### Official Specifications
- [Algorand Developer Portal](https://developer.algorand.org/)
- [ARC Standards Repository](https://github.com/algorandfoundation/ARCs)
- [Ethereum EIPs](https://eips.ethereum.org/)

### Platform Documentation
- [Biatec Tokens API](https://api.tokens.biatec.io/swagger)
- [Backend Repository](https://github.com/scholtz/BiatecTokensApi)
- [Frontend Repository](https://github.com/scholtz/biatec-tokens)

### Community Resources
- [Algorand Discord](https://discord.gg/algorand)
- [Ethereum Developer Portal](https://ethereum.org/en/developers/)

### Compliance Resources
- [EU MICA Regulation](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1114)
- [FATF Guidelines](https://www.fatf-gafi.org/)

---

## Appendix: Standards Validation Rules

### ARC-3 Validation Rules

| Rule ID | Severity | Description |
|---------|----------|-------------|
| arc3-url-suffix | Blocker | URL must end with #arc3 |
| arc3-url-missing | Blocker | URL is required |
| arc3-url-scheme | Major | Should use https:// or ipfs:// |
| arc3-hash-missing | Major | Metadata hash recommended |
| arc3-name-length | Minor | Name should be ≤50 chars |
| arc3-unit-length | Minor | Unit name should be ≤10 chars |
| arc3-nft-decimals | Major | NFTs should have decimals=0 |

### ARC-19 Validation Rules

| Rule ID | Severity | Description |
|---------|----------|-------------|
| arc19-url-scheme | Blocker | Must use template-ipfs:// |
| arc19-reserve-missing | Blocker | Reserve address required |
| arc19-manager-warning | Minor | Manager enables mutability |
| arc19-placeholder | Minor | Should have {ipfscid:...} placeholder |
| arc19-nft-decimals | Major | NFTs should have decimals=0 |

### ARC-69 Validation Rules

| Rule ID | Severity | Description |
|---------|----------|-------------|
| arc69-metadata-missing | Major | Inline metadata recommended |
| arc69-invalid-json | Blocker | Must be valid JSON |
| arc69-size-limit | Blocker | Must be ≤1024 bytes |
| arc69-standard-field | Minor | Should include "standard":"arc69" |
| arc69-description | Minor | Description field recommended |
| arc69-media-url | Minor | media_url should use https/ipfs |

---

**Document Version:** 1.0  
**Last Updated:** February 14, 2026  
**Maintained By:** Biatec Tokens Development Team  

For questions or support, visit: https://tokens.biatec.io
