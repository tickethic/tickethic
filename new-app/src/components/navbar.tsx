import { Button } from '@/components/ui/button'
import { Ticket, Menu } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <a href="#" className="flex items-center">
              <Ticket className="text-purple-600 mr-2 w-6 h-6" />
              <span className="text-xl font-bold text-gray-800">Tick3thic</span>
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-purple-600 transition">Accueil</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 transition">Événements</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 transition">Pour les organisateurs</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 transition">Pour les artistes</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 transition">Contact</a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-700 hover:text-purple-600 transition hidden md:block">Connexion</a>
            <Button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
              Inscription
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
