import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🔧 Setting up deployment environment...");

  // Check if .env file exists
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) {
    console.log("📝 Creating .env file from template...");
    const envExample = `# Network Configuration
AMOY_RPC_URL=https://rpc-amoy.polygon.technology
AMOY_PRIVATE_KEY=your_private_key_here

# Deployment Configuration
DEPLOYER_ADDRESS=your_deployer_address_here
CREATORS=your_address1,your_address2

# Optional: Gas Configuration
GAS_LIMIT=30000000
GAS_PRICE=1000000000
`;
    fs.writeFileSync(envPath, envExample);
    console.log("✅ .env file created. Please fill in your configuration.");
    console.log("⚠️  IMPORTANT: Never commit your private keys to git!");
    return;
  }

  // Load environment variables
  require('dotenv').config();

  // Validate required environment variables
  const requiredVars = ['AMOY_RPC_URL', 'AMOY_PRIVATE_KEY'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:", missingVars.join(', '));
    console.error("Please update your .env file with the required values.");
    process.exit(1);
  }

  // Validate private key format
  const privateKey = process.env.AMOY_PRIVATE_KEY!;
  if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
    console.error("❌ Invalid private key format. Must be 64 hex characters with 0x prefix.");
    process.exit(1);
  }

  // Get deployer address
  const wallet = new ethers.Wallet(privateKey);
  console.log("👤 Deployer address:", wallet.address);

  // Check network connection
  try {
    const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL);
    const network = await provider.getNetwork();
    console.log("🌐 Connected to network:", network.name, `(Chain ID: ${network.chainId})`);
    
    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "MATIC");
    
    if (balance === 0n) {
      console.log("⚠️  WARNING: Account has no MATIC. You need testnet MATIC to deploy contracts.");
      console.log("💡 Get testnet MATIC from: https://faucet.polygon.technology/");
    }
  } catch (error) {
    console.error("❌ Failed to connect to network:", error);
    process.exit(1);
  }

  // Parse creators
  const creatorsEnv = process.env.CREATORS || wallet.address;
  const creators = creatorsEnv.split(',').map(addr => addr.trim());
  console.log("👥 Creators:", creators);

  // Create deployment configuration
  const config = {
    network: {
      name: "polygonAmoy",
      chainId: 80002,
      rpcUrl: process.env.AMOY_RPC_URL,
      explorerUrl: "https://amoy.polygonscan.com"
    },
    deployer: {
      address: wallet.address,
      privateKey: privateKey
    },
    creators: creators,
    gas: {
      limit: process.env.GAS_LIMIT || "30000000",
      price: process.env.GAS_PRICE || "1000000000"
    }
  };

  // Save configuration
  const configPath = path.join(__dirname, "..", "deployment-config.json");
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("💾 Configuration saved to:", configPath);

  console.log("✅ Environment setup completed successfully!");
  console.log("\n🚀 Ready to deploy! Run: npx hardhat run scripts/deployWithTokens.ts --network amoy");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  });
