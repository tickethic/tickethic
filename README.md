# Tickethic 🎫

A decentralized application (dApp) for managing event tickets as NFTs. This open-source project enables fair and transparent revenue sharing between artists and event organizers through blockchain technology.

## 🌟 Features

- **NFT-based Tickets**: Each ticket is a unique NFT on the blockchain
- **Artist Registration**: Artists can register and mint their own NFT collections
- **Revenue Sharing**: Fair and transparent revenue distribution
- **Web3 Integration**: Built with wagmi, viem, and Reown AppKit
- **IPFS Deployment**: Fully decentralized deployment on IPFS network

## 🏗️ Project Structure

```
tickethic/
├── dapp/                 # Frontend Next.js application (IPFS-ready)
│   ├── src/             # Source code
│   ├── public/          # Static assets
│   ├── out/             # Static build output (for IPFS)
│   ├── .github/         # GitHub Actions for IPFS deployment
│   └── IPFS_DEPLOYMENT.md # IPFS deployment guide
├── evm/                 # Smart contracts (Hardhat)
│   ├── contracts/       # Solidity contracts
│   ├── scripts/         # Deployment scripts
│   └── test/           # Contract tests
├── nft/                 # NFT metadata
│   ├── artists/         # Artist metadata
│   └── events/          # Event metadata
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tickethic/tickethic.git
   cd tickethic
   ```

2. **Install dependencies:**
   ```bash
   # Install dapp dependencies
   cd dapp
   npm install
   
   # Install smart contract dependencies
   cd ../evm
   npm install
   ```

3. **Configure environment:**
   ```bash
   # Copy environment template
   cd ../dapp
   cp env.example .env
   
   # Edit .env with your configuration
   # See DEPLOY.md for detailed instructions
   ```

### Development

1. **Start the dapp locally:**
   ```bash
   cd dapp
   npm run dev
   ```

2. **Build for production:**
   ```bash
   npm run build
   ```

3. **Deploy to static hosting:**
   ```bash
   npm run deploy
   ```

## 🔧 Smart Contracts

The project includes smart contracts for:
- **Artist NFT**: Artist registration and management
- **Event NFT**: Event creation and ticket management
- **Ticket NFT**: Individual ticket tokens
- **Organizer**: Event organizer management

### Contract Deployment

```bash
cd evm
npx hardhat compile
npx hardhat deploy --network <network>
```

## 🌐 Deployment

### IPFS (Recommended for dApps)

The dapp is optimized for IPFS deployment, making it truly decentralized:

1. **Configure GitHub Secrets** with Storacha credentials
2. **Push to main branch** - automatic IPFS deployment
3. **Access via IPFS gateways** - no central server needed

See [IPFS_DEPLOYMENT.md](dapp/IPFS_DEPLOYMENT.md) for detailed deployment instructions.

### Local Testing

```bash
cd dapp
npm run build
npm run ipfs-serve
```

### Supported Hosting Providers

- **IPFS**: Fully decentralized, immutable, and censorship-resistant
- **Vercel**: Traditional hosting with CDN
- **Netlify**: Static hosting with form handling
- **GitHub Pages**: Free static hosting
- **Any static hosting**: FTP, S3, etc.

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **wagmi**: React hooks for Ethereum
- **viem**: TypeScript interface for Ethereum
- **Reown AppKit**: Web3 wallet connection
- **Tailwind CSS**: Utility-first CSS framework

### Smart Contracts
- **Solidity**: Smart contract language
- **Hardhat**: Development environment
- **OpenZeppelin**: Secure contract libraries

### Deployment
- **Vercel**: Automatic deployments and CDN
- **Environment Variables**: Secure configuration
- **GitHub Integration**: Automatic builds on push

## 📖 Documentation

- [Vercel Deployment Guide](dapp/VERCEL_DEPLOYMENT.md) - Detailed deployment instructions
- [Smart Contracts](evm/README.md) - Contract documentation
- [API Reference](docs/api.md) - API documentation (coming soon)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [https://tickethic.ch](https://tickethic.ch)
- **Documentation**: [https://docs.tickethic.ch](https://docs.tickethic.ch) (coming soon)
- **Issues**: [GitHub Issues](https://github.com/tickethic/tickethic/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tickethic/tickethic/discussions)

## 🎯 Roadmap

- [ ] Multi-chain support
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] API for third-party integrations
- [ ] Governance token
- [ ] Staking mechanisms

## 💡 Support

If you have any questions or need help:

1. Check the [documentation](dapp/DEPLOY.md)
2. Search [existing issues](https://github.com/tickethic/tickethic/issues)
3. Create a [new issue](https://github.com/tickethic/tickethic/issues/new)
4. Join our [Discord community](https://discord.gg/tickethic) (coming soon)

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract libraries
- [Reown](https://reown.com/) for Web3 wallet integration
- [Next.js](https://nextjs.org/) for the amazing React framework
- The Ethereum community for inspiration and support

---

**Made with ❤️ by the Tickethic team**

*Empowering artists and event organizers through blockchain technology*

Join the team
https://discord.gg/bbtr7PE3
