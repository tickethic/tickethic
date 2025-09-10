'use client'

import { useWallet } from '@/hooks/useWallet'
import { useEvents } from '@/hooks/useEvents'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Ticket, Users, TrendingUp, DollarSign } from 'lucide-react'

export default function AnalyticsPage() {
  const { address, isConnected, connect } = useWallet()
  const { events, loading } = useEvents()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Analytics</h1>
            <p className="text-gray-600 mb-8">Connectez votre wallet pour voir vos métriques personnalisées</p>
            <Button onClick={connect} className="bg-purple-600 hover:bg-purple-700">
              Connecter mon wallet
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Calculer les métriques basées sur les événements
  const totalEvents = events.length
  const totalTickets = events.reduce((sum, event) => sum + (event.totalTickets || 0), 0)
  const totalSold = events.reduce((sum, event) => sum + (event.soldTickets || 0), 0)
  const totalRevenue = events.reduce((sum, event) => {
    const price = parseFloat(event.ticketPrice || '0')
    const sold = event.soldTickets || 0
    return sum + (price * sold)
  }, 0)

  const soldPercentage = totalTickets > 0 ? (totalSold / totalTickets) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Métriques personnalisées pour votre wallet</p>
          <p className="text-sm text-gray-500 mt-1">Wallet: {address}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des données...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Événements</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEvents}</div>
                <p className="text-xs text-muted-foreground">
                  Total des événements
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Billets vendus</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSold}</div>
                <p className="text-xs text-muted-foreground">
                  Sur {totalTickets} disponibles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux de vente</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{soldPercentage.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Moyenne de vente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} ETH</div>
                <p className="text-xs text-muted-foreground">
                  Volume généré
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {events.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Détail des événements</CardTitle>
              <CardDescription>
                Liste de tous les événements avec leurs métriques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{event.name || `Événement ${index + 1}`}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(Number(event.date) * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Prix:</span> {event.ticketPrice} ETH
                      </div>
                      <div>
                        <span className="text-gray-500">Vendus:</span> {event.soldTickets}/{event.totalTickets}
                      </div>
                      <div>
                        <span className="text-gray-500">Revenus:</span> {(parseFloat(event.ticketPrice || '0') * (event.soldTickets || 0)).toFixed(2)} ETH
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && events.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun événement trouvé</h3>
              <p className="text-gray-600 mb-4">
                Il n'y a pas encore d'événements sur la plateforme.
              </p>
              <Button asChild>
                <a href="/organizers">Créer un événement</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
