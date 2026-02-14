# Token Standards Migration Guide

## Overview

This guide provides step-by-step instructions for migrating between token standards on the Biatec Tokens platform. Whether you're upgrading to add metadata, switching networks, or transitioning to a more appropriate standard, this guide covers common migration scenarios.

**Important:** Token migrations typically require creating a new token and coordinating a swap. Algorand assets cannot be "upgraded" in place due to blockchain immutability.

---

## Table of Contents

1. [Understanding Migration Constraints](#understanding-migration-constraints)
2. [Migration Scenarios](#migration-scenarios)
3. [ASA to ARC-3 Migration](#asa-to-arc-3-migration)
4. [ARC-3 to ARC-19 Migration](#arc-3-to-arc-19-migration)
5. [Algorand to Ethereum Bridge](#algorand-to-ethereum-bridge)
6. [ARC-200 Compliance Upgrade](#arc-200-compliance-upgrade)
7. [Migration Best Practices](#migration-best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Understanding Migration Constraints

### Blockchain Immutability

**Key Principle:** Once a token is created on the blockchain, its fundamental standard and parameters cannot be changed.

**What CAN Be Changed (with proper addresses):**
- ✅ Manager configurations (if manager address set)
- ✅ Freeze/clawback status
- ✅ Reserve address (enables ARC-19 metadata updates)
- ✅ URL field (if manager address set)

**What CANNOT Be Changed:**
- ❌ Token standard (ASA to ARC-3, ARC-3 to ARC-19)
- ❌ Total supply
- ❌ Decimals
- ❌ Name (if manager removed)
- ❌ Unit name
- ❌ Asset ID

### Migration Approaches

**1. Token Swap (Recommended)**
- Create new token with desired standard
- Implement swap mechanism
- Users exchange old for new
- Retire old token

**2. Parallel Operation**
- Run both tokens simultaneously
- Gradually phase out old token
- Lower risk, slower transition

**3. Airdrop**
- Create new token
- Snapshot old token holders
- Airdrop new tokens
- Communicate retirement of old token

---

## Migration Scenarios

### Common Migration Paths

```
┌─────────┐
│   ASA   │────────────────────────┐
└────┬────┘                        │
     │                             │
     │ Add Metadata                │ Add Compliance
     ↓                             ↓
┌─────────┐                   ┌──────────┐
│  ARC-3  │                   │  ARC-200 │
└────┬────┘                   └──────────┘
     │
     │ Need Mutability
     ↓
┌─────────┐
│ ARC-19  │
└─────────┘

Cross-Chain:
┌───────────┐            ┌──────────┐
│ Algorand  │ ←Bridge→   │ Ethereum │
│ (any std) │            │ ERC-20/  │
└───────────┘            │ ERC-721  │
                         └──────────┘
```

---

## ASA to ARC-3 Migration

### Use Case
You created a plain ASA token and now want to add rich metadata (images, descriptions, properties) for better wallet display.

### Prerequisites
- ✅ Admin access to Biatec platform
- ✅ New metadata prepared (JSON + images)
- ✅ Metadata hosting ready (IPFS or HTTPS)
- ✅ Communication plan for token holders

### Step-by-Step Process

#### Phase 1: Preparation (1-2 weeks before)

**1. Create Metadata**

```json
{
  "name": "Your Token Name",
  "description": "Detailed token description",
  "image": "ipfs://QmYourImageCID",
  "image_integrity": "sha256-...",
  "image_mimetype": "image/png",
  "external_url": "https://yourproject.com",
  "properties": {
    "category": "Utility",
    "supply": "1000000",
    "network": "Algorand"
  }
}
```

**2. Upload and Pin Metadata**

```bash
# Using Pinata
curl -X POST "https://api.pinata.cloud/pinning/pinFileToIPFS" \
  -H "Authorization: Bearer YOUR_JWT" \
  -F file=@metadata.json

# Result: ipfs://QmMetadataCID
```

**3. Calculate Metadata Hash (Optional but Recommended)**

```javascript
import { createHash } from 'crypto';
import fs from 'fs';

const metadata = fs.readFileSync('metadata.json');
const hash = createHash('sha256').update(metadata).digest();
console.log('Hash:', hash.toString('base64'));
```

**4. Create New ARC-3 Token**

```typescript
import { TokenStandard } from '@/types/api';

const arc3Config = {
  standard: TokenStandard.ARC3,
  name: 'Your Token Name',        // Match old token
  unitName: 'TKN',                 // Match old token
  total: 1000000,                  // Match old token
  decimals: 6,                     // Match old token
  url: 'ipfs://QmMetadataCID#arc3',
  metadataHash: 'base64-hash-here',
  walletAddress: 'YOUR_ALGO_ADDRESS'
};

// Deploy via Biatec platform
const result = await deployToken(arc3Config);
console.log('New ARC-3 Token:', result.tokenId);
```

#### Phase 2: Communication (1 week before swap)

**5. Announce Migration**

Template announcement:
```
📢 Token Migration Announcement

We are upgrading [OLD_TOKEN] to ARC-3 standard!

What this means:
✅ Rich metadata and images in wallets
✅ Better marketplace display
✅ Enhanced discoverability

Migration Details:
- Old Token ID: 123456789
- New Token ID: 987654321
- Swap Ratio: 1:1
- Swap Window: [START_DATE] to [END_DATE]

How to Migrate:
1. Visit: https://yourproject.com/migrate
2. Connect your Algorand account
3. Approve swap transaction
4. Receive new ARC-3 tokens

Questions? support@yourproject.com
```

**6. Prepare Swap Interface**

Options:
- **Option A:** Biatec platform swap tool (recommended)
- **Option B:** Custom smart contract swap
- **Option C:** Manual processing with verification

#### Phase 3: Execution (Swap Period)

**7. Implement Swap Mechanism**

```typescript
// Simplified swap logic
async function swapTokens(userAddress: string, amount: number) {
  // 1. Verify user has old tokens
  const oldBalance = await getTokenBalance(userAddress, OLD_TOKEN_ID);
  if (oldBalance < amount) {
    throw new Error('Insufficient balance');
  }
  
  // 2. Create atomic transaction group:
  //    - User sends old tokens to burn address
  //    - Platform sends new tokens to user
  const txGroup = [
    {
      type: 'axfer',
      from: userAddress,
      to: BURN_ADDRESS,
      amount: amount,
      assetId: OLD_TOKEN_ID
    },
    {
      type: 'axfer',
      from: PLATFORM_ADDRESS,
      to: userAddress,
      amount: amount,
      assetId: NEW_TOKEN_ID
    }
  ];
  
  // 3. Sign and submit
  return await submitAtomicTransaction(txGroup);
}
```

**8. Monitor Swap Progress**

```typescript
// Track migration status
const stats = {
  totalOldSupply: 1000000,
  swappedAmount: 0,
  remainingOldTokens: 1000000,
  percentComplete: 0
};

// Update dashboard
setInterval(async () => {
  stats.swappedAmount = await getTokenBalance(BURN_ADDRESS, OLD_TOKEN_ID);
  stats.remainingOldTokens = stats.totalOldSupply - stats.swappedAmount;
  stats.percentComplete = (stats.swappedAmount / stats.totalOldSupply) * 100;
  
  console.log(`Migration: ${stats.percentComplete.toFixed(2)}% complete`);
}, 60000); // Every minute
```

#### Phase 4: Post-Migration (After swap window)

**9. Finalize Migration**

```typescript
// Check remaining old tokens
const finalOldBalance = totalOldSupply - swappedAmount;

if (finalOldBalance > 0) {
  console.log(`Warning: ${finalOldBalance} old tokens not swapped`);
  
  // Options:
  // A. Extend swap window
  // B. Manual migration for stragglers
  // C. Declare remaining tokens as burned
}

// Update documentation
updateDocs({
  oldTokenId: OLD_TOKEN_ID,
  newTokenId: NEW_TOKEN_ID,
  status: 'Migration Complete',
  date: new Date().toISOString()
});
```

**10. Update Integrations**

```javascript
// Update all references
const integrations = [
  'DEX listings',
  'Block explorers',
  'Wallet watchlists',
  'Price trackers',
  'Analytics platforms',
  'Documentation'
];

// Checklist
for (const integration of integrations) {
  console.log(`Update ${integration}: OLD_ID → NEW_ID`);
}
```

### Migration Checklist

- [ ] Metadata created and tested
- [ ] Metadata uploaded and pinned (IPFS)
- [ ] Hash calculated and verified
- [ ] New ARC-3 token created
- [ ] Tokens transferred to platform address
- [ ] Swap mechanism tested on testnet
- [ ] Communication sent to community
- [ ] Swap window announced (2+ weeks notice)
- [ ] Swap interface deployed
- [ ] Migration progress monitored
- [ ] Post-migration updates completed
- [ ] All integrations updated

### Costs

| Item | Estimated Cost |
|------|---------------|
| New ARC-3 token creation | 0.1 ALGO |
| Metadata hosting (IPFS) | $0-5/month |
| Transaction fees (swaps) | 0.001 ALGO × users |
| Development time | 20-40 hours |

### Timeline

- Week 1-2: Preparation and testing
- Week 3: Community announcement
- Week 4-6: Swap window (2-4 weeks recommended)
- Week 7: Post-migration cleanup

---

## ARC-3 to ARC-19 Migration

### Use Case
You have an ARC-3 token with immutable metadata and need to enable metadata updates (e.g., gaming NFTs with upgradeable attributes).

### Key Difference
- **ARC-3:** External metadata URL, immutable if hash provided
- **ARC-19:** Template URL resolves via reserve address, mutable

### Important Notes
⚠️ **Cannot convert existing ARC-3 to ARC-19** - requires new token  
⚠️ **Consider implications of mutability** - communicate clearly to holders  
⚠️ **Set clear update policy** - document when/why metadata changes

### Process

Follow same general process as ASA → ARC-3, with these changes:

**1. Configure ARC-19 Token**

```typescript
const arc19Config = {
  standard: 'ARC19', // Platform-specific, use ARC3 with template URL
  name: 'Your NFT Collection',
  unitName: 'YNFT',
  total: 1,
  decimals: 0,
  url: 'template-ipfs://{ipfscid:0:dag-pb:reserve:sha2-256}',
  reserve: 'RESERVE_ADDRESS_WITH_CID',
  manager: 'YOUR_MANAGER_ADDRESS' // Required for updates
};
```

**2. Document Update Policy**

Create `METADATA_POLICY.md`:
```markdown
# NFT Metadata Update Policy

## Mutability
This NFT uses ARC-19 standard, allowing metadata updates.

## Update Conditions
Metadata may be updated when:
- Bug fixes or corrections needed
- Game mechanics require attribute changes
- Community votes for updates (DAO)

## Update Process
1. Proposal announced 7 days in advance
2. Community feedback period
3. Update executed
4. Changelog published

## Transparency
All updates logged at: https://yourproject.com/changelog
```

**3. Implement Update Mechanism**

```typescript
async function updateNftMetadata(
  tokenId: number,
  newMetadataCid: string
) {
  // 1. Upload new metadata to IPFS
  const uploaded = await pinToIPFS(newMetadata);
  
  // 2. Update reserve address to point to new CID
  const tx = algosdk.makeAssetConfigTxnWithSuggestedParams(
    managerAddress,
    undefined,
    tokenId,
    undefined, // manager (keep)
    newMetadataCid, // reserve (update)
    undefined, // freeze (keep)
    undefined, // clawback (keep)
    suggestedParams
  );
  
  // 3. Sign and submit
  const signedTx = tx.signTxn(managerPrivateKey);
  await algod.sendRawTransaction(signedTx).do();
  
  // 4. Log change
  await logMetadataUpdate({
    tokenId,
    oldCid: oldMetadataCid,
    newCid: newMetadataCid,
    reason: 'Attribute upgrade',
    timestamp: new Date()
  });
}
```

---

## Algorand to Ethereum Bridge

### Use Case
Want to offer your token on both Algorand and Ethereum ecosystems to reach wider audience.

### Options

#### Option 1: Dual Native Tokens (Recommended for most)

**Pros:**
- ✅ No bridge security risks
- ✅ Full control on both chains
- ✅ Simpler compliance
- ✅ Lower technical complexity

**Cons:**
- ❌ Liquidity fragmentation
- ❌ Manual price tracking
- ❌ No automatic arbitrage

**Process:**

```typescript
// 1. Deploy on Algorand (already have)
const algorandToken = {
  standard: TokenStandard.ARC3,
  name: 'Cross-Chain Token',
  unitName: 'CCT',
  total: 1000000,
  decimals: 6
};

// 2. Deploy on Ethereum
const ethereumToken = {
  standard: TokenStandard.ERC20,
  name: 'Cross-Chain Token',
  symbol: 'CCT',
  decimals: 18, // ERC-20 standard
  totalSupply: '1000000000000000000000000' // 1M in wei
};

// 3. Coordinate supply
// Keep 50% on each chain, or customize per strategy
```

#### Option 2: Third-Party Bridge

**Available Bridges:**
- Wormhole: https://wormhole.com/
- Portal Bridge: https://portalbridge.com/
- Glitter Finance: https://glitter.finance/

**Pros:**
- ✅ True cross-chain transfers
- ✅ Unified supply
- ✅ Arbitrage possible

**Cons:**
- ❌ Bridge security risks
- ❌ Liquidity requirements
- ❌ Additional complexity
- ❌ Bridge fees

**Process:**

```typescript
// 1. Integrate with bridge SDK
import { Wormhole } from '@wormhole-foundation/sdk';

// 2. Lock tokens on source chain
async function bridgeToEthereum(amount: number) {
  // Lock Algorand tokens
  await lockTokens(ALGORAND_TOKEN_ID, amount, BRIDGE_ADDRESS);
  
  // Mint equivalent on Ethereum (bridge handles)
  const bridgeReceipt = await wormhole.transfer({
    sourceChain: 'algorand',
    targetChain: 'ethereum',
    amount: amount,
    token: ALGORAND_TOKEN_ID
  });
  
  return bridgeReceipt;
}
```

### Cost Comparison

| Approach | Setup Cost | Per-Transfer Cost | Security Risk |
|----------|-----------|-------------------|---------------|
| **Dual Native** | Medium | $0 | Low |
| **Wormhole Bridge** | High | $5-50 | Medium |
| **Custom Bridge** | Very High | $1-10 | High |

### Recommendation

For most projects: **Use Dual Native Tokens**
- List both tokens on respective DEXs
- Document the relationship clearly
- Monitor price parity via aggregators

---

## ARC-200 Compliance Upgrade

### Use Case
Transitioning from ASA/ARC-3 to ARC-200 to add MICA compliance metadata and smart contract features.

### Why Upgrade?
- ✅ Built-in compliance metadata
- ✅ Transfer restrictions capability
- ✅ KYC/whitelist integration
- ✅ Better for regulated tokens
- ✅ MICA-ready for EU market

### Prerequisites
- Legal entity established
- Compliance requirements understood
- KYC provider integrated (if needed)
- Legal review completed

### Process

**1. Gather Compliance Information**

```typescript
const micaCompliance = {
  issuerLegalName: 'Your Company Ltd.',
  issuerRegistrationNumber: 'REG123456',
  issuerJurisdiction: 'GB', // ISO 3166-1 alpha-2
  regulatoryLicense: 'FCA-LIC-2026-001',
  micaTokenClassification: 'utility',
  tokenPurpose: 'Platform access and governance',
  kycRequired: true,
  restrictedJurisdictions: ['KP', 'IR', 'SY'], // Example
  complianceContactEmail: 'compliance@yourcompany.com',
  whitepaperUrl: 'https://yourcompany.com/whitepaper.pdf'
};
```

**2. Set Up Whitelist (if KYC required)**

```typescript
// Configure whitelist in Biatec platform
const whitelistConfig = {
  name: 'KYC Verified Users',
  description: 'Users who completed KYC verification',
  requiresJurisdictionCheck: true,
  allowedJurisdictions: ['US', 'GB', 'EU27'],
  kycProvider: 'Jumio', // Or your provider
  kycLevel: 'enhanced'
};
```

**3. Deploy ARC-200 Token**

```typescript
const arc200Config = {
  standard: TokenStandard.ARC200,
  name: 'Compliant Utility Token',
  symbol: 'CUT',
  decimals: 6,
  totalSupply: '1000000000000', // 1M tokens
  walletAddress: 'YOUR_ALGO_ADDRESS',
  micaCompliance: micaCompliance
};

const result = await deployToken(arc200Config);
```

**4. Implement Migration with KYC Check**

```typescript
async function migrateToARC200(
  userAddress: string,
  amount: number
) {
  // 1. Check KYC status
  const kycStatus = await checkKycStatus(userAddress);
  if (!kycStatus.verified) {
    throw new Error('KYC verification required');
  }
  
  // 2. Check jurisdiction
  if (micaCompliance.restrictedJurisdictions.includes(kycStatus.country)) {
    throw new Error('Jurisdiction not allowed');
  }
  
  // 3. Add to whitelist
  await addToWhitelist(userAddress, ARC200_TOKEN_ID);
  
  // 4. Perform swap
  return await swapTokens(
    userAddress,
    OLD_TOKEN_ID,
    ARC200_TOKEN_ID,
    amount
  );
}
```

**5. Update Platform Documentation**

```markdown
# Token Compliance Update

As of [DATE], [TOKEN] is upgrading to ARC-200 standard for enhanced regulatory compliance.

## What's Changing
- ✅ MICA-compliant metadata
- ✅ KYC verification required
- ✅ Jurisdiction checks
- ✅ Enhanced transfer controls

## Action Required
1. Complete KYC verification at: https://yourcompany.com/kyc
2. Verify jurisdiction eligibility
3. Migrate tokens before [DEADLINE]

## Restricted Jurisdictions
Residents of the following jurisdictions cannot hold ARC-200 tokens:
- [List restricted countries]

## Questions?
Contact compliance@yourcompany.com
```

### Migration Timeline for ARC-200

- **Week 1-4:** Legal review and compliance setup
- **Week 5-6:** KYC provider integration
- **Week 7:** Deploy ARC-200 token on testnet
- **Week 8:** Community announcement (4 weeks notice)
- **Week 9-10:** KYC verification period
- **Week 11-14:** Migration window (4 weeks)
- **Week 15:** Post-migration compliance audit

---

## Migration Best Practices

### Communication

**Do's:**
- ✅ Announce 2-4 weeks in advance minimum
- ✅ Explain benefits clearly
- ✅ Provide step-by-step instructions
- ✅ Offer support channels
- ✅ Send multiple reminders

**Don'ts:**
- ❌ Rush migration (<1 week notice)
- ❌ Use technical jargon
- ❌ Ignore user questions
- ❌ Change plan mid-migration

### Technical

**Do's:**
- ✅ Test on testnet first
- ✅ Use atomic transactions for swaps
- ✅ Implement safeguards
- ✅ Monitor closely
- ✅ Keep detailed logs

**Don'ts:**
- ❌ Skip testing
- ❌ Trust manual processes
- ❌ Ignore edge cases
- ❌ Deploy without rollback plan

### Legal/Compliance

**Do's:**
- ✅ Consult legal counsel
- ✅ Update terms of service
- ✅ Notify regulators (if required)
- ✅ Document everything
- ✅ Verify tax implications

**Don'ts:**
- ❌ Ignore regulatory requirements
- ❌ Make false promises
- ❌ Misrepresent new standard
- ❌ Skip due diligence

---

## Troubleshooting

### Common Issues

#### Issue: Low Swap Participation

**Symptoms:**
- < 50% of holders migrating
- Swap deadline approaching

**Solutions:**
1. Extend swap window (announce extension)
2. Send targeted reminders to large holders
3. Offer support via video calls
4. Create video tutorial
5. Simplify swap process
6. Consider manual migration for large holders

#### Issue: Swap Transaction Failing

**Symptoms:**
- Users report failed swaps
- Atomic transactions reverting

**Diagnosis:**
```typescript
// Check common failure reasons
async function diagnoseSwapFailure(userAddress) {
  const checks = {
    oldBalance: await getBalance(userAddress, OLD_TOKEN_ID),
    newOptIn: await isOptedIn(userAddress, NEW_TOKEN_ID),
    platformBalance: await getBalance(PLATFORM_ADDRESS, NEW_TOKEN_ID),
    networkStatus: await checkNetworkCongestion()
  };
  
  if (checks.oldBalance === 0) {
    return 'User has no old tokens';
  }
  if (!checks.newOptIn) {
    return 'User must opt-in to new token first';
  }
  if (checks.platformBalance < checks.oldBalance) {
    return 'Insufficient platform liquidity';
  }
  if (checks.networkStatus.congested) {
    return 'Network congested, retry later';
  }
}
```

**Solutions:**
1. Add opt-in step to swap UI
2. Ensure platform has sufficient new tokens
3. Increase transaction fees during congestion
4. Add retry logic with exponential backoff

#### Issue: Metadata Not Displaying After Migration

**Symptoms:**
- New tokens created but metadata missing in wallets

**Solutions:**
1. Verify URL format: `ipfs://CID#arc3` or `template-ipfs://...`
2. Check metadata JSON is accessible
3. Test IPFS gateways
4. Wait 10-15 minutes for wallet cache
5. Contact wallet support if persistent

---

## Post-Migration Checklist

After completing any migration:

- [ ] All token holders notified of completion
- [ ] Old token marked as deprecated
- [ ] Integrations updated (DEX, explorers, etc.)
- [ ] Documentation updated
- [ ] Support tickets resolved
- [ ] Migration statistics documented
- [ ] Post-mortem completed
- [ ] Lessons learned documented
- [ ] Celebration tweet posted 🎉

---

## Support and Resources

### Biatec Platform Support
- Documentation: https://docs.biatec.io/migrations
- Email: migrations@biatec.io
- Discord: https://discord.gg/biatec

### Community Resources
- Algorand Discord: https://discord.gg/algorand
- Migration Templates: https://github.com/scholtz/biatec-tokens/tree/main/docs/templates

### Legal Resources
- MICA Compliance: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1114
- Token Migration Law: Consult your jurisdiction

---

**Document Version:** 1.0  
**Last Updated:** February 14, 2026  
**Maintained By:** Biatec Tokens Development Team

**Disclaimer:** This guide provides general technical guidance only. Always consult legal counsel for compliance matters and test thoroughly on testnet before mainnet migrations.
