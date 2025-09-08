'use client'

import { useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { useArtistRegistration, ArtistRegistrationData } from '@/hooks/useArtistRegistration'
import { Music, User, Globe, Twitter, Instagram, Headphones, Upload, CheckCircle, AlertCircle } from 'lucide-react'

export function CreateArtistForm() {
  const { address } = useWallet()
  const { mintArtist, isLoading, error, success, hash } = useArtistRegistration()
  
  const [formData, setFormData] = useState<ArtistRegistrationData>({
    name: '',
    description: '',
    genre: '',
    socialLinks: {
      website: '',
      twitter: '',
      instagram: '',
      spotify: ''
    },
    imageUrl: ''
  })

  const [errors, setErrors] = useState<Partial<ArtistRegistrationData>>({})

  const genres = [
    'Rock', 'Pop', 'Hip-Hop', 'Electronic', 'Jazz', 'Classical', 
    'Country', 'R&B', 'Reggae', 'Blues', 'Folk', 'Metal', 'Punk', 'Indie', 'Autre'
  ]

  const validateForm = (): boolean => {
    const newErrors: Partial<ArtistRegistrationData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de l\'artiste est requis'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise'
    }

    if (!formData.genre) {
      newErrors.genre = 'Le genre musical est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!address) {
      alert('Veuillez connecter votre wallet')
      return
    }

    if (!validateForm()) {
      return
    }

    await mintArtist(formData)
  }

  const handleInputChange = (field: keyof ArtistRegistrationData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleSocialLinkChange = (platform: keyof ArtistRegistrationData['socialLinks'], value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }))
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Artiste créé avec succès !
          </h2>
          
          <p className="text-gray-600 mb-6">
            Votre profil artiste a été créé avec succès sur la blockchain. Vous pouvez maintenant participer aux événements.
          </p>
          
          {hash && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Transaction hash :</p>
              <p className="text-xs font-mono text-gray-800 break-all">{hash}</p>
            </div>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Créer un autre profil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
            <Music className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Créer un Profil Artiste</h2>
            <p className="text-gray-600">Créez votre profil artiste NFT sur la blockchain</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Comment ça marche ?
          </h3>
          <p className="text-blue-700 text-sm mb-2">
            Créez directement votre profil artiste NFT sur la blockchain. Chaque wallet peut créer un seul profil artiste.
          </p>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Remplissez le formulaire ci-dessous</li>
            <li>• Votre profil NFT sera créé instantanément</li>
            <li>• Vous pourrez participer aux événements</li>
            <li>• Limite : 1 profil artiste par wallet</li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom de l'artiste */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'artiste *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Votre nom d'artiste"
              />
            </div>
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Décrivez votre style musical, votre parcours, vos influences..."
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genre musical *
            </label>
            <select
              value={formData.genre}
              onChange={(e) => handleInputChange('genre', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.genre ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionnez un genre</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            {errors.genre && <p className="text-red-600 text-sm mt-1">{errors.genre}</p>}
          </div>

          {/* Liens sociaux */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Liens sociaux (optionnel)
            </label>
            <div className="space-y-3">
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={formData.socialLinks.website}
                  onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Site web"
                />
              </div>
              
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Twitter/X"
                />
              </div>
              
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Instagram"
                />
              </div>
              
              <div className="relative">
                <Headphones className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={formData.socialLinks.spotify}
                  onChange={(e) => handleSocialLinkChange('spotify', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Musique/Streaming"
                />
              </div>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de l'image de profil (optionnel)
            </label>
            <div className="relative">
              <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://example.com/your-image.jpg"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Création en cours...
              </div>
            ) : (
              'Créer mon profil artiste'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
