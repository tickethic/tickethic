'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWallet } from '@/hooks/useWallet'
import { Ticket, Wallet, Calendar, MapPin, Clock, ExternalLink, QrCode } from 'lucide-react'

export default function MesBilletsPage() {
  const { isConnected, address } = useWallet()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        
        <div className="w-full flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-md p-12 max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Wallet className="w-12 h-12 text-purple-600" />
                </div>
                
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Connexion requise
                </h1>
                
                <p className="text-lg text-gray-600 mb-8">
                  Pour voir vos billets NFT, vous devez d'abord connecter votre wallet.
                </p>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">
                    Vos billets NFT :
                  </h3>
                  <ul className="text-left text-purple-700 space-y-2">
                    <li className="flex items-center">
                      <Ticket className="w-4 h-4 mr-2" />
                      Billets d'événements uniques
                    </li>
                    <li className="flex items-center">
                      <QrCode className="w-4 h-4 mr-2" />
                      Codes QR pour l'entrée
                    </li>
                    <li className="flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Liens vers les événements
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

  // Mock data pour les billets - à remplacer par de vraies données
  const mockTickets = [
    {
      id: 1,
      eventName: "Concert Électronique 2024",
      eventDate: "2024-03-15",
      eventTime: "20:00",
      eventLocation: "Salle Pleyel, Paris",
      ticketType: "Standard",
      price: "0.1 ETH",
      qrCode: "QR123456789",
      status: "Valide",
      nftId: "12345"
    },
    {
      id: 2,
      eventName: "Festival Techno Underground",
      eventDate: "2024-04-22",
      eventTime: "22:00",
      eventLocation: "Warehouse, Lyon",
      ticketType: "VIP",
      price: "0.25 ETH",
      qrCode: "QR987654321",
      status: "Valide",
      nftId: "67890"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="w-full flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Mes Billets NFT
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Gérez et visualisez tous vos billets d'événements sous forme de NFT
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Wallet className="w-4 h-4" />
              <span>Connecté : {address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Ticket className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{mockTickets.length}</p>
                    <p className="text-gray-600">Billets possédés</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-800">2</p>
                    <p className="text-gray-600">Événements à venir</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <QrCode className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-800">100%</p>
                    <p className="text-gray-600">Billets valides</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tickets List */}
          <div className="space-y-6">
            {mockTickets.map((ticket) => (
              <Card key={ticket.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-gray-800">{ticket.eventName}</CardTitle>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(ticket.eventDate).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {ticket.eventTime}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {ticket.eventLocation}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {ticket.status}
                      </span>
                      <p className="text-lg font-semibold text-purple-600 mt-1">{ticket.price}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Détails du billet</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type :</span>
                          <span className="font-medium">{ticket.ticketType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">NFT ID :</span>
                          <span className="font-medium font-mono">{ticket.nftId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Code QR :</span>
                          <span className="font-medium font-mono">{ticket.qrCode}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Actions</h4>
                      <div className="space-y-2">
                        <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition flex items-center justify-center">
                          <QrCode className="w-4 h-4 mr-2" />
                          Afficher le QR Code
                        </button>
                        <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition flex items-center justify-center">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Voir l'événement
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {mockTickets.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Aucun billet trouvé
                </h3>
                <p className="text-gray-500 mb-6">
                  Vous n'avez pas encore acheté de billets d'événements.
                </p>
                <a 
                  href="/events" 
                  className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition"
                >
                  Découvrir les événements
                </a>
              </CardContent>
            </Card>
          )}

          {/* Help Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Besoin d'aide ?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Comment utiliser mes billets ?</h4>
                  <p className="text-sm text-gray-600">
                    Présentez le QR Code à l'entrée de l'événement. Votre billet NFT sera vérifié 
                    automatiquement sur la blockchain.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Problème avec un billet ?</h4>
                  <p className="text-sm text-gray-600">
                    Contactez l'organisateur de l'événement ou notre support via Discord 
                    si vous rencontrez des difficultés.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
