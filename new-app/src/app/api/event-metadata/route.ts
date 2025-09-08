import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const metadataURI = searchParams.get('uri')
    
    console.log('Event metadata API called with URI:', metadataURI)
    
    if (!metadataURI) {
      return NextResponse.json(
        { error: 'Metadata URI is required' },
        { status: 400 }
      )
    }

    // Try to fetch from IPFS - but NEVER for artist URIs
    let metadata
    try {
      if (metadataURI.startsWith('ipfs://')) {
        // NEVER fetch artist metadata for events
        if (metadataURI.startsWith('ipfs://artist-')) {
          console.log('BLOCKED: Artist URI detected for event metadata:', metadataURI)
          metadata = null
        } else {
          // Convert IPFS URI to HTTP URL
          const ipfsHash = metadataURI.replace('ipfs://', '')
          const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`
          
          const response = await fetch(ipfsUrl)
          if (response.ok) {
            const fetchedData = await response.json()
            // Double check: if the fetched data looks like artist data, reject it
            if (fetchedData.name && fetchedData.external_url) {
              console.log('BLOCKED: Fetched data looks like artist metadata:', fetchedData.name)
              metadata = null
            } else {
              metadata = fetchedData
              console.log('Fetched event metadata from IPFS:', metadata)
            }
          }
        }
      } else if (metadataURI.startsWith('http')) {
        // Direct HTTP URL
        const response = await fetch(metadataURI)
        if (response.ok) {
          metadata = await response.json()
        }
      }
    } catch (ipfsError) {
      console.warn('Failed to fetch from IPFS, using fallback:', ipfsError)
    }

    // Fallback to placeholder data if IPFS fetch fails
    if (!metadata) {
      // Extract event name from URI if it's in the format event://event-name-timestamp
      let eventName = 'Événement'
      
      if (metadataURI.startsWith('event://')) {
        const eventSlug = metadataURI.replace('event://', '')
        // Remove timestamp and convert back to readable name
        const nameWithoutTimestamp = eventSlug.replace(/-\d+$/, '')
        eventName = nameWithoutTimestamp
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      } else if (metadataURI.startsWith('ipfs://event-')) {
        // Handle old format ipfs://event-timestamp
        const eventSlug = metadataURI.replace('ipfs://event-', '')
        eventName = `Événement #${eventSlug}`
      } else if (metadataURI.startsWith('ipfs://artist-')) {
        // This is an artist URI being used for an event - this is wrong!
        console.warn('Artist URI used for event metadata:', metadataURI)
        const artistId = metadataURI.replace('ipfs://artist-', '')
        eventName = `Événement avec Artiste #${artistId}`
      } else {
        // Generic fallback
        eventName = `Événement #${Date.now()}`
      }
      
      metadata = {
        name: eventName,
        description: `Rejoignez-nous pour ${eventName.toLowerCase()}, un événement musical exceptionnel avec des artistes talentueux. Venez profiter d'une soirée inoubliable dans une ambiance unique.`,
        image: 'https://via.placeholder.com/400x200/7c3aed/ffffff?text=Event',
        date: new Date().toISOString(),
        location: 'À définir',
        category: 'Musique'
      }
    }

    return NextResponse.json(metadata)
  } catch (error) {
    console.error('Error fetching event metadata:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event metadata' },
      { status: 500 }
    )
  }
}
