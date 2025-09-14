// Server-side contract addresses (for API routes)
// These use environment variables without NEXT_PUBLIC_ prefix
export const serverContractAddresses = {
  Artist: process.env.ARTIST_CONTRACT!,
  Organizator: process.env.ORGANIZATOR_CONTRACT!,
  Ticket: process.env.TICKET_CONTRACT!,
  Event: process.env.EVENT_CONTRACT!,
  EventManager: process.env.EVENT_MANAGER_CONTRACT!
} as const

// Validate that all required environment variables are present
const requiredEnvVars = [
  'ARTIST_CONTRACT',
  'ORGANIZATOR_CONTRACT', 
  'TICKET_CONTRACT',
  'EVENT_CONTRACT',
  'EVENT_MANAGER_CONTRACT'
] as const

const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
if (missingVars.length > 0) {
  throw new Error(`Missing required server environment variables: ${missingVars.join(', ')}`)
}
