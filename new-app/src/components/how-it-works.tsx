export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Inscription",
      description: "Créez votre compte en 2 minutes selon votre profil",
      color: "purple"
    },
    {
      number: 2,
      title: "Configuration",
      description: "Complétez votre profil ou créez votre événement",
      color: "blue"
    },
    {
      number: 3,
      title: "Interaction",
      description: "Connectez-vous avec la communauté",
      color: "green"
    },
    {
      number: 4,
      title: "Profitez",
      description: "Vivez une expérience événementielle inoubliable",
      color: "yellow"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Comment ça marche
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez en quelques étapes comment Tick3thic révolutionne votre expérience événementielle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="text-center" data-aos="fade-up" data-aos-delay={`${(index + 1) * 100}`}>
              <div className={`w-20 h-20 bg-${step.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className={`text-${step.color}-600 font-bold text-2xl`}>
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
