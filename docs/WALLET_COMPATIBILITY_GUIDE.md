# Wallet Compatibility Guide

## Important Notice ⚠️

**Biatec Tokens Platform Uses Email/Password Authentication Only**

This guide documents wallet compatibility for **informational purposes only**. The Biatec Tokens platform is designed for non-crypto-native users and does NOT integrate wallet connectors.

**Platform Architecture:**
- ✅ Email/password authentication
- ✅ Backend handles all blockchain interactions
- ✅ ARC76 account derivation from user credentials
- ❌ NO wallet connection buttons or modals
- ❌ NO WalletConnect, Pera Connect, or similar integrations

**Purpose of This Guide:**
- Help issuers understand how their tokens will display in end-user wallets
- Provide guidance on choosing token standards for maximum wallet compatibility
- Document expected user experience when tokens are held

---

## Executive Summary

This guide provides comprehensive information about how major Algorand wallets display different token standards. Understanding wallet behavior helps issuers choose appropriate standards and set proper expectations for token holders.

**Key Findings:**
- ARC-3 has excellent support across all major Algorand wallets
- ARC-19 supported well by mobile wallets (Pera, Defly)
- ARC-69 has good support but lower visual prominence
- Plain ASA universally supported with basic display
- Browser extension wallets (Lute) have partial ARC-19/69 support
- Multi-chain wallets (Exodus) show limited ARC support

---

## Wallet Overview

### Supported Algorand Wallets

| Wallet | Type | ARC-3 | ARC-19 | ARC-69 | ASA | Last Verified |
|--------|------|-------|--------|--------|-----|---------------|
| **Pera Wallet** | Mobile | ★★★★★ | ★★★★★ | ★★★★ | ★★★★ | Feb 2026 |
| **Defly Wallet** | Mobile | ★★★★★ | ★★★★ | ★★★★ | ★★★★ | Feb 2026 |
| **Lute Wallet** | Browser | ★★★★ | ★★ | ★★ | ★★★★ | Feb 2026 |
| **Exodus Wallet** | Desktop/Mobile | ★★ | ★★ | ★★ | ★★★★ | Feb 2026 |

---

## Detailed Wallet Profiles

### 1. Pera Wallet (Recommended)

**Type:** Mobile (iOS, Android)  
**Website:** https://perawallet.app/  
**Overall Rating:** ★★★★★ Excellent

**Description:**
Official Algorand mobile wallet with comprehensive support for all ARC standards. Best-in-class metadata display, image rendering, and IPFS gateway resolution.

#### Standard Support

**ARC-3 Support:** ★★★★★ Excellent
- ✅ Automatically fetches metadata from URL
- ✅ Renders images in thumbnail grid
- ✅ Full IPFS support with multiple gateways
- ✅ Displays all metadata fields
- ✅ Verifies metadata hash if provided
- ✅ Caches metadata for performance

**Display Behavior:**
```
Asset List View:
┌─────────────────────┐
│ [Image Thumbnail]   │
│ Token Name          │
│ 1.00 UNIT           │
│ $XX.XX USD          │
└─────────────────────┘

Detail View:
- Token Name: From metadata.name
- Image: Full resolution from metadata.image
- Description: metadata.description
- Properties: All custom properties displayed
- External URL: Clickable link
```

**ARC-19 Support:** ★★★★★ Excellent
- ✅ Resolves template-ipfs:// URLs dynamically
- ✅ Uses reserve address to fetch current CID
- ✅ Updates metadata when reserve changes
- ✅ Supports both dag-pb and raw CID formats
- ✅ Visual indication of mutable NFTs

**ARC-69 Support:** ★★★★ Good
- ✅ Parses note field JSON
- ✅ Displays media_url images
- ✅ Shows description and properties
- ⚠️ Less visual prominence than ARC-3/19
- ⚠️ 1KB limit applies

**ASA Support:** ★★★★ Good
- ✅ Clean display of name and unit
- ✅ Proper decimal formatting
- ✅ Balance tracking
- ⚠️ No image or metadata (expected for ASA)

#### Best Practices for Pera

1. **For ARC-3:**
   - Use IPFS URLs for decentralization
   - Provide high-quality images (512x512 minimum)
   - Include metadata hash for verification
   - Test with multiple IPFS gateways

2. **For ARC-19:**
   - Clearly communicate mutability policy
   - Use reserve address you control
   - Test metadata updates before announcing
   - Provide fallback image in initial deployment

3. **For ARC-69:**
   - Keep JSON under 900 bytes (leave buffer)
   - Use media_url for images
   - Include all critical info in 1KB limit

**Known Issues:**
- None reported as of Feb 2026

**User Experience Rating:** 10/10

---

### 2. Defly Wallet

**Type:** Mobile (iOS, Android), Web  
**Website:** https://defly.app/  
**Overall Rating:** ★★★★★ Excellent

**Description:**
DeFi-focused Algorand wallet with excellent NFT collection management. Outstanding support for ARC-3 with marketplace integration features.

#### Standard Support

**ARC-3 Support:** ★★★★★ Excellent
- ✅ Gorgeous NFT gallery view
- ✅ Collection grouping
- ✅ High-quality image rendering
- ✅ Full metadata display
- ✅ IPFS and HTTPS support
- ✅ #arc3 suffix detection

**Display Behavior:**
```
Collections View:
┌───────────────────────────────┐
│ Collection Name               │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ │
│ │ #1 │ │ #2 │ │ #3 │ │ #4 │ │
│ └────┘ └────┘ └────┘ └────┘ │
└───────────────────────────────┘

NFT Detail:
- Full-screen image viewer
- All metadata properties
- Transfer/send functionality
- Marketplace links (if available)
```

**ARC-19 Support:** ★★★★ Good
- ✅ Template URL resolution
- ✅ Reserve-based metadata loading
- ⚠️ Slight delay on metadata updates (5-10 min cache)
- ✅ Visual quality matches ARC-3

**ARC-69 Support:** ★★★★ Good
- ✅ Note field parsing
- ✅ Media URL support
- ✅ Properties display
- ⚠️ Less prominent than ARC-3

**ASA Support:** ★★★★ Good
- ✅ Clean token list
- ✅ Decimal formatting
- ✅ Quick transfer UI

#### Best Practices for Defly

1. **For NFT Collections:**
   - Use consistent naming (e.g., "Collection #1", "Collection #2")
   - Provide collection-level metadata
   - High-quality images essential
   - Consider collection assets (collection banner)

2. **For DeFi Tokens:**
   - Plain ASA works great
   - ARC-200 supported
   - Clear unit names

**Known Issues:**
- ARC-19 metadata cache takes 5-10 min to refresh

**User Experience Rating:** 10/10

---

### 3. Lute Wallet

**Type:** Browser Extension (Chrome, Firefox, Edge)  
**Website:** https://lute.app/  
**Overall Rating:** ★★★ Good

**Description:**
Browser extension wallet for Algorand. Good for web3 interactions but has limitations with advanced ARC standards due to browser environment constraints.

#### Standard Support

**ARC-3 Support:** ★★★★ Good
- ✅ Displays metadata name
- ✅ Shows images from HTTPS URLs
- ⚠️ IPFS URLs may load slowly
- ⚠️ Browser CORS restrictions apply
- ✅ Basic metadata rendering

**Display Behavior:**
```
Extension Popup:
┌─────────────────┐
│ Assets          │
│ Token Name      │
│ 100.50 UNIT     │
│ [small image]   │
└─────────────────┘
```

**ARC-19 Support:** ★★ Partial
- ⚠️ Limited template resolution
- ⚠️ May not fetch reserve-based metadata
- ⚠️ Can display as plain ASA
- ⚠️ Browser environment limitations

**ARC-69 Support:** ★★ Partial
- ⚠️ Limited note parsing
- ⚠️ Metadata may not display
- ✅ Token functions normally
- ⚠️ No enhanced metadata shown

**ASA Support:** ★★★★ Good
- ✅ Reliable display
- ✅ Good for browser-based dApps
- ✅ Quick transactions

#### Best Practices for Lute

1. **Prefer HTTPS over IPFS:**
   - Browser extension has better HTTPS handling
   - IPFS gateways may be blocked by CORS

2. **For ARC-19/69:**
   - Expect reduced functionality
   - Provide clear asset name/unit
   - Token will work but may lack metadata

3. **Test in Browser:**
   - Always test HTTPS URLs in incognito
   - Check CORS headers
   - Verify image loading

**Known Issues:**
- IPFS URLs slow in browser extension
- ARC-19 template resolution incomplete
- CORS restrictions on some metadata hosts

**User Experience Rating:** 7/10

---

### 4. Exodus Wallet

**Type:** Desktop (Windows, Mac, Linux), Mobile (iOS, Android)  
**Website:** https://www.exodus.com/  
**Overall Rating:** ★★ Limited

**Description:**
Multi-chain wallet supporting 50+ blockchains. Algorand support is basic - focuses on core functionality rather than ARC standards.

#### Standard Support

**ARC-3 Support:** ★★ Poor
- ❌ Does not fetch ARC-3 metadata
- ❌ Shows only asset name from on-chain params
- ❌ No image display
- ✅ Token functions normally (send/receive)

**Display Behavior:**
```
Asset List:
Token Name (from params, not metadata)
100.00 UNIT
$XX.XX USD
```

**ARC-19 Support:** ★★ Poor
- ❌ No template resolution
- ❌ Displays as plain ASA
- ✅ Transfer functions work

**ARC-69 Support:** ★★ Poor
- ❌ No note parsing
- ❌ Displays as plain ASA
- ✅ Transfer functions work

**ASA Support:** ★★★★ Good
- ✅ Reliable ASA support
- ✅ Multi-chain portfolio view
- ✅ Exchange integrations
- ✅ Good for simple tokens

#### Best Practices for Exodus

1. **Stick to ASA:**
   - If targeting Exodus users, use plain ASA
   - ARC standards won't display

2. **Set Good On-Chain Names:**
   - Asset name will be only identifier
   - Make it descriptive

3. **Communicate Limitations:**
   - Inform users metadata won't show in Exodus
   - Suggest Pera/Defly for full experience

**Known Issues:**
- No ARC standard support
- Multi-chain wallet priorities other ecosystems

**User Experience Rating:** 6/10 (for Algorand specifically)

---

## Standard-Specific Recommendations

### For ARC-3 Tokens

**Target Wallets:** Pera, Defly (Excellent), Lute (Good)

**Optimization Tips:**
1. **Image Size:**
   - Primary image: 512x512 to 2048x2048
   - Thumbnail: 256x256
   - Format: PNG or JPEG
   - Max file size: 5MB (smaller = faster load)

2. **Metadata Hosting:**
   - IPFS: Best for decentralization
     - Pin on multiple nodes
     - Use well-known gateways (Pinata, NFT.Storage)
   - HTTPS: Best for performance
     - Use CDN (Cloudflare, AWS CloudFront)
     - Enable CORS headers
     - Set cache-control headers

3. **Metadata Structure:**
```json
{
  "name": "Clear, readable name",
  "description": "Concise description (200 chars)",
  "image": "ipfs://QmXyz or https://cdn.example.com/image.png",
  "image_integrity": "sha256-...",
  "image_mimetype": "image/png",
  "external_url": "https://yourproject.com/token/1",
  "properties": {
    "creator": "Artist Name",
    "edition": "1/100",
    "rarity": "Rare"
  }
}
```

**Wallet Testing Checklist:**
- [ ] Image loads in Pera (mobile)
- [ ] Image loads in Defly (mobile)
- [ ] Image loads in Lute (browser)
- [ ] Metadata fields display correctly
- [ ] External URL clickable
- [ ] Properties render properly

---

### For ARC-19 Tokens

**Target Wallets:** Pera (Excellent), Defly (Good)

**Optimization Tips:**
1. **Reserve Management:**
   - Use address you control
   - Document update policy publicly
   - Test updates on testnet first
   - Communicate changes to community

2. **Template URL Format:**
```
Recommended:
template-ipfs://{ipfscid:0:dag-pb:reserve:sha2-256}

Alternative:
template-ipfs://{ipfscid:1:raw:reserve:sha2-256}
```

3. **Metadata Updates:**
   - Allow 10-15 minutes for wallet cache refresh
   - Announce updates in advance
   - Provide changelog
   - Keep old CID accessible temporarily

**Wallet Testing Checklist:**
- [ ] Metadata resolves in Pera
- [ ] Metadata resolves in Defly
- [ ] Update reserve address
- [ ] Wait 15 minutes
- [ ] Verify new metadata displays
- [ ] Document update process

---

### For ARC-69 Tokens

**Target Wallets:** Pera (Good), Defly (Good)

**Optimization Tips:**
1. **Size Management:**
   - Keep JSON under 900 bytes (safety buffer)
   - Minimize whitespace
   - Use short property names
   - External media URLs don't count toward limit

2. **Metadata Structure:**
```json
{
  "standard":"arc69",
  "description":"Brief description",
  "media_url":"ipfs://QmXyz",
  "properties":{"trait":"value"}
}
```
Size: ~95 bytes

3. **Testing:**
```javascript
const metadataJson = JSON.stringify(metadata);
const byteSize = new TextEncoder().encode(metadataJson).length;
console.log(`Size: ${byteSize} bytes (limit: 1024)`);
```

**Wallet Testing Checklist:**
- [ ] Size is ≤ 1024 bytes
- [ ] JSON is valid
- [ ] media_url accessible
- [ ] Displays in Pera
- [ ] Displays in Defly

---

### For Plain ASA Tokens

**Target Wallets:** All wallets (Universal Support)

**Optimization Tips:**
1. **Naming:**
   - Name: Clear, professional (max 32 bytes)
   - Unit: 3-8 characters
   - Example: "Biatec Utility" / "BIAT"

2. **Configuration:**
   - Decimals: Match industry standard for token type
   - URL: Can include website (optional, 96 bytes max)
   - Consider compliance addresses (freeze, clawback)

**Wallet Testing Checklist:**
- [ ] Name displays correctly
- [ ] Unit name not truncated
- [ ] Decimals format properly
- [ ] Transfer functionality works

---

## Ecosystem Compatibility Matrix

### NFT Marketplaces

| Marketplace | ASA | ARC-3 | ARC-19 | ARC-69 | Notes |
|-------------|-----|-------|--------|--------|-------|
| **AlgoExplorer** | ✅ | ✅ | ✅ | ✅ | Full support |
| **NFTExplorer** | ✅ | ✅ | ✅ | ✅ | Optimized for NFTs |
| **Rand Gallery** | ✅ | ✅ | ✅ | ⚠️ | Prefers ARC-3/19 |
| **Dartroom** | ✅ | ✅ | ⚠️ | ⚠️ | Best with ARC-3 |

### Block Explorers

| Explorer | ASA | ARC-3 | ARC-19 | ARC-69 | Metadata Display |
|----------|-----|-------|--------|--------|-----------------|
| **AlgoExplorer** | ✅ | ✅ | ✅ | ✅ | Excellent |
| **GoalSeeker** | ✅ | ✅ | ✅ | ✅ | Good |
| **AlgoScan** | ✅ | ✅ | ⚠️ | ⚠️ | Basic |

### DeFi Platforms

| Platform | ASA | ARC-200 | Notes |
|----------|-----|---------|-------|
| **Tinyman** | ✅ | ⚠️ | Excellent ASA support |
| **Pact** | ✅ | ⚠️ | Good ASA support |
| **AlgoFi** | ✅ | ❌ | ASA only |

---

## Integration Testing Guide

### Testing Checklist Template

Use this checklist for each token standard you deploy:

#### Pre-Deployment Testing
- [ ] Token configuration validated
- [ ] Metadata JSON validated (if applicable)
- [ ] Images accessible from multiple locations
- [ ] URL schemes correct
- [ ] Testnet deployment successful

#### Wallet Display Testing

**Pera Wallet (iOS/Android):**
- [ ] Asset appears in list
- [ ] Image displays (ARC-3/19)
- [ ] Name shows correctly
- [ ] Balance formats properly
- [ ] Transfer works
- [ ] Metadata details accessible

**Defly Wallet:**
- [ ] Asset appears in list
- [ ] Image displays
- [ ] Collections grouped (if applicable)
- [ ] Transfer works
- [ ] DeFi integrations work (if applicable)

**Lute Wallet (Browser):**
- [ ] Asset appears in extension
- [ ] Name displays
- [ ] Basic functionality works
- [ ] dApp connections work

#### Marketplace Testing (if NFT)
- [ ] Appears in marketplace search
- [ ] Image and metadata display
- [ ] Properties render correctly
- [ ] Sale/auction functions work

#### Cross-Platform Verification
- [ ] Test on iOS
- [ ] Test on Android
- [ ] Test on desktop (if applicable)
- [ ] Test in multiple browsers (for browser wallets)

---

## Troubleshooting Common Display Issues

### Issue: Image Not Displaying in Pera

**Symptoms:** Token shows but no image appears

**Diagnosis:**
1. Check URL format: Must end with `#arc3`
2. Verify metadata JSON is accessible
3. Test image URL in browser
4. Check IPFS gateway availability
5. Verify metadata hash matches content

**Solutions:**
```bash
# Test metadata URL
curl https://your-metadata-url

# Test IPFS URL through gateway
curl https://ipfs.io/ipfs/QmXyz

# Verify hash
echo -n "$(curl -s https://metadata-url)" | sha256sum
```

### Issue: ARC-19 Not Updating

**Symptoms:** Changed reserve but old metadata still shows

**Diagnosis:**
1. Wallet cache (10-15 min delay)
2. Reserve address doesn't contain valid CID
3. Template format incorrect
4. IPFS pinning issue

**Solutions:**
1. Wait 15 minutes after reserve change
2. Force-close and reopen wallet app
3. Clear wallet cache (if option available)
4. Verify reserve address decodes to valid CID
5. Test template resolution manually

### Issue: ARC-69 Metadata Missing

**Symptoms:** Token shows but no metadata in wallet

**Diagnosis:**
1. Metadata exceeds 1024 bytes
2. Invalid JSON format
3. Wallet doesn't support ARC-69
4. Note field empty or incorrect

**Solutions:**
```javascript
// Validate metadata size
const metadata = {
  standard: "arc69",
  description: "Your description",
  media_url: "ipfs://..."
};

const json = JSON.stringify(metadata);
const size = new TextEncoder().encode(json).length;

if (size > 1024) {
  console.error(`Too large: ${size} bytes`);
} else {
  console.log(`OK: ${size} bytes`);
}

// Validate JSON
try {
  JSON.parse(json);
  console.log("Valid JSON");
} catch (e) {
  console.error("Invalid JSON:", e);
}
```

### Issue: Wallet Shows Wrong Name

**Symptoms:** Wallet displays different name than expected

**Explanation:**
- ARC-3/19: Wallet shows `metadata.name` (external)
- ASA: Wallet shows on-chain `name` parameter
- Mismatch occurs when these don't match

**Solution:**
Ensure consistency:
```typescript
// For ARC-3
{
  name: "On-Chain Name",  // Shown in explorers
  metadata: {
    name: "On-Chain Name" // Shown in wallets (should match)
  }
}
```

---

## Best Practices Summary

### Do's ✅

1. **Test on Multiple Wallets**
   - Always test on Pera and Defly minimum
   - Test on testnet before mainnet
   - Verify all metadata displays correctly

2. **Optimize Images**
   - Use appropriate sizes (512-2048px)
   - Compress for web (< 2MB ideal)
   - Test loading speed

3. **Provide Fallbacks**
   - Set good on-chain name/unit
   - Works even if metadata fails

4. **Document Compatibility**
   - Tell users which wallets work best
   - Explain expected display differences

5. **Monitor After Launch**
   - Check wallet integrations
   - Watch for user reports
   - Update if standards evolve

### Don'ts ❌

1. **Don't Assume Universal Support**
   - Not all wallets support all standards
   - Browser wallets have limitations
   - Multi-chain wallets may be basic

2. **Don't Use Broken IPFS Links**
   - Pin on multiple providers
   - Test gateway availability
   - Provide HTTPS fallback if possible

3. **Don't Exceed Size Limits**
   - ARC-69: 1024 bytes hard limit
   - Images: Keep reasonable (< 5MB)
   - Metadata JSON: < 100KB

4. **Don't Change Standards Mid-Flight**
   - Can't upgrade ASA to ARC-3
   - Requires new token and migration
   - Plan ahead

5. **Don't Ignore Browser Constraints**
   - Lute wallet has CORS limitations
   - IPFS may not work in all browsers
   - Test thoroughly

---

## Future Wallet Support

### Emerging Wallets

Watch for support from these upcoming wallets:
- **Kibisis:** Web-based wallet in development
- **Biatec Wallet:** Native Biatec ecosystem wallet
- **AWallet:** Privacy-focused Algorand wallet

### Standards Evolution

Future ARC standards in development:
- **ARC-74:** Optimistic rollup NFTs
- **ARC-76:** Authentication standard (Biatec implementation)
- **ARC-200:** Continued development

### Wallet Feature Requests

Common requested features:
- Better ARC-19 cache management
- Collection-level metadata
- Bulk transfer UI
- Cross-chain bridge integration

---

## Support and Resources

### Wallet-Specific Support

**Pera Wallet:**
- Discord: https://discord.gg/pera
- Docs: https://docs.perawallet.app/
- GitHub: https://github.com/perawallet

**Defly Wallet:**
- Discord: https://discord.gg/defly
- Twitter: @deflyapp
- Support: support@defly.app

**Lute Wallet:**
- Discord: https://discord.gg/lute
- Docs: https://docs.lute.app/

### Testing Resources

**Testnet Faucets:**
- https://bank.testnet.algorand.network/
- https://testnet.algoexplorer.io/dispenser

**IPFS Pinning Services:**
- Pinata: https://pinata.cloud/
- NFT.Storage: https://nft.storage/
- Web3.Storage: https://web3.storage/

**Metadata Validators:**
- Built-in: Biatec Tokens platform validator
- ARC-3: https://arc3.xyz/validator
- JSON: https://jsonlint.com/

### Contact

For platform-specific questions:
- Email: support@biatec.io
- Discord: https://discord.gg/biatec
- Documentation: https://docs.biatec.io

---

**Document Version:** 1.0  
**Last Updated:** February 14, 2026  
**Maintained By:** Biatec Tokens Development Team

**Disclaimer:** Wallet compatibility information is based on testing as of February 2026. Wallet features and support may change. Always test your specific use case on testnet before mainnet deployment.
