import { ArrowRight } from 'lucide-react'

export function Events() {
  const events = [
    {
      id: 1,
      title: "Festival Électronique",
      description: "Un festival de musique électronique avec les meilleurs DJs internationaux.",
      category: "Musique",
      date: "25 Juin 2023",
      location: "Genève, Suisse",
      image: "http://static.photos/music/640x360/1"
    },
    {
      id: 2,
      title: "Exposition Contemporaine",
      description: "Découvrez les œuvres d'artistes contemporains émergents.",
      category: "Art",
      date: "15 Juillet 2023",
      location: "Lausanne, Suisse",
      image: "http://static.photos/art/640x360/2"
    },
    {
      id: 3,
      title: "Marché Culinaire",
      description: "Dégustez les spécialités de chefs locaux et internationaux.",
      category: "Gastronomie",
      date: "5 Août 2023",
      location: "Zurich, Suisse",
      image: "http://static.photos/food/640x360/3"
    }
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Musique":
        return "bg-purple-100 text-purple-800"
      case "Art":
        return "bg-blue-100 text-blue-800"
      case "Gastronomie":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div data-aos="fade-right">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Événements à venir</h2>
            <p className="text-gray-600">Découvrez les prochains événements près de chez vous</p>
          </div>
          <a href="#" className="text-purple-600 font-semibold hover:text-purple-700 transition flex items-center" data-aos="fade-left">
            Voir tout <ArrowRight className="ml-2 w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div key={event.id} className="rounded-xl overflow-hidden shadow-md border border-gray-100 transition hover:shadow-lg" data-aos="fade-up" data-aos-delay={index * 100}>
              <div 
                className="h-48 bg-cover bg-center" 
                style={{ backgroundImage: `url(${event.image})` }}
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className={`${getCategoryColor(event.category)} text-xs font-medium px-2.5 py-0.5 rounded`}>
                    {event.category}
                  </span>
                  <span className="text-gray-500 text-sm">{event.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">{event.location}</span>
                  <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">Détails</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
