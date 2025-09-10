'use client'
import { useState } from 'react'
import { useWriteContract, useAccount } from 'wagmi'
import { parseAbi } from 'viem'

export const ValidatorSection = () => {
  const { address } = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()
  
  const [ticketId, setTicketId] = useState('')
  const [eventAddress, setEventAddress] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!ticketId || !eventAddress) {
      setError('Veuillez remplir tous les champs')
      return
    }

    if (!address) {
      setError('Veuillez connecter votre wallet')
      return
    }

    try {
      // Parse the event contract ABI for checkIn function
      const eventABI = parseAbi([
        'function checkIn(uint256 tokenId) external'
      ])

      await writeContractAsync({
        address: eventAddress as `0x${string}`,
        abi: eventABI,
        functionName: 'checkIn',
        args: [BigInt(ticketId)]
      })

      setSuccess(`Ticket #${ticketId} validé avec succès !`)
      setTicketId('')
      
    } catch (error) {
      console.error('Check-in failed:', error)
      setError('Échec de la validation. Vérifiez que vous êtes autorisé et que le ticket existe.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">✅</span>
          <div>
            <h2 className="text-2xl font-bold text-green-900">Section Validateurs</h2>
            <p className="text-green-700">Vérifiez et validez les tickets à l&apos;entrée des événements</p>
          </div>
        </div>
      </div>

      {/* Check-in Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Validation de Ticket</h3>
        
        <form onSubmit={handleCheckIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse du Contrat Événement
            </label>
            <input
              type="text"
              value={eventAddress}
              onChange={(e) => setEventAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0x..."
              disabled={isPending}
            />
            <p className="text-xs text-gray-500 mt-1">
              L&apos;adresse du contrat de l&apos;événement à valider
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID du Ticket
            </label>
            <input
              type="number"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="123"
              disabled={isPending}
            />
            <p className="text-xs text-gray-500 mt-1">
              Le numéro du ticket à valider
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
            disabled={isPending || !ticketId || !eventAddress}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isPending ? 'Validation en cours...' : '✅ Valider le Ticket'}
          </button>
        </form>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Instructions pour les Validateurs</h3>
        <div className="space-y-2 text-blue-800">
              <p><strong>1.</strong> Obtenez l&apos;adresse du contrat événement de l&apos;organisateur</p>
              <p><strong>2.</strong> Demandez l&apos;ID du ticket au participant</p>
              <p><strong>3.</strong> Cliquez sur &quot;Valider le Ticket&quot; pour confirmer l&apos;entrée</p>
          <p><strong>4.</strong> Le ticket ne pourra plus être utilisé après validation</p>
        </div>
      </div>

      {/* Validator Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Statut du Validateur</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Wallet connecté :</span>
            <span className="font-mono text-sm">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Non connecté'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Statut :</span>
            <span className="text-yellow-600">En attente d&apos;autorisation</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            <strong>Note :</strong> Vous devez être ajouté comme validateur par l&apos;organisateur de l&apos;événement pour pouvoir valider les tickets.
          </p>
        </div>
      </div>
    </div>
  )
}
