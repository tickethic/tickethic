import { run, ethers } from "hardhat";
import fs from 'fs';
import path from 'path';
import TickethicWithEventManagerModule from "../ignition/modules/TickethicWithEventManager";

async function main() {
  console.log("🚀 Starting Tickethic deployment with EventManager...");

  const deployment = await run("ignition deploy", {
    module: TickethicWithEventManagerModule,
    parameters: {
      TickethicWithEventManagerModule: {
        // No specific parameters needed here as they are defined in the module
      },
    },
  });

  const deployedAddresses = {
    Artist: deployment.Artist.address,
    Ticket: deployment.Ticket.address,
    Organizator: deployment.Organizator.address,
    Event: deployment.Event.address,
    EventManager: deployment.EventManager.address,
  };

  const addressesPath = path.resolve(__dirname, '../contract-addresses.json');
  fs.writeFileSync(addressesPath, JSON.stringify(deployedAddresses, null, 2));

  console.log("✅ Contracts deployed and addresses saved to contract-addresses.json:");
  console.log(deployedAddresses);

  console.log("🎉 Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
