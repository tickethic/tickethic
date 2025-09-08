import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const metadataURI = searchParams.get('uri')
    
    if (!metadataURI) {
      return NextResponse.json(
        { error: 'Metadata URI is required' },
        { status: 400 }
      )
    }

    // For now, we'll return placeholder data
    // In a real implementation, you would fetch from IPFS using the metadataURI
    const placeholderMetadata = {
      name: `Événement ${Math.floor(Math.random() * 1000)}`,
      description: 'Description de l\'événement...',
      image: 'https://via.placeholder.com/400x200',
      date: new Date().toISOString(),
      location: 'Lieu de l\'événement',
      category: 'Musique'
    }

    return NextResponse.json(placeholderMetadata)
  } catch (error) {
    console.error('Error fetching event metadata:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event metadata' },
      { status: 500 }
    )
  }
}
