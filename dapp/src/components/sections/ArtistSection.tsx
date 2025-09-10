'use client'
import { useState } from 'react'
import { useWriteContract, useAccount } from 'wagmi'
import { parseAbi } from 'viem'
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '@/config/contracts'

export const ArtistSection = () => {
  const { address } = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()

  // Registration form state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [artistName, setArtistName] = useState('')
  const [artistMetadataURI, setArtistMetadataURI] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSignUpClick = () => {
    setDialogOpen(true)
    setArtistName('')
    setArtistMetadataURI('')
    setError(null)
    setSuccess(null)
  }

  const handleDialogCancel = () => {
    setDialogOpen(false)
    setArtistName('')
    setArtistMetadataURI('')
    setError(null)
    setSuccess(null)
  }

  const handleSignUpArtist = async () => {
    setError(null)
    setSuccess(null)
    
    if (!artistName || !artistMetadataURI) {
      setError('Veuillez remplir tous les champs')
      return
    }

    if (!address) {
      setError('Veuillez connecter votre wallet')
      return
    }

    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.ARTIST,
        abi: parseAbi(CONTRACT_ABIS.ARTIST),
        functionName: 'mintArtist',
        args: [artistName, artistMetadataURI],
      })
      
      setSuccess('NFT Artiste créé avec succès !')
      setDialogOpen(false)
      setArtistName('')
      setArtistMetadataURI('')
      
    } catch (error) {
      console.error("Failed to sign up artist:", error)
      setError('Échec de la création du NFT Artiste')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">🎵</span>
          <div>
            <h2 className="text-2xl font-bold text-purple-900">Section Artistes</h2>
            <p className="text-purple-700">Inscrivez-vous comme artiste et gérez votre profil pour participer aux événements</p>
          </div>
        </div>
      </div>

      {/* Artist Registration */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Inscription Artiste</h3>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Comment devenir artiste ?</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Créez un NFT Artiste avec vos informations</li>
              <li>• Définissez votre URI de métadonnées IPFS</li>
              <li>• Les organisateurs pourront vous sélectionner pour leurs événements</li>
              <li>• Vous recevrez automatiquement votre part des revenus</li>
            </ul>
          </div>

          <button
            onClick={handleSignUpClick}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            🎵 S&apos;inscrire comme Artiste
          </button>
        </div>
      </div>

      {/* Artist Profile */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Mon Profil Artiste</h3>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎭</div>
          <h4 className="text-xl font-medium text-gray-900 mb-2">Profil Artiste</h4>
          <p className="text-gray-600 mb-6">
            Ici vous pourrez voir votre profil artiste, vos événements passés et futurs, et vos revenus.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-yellow-800 text-sm">
              <strong>Fonctionnalité à venir :</strong> Affichage du profil, historique des événements, statistiques de revenus.
            </p>
          </div>
        </div>
      </div>

      {/* Registration Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Inscription Artiste</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l&apos;Artiste *
                </label>
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Votre nom d'artiste"
                  disabled={isPending}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URI Métadonnées IPFS *
                </label>
                <input
                  type="text"
                  value={artistMetadataURI}
                  onChange={(e) => setArtistMetadataURI(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="ipfs://Qm..."
                  disabled={isPending}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lien vers vos métadonnées (nom, description, liens sociaux, etc.)
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleSignUpArtist}
                  disabled={isPending || !artistName || !artistMetadataURI}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isPending ? 'Création...' : 'Créer NFT Artiste'}
                </button>
                <button
                  onClick={handleDialogCancel}
                  disabled={isPending}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
