'use client'
import { useState } from 'react'
import { CreateEventForm } from '../CreateEventForm'
import { ArtistList } from '../ArtistList'

export const OrganizerSection = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'artists' | 'events'>('create')

  const handleEventCreated = (eventId: number, eventAddress: string) => {
    console.log('Event created:', { eventId, eventAddress })
    alert(`Événement créé avec succès !\nID: ${eventId}\nAdresse: ${eventAddress}`)
    setActiveTab('events') // Switch to events tab after creation
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">🎪</span>
          <div>
            <h2 className="text-2xl font-bold text-blue-900">Section Organisateurs</h2>
            <p className="text-blue-700">Créez et gérez vos événements, sélectionnez les artistes et définissez les parts de revenus</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🎪 Créer un Événement
            </button>
            <button
              onClick={() => setActiveTab('artists')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'artists'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🎵 Artistes Disponibles
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'events'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📅 Mes Événements
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'create' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Créer un Nouvel Événement</h3>
              <CreateEventForm onEventCreated={handleEventCreated} />
            </div>
          )}
          
          {activeTab === 'artists' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Artistes Disponibles</h3>
              <ArtistList />
            </div>
          )}
          
          {activeTab === 'events' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Mes Événements</h3>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h4 className="text-xl font-medium text-gray-900 mb-2">Gestion des Événements</h4>
                <p className="text-gray-600 mb-6">
                  Ici vous pourrez voir tous vos événements créés, leurs statistiques de vente, et gérer les validateurs.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-yellow-800 text-sm">
                    <strong>Fonctionnalité à venir :</strong> Affichage des événements, statistiques de vente, gestion des validateurs.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
