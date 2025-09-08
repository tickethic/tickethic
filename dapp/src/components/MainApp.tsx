'use client'
import { useState } from 'react'
import { useDisconnect, useAppKitNetwork } from '@reown/appkit/react'
import { networks } from '@/config'
import { useAccount } from 'wagmi'
import { Navigation, UserRole } from './Navigation'
import { OrganizerSection } from './sections/OrganizerSection'
import { ValidatorSection } from './sections/ValidatorSection'
import { ArtistSection } from './sections/ArtistSection'
import { ParticipantSection } from './sections/ParticipantSection'

export const MainApp = () => {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchNetwork } = useAppKitNetwork()
  
  const [activeRole, setActiveRole] = useState<UserRole>('participant')

  const handleDisconnect = async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error("Failed to disconnect:", error)
    }
  }

  const renderActiveSection = () => {
    switch (activeRole) {
      case 'organizer':
        return <OrganizerSection />
      case 'validator':
        return <ValidatorSection />
      case 'artist':
        return <ArtistSection />
      case 'participant':
        return <ParticipantSection />
      default:
        return <ParticipantSection />
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🔗</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tickethic</h1>
          <p className="text-gray-600 mb-6">
            Connectez votre wallet pour accéder à la plateforme de ticketing décentralisée
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Réseau supporté :</strong> Polygon Amoy (Testnet)
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎫</span>
              <h1 className="text-xl font-bold text-gray-900">Tickethic</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-mono">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Non connecté'}
                </span>
              </div>
              <button
                onClick={() => switchNetwork(networks[1])}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Switch Network
              </button>
              <button
                onClick={handleDisconnect}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <Navigation activeRole={activeRole} onRoleChange={setActiveRole} />
        
        {/* Active Section */}
        <div className="mb-8">
          {renderActiveSection()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Tickethic - Plateforme de ticketing décentralisée sur Polygon
            </p>
            <p className="text-xs mt-2">
              Réseau de test : Polygon Amoy | Version 1.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
