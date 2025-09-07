# 🚀 Tickethic Deployment Guide

This guide will help you deploy the Tickethic smart contracts with the TickethicCoin token system.

## 📋 Prerequisites

1. **Node.js 18+** installed
2. **Git** installed
3. **Polygon Amoy testnet MATIC** (get from [faucet](https://faucet.polygon.technology/))
4. **Private key** of your deployer wallet

## 🔧 Setup

### 1. Install Dependencies

```bash
cd evm
npm install
```

### 2. Configure Environment

```bash
# Run the setup script
npx hardhat run scripts/setupEnvironment.ts
```

This will create a `.env` file. Edit it with your configuration:

```env
# Network Configuration
AMOY_RPC_URL=https://rpc-amoy.polygon.technology
AMOY_PRIVATE_KEY=0x_your_private_key_here

# Deployment Configuration
DEPLOYER_ADDRESS=0x_your_deployer_address_here
FOUNDERS_MULTISIG=0x_your_multisig_wallet_address_here

# Optional: Gas Configuration
GAS_LIMIT=30000000
GAS_PRICE=1000000000
```

### 3. Get Testnet MATIC

Visit [Polygon Amoy Faucet](https://faucet.polygon.technology/) and request testnet MATIC for your deployer address.

## 🚀 Deployment

### Deploy All Contracts

```bash
npx hardhat run scripts/deployWithTokens.ts --network amoy
```

This will deploy:
- ✅ TickethicCoin (ERC20 token)
- ✅ RewardConfig (configurable rewards)
- ✅ Artist (artist management)
- ✅ Ticket (ticket NFTs)
- ✅ Organizator (organizer management)
- ✅ EventManager (event creation)

### Verify Deployment

After deployment, check the generated `contract-addresses.json` file:

```json
{
  "networks": {
    "80002": {
      "contracts": {
        "TickethicCoin": "0x...",
        "Artist": "0x...",
        "Ticket": "0x...",
        "Organizator": "0x...",
        "EventManager": "0x...",
        "RewardConfig": "0x..."
      }
    }
  }
}
```

## 🔐 Security Notes

- ⚠️ **Never commit private keys to git**
- ⚠️ **Never share your private keys**
- ⚠️ **Use testnet for development only**
- ✅ **Keep deployment addresses secure**
- ✅ **Verify contracts on block explorer**

## 📊 Token Distribution

After deployment, tokens are distributed as follows:

- **Creators**: 20% (200M TTC) - Split among creator addresses
- **Reward Pool**: 80% (800M TTC) - For user rewards

### Reward Amounts (Configurable)

- **Buyer**: 10 TTC per ticket
- **Artist**: 5 TTC per ticket
- **Organizer**: 5 TTC per ticket
- **Validator**: 2 TTC per validation

## 🔄 Update dApp Configuration

After deployment, update your dApp configuration:

1. Copy contract addresses from `contract-addresses.json`
2. Update `dapp/src/config/contracts.ts`
3. Replace placeholder addresses with real ones

## 🧪 Testing

### Test Token Distribution

```bash
# Check token balances
npx hardhat run scripts/checkBalances.ts --network amoy
```

### Test Event Creation

```bash
# Create a test event
npx hardhat run scripts/createTestEvent.ts --network amoy
```

## 📝 Next Steps

1. **Update dApp**: Configure contract addresses in frontend
2. **Test Integration**: Verify dApp can interact with contracts
3. **Deploy Frontend**: Deploy dApp to your hosting provider
4. **Monitor**: Watch contract activity on block explorer

## 🆘 Troubleshooting

### Common Issues

**"Insufficient funds"**
- Get more testnet MATIC from faucet

**"Invalid private key"**
- Check private key format (64 hex chars with 0x prefix)

**"Network connection failed"**
- Verify RPC URL is correct
- Check internet connection

**"Contract deployment failed"**
- Increase gas limit
- Check contract code for errors

### Getting Help

- Check [Hardhat documentation](https://hardhat.org/docs)
- Visit [Polygon documentation](https://docs.polygon.technology/)
- Join our community for support

## 🎉 Success!

Once deployed, you'll have:
- ✅ Fully functional TickethicCoin token system
- ✅ Configurable reward system
- ✅ Event management platform
- ✅ NFT ticket system
- ✅ Artist and organizer management

Your Tickethic platform is ready to revolutionize event ticketing! 🎫
