# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Known Security Issues

### NPM Package Vulnerabilities

As of the latest audit (January 2026), the following security vulnerabilities exist in dependencies:

#### Critical (1)
- **form-data** (4.0.0 - 4.0.3): Uses unsafe random function for choosing boundary
  - **Status**: Awaiting upstream fix
  - **Mitigation**: This is used by internal dependencies and does not directly affect the application's security posture

#### High (14)
- **axios** (1.0.0 - 1.11.0): Vulnerable to DoS attack through lack of data size check
  - **Status**: Can be fixed with `npm audit fix`
  - **Impact**: Medium - DoS potential on client-side requests
  
- **h3** (≤1.15.4): Request Smuggling (TE.TE) issue
  - **Status**: Awaiting upstream fix
  - **Impact**: Low - Used internally by development dependencies
  
- **glob** (10.2.0 - 10.4.5): Command injection via -c/--cmd
  - **Status**: Can be fixed with `npm audit fix`
  - **Impact**: Low - Not used in production code
  
- **playwright** (<1.55.1): Downloads browsers without SSL certificate verification
  - **Status**: Can be fixed with `npm audit fix`
  - **Impact**: Low - Development dependency only
  
- **ws** (7.0.0 - 7.5.9): DoS when handling many HTTP headers
  - **Status**: Requires breaking change to fix
  - **Impact**: Medium - Used by wallet connection libraries

#### Moderate (2)
- **esbuild** (≤0.24.2): Development server can be accessed by any website
  - **Status**: Can be fixed with `npm audit fix`
  - **Impact**: Low - Development environment only

### Remediation Plan

1. **Immediate Actions**:
   ```bash
   # Fix non-breaking vulnerabilities
   npm audit fix
   ```

2. **Short-term (Next Release)**:
   - Update axios to latest stable version
   - Review and update ws dependency chain
   - Monitor upstream fixes for form-data

3. **Long-term**:
   - Implement automated dependency scanning in CI/CD
   - Set up Dependabot alerts
   - Regular monthly security audits

## Security Best Practices

### Frontend Security

1. **Authentication**
   - Never store private keys in browser
   - Use wallet providers for all signing operations
   - Session tokens stored in localStorage (consider upgrading to httpOnly cookies when backend is implemented)

2. **Input Validation**
   - All user inputs are validated client-side
   - Additional server-side validation required when backend is implemented

3. **XSS Prevention**
   - Vue 3's automatic HTML escaping enabled
   - No use of `v-html` with user-provided content
   - Content Security Policy headers to be implemented in deployment

4. **CSRF Protection**
   - To be implemented with backend API integration
   - Use CSRF tokens for all state-changing operations

### Wallet Security

1. **Supported Wallets**
   - All wallet integrations use established, audited libraries
   - No direct private key handling
   - Transaction signing happens in user's wallet extension

2. **Network Security**
   - HTTPS enforced in production
   - Secure WebSocket connections for wallet communication
   - Network endpoints validated before use

### Data Privacy

1. **Personal Information**
   - Minimal data collection (wallet address only)
   - No email or personal information stored without consent
   - User data stored locally in browser

2. **Token Metadata**
   - Images and metadata to be stored on IPFS (decentralized)
   - No sensitive data in token metadata

### Smart Contract Security

1. **Token Deployment**
   - All transactions require user approval
   - Clear display of transaction details before signing
   - Gas/fee estimation shown to user

2. **Code Review**
   - Smart contract code to be audited before production deployment
   - Use of established, audited token standards (ARC-3, ARC-200, ERC-20, ERC-721)

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

1. **DO NOT** open a public GitHub issue
2. Email security concerns to: [Add security contact email]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Fix Timeline**: Varies by severity
  - Critical: Within 24-48 hours
  - High: Within 1 week
  - Medium: Within 2 weeks
  - Low: Next regular release

### Disclosure Policy

- Security issues will be disclosed publicly only after a fix is available
- We will credit security researchers who report issues responsibly
- A security advisory will be published for all critical and high-severity issues

## Security Checklist for Contributors

Before submitting code, ensure:

- [ ] No hardcoded secrets, API keys, or private keys
- [ ] All user inputs are properly validated
- [ ] No use of `eval()` or `Function()` with user input
- [ ] No SQL injection vectors (when backend is implemented)
- [ ] Proper error handling without exposing sensitive information
- [ ] Dependencies are up to date
- [ ] No use of deprecated or vulnerable libraries

## Security Tools

### Recommended Tools for Development

1. **ESLint Security Plugin**
   ```bash
   npm install --save-dev eslint-plugin-security
   ```

2. **Snyk** (for dependency scanning)
   ```bash
   npm install -g snyk
   snyk test
   ```

3. **OWASP ZAP** (for penetration testing)
   - Use after backend deployment

## Environment Security

### Development Environment
- Use `.env` files for local configuration
- Never commit `.env` files to version control
- Use `.env.example` as template

### Production Environment
- Use environment variables for all secrets
- Implement rate limiting
- Enable CORS with strict origin policies
- Use HTTPS only
- Implement security headers:
  - Content-Security-Policy
  - X-Content-Type-Options
  - X-Frame-Options
  - Strict-Transport-Security

## Third-Party Integrations

### Stripe
- Use Stripe's client-side SDK only
- Never expose secret API keys
- Implement webhook signature verification
- Use HTTPS for all Stripe callbacks

### IPFS/Pinata
- Use API keys with limited permissions
- Implement rate limiting
- Monitor usage for abuse
- Keep API keys in environment variables

### Algorand Network
- Use official SDKs only
- Validate all network responses
- Implement retry logic with exponential backoff
- Monitor for network downtime

## Incident Response Plan

### In Case of Security Breach

1. **Immediate**:
   - Isolate affected systems
   - Document all evidence
   - Notify security team

2. **Short-term** (Within 24 hours):
   - Assess scope of breach
   - Implement temporary fixes
   - Notify affected users if applicable

3. **Long-term**:
   - Conduct post-mortem
   - Implement permanent fixes
   - Update security procedures
   - Public disclosure (if required)

## Compliance

### GDPR Considerations
- User consent for data collection
- Right to data deletion
- Data portability
- Privacy by design

### Smart Contract Auditing
- Third-party audit recommended before mainnet deployment
- Use of formal verification tools
- Continuous monitoring of deployed contracts

## Updates and Maintenance

This security policy is reviewed and updated:
- After any security incident
- Quarterly (at minimum)
- When new features are added
- When new dependencies are introduced

Last Updated: January 19, 2026
Version: 1.0.0

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vue.js Security Best Practices](https://vuejs.org/guide/best-practices/security.html)
- [Algorand Security](https://developer.algorand.org/docs/get-started/basics/why_algorand/)
- [Web3 Security Guide](https://consensys.github.io/smart-contract-best-practices/)

---

**Remember**: Security is everyone's responsibility. If you see something, say something.
