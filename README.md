# Biatec Tokens

<div align="center">
  <h3>Next-Generation Tokenization Platform</h3>
  <p>Create, manage, and deploy tokens across multiple standards with enterprise-grade security and lightning-fast performance on Algorand-based networks.</p>
</div>

---

## 🚀 Overview

Biatec Tokens is a comprehensive Vue 3-based frontend application that simplifies the creation and management of blockchain tokens on Algorand-based networks. With support for multiple token standards and seamless wallet integration, Biatec Tokens empowers developers and businesses to tokenize assets quickly and securely.

## Deployment

- Frontend: https://tokens.biatec.io
- Backend: [https://api.tokens.biatec.io](https://api.tokens.biatec.io/swagger/index.html)

### Key Features

- **Multi-Standard Support**: Create tokens across 8 different standards including:
  - **Algorand Native**: ASA (Algorand Standard Assets)
  - **ARC Standards**: ARC3 Fungible Tokens, ARC3 NFTs, ARC3 Fractional NFTs, ARC200, ARC72
  - **Ethereum Standards**: ERC20, ERC721
  
- **Multi-Wallet Integration**: Seamless connection with popular Algorand wallets:
  - Biatec Wallet
  - Pera Wallet
  - Defly Wallet
  - Exodus
  - Kibisis
  - Lute Connect
  
- **Multi-Network Support**: Deploy tokens on multiple networks:
  - VOI Mainnet
  - Aramid Mainnet
  - Dockernet (Local Development)
  
- **Intuitive User Interface**: 
  - Modern, responsive design with dark mode support
  - Token creation wizard with validation
  - Real-time dashboard for token management
  - Transaction history and analytics
  
- **Enterprise-Grade Security**:
  - Algorand-based authentication
  - Secure wallet integration
  - Transaction signing with user consent

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For cloning the repository
- **Compatible Wallet**: One of the supported Algorand wallets installed

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/scholtz/biatec-tokens.git
cd biatec-tokens
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Algorand Network Configuration
VITE_ALGOD_URL=https://testnet-api.algonode.cloud
VITE_ALGOD_TOKEN=
VITE_INDEXER_URL=https://testnet-idx.algonode.cloud
VITE_INDEXER_TOKEN=

# Stripe Configuration (if using payments)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

> **Note**: For production, update these values with your mainnet endpoints and credentials.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
biatec-tokens/
├── src/
│   ├── components/          # Vue components
│   │   ├── ui/             # Reusable UI components (Button, Modal, Card, etc.)
│   │   └── layout/         # Layout components (Navbar, Sidebar)
│   ├── stores/             # Pinia state management stores
│   │   ├── auth.ts         # Authentication state
│   │   ├── tokens.ts       # Token management state
│   │   ├── theme.ts        # Theme management (dark/light mode)
│   │   ├── settings.ts     # User settings
│   │   └── subscription.ts # Subscription management
│   ├── router/             # Vue Router configuration
│   │   └── index.ts        # Route definitions
│   ├── views/              # Page components
│   │   ├── Home.vue        # Landing page
│   │   ├── TokenCreator.vue    # Token creation wizard
│   │   ├── TokenDashboard.vue  # Token management dashboard
│   │   ├── Settings.vue    # User settings
│   │   └── subscription/   # Subscription-related views
│   ├── assets/             # Static assets (images, styles)
│   ├── main.ts             # Application entry point
│   ├── App.vue             # Root component
│   └── style.css           # Global styles (Tailwind CSS)
├── public/                 # Public static files
├── docker/                 # Docker configuration
├── k8s/                    # Kubernetes manifests
├── .github/                # GitHub Actions workflows
├── package.json            # Project dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 💻 Development

### Available Scripts

- **`npm run dev`**: Start development server with hot-reload
- **`npm run build`**: Build for production (includes TypeScript type checking)
- **`npm run preview`**: Preview production build locally

### Development Workflow

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Make your changes**: The app will hot-reload automatically

3. **Type checking**: TypeScript errors will be shown in your IDE and during build

4. **Build for production**: 
   ```bash
   npm run build
   ```

### Technology Stack

- **Frontend Framework**: Vue 3 (Composition API with `<script setup>`)
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom configuration
- **State Management**: Pinia
- **Router**: Vue Router
- **Blockchain SDK**: Algorand SDK (algosdk)
- **Wallet Integration**: @txnlab/use-wallet-vue

## 🎨 Supported Token Standards

### Algorand Standards

| Standard | Type | Description |
|----------|------|-------------|
| **ASA** | Fungible | Native Algorand Standard Assets without ARC3 metadata |
| **ARC3 Fungible** | Fungible | ASA with built-in metadata support (name, symbol, URL, etc.) |
| **ARC3 NFT** | NFT | ASA NFT with metadata stored in IPFS (supply = 1) |
| **ARC3 Fractional NFT** | NFT | ASA NFT with fractional ownership support |
| **ARC200** | Fungible | Smart contract tokens compatible with ERC20 standards |
| **ARC72** | NFT | NFT standard with Ethereum-style functionality |

### Ethereum Standards

| Standard | Type | Description |
|----------|------|-------------|
| **ERC20** | Fungible | Standard Ethereum fungible tokens with full EVM compatibility |
| **ERC721** | NFT | Ethereum NFTs with rich metadata and ownership tracking |

## 🌐 Network Configuration

The application supports multiple Algorand-based networks:

### VOI Mainnet
- **Algod**: https://mainnet-api.voi.nodely.dev
- **Genesis ID**: voimain-v1.0
- **Use Case**: Production deployments on VOI network

### Aramid Mainnet
- **Algod**: https://algod.aramidmain.a-wallet.net
- **Genesis ID**: aramidmain-v1.0
- **Use Case**: Production deployments on Aramid network

### Dockernet (Local)
- **Algod**: http://localhost:4001
- **Genesis ID**: dockernet-v1
- **Use Case**: Local development and testing

> **Note**: Network selection and configuration is handled in `src/main.ts`

## 👛 Wallet Integration

Biatec Tokens integrates with multiple Algorand wallet providers:

- **Biatec Wallet**: Native integration with WalletConnect
- **Pera Wallet**: Popular Algorand mobile and web wallet
- **Defly Wallet**: Feature-rich Algorand wallet
- **Exodus**: Multi-chain wallet with Algorand support
- **Kibisis**: Browser extension wallet for Algorand
- **Lute Connect**: Algorand wallet with advanced features

### Connecting Your Wallet

1. Click "Connect Wallet" in the navigation bar
2. Select your preferred wallet provider
3. Approve the connection in your wallet
4. Start creating and managing tokens!

## 📦 Deployment

### Building for Production

```bash
npm run build
```

This command:
1. Runs TypeScript type checking (`vue-tsc -b`)
2. Builds the application with Vite
3. Outputs optimized files to the `dist/` directory

### Docker Deployment

Docker configuration is available in the `docker/` directory:

```bash
# Build Docker image
docker build -t biatec-tokens -f docker/Dockerfile .

# Run container
docker run -p 8080:80 biatec-tokens
```

### Kubernetes Deployment

Kubernetes manifests are available in the `k8s/` directory:

```bash
kubectl apply -f k8s/
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_ALGOD_URL` | Algorand node API URL | No | Configured per network in main.ts |
| `VITE_ALGOD_TOKEN` | Algorand node API token | No | Empty for public nodes |
| `VITE_INDEXER_URL` | Algorand indexer URL | No | - |
| `VITE_INDEXER_TOKEN` | Algorand indexer token | No | - |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe public key (for subscriptions) | No | - |

### Wallet Configuration

Wallet providers are configured in `src/main.ts`:

```typescript
app.use(WalletManagerPlugin, {
  wallets: [
    { id: WalletId.BIATEC, options: { projectId: 'your-project-id' } },
    WalletId.PERA,
    WalletId.DEFLY,
    // ... other wallets
  ],
  networks: networks,
  defaultNetwork: NetworkId.TESTNET,
});
```

## 🤝 Contributing

We welcome contributions to Biatec Tokens! Here's how you can help:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run type checking: `npm run build`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- **TypeScript**: Use strict typing, avoid `any`
- **Vue Components**: Use Composition API with `<script setup>`
- **Styling**: Follow Tailwind CSS utility-first approach
- **Formatting**: Code is formatted with Prettier (configuration in project)

### Commit Messages

Follow conventional commits format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## 🐛 Troubleshooting

### Common Issues

#### Wallet Connection Fails
- **Solution**: Ensure you have the latest version of your wallet installed
- Check that you're on the correct network (mainnet/testnet)
- Clear browser cache and try again

#### Build Errors
- **Solution**: Delete `node_modules` and `package-lock.json`, then run `npm install`
- Ensure you're using Node.js 18.x or higher
- Check that all required environment variables are set

#### TypeScript Errors
- **Solution**: Run `npm run build` to see detailed error messages
- Ensure all dependencies are installed correctly
- Check `tsconfig.json` for proper configuration

#### Module Not Found Errors
- **Solution**: Some wallet libraries require Buffer polyfills (already configured in `src/main.ts`)
- If you add new dependencies, ensure they're compatible with Vite

### Getting Help

- **Issues**: Open an issue on [GitHub Issues](https://github.com/scholtz/biatec-tokens/issues)
- **Discussions**: Join discussions on [GitHub Discussions](https://github.com/scholtz/biatec-tokens/discussions)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contact & Support

- **Repository**: [https://github.com/scholtz/biatec-tokens](https://github.com/scholtz/biatec-tokens)
- **Author**: [@scholtz](https://github.com/scholtz)

---

<div align="center">
  <p>Built with ❤️ for the Algorand ecosystem</p>
  <p>Powered by Vue 3, TypeScript, and Vite</p>
</div>
