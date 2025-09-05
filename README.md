# Tickethic 🎫

A decentralized application (dApp) for managing event tickets as NFTs. This open-source project enables fair and transparent revenue sharing between artists and event organizers through blockchain technology.

## 🌟 Features

- **NFT-based Tickets**: Each ticket is a unique NFT on the blockchain
- **Artist Registration**: Artists can register and mint their own NFT collections
- **Revenue Sharing**: Fair and transparent revenue distribution
- **Web3 Integration**: Built with wagmi, viem, and Reown AppKit
- **Static Deployment**: Optimized for static hosting with FTP deployment

## 🏗️ Project Structure

```
tickethic/
├── dapp/                 # Frontend Next.js application
│   ├── src/             # Source code
│   ├── public/          # Static assets
│   ├── deploy.js        # FTP deployment script
│   └── DEPLOY.md        # Deployment documentation
├── evm/                 # Smart contracts (Hardhat)
│   ├── contracts/       # Solidity contracts
│   ├── scripts/         # Deployment scripts
│   └── test/           # Contract tests
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
   git clone https://github.com/dadamagouil/tickethic.git
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

### Static Hosting (Recommended)

The dapp is optimized for static hosting and can be deployed to any FTP server:

1. **Configure FTP settings** in `.env`
2. **Run deployment:**
   ```bash
   npm run deploy
   ```

See [DEPLOY.md](dapp/DEPLOY.md) for detailed deployment instructions.

### Supported Hosting Providers

- **OVH**: `ftp.cluster0XX.ovh.net`
- **Infomaniak**: `ftp.infomaniak.com`
- **Hostinger**: `ftp.your-domain.com`
- Any FTP-compatible hosting

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
- **Static Export**: Next.js static generation
- **FTP**: Automated deployment script
- **Environment Variables**: Secure configuration

## 📖 Documentation

- [Deployment Guide](dapp/DEPLOY.md) - Detailed deployment instructions
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
- **Issues**: [GitHub Issues](https://github.com/dadamagouil/tickethic/issues)
- **Discussions**: [GitHub Discussions](https://github.com/dadamagouil/tickethic/discussions)

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
2. Search [existing issues](https://github.com/dadamagouil/tickethic/issues)
3. Create a [new issue](https://github.com/dadamagouil/tickethic/issues/new)
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
