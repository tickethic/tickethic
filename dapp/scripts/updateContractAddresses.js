const fs = require('fs');
const path = require('path');

/**
 * Script to update contract addresses in the dApp configuration
 * Usage: node scripts/updateContractAddresses.js <path_to_evm_contract_addresses.json>
 */
async function updateContractAddresses() {
  const evmAddressesPath = process.argv[2];

  if (!evmAddressesPath) {
    console.error('Usage: node scripts/updateContractAddresses.js <path_to_evm_contract_addresses.json>');
    process.exit(1);
  }

  const dappConfigPath = path.resolve(__dirname, '../src/config/contracts.ts');

  try {
    // Read deployed addresses from EVM project
    const evmAddresses = JSON.parse(fs.readFileSync(evmAddressesPath, 'utf8'));

    // Read current dApp configuration
    let dappConfigContent = fs.readFileSync(dappConfigPath, 'utf8');

    // Update addresses
    dappConfigContent = dappConfigContent.replace(
      /ARTIST: '0x.*?'/,
      `ARTIST: '${evmAddresses.Artist}'`
    );
    dappConfigContent = dappConfigContent.replace(
      /ORGANIZATOR: '0x.*?'/,
      `ORGANIZATOR: '${evmAddresses.Organizator}'`
    );
    dappConfigContent = dappConfigContent.replace(
      /TICKET: '0x.*?'/,
      `TICKET: '${evmAddresses.Ticket}'`
    );
    dappConfigContent = dappConfigContent.replace(
      /EVENT: '0x.*?'/,
      `EVENT: '${evmAddresses.Event}'`
    );
    dappConfigContent = dappConfigContent.replace(
      /EVENT_MANAGER: '0x.*?'/,
      `EVENT_MANAGER: '${evmAddresses.EventManager}'`
    );

    // Write updated configuration
    fs.writeFileSync(dappConfigPath, dappConfigContent);

    console.log('✅ dApp contract addresses updated successfully in:', dappConfigPath);
    console.log('Updated addresses:', evmAddresses);

  } catch (error) {
    console.error('❌ Error updating dApp contract addresses:', error);
    process.exit(1);
  }
}

updateContractAddresses();
