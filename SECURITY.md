# Security Policy

## Overview

Biatec Tokens takes security seriously. This document outlines our security practices, known issues, and how to report vulnerabilities.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Practices

### Authentication & Authorization
- **Algorand-based Authentication**: Uses blockchain-based authentication via Algorand wallets
- **Transaction Signing**: All transactions require explicit user approval in connected wallet
- **No Private Key Storage**: Private keys are never stored or transmitted - managed by user's wallet

### Wallet Integration
- **Multiple Wallet Support**: Integration with established wallet providers (Pera, Defly, Biatec, etc.)
- **Secure Connection**: Wallet connections use standard Algorand authentication protocols
- **User Consent**: Every transaction requires user approval via wallet interface

### Code Quality
- **TypeScript Strict Mode**: Enforced type safety throughout the codebase
- **Build-time Type Checking**: All production builds include TypeScript validation
- **Input Validation**: User inputs are validated before processing

## Known Security Considerations

### Dependency Vulnerabilities

The project currently has some dependency vulnerabilities that are inherited from wallet integration libraries:

#### High Priority (Require Attention)

1. **WalletConnect v1 Dependencies**
   - **Status**: Deprecated upstream
   - **Impact**: Wallet integration libraries (@txnlab/use-wallet-vue, @perawallet/connect, @blockshake/defly-connect) depend on WalletConnect v1
   - **Risk Level**: Medium (affects wallet connection reliability, not core security)
   - **Mitigation**: Monitor for updates to wallet libraries that migrate to WalletConnect v2
   - **Recommendation**: Track upstream migration status

2. **axios (DoS vulnerability)**
   - **CVE**: GHSA-4hjh-wcwx-xvwj
   - **Impact**: Potential DoS through lack of data size check
   - **Risk Level**: Medium (client-side impact only)
   - **Current Version**: Check package.json
   - **Mitigation**: Rate limiting and size checks at application level
   - **Recommendation**: Update when compatible version available

3. **form-data (unsafe random function)**
   - **CVE**: GHSA-fjxv-7rqg-78g4
   - **Impact**: Predictable boundary generation
   - **Risk Level**: Low (limited attack surface in this application)
   - **Mitigation**: Not used for security-critical operations
   - **Recommendation**: Update when compatible version available

#### Low Priority (Monitoring)

1. **Development Dependencies**
   - Several vulnerabilities exist in development-only dependencies (playwright, h3, glob)
   - **Risk Level**: Low (not included in production builds)
   - **Status**: Monitoring for updates

### Blockchain Security

#### Smart Contract Interactions
- **Token Creation**: Uses Algorand SDK for token creation
- **Transaction Validation**: All transactions validated by Algorand network
- **Network Selection**: Supports multiple networks (VOI, Aramid, dockernet)

#### Best Practices
- Always verify token addresses before interacting
- Review all transaction details in your wallet before signing
- Use testnet (dockernet) for development and testing
- Never share your wallet seed phrase or private keys

## Security Updates

### Update Policy
- Security patches are released as soon as possible after discovery
- Critical vulnerabilities receive immediate attention
- Regular dependency updates are performed monthly

### Staying Informed
- Watch this repository for security announcements
- Check [GitHub Security Advisories](https://github.com/scholtz/biatec-tokens/security/advisories)
- Follow project updates for dependency migration news

## Reporting a Vulnerability

### How to Report

If you discover a security vulnerability, please report it responsibly:

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Send a detailed report to the maintainers (see Contact section)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

### Response Timeline
- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: Within 7 days
  - High: Within 30 days
  - Medium: Within 90 days
  - Low: Next scheduled release

### What to Expect
1. Acknowledgment of your report
2. Regular updates on the fix progress
3. Credit in release notes (if desired)
4. Public disclosure after fix is deployed

## Security Recommendations for Users

### For Developers
1. **Keep Dependencies Updated**: Regularly run `npm update` and review security advisories
2. **Use Environment Variables**: Never commit sensitive data (API keys, tokens) to version control
3. **Enable 2FA**: Use two-factor authentication on GitHub and npm accounts
4. **Review Changes**: Carefully review all code changes, especially in wallet integration
5. **Test Thoroughly**: Use testnet/dockernet for all development and testing

### For End Users
1. **Verify URLs**: Always verify you're on the correct website
2. **Use Official Wallets**: Only use official, verified wallet applications
3. **Review Transactions**: Always review transaction details before signing
4. **Protect Seed Phrases**: Never share your wallet seed phrase or private keys
5. **Stay Updated**: Keep your wallet software updated to the latest version
6. **Use Hardware Wallets**: Consider hardware wallets for large holdings

## Security Checklist for Deployments

Before deploying to production:

- [ ] All environment variables properly configured
- [ ] HTTPS enabled with valid SSL certificates
- [ ] CSP (Content Security Policy) headers configured
- [ ] Rate limiting implemented at infrastructure level
- [ ] CORS properly configured for API endpoints
- [ ] Security headers enabled (X-Frame-Options, X-Content-Type-Options, etc.)
- [ ] Regular automated backups configured
- [ ] Monitoring and alerting set up
- [ ] Incident response plan documented
- [ ] Dependencies reviewed and updated

## Third-Party Security

### Wallet Providers
All wallet integrations use official SDKs from reputable providers:
- **Pera Wallet**: Official Algorand wallet
- **Defly Wallet**: Established Algorand wallet provider
- **Biatec Wallet**: WalletConnect-based integration
- **Kibisis**: Browser extension wallet
- **Lute Connect**: Algorand wallet
- **Exodus**: Multi-chain wallet

### Network Providers
- **VOI Network**: https://voi.network
- **Aramid Network**: Community-driven Algorand network
- **Algorand SDK**: Official algosdk package

## Compliance

### Data Privacy
- No personal data is stored server-side
- Wallet addresses are public by blockchain design
- Transaction data is stored on-chain (public blockchain)

### Open Source
- Code is open source for transparency and community review
- Security through transparency
- Community contributions welcome

## Resources

- [Algorand Security Best Practices](https://developer.algorand.org/docs/get-started/basics/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web3 Security Best Practices](https://github.com/Consensys/smart-contract-best-practices)

## Contact

For security-related inquiries:
- **GitHub**: [@scholtz](https://github.com/scholtz)
- **Repository**: [biatec-tokens](https://github.com/scholtz/biatec-tokens)

---

**Last Updated**: January 2026

*This security policy is subject to updates. Please check regularly for changes.*
