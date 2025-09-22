// Utilitaires pour les appels IPFS directs
export const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://dweb.link/ipfs/',
  'https://ipfs.fleek.co/ipfs/',
  'https://gateway.originprotocol.com/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://ipfs.infura.io/ipfs/'
]

export async function fetchFromIPFS(ipfsHash: string): Promise<any> {
  // Remove ipfs:// prefix if present
  const cleanHash = ipfsHash.replace('ipfs://', '')
  
  // Try each gateway until one works
  for (const gateway of IPFS_GATEWAYS) {
    try {
      const url = `${gateway}${cleanHash}`
      console.log(`Trying IPFS gateway: ${url}`)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log(`Successfully fetched from IPFS: ${url}`)
        return data
      }
    } catch (error) {
      console.log(`IPFS gateway failed: ${gateway}${cleanHash}`, error instanceof Error ? error.message : 'Unknown error')
      continue
    }
  }
  
  throw new Error(`All IPFS gateways failed for hash: ${cleanHash}`)
}

export async function fetchMetadata(metadataURI: string): Promise<any> {
  if (metadataURI.startsWith('ipfs://')) {
    return await fetchFromIPFS(metadataURI)
  } else if (metadataURI.startsWith('http://') || metadataURI.startsWith('https://')) {
    // Direct HTTP/HTTPS URL
    const response = await fetch(metadataURI, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000)
    })
    
    if (response.ok) {
      return await response.json()
    } else {
      throw new Error(`HTTP request failed: ${response.status}`)
    }
  } else {
    throw new Error(`Unsupported metadata URI format: ${metadataURI}`)
  }
}
