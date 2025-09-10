'use client'
import { useState } from 'react'
import { CreateEventForm } from './CreateEventForm'
import { ArtistList } from './ArtistList'

interface EventManagerProps {
  onCancel?: () => void
}

export const EventManager = ({ onCancel }: EventManagerProps) => {
  const [activeTab, setActiveTab] = useState<'create' | 'artists'>('create')

  const handleEventCreated = (eventId: number, eventAddress: string) => {
    console.log('Event created:', { eventId, eventAddress })
    // You can add success notification here
    alert(`Event created successfully! ID: ${eventId}, Address: ${eventAddress}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
              <p className="text-gray-600 mt-2">
                Create events and manage artists for your ticketing platform
              </p>
            </div>
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                ← Back
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create Event
            </button>
            <button
              onClick={() => setActiveTab('artists')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'artists'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Browse Artists
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'create' && (
            <CreateEventForm onEventCreated={handleEventCreated} />
          )}
          
          {activeTab === 'artists' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Available Artists</h2>
              <ArtistList />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}