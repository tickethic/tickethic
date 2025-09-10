'use client'

import { Button } from '@/components/ui/button'
import { Ticket, Menu, User, LogOut, Shield } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { useIsContractOwner } from '@/hooks/useIsContractOwner'

export function Navbar() {
  const { address, isConnected, connect, disconnect, formatAddress } = useWallet()
  const { isOwner } = useIsContractOwner()
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <Ticket className="text-purple-600 mr-2 w-6 h-6" />
              <span className="text-xl font-bold text-gray-800">Tickethic</span>
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-purple-600 transition">Accueil</a>
            <a href="/events" className="text-gray-700 hover:text-purple-600 transition">Événements</a>
            <a href="/organizers" className="text-gray-700 hover:text-purple-600 transition">Pour les organisateurs</a>
            <a href="/artists" className="text-gray-700 hover:text-purple-600 transition">Pour les artistes</a>
            {isOwner && (
              <a href="/admin" className="text-gray-700 hover:text-purple-600 transition flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                Admin
              </a>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={isConnected ? disconnect : connect}
              className={`px-4 py-2 rounded-md transition ${
                isConnected 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isConnected ? (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnecter mon wallet
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Connecter mon wallet
                </>
              )}
            </Button>
            <button className="md:hidden text-gray-700">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
