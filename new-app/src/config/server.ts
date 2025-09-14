// Server-side contract addresses (for API routes) with fallbacks
// These use environment variables without NEXT_PUBLIC_ prefix
export const serverContractAddresses = {
  Artist: process.env.ARTIST_CONTRACT || "0x726D177E3F7f7e727Cbd4f109eD712fa5D09C989",
  Organizator: process.env.ORGANIZATOR_CONTRACT || "0x2BCBd0d867cccfEF9746C3400c16512460011407",
  Ticket: process.env.TICKET_CONTRACT || "0x25F13fC9413d6969dBee5f686b20c71Aa2273505",
  Event: process.env.EVENT_CONTRACT || "0x7a18BCd38346BBd2A99b7C1740270450e4Ef063b",
  EventManager: process.env.EVENT_MANAGER_CONTRACT || "0xd23a1dF74d3E56D2B1aba069F2735FEe197F051f"
} as const
