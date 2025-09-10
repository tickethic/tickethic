'use client'
import { useState } from 'react'
import { useWriteContract, useAccount } from 'wagmi'
import { parseAbi } from 'viem'

export const ParticipantSection = () => {
  const { address } = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()

  // Ticket purchase form state
  const [eventAddress, setEventAddress] = useState('')
  const [ticketPrice, setTicketPrice] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleBuyTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!eventAddress || !ticketPrice) {
      setError('Veuillez remplir tous les champs')
      return
    }

    if (!address) {
      setError('Veuillez connecter votre wallet')
      return
    }

    try {
      // Parse the event contract ABI for buyTicket function
      const eventABI = parseAbi([
        'function buyTicket() external payable'
      ])

      await writeContractAsync({
        address: eventAddress as `0x${string}`,
        abi: eventABI,
        functionName: 'buyTicket',
        value: BigInt(Math.floor(parseFloat(ticketPrice) * 1e18)) // Convert ETH to wei
      })

      setSuccess(`Ticket acheté avec succès pour ${ticketPrice} ETH !`)
      setEventAddress('')
      setTicketPrice('')
      
    } catch (error) {
      console.error('Ticket purchase failed:', error)
      setError('Échec de l&apos;achat du ticket. Vérifiez l&apos;adresse de l&apos;événement et le prix.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">🎫</span>
          <div>
            <h2 className="text-2xl font-bold text-orange-900">Section Participants</h2>
            <p className="text-orange-700">Achetez des tickets pour vos événements favoris et gérez votre collection</p>
          </div>
        </div>
      </div>

      {/* Ticket Purchase */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Acheter un Ticket</h3>
        
        <form onSubmit={handleBuyTicket} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse du Contrat Événement
            </label>
            <input
              type="text"
              value={eventAddress}
              onChange={(e) => setEventAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="0x..."
              disabled={isPending}
            />
            <p className="text-xs text-gray-500 mt-1">
              L&apos;adresse du contrat de l&apos;événement
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix du Ticket (ETH)
            </label>
            <input
              type="number"
              step="0.001"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="0.1"
              disabled={isPending}
            />
            <p className="text-xs text-gray-500 mt-1">
              Le prix exact du ticket en ETH
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-600">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || !eventAddress || !ticketPrice}
            className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isPending ? 'Achat en cours...' : '🎫 Acheter le Ticket'}
          </button>
        </form>
      </div>

      {/* My Tickets */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Mes Tickets</h3>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎫</div>
          <h4 className="text-xl font-medium text-gray-900 mb-2">Collection de Tickets</h4>
          <p className="text-gray-600 mb-6">
            Ici vous pourrez voir tous vos tickets NFT, leur statut de validation, et les détails des événements.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-yellow-800 text-sm">
              <strong>Fonctionnalité à venir :</strong> Affichage des tickets NFT, statut de validation, détails des événements.
            </p>
          </div>
        </div>
      </div>

      {/* Available Events */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Événements Disponibles</h3>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎪</div>
          <h4 className="text-xl font-medium text-gray-900 mb-2">Découvrir les Événements</h4>
          <p className="text-gray-600 mb-6">
            Parcourez tous les événements disponibles, découvrez les artistes et achetez vos tickets.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-yellow-800 text-sm">
              <strong>Fonctionnalité à venir :</strong> Liste des événements, filtres par date/genre, détails des artistes.
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Comment acheter un ticket ?</h3>
        <div className="space-y-2 text-blue-800">
              <p><strong>1.</strong> Obtenez l&apos;adresse du contrat événement de l&apos;organisateur</p>
          <p><strong>2.</strong> Vérifiez le prix exact du ticket</p>
              <p><strong>3.</strong> Assurez-vous d&apos;avoir assez d&apos;ETH dans votre wallet</p>
              <p><strong>4.</strong> Cliquez sur &quot;Acheter le Ticket&quot; pour finaliser l&apos;achat</p>
          <p><strong>5.</strong> Votre ticket NFT sera automatiquement ajouté à votre wallet</p>
        </div>
      </div>
    </div>
  )
}
