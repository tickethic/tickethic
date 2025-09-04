import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ArtistOnlyModule = buildModule("ArtistOnlyModule", (m) => {
  // Deploy only Artist contract
  const artist = m.contract("Artist");

  return { artist };
});

export default ArtistOnlyModule;
