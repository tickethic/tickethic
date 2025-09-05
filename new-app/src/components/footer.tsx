import { Ticket, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <a href="#" className="flex items-center mb-6">
              <Ticket className="text-purple-400 mr-2 w-6 h-6" />
              <span className="text-xl font-bold">Tick3thic</span>
            </a>
            <p className="text-gray-400 mb-4">La première plateforme événementielle décentralisée et éthique.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Pour les organisateurs</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Créer un événement</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Gestion des billets</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Analytics</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Tarifs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Pour les artistes</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Créer un profil</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Trouver des événements</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Gestion des paiements</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Ressources</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-2" />
                <span>contact@Tick3thic.ch</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="w-4 h-4 mr-2" />
                <span>+41 22 123 45 67</span>
              </li>
              <li className="flex items-center text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Genève, Suisse</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">© 2023 Tick3thic. Tous droits réservés.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition">Conditions générales</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Politique de confidentialité</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Mentions légales</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
