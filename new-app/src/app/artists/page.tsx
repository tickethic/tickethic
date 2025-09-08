'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ArtistList } from '@/components/ArtistList'
import { AllArtistsList } from '@/components/AllArtistsList'
import { OwnerArtistForm } from '@/components/OwnerArtistForm'
import { useWallet } from '@/hooks/useWallet'
import { useIsOwner } from '@/hooks/useOwnerArtist'
import { User, Music, Plus, Wallet } from 'lucide-react'
import { useState } from 'react'

export default function ArtistsPage() {
  const { isConnected, address } = useWallet()
  const { isOwner, isLoading: isLoadingOwner } = useIsOwner(address)
  const [activeTab, setActiveTab] = useState<'my-artists' | 'all-artists' | 'owner'>('my-artists')
  const [stats, setStats] = useState({ totalArtists: 0, totalEvents: 0, totalRevenue: 0 })

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        
        <div className="w-full flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-md p-12 max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Wallet className="w-12 h-12 text-purple-600" />
                </div>
                
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Connexion requise
                </h1>
                
                <p className="text-lg text-gray-600 mb-8">
                  Pour accéder à l'espace artistes, vous devez d'abord connecter votre wallet.
                </p>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">
                    Fonctionnalités disponibles pour les artistes :
                  </h3>
                  <ul className="text-left text-purple-700 space-y-2">
                    <li className="flex items-center">
                      <Plus className="w-4 h-4 mr-2" />
                      Soumettre une candidature artiste
                    </li>
                    <li className="flex items-center">
                      <Music className="w-4 h-4 mr-2" />
                      Gérer son profil artiste
                    </li>
                    <li className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Suivre ses performances et revenus
                    </li>
                  </ul>
                </div>
                
                <p className="text-sm text-gray-500">
                  Utilisez le bouton "Connecter mon wallet" dans la barre de navigation pour commencer.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="w-full flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Espace Artistes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Soumettez votre candidature pour devenir artiste et gérez votre profil sur la plateforme
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
              <User className="w-4 h-4" />
              <span>Connecté en tant que : {address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-lg mx-auto">
            <button
              onClick={() => setActiveTab('my-artists')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                activeTab === 'my-artists'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Mes artistes
            </button>
            <button
              onClick={() => setActiveTab('all-artists')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                activeTab === 'all-artists'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Tous les artistes
            </button>
            {isOwner && (
              <button
                onClick={() => setActiveTab('owner')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                  activeTab === 'owner'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Admin
              </button>
            )}
          </div>

          {/* Tab Content */}
          {activeTab === 'my-artists' ? (
            <ArtistList 
              artistAddress={address || ''} 
              onStatsUpdate={setStats}
            />
          ) : activeTab === 'all-artists' ? (
            <AllArtistsList />
          ) : (
            <OwnerArtistForm />
          )}

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalArtists}</div>
              <div className="text-gray-600">Profils artistes</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalEvents}</div>
              <div className="text-gray-600">Événements participés</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalRevenue.toFixed(4)} ETH</div>
              <div className="text-gray-600">Revenus générés</div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
