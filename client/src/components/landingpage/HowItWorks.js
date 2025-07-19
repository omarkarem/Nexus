function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Plan",
      description: "Organize your tasks with intelligent prioritization and smart scheduling that works around your life."
    },
    {
      number: "02", 
      title: "Focus",
      description: "Enter deep work sessions with customizable Pomodoro timers and distraction-free environments."
    },
    {
      number: "03",
      title: "Track",
      description: "Analyze your productivity patterns and get personalized insights to optimize your workflow."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            How It <span className="bg-gradient-aurora bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Simple, powerful, effective. Master your productivity in three steps.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-turquoise opacity-50 transform translate-x-1/2"></div>
              )}
              
              <div className="bg-glass-bg backdrop-blur-glass border border-glass-border rounded-xl p-8 relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-turquoise to-turquoise-light rounded-full text-primary font-bold text-xl mb-6 shadow-lg shadow-turquoise/20">
                  {step.number}
                </div>
                <h3 className="text-2xl font-semibold text-text-primary mb-4">
                  <span className="bg-gradient-turquoise bg-clip-text text-transparent">{step.title}</span>
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks; 