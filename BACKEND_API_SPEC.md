# Backend API Specification for Biatec Tokens

This document outlines the required backend API endpoints to make the Biatec Tokens platform fully functional.

## Architecture Overview

```
┌──────────────┐      HTTP/REST      ┌──────────────┐      RPC      ┌──────────────┐
│   Frontend   │ ←─────────────────→ │  Backend API │ ←────────────→ │  Blockchain  │
│   (Vue 3)    │                     │  (Node.js)   │                │ (Algorand/EVM)│
└──────────────┘                     └──────────────┘                └──────────────┘
                                            │
                                            ↓
                                     ┌──────────────┐
                                     │   Database   │
                                     │ (PostgreSQL) │
                                     └──────────────┘
                                            │
                                            ↓
                                     ┌──────────────┐
                                     │     IPFS     │
                                     │   (Pinata)   │
                                     └──────────────┘
```

## Core API Endpoints

### Authentication

#### `POST /api/auth/connect`
Connect wallet and create/retrieve user session.

**Request:**
```json
{
  "address": "ABCD...XYZ",
  "network": "voi-mainnet",
  "signedMessage": "0x...",
  "message": "Sign in to Biatec Tokens"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "address": "ABCD...XYZ",
    "network": "voi-mainnet",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "jwt_token_here"
}
```

#### `POST /api/auth/disconnect`
Sign out user and invalidate session.

**Request:**
```json
{
  "token": "jwt_token_here"
}
```

**Response:**
```json
{
  "success": true
}
```

---

### Token Management

#### `GET /api/tokens`
Retrieve all tokens created by the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `status` (optional): Filter by status (created, deploying, deployed, failed)
- `standard` (optional): Filter by standard (ASA, ARC3-FT, ARC3-NFT, ARC200, ARC72, ERC20, ERC721)
- `limit` (optional): Number of results per page (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "tokens": [
    {
      "id": "uuid",
      "name": "My Token",
      "symbol": "MTK",
      "description": "A test token",
      "standard": "ASA",
      "type": "Fungible Token",
      "totalSupply": "1000000",
      "decimals": 6,
      "imageUrl": "https://ipfs.io/ipfs/...",
      "status": "deployed",
      "assetId": "12345678",
      "txId": "TXID...",
      "network": "voi-mainnet",
      "createdAt": "2024-01-01T00:00:00Z",
      "deployedAt": "2024-01-01T00:01:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

#### `POST /api/tokens`
Create a new token (saves to database, prepares for deployment).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "name": "My Token",
  "symbol": "MTK",
  "description": "A test token",
  "standard": "ASA",
  "type": "Fungible Token",
  "totalSupply": "1000000",
  "decimals": 6,
  "image": "base64_encoded_image_or_file_upload",
  "attributes": [
    {
      "trait_type": "Color",
      "value": "Blue"
    }
  ],
  "network": "voi-mainnet"
}
```

**Response:**
```json
{
  "success": true,
  "token": {
    "id": "uuid",
    "name": "My Token",
    "symbol": "MTK",
    "status": "created",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### `POST /api/tokens/:id/deploy`
Deploy a token to the blockchain.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "network": "voi-mainnet",
  "walletAddress": "ABCD...XYZ"
}
```

**Response:**
```json
{
  "success": true,
  "deployment": {
    "id": "uuid",
    "tokenId": "uuid",
    "status": "deploying",
    "unsignedTxn": "base64_encoded_transaction",
    "estimatedFee": 0.001,
    "message": "Please sign the transaction in your wallet"
  }
}
```

#### `POST /api/tokens/:id/submit`
Submit a signed transaction to the blockchain.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "signedTxn": "base64_encoded_signed_transaction",
  "network": "voi-mainnet"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "txId": "TXID...",
    "assetId": "12345678",
    "status": "deploying",
    "message": "Transaction submitted successfully"
  }
}
```

#### `GET /api/tokens/:id/status`
Check the deployment status of a token.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "status": {
    "tokenId": "uuid",
    "deploymentStatus": "deployed",
    "txId": "TXID...",
    "assetId": "12345678",
    "confirmations": 5,
    "blockNumber": 12345,
    "deployedAt": "2024-01-01T00:01:00Z"
  }
}
```

#### `DELETE /api/tokens/:id`
Delete a token (only if status is 'created' or 'failed').

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Token deleted successfully"
}
```

---

### IPFS Integration

#### `POST /api/ipfs/upload`
Upload an image or metadata to IPFS.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request:**
```
file: <binary_file>
metadata: {
  "name": "My Token",
  "description": "A test token"
}
```

**Response:**
```json
{
  "success": true,
  "ipfs": {
    "hash": "QmXXXX...",
    "url": "https://ipfs.io/ipfs/QmXXXX...",
    "pinataUrl": "https://gateway.pinata.cloud/ipfs/QmXXXX..."
  }
}
```

#### `POST /api/ipfs/metadata`
Create and upload token metadata JSON to IPFS.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "name": "My Token",
  "description": "A test token",
  "image": "ipfs://QmXXXX...",
  "properties": {
    "standard": "ARC3",
    "attributes": [
      {
        "trait_type": "Color",
        "value": "Blue"
      }
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "metadata": {
    "hash": "QmYYYY...",
    "url": "ipfs://QmYYYY...",
    "gatewayUrl": "https://ipfs.io/ipfs/QmYYYY..."
  }
}
```

---

### Smart Contract Compilation

#### `POST /api/contracts/compile`
Compile smart contract code (PyTeal for Algorand, Solidity for EVM).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "standard": "ARC200",
  "network": "voi-mainnet",
  "parameters": {
    "name": "My Token",
    "symbol": "MTK",
    "totalSupply": "1000000",
    "decimals": 6
  }
}
```

**Response:**
```json
{
  "success": true,
  "contract": {
    "standard": "ARC200",
    "compiled": true,
    "approvalProgram": "base64_encoded_teal",
    "clearStateProgram": "base64_encoded_teal",
    "abi": { "methods": [...] },
    "size": 2048,
    "estimatedCost": 0.1
  }
}
```

---

### Network Configuration

#### `GET /api/networks`
Get available networks and their configurations.

**Response:**
```json
{
  "success": true,
  "networks": [
    {
      "id": "voi-mainnet",
      "name": "VOI Mainnet",
      "type": "algorand",
      "algodUrl": "https://mainnet-api.voi.nodely.dev",
      "indexerUrl": "https://mainnet-idx.voi.nodely.dev",
      "genesisHash": "r20fSQI8gWe/kFZziNonSPCXLwcQmH/nxROvnnueWOk=",
      "chainId": 1,
      "isTestnet": false
    }
  ]
}
```

#### `GET /api/networks/:id/status`
Check network health and status.

**Response:**
```json
{
  "success": true,
  "status": {
    "networkId": "voi-mainnet",
    "healthy": true,
    "blockHeight": 12345678,
    "lastBlock": "2024-01-01T00:00:00Z",
    "avgBlockTime": 3.5,
    "tps": 1000
  }
}
```

---

### Subscription Management

#### `POST /api/subscription/checkout`
Create a Stripe checkout session.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "plan": "pro",
  "billingCycle": "monthly"
}
```

**Response:**
```json
{
  "success": true,
  "checkout": {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/pay/cs_test_..."
  }
}
```

#### `POST /api/subscription/webhook`
Handle Stripe webhook events.

**Headers:**
```
Stripe-Signature: <signature>
```

**Request:**
```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {...}
  }
}
```

**Response:**
```json
{
  "received": true
}
```

#### `GET /api/subscription/status`
Get user's subscription status.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "subscription": {
    "active": true,
    "plan": "pro",
    "billingCycle": "monthly",
    "status": "active",
    "currentPeriodEnd": "2024-02-01T00:00:00Z",
    "cancelAtPeriodEnd": false
  }
}
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address VARCHAR(255) NOT NULL UNIQUE,
  network VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tokens Table
```sql
CREATE TABLE tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  description TEXT,
  standard VARCHAR(20) NOT NULL,
  type VARCHAR(50) NOT NULL,
  total_supply VARCHAR(100),
  decimals INTEGER,
  image_url TEXT,
  metadata_url TEXT,
  attributes JSONB,
  status VARCHAR(20) DEFAULT 'created',
  asset_id VARCHAR(100),
  contract_address VARCHAR(255),
  tx_id VARCHAR(255),
  network VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  deployed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Deployments Table
```sql
CREATE TABLE deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID REFERENCES tokens(id) ON DELETE CASCADE,
  network VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  unsigned_txn TEXT,
  signed_txn TEXT,
  tx_id VARCHAR(255),
  block_number BIGINT,
  confirmations INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  submitted_at TIMESTAMP,
  confirmed_at TIMESTAMP
);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  plan VARCHAR(50) NOT NULL,
  billing_cycle VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Environment Variables (Backend)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/biatec_tokens

# Algorand Networks
ALGOD_VOI_URL=https://mainnet-api.voi.nodely.dev
ALGOD_VOI_TOKEN=
INDEXER_VOI_URL=https://mainnet-idx.voi.nodely.dev
INDEXER_VOI_TOKEN=

# IPFS/Pinata
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
PINATA_JWT=your_pinata_jwt

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_PRO_MONTHLY=price_...
STRIPE_PRICE_ID_PRO_YEARLY=price_...

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d

# Server
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://biatec-tokens.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Technology Stack Recommendations

### Backend Framework
- **Node.js + Express** (recommended for JavaScript ecosystem)
- **NestJS** (alternative for enterprise-grade apps)
- **FastAPI** (Python alternative)

### Database
- **PostgreSQL** (recommended for relational data and JSON support)
- **MongoDB** (alternative for document-based storage)

### Blockchain SDKs
- **algosdk** (Algorand JavaScript SDK)
- **web3.js** or **ethers.js** (Ethereum/EVM SDK)

### IPFS Integration
- **Pinata** (recommended for ease of use)
- **Infura IPFS** (alternative)
- **NFT.Storage** (free alternative for NFTs)

### Smart Contract Tools
- **PyTeal** (Algorand smart contracts)
- **Solidity** (EVM smart contracts)
- **Hardhat** (EVM development environment)

---

## Security Considerations

1. **Authentication**: Use JWT tokens with short expiry times
2. **Rate Limiting**: Implement per-user and global rate limits
3. **Input Validation**: Validate all inputs before processing
4. **Transaction Signing**: Never handle private keys on the backend
5. **CORS**: Configure proper CORS policies
6. **HTTPS**: Enforce HTTPS in production
7. **Environment Variables**: Never commit secrets to version control
8. **Database**: Use parameterized queries to prevent SQL injection
9. **API Keys**: Rotate API keys regularly
10. **Monitoring**: Implement logging and monitoring (e.g., Sentry)

---

## Deployment Recommendations

### Backend Hosting
- **AWS EC2** or **DigitalOcean Droplets**
- **Heroku** (easy deployment)
- **Vercel** or **Railway** (serverless options)

### Database Hosting
- **AWS RDS** (PostgreSQL)
- **Supabase** (PostgreSQL with built-in auth)
- **MongoDB Atlas**

### CI/CD
- GitHub Actions for automated testing and deployment
- Docker containers for consistent environments

---

## Next Steps

1. Set up Node.js backend with Express
2. Configure PostgreSQL database and run migrations
3. Implement authentication endpoints
4. Add token creation and storage endpoints
5. Integrate Algorand SDK for ASA deployment
6. Integrate IPFS for image/metadata storage
7. Implement EVM contract deployment
8. Add Stripe webhook handling
9. Deploy to staging environment
10. Test end-to-end flow
11. Deploy to production

---

## Support

For questions or issues with the API specification, please open an issue on GitHub.
