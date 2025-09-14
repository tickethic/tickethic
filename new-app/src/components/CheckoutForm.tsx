'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@/hooks/useWallet'
import { useBuyTicket } from '@/hooks/useBuyTicket'
import { useEventStatus } from '@/hooks/useEventStatus'
import { useEventValidation } from '@/hooks/useEventValidation'
import { EventInfo } from './EventInfo'
import { CreditCard, CheckCircle, Shield, AlertCircle } from 'lucide-react'

interface CheckoutFormProps {
  eventId: number
  eventAddress: string
  ticketPrice: bigint
  eventName: string
}

export function CheckoutForm({ eventId, eventAddress, ticketPrice, eventName }: CheckoutFormProps) {
  const router = useRouter()
  const { address, isConnected } = useWallet()
  const { buyTicket, isLoading, isConfirmed, error, hash, ticketId } = useBuyTicket()
  const { 
    date, 
    ticketPrice: contractTicketPrice, 
    totalTickets, 
    soldTickets, 
    organizer,
    isLoading: isLoadingStatus, 
    hasError: hasContractError,
    isEventValid, 
    validationError 
  } = useEventStatus(eventAddress)

  const { 
    isEventValid: isEventContractValid, 
    validationErrors: contractValidationErrors 
  } = useEventValidation(eventAddress)
  
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected || !address) {
      alert('Veuillez connecter votre wallet pour continuer')
      return
    }

    if (!agreedToTerms) {
      alert('Veuillez accepter les conditions générales')
      return
    }

    // Check if user has enough ETH (add some buffer for gas)
    const requiredEth = Number(contractTicketPrice || ticketPrice) / 1e18
    const gasBuffer = 0.01 // 0.01 ETH buffer for gas
    const totalRequired = requiredEth + gasBuffer
    
    console.log('=== ETH BALANCE CHECK ===')
    console.log('Required ETH for ticket:', requiredEth)
    console.log('Gas buffer:', gasBuffer)
    console.log('Total required:', totalRequired)
    console.log('========================')

    // Check contract validation
    if (!isEventContractValid) {
      console.error('Contract validation failed:', contractValidationErrors)
      alert(`Erreur de validation du contrat : ${contractValidationErrors.join(', ')}`)
      return
    }

    // Debug: Log the values being sent
    console.log('=== DEBUG ACHAT BILLET ===')
    console.log('Event Address:', eventAddress)
    console.log('Ticket Price from props (wei):', ticketPrice.toString())
    console.log('Ticket Price from props (ETH):', (Number(ticketPrice) / 1e18).toString())
    console.log('Contract Ticket Price (wei):', contractTicketPrice?.toString() || 'Loading...')
    console.log('Contract Ticket Price (ETH):', contractTicketPrice ? (Number(contractTicketPrice) / 1e18).toString() : 'Loading...')
    console.log('User Address:', address)
    console.log('Event Valid:', isEventValid)
    console.log('Validation Error:', validationError)
    console.log('Sold Tickets:', soldTickets?.toString() || 'Loading...')
    console.log('Total Tickets:', totalTickets?.toString() || 'Loading...')
    console.log('Event Date:', date ? new Date(Number(date) * 1000).toISOString() : 'Loading...')
    console.log('Current Time:', new Date().toISOString())
    console.log('Organizer:', organizer || 'Loading...')
    console.log('Has Contract Error:', hasContractError)
    console.log('========================')

    // Use contract price if available, otherwise fallback to props price
    const finalTicketPrice = contractTicketPrice || ticketPrice
    
    console.log('Using ticket price (wei):', finalTicketPrice.toString())
    console.log('Using ticket price (ETH):', (Number(finalTicketPrice) / 1e18).toString())

    try {
      await buyTicket({
        eventAddress,
        ticketPrice: finalTicketPrice,
        buyerInfo: {
          walletAddress: address
        }
      })
    } catch (error) {
      console.error('Error buying ticket:', error)
    }
  }

  // Success state
  if (isConfirmed) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Billet acheté !</h2>
        <p className="text-gray-600 mb-6">
          Votre billet pour <strong>{eventName}</strong> a été acheté avec succès.
        </p>
        
        {ticketId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-gray-700 mb-1">ID du billet :</p>
            <p className="text-lg font-mono text-gray-800">#{ticketId.toString()}</p>
          </div>
        )}

        {hash && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-gray-700 mb-1">Transaction :</p>
            <p className="text-xs font-mono text-gray-600 break-all">{hash}</p>
            <button
              onClick={() => navigator.clipboard.writeText(hash)}
              className="mt-2 text-xs text-purple-600 hover:text-purple-800 underline"
            >
              📋 Copier l'hash
            </button>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.push('/events')}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            Retour aux événements
          </button>
          <button
            onClick={() => router.push('/profile')}
            className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition font-semibold"
          >
            Voir mes billets
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Confirmer l'achat</h2>
      
      {/* Informations de l'événement */}
      <EventInfo eventAddress={eventAddress} />
      
      {/* Wallet Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-2">
          <Shield className="w-5 h-5 text-purple-600 mr-2" />
          <span className="font-medium text-gray-800">Wallet connecté</span>
        </div>
        <p className="text-sm text-gray-600 font-mono">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </div>

      {/* Event Status Debug */}
      {isLoadingStatus ? (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-800 text-sm">Vérification de l'événement...</span>
          </div>
        </div>
      ) : hasContractError ? (
        <div className="bg-red-50 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="font-medium text-red-800">Erreur de lecture du contrat</span>
          </div>
          <p className="text-red-700 text-sm">
            Impossible de lire les données de l'événement. Vérifiez que l'adresse du contrat est correcte.
          </p>
          <p className="text-red-600 text-xs mt-2 font-mono">
            Adresse: {eventAddress}
          </p>
        </div>
      ) : !isEventValid ? (
        <div className="bg-red-50 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="font-medium text-red-800">Événement non disponible</span>
          </div>
          <p className="text-red-700 text-sm">{validationError}</p>
        </div>
      ) : !isEventContractValid ? (
        <div className="bg-red-50 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="font-medium text-red-800">Contrat invalide</span>
          </div>
          <p className="text-red-700 text-sm">
            {contractValidationErrors.join(', ')}
          </p>
        </div>
      ) : (
        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="font-medium text-green-800">Événement disponible</span>
          </div>
          <div className="text-sm text-green-700 space-y-1">
            <p>Prix: {contractTicketPrice ? (Number(contractTicketPrice) / 1e18).toFixed(4) : '...'} ETH</p>
            <p>Billets: {soldTickets?.toString() || '...'} / {totalTickets?.toString() || '...'}</p>
            <p>Date: {date ? new Date(Number(date) * 1000).toLocaleString('fr-FR') : '...'}</p>
            <p>Organisateur: {organizer ? `${organizer.slice(0, 6)}...${organizer.slice(-4)}` : '...'}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Terms and Conditions */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            J'accepte les{' '}
            <a 
              href="/conditions-generales" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 underline"
            >
              conditions générales
            </a>{' '}
            et la{' '}
            <a 
              href="/politique-confidentialite" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 underline"
            >
              politique de confidentialité
            </a>
          </label>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium mb-2">
              Erreur lors de l'achat
            </p>
            <p className="text-red-700 text-sm">
              {error.message || 'Une erreur inattendue s\'est produite. Veuillez réessayer.'}
            </p>
            <div className="mt-2 text-xs text-red-600">
              <p>Vérifiez que :</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Votre wallet a suffisamment d'ETH</li>
                <li>L'événement n'est pas complet</li>
                <li>L'événement n'a pas encore eu lieu</li>
                <li>Le montant envoyé correspond au prix du billet</li>
              </ul>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !agreedToTerms || !isEventValid || !isEventContractValid || isLoadingStatus}
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Achat en cours...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Acheter le billet
            </>
          )}
        </button>
      </form>
    </div>
  )
}
