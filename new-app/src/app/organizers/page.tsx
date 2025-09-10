'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CreateEventForm } from '@/components/CreateEventForm'
import { OrganizerEventsList } from '@/components/OrganizerEventsList'
import { OrganizerRegistration } from '@/components/OrganizerRegistration'
import { OrganizerAdmin } from '@/components/OrganizerAdmin'
import { useWallet } from '@/hooks/useWallet'
import { useOrganizerStatus } from '@/hooks/useOrganizerStatus'
// Remove the import since we're now using the API directly
import { User, Calendar, Plus, Wallet, UserCheck } from 'lucide-react'
import { useState } from 'react'

export default function OrganizersPage() {
  const { isConnected, address } = useWallet()
  const { isOrganizer, isLoading: isLoadingStatus } = useOrganizerStatus(address)
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create')
  // We'll get the stats from the OrganizerEventsList component
  const [stats, setStats] = useState({ totalEvents: 0, totalSold: 0, totalRevenue: 0 })

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
                  Pour accéder à l'espace organisateurs, vous devez d'abord connecter votre wallet.
                </p>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">
                    Fonctionnalités disponibles pour les organisateurs :
                  </h3>
                  <ul className="text-left text-purple-700 space-y-2">
                    <li className="flex items-center">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer de nouveaux événements
                    </li>
                    <li className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Gérer vos événements existants
                    </li>
                    <li className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Suivre les ventes et statistiques
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

  // Show loading state while checking organizer status
  if (isLoadingStatus) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="w-full flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Vérification du statut d'organisateur...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Show registration form if not an organizer
  if (!isOrganizer) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        
        <div className="w-full flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Espace Organisateurs
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Vous devez être enregistré comme organisateur pour accéder à cette section
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <User className="w-4 h-4" />
                <span>Connecté en tant que : {address?.slice(0, 6)}...{address?.slice(-4)}</span>
              </div>
            </div>
            
            <OrganizerAdmin />
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
              Espace Organisateurs
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Gérez vos événements et créez de nouvelles expériences pour votre communauté
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
              <UserCheck className="w-4 h-4 text-green-600" />
              <span>Organisateur vérifié : {address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                activeTab === 'create'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Créer un événement
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                activeTab === 'manage'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Mes événements
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'create' ? (
            <CreateEventForm />
          ) : (
            <OrganizerEventsList 
              organizerAddress={address || ''} 
              onStatsUpdate={setStats}
            />
          )}

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalEvents}</div>
              <div className="text-gray-600">Événements créés</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalSold}</div>
              <div className="text-gray-600">Billets vendus</div>
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
