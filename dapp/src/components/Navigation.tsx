'use client'

export type UserRole = 'organizer' | 'validator' | 'artist' | 'participant'

interface NavigationProps {
  activeRole: UserRole
  onRoleChange: (role: UserRole) => void
}

export const Navigation = ({ activeRole, onRoleChange }: NavigationProps) => {
  const roles = [
    {
      id: 'organizer' as UserRole,
      name: 'Organisateurs',
      description: 'Créer et gérer des événements',
      icon: '🎪',
      color: 'bg-blue-500'
    },
    {
      id: 'validator' as UserRole,
      name: 'Validateurs',
      description: 'Vérifier les tickets à l\'entrée',
      icon: '✅',
      color: 'bg-green-500'
    },
    {
      id: 'artist' as UserRole,
      name: 'Artistes',
      description: 'S\'inscrire et gérer son profil',
      icon: '🎵',
      color: 'bg-purple-500'
    },
    {
      id: 'participant' as UserRole,
      name: 'Participants',
      description: 'Acheter des tickets d\'événements',
      icon: '🎫',
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Choisissez votre rôle</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => onRoleChange(role.id)}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200 text-left
              ${activeRole === role.id
                ? `${role.color} text-white border-transparent shadow-lg`
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{role.icon}</span>
              <div>
                <h3 className="font-semibold">{role.name}</h3>
                <p className={`text-sm ${activeRole === role.id ? 'text-white/90' : 'text-gray-500'}`}>
                  {role.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
