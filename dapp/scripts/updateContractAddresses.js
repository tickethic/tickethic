const fs = require('fs');
const path = require('path');

/**
 * Script to update contract addresses in the dApp configuration
 * Usage: node scripts/updateContractAddresses.js ../evm/contract-addresses.json
 */

function updateContractAddresses(contractAddressesPath) {
  try {
    // Read contract addresses from EVM deployment
    const contractAddresses = JSON.parse(fs.readFileSync(contractAddressesPath, 'utf8'));
    
    // Get the first network (assuming single network deployment)
    const networkKey = Object.keys(contractAddresses.networks)[0];
    const network = contractAddresses.networks[networkKey];
    
    if (!network || !network.contracts) {
      throw new Error('Invalid contract addresses file format');
    }

    // Read current dApp configuration
    const configPath = path.join(__dirname, '..', 'src', 'config', 'contracts.ts');
    let configContent = fs.readFileSync(configPath, 'utf8');

    // Update contract addresses
    const updates = [
      { placeholder: 'TICKETHIC_COIN: \'0x...\'', newValue: `TICKETHIC_COIN: '${network.contracts.TickethicCoin}'` },
      { placeholder: 'EVENT_MANAGER: \'0x...\'', newValue: `EVENT_MANAGER: '${network.contracts.EventManager}'` },
      { placeholder: 'ARTIST: \'0xE1C58Db7162b2B32b05d7cd549C017D1EF439ECf\'', newValue: `ARTIST: '${network.contracts.Artist}'` },
      { placeholder: 'ORGANIZATOR: \'0xA8D1c6e15058b7D984a8e5CF3b47cB227724339A\'', newValue: `ORGANIZATOR: '${network.contracts.Organizator}'` },
      { placeholder: 'TICKET: \'0xf2566f305eb91798CD9952adb4683433F49B9300\'', newValue: `TICKET: '${network.contracts.Ticket}'` },
      { placeholder: 'EVENT: \'0xf9f621310b6E8fce37307155647C1d5bfa54F0D4\'', newValue: `EVENT: '${network.contracts.EventManager}'` }
    ];

    // Apply updates
    updates.forEach(update => {
      if (configContent.includes(update.placeholder)) {
        configContent = configContent.replace(update.placeholder, update.newValue);
        console.log(`✅ Updated: ${update.placeholder.split(':')[0].trim()}`);
      } else {
        console.log(`⚠️  Placeholder not found: ${update.placeholder}`);
      }
    });

    // Write updated configuration
    fs.writeFileSync(configPath, configContent);
    
    console.log('\n🎉 Contract addresses updated successfully!');
    console.log('📋 Updated addresses:');
    console.log(`  TickethicCoin: ${network.contracts.TickethicCoin}`);
    console.log(`  EventManager: ${network.contracts.EventManager}`);
    console.log(`  Artist: ${network.contracts.Artist}`);
    console.log(`  Organizator: ${network.contracts.Organizator}`);
    console.log(`  Ticket: ${network.contracts.Ticket}`);
    
    console.log('\n🚀 Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Test the dApp with your deployed contracts');
    console.log('3. Deploy the dApp to your hosting provider');

  } catch (error) {
    console.error('❌ Error updating contract addresses:', error.message);
    process.exit(1);
  }
}

// Get contract addresses file path from command line argument
const contractAddressesPath = process.argv[2];

if (!contractAddressesPath) {
  console.error('❌ Please provide the path to contract-addresses.json');
  console.log('Usage: node scripts/updateContractAddresses.js ../evm/contract-addresses.json');
  process.exit(1);
}

if (!fs.existsSync(contractAddressesPath)) {
  console.error('❌ Contract addresses file not found:', contractAddressesPath);
  process.exit(1);
}

updateContractAddresses(contractAddressesPath);
