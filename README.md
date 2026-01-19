# Biatec Tokens - Next-Generation Tokenization Platform

A comprehensive Vue 3 + TypeScript frontend application for creating, managing, and deploying tokens across multiple blockchain standards including Algorand (ASA, ARC-3, ARC-200, ARC-72) and EVM-compatible networks (ERC-20, ERC-721).

## 🚀 Features

### Multi-Standard Token Support
- **Algorand Standards**: ASA (Algorand Standard Asset), ARC-3 (Fungible & NFT), ARC-200, ARC-72
- **EVM Standards**: ERC-20 (Fungible), ERC-721 (NFT)
- Support for both Fungible Tokens (FT) and Non-Fungible Tokens (NFT)

### Wallet Integration
- Multiple wallet support via `@txnlab/use-wallet-vue`
- Supported wallets: Biatec, Pera, Defly, Exodus, Kibisis, Lute
- Seamless wallet connection and authentication
- Support for VOI Network, Aramid Network, and Dockernet

### Token Management
- Intuitive token creation wizard with form validation
- Token dashboard with filtering by standard and status
- Real-time deployment status tracking
- Token metadata management (name, symbol, description, supply, decimals)
- Image upload for token/NFT artwork
- NFT attributes (trait types and values)

### User Experience
- Modern, responsive UI with Tailwind CSS
- Dark mode support with animated gradient backgrounds
- Glass-effect design system
- Comprehensive statistics and analytics
- Network configuration management

## 🛠️ Tech Stack

- **Framework**: Vue 3 with Composition API (`<script setup>`)
- **Language**: TypeScript 5.8 (strict mode)
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4
- **State Management**: Pinia 2.3
- **Router**: Vue Router 4.5
- **Blockchain**: Algorand SDK (algosdk 3.3.1)
- **Wallet Integration**: @txnlab/use-wallet-vue 4.1.0

## 📋 Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- Git

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/scholtz/biatec-tokens.git
cd biatec-tokens
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
# - Set Algorand network endpoints (default: VOI mainnet)
# - Add your Stripe publishable key if using payments
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Build & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## 🌐 Supported Networks

### Algorand Networks
- **VOI Mainnet** (default)
  - Algod: `https://mainnet-api.voi.nodely.dev`
  - Indexer: `https://mainnet-idx.voi.nodely.dev`

- **Aramid Mainnet**
  - Algod: `https://algod.aramidmain.a-wallet.net`

- **Dockernet** (local development)
  - Algod: `http://localhost:4001`

### EVM Networks
Configurable via the Settings page

## 📚 Project Structure

```
src/
├── components/       # Vue components
│   ├── ui/          # Reusable UI components
│   ├── layout/      # Layout components
│   └── ...          # Other components
├── stores/          # Pinia stores
│   ├── auth.ts      # Authentication & wallet state
│   ├── tokens.ts    # Token management
│   ├── settings.ts  # Network configuration
│   ├── subscription.ts  # Subscription management
│   └── theme.ts     # Theme management
├── router/          # Vue Router configuration
├── views/           # Page components
│   ├── Home.vue
│   ├── TokenCreator.vue
│   ├── TokenDashboard.vue
│   ├── Settings.vue
│   └── subscription/
└── main.ts          # Application entry point
```

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_ALGOD_URL` | Algorand node URL | `https://mainnet-api.voi.nodely.dev` |
| `VITE_ALGOD_TOKEN` | Algorand node API token | (empty) |
| `VITE_INDEXER_URL` | Algorand indexer URL | `https://mainnet-idx.voi.nodely.dev` |
| `VITE_INDEXER_TOKEN` | Algorand indexer API token | (empty) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe public key | (required for payments) |

## 🎨 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Type-check and build for production
- `npm run preview` - Preview production build locally

## 🔒 Security

This project uses several security best practices:
- TypeScript strict mode enabled
- Content Security Policy headers (configured in deployment)
- Secure wallet integration via established libraries
- No private key storage in frontend

**Note**: There are some known npm package vulnerabilities. Run `npm audit` for details.

## 🚧 Current Status

**Frontend**: ✅ Production-ready with comprehensive UI/UX

**Backend Integration**: 🚧 In Progress
- Token deployment currently uses mock data
- Real blockchain integration requires backend API
- IPFS integration for image storage pending
- Smart contract compilation and deployment to be implemented

## 🗺️ Roadmap

- [ ] Backend API implementation
- [ ] Real Algorand token deployment (ASA, ARC standards)
- [ ] EVM smart contract deployment
- [ ] IPFS/Pinata integration for metadata storage
- [ ] Database for token persistence
- [ ] Stripe webhook integration
- [ ] Transaction signing and submission
- [ ] Token refresh from on-chain state
- [ ] Deployment cost estimation
- [ ] Enhanced error handling and notifications

## 👥 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

[Add your license here]

## 🤝 Support

For questions or support, please open an issue on GitHub.

## 🔗 Links

- [Algorand Developer Portal](https://developer.algorand.org/)
- [VOI Network](https://voi.network/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
