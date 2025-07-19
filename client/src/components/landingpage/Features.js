function Features() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Intelligent Task Management",
      description: "Smart prioritization and automated scheduling that adapts to your work patterns and deadlines."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Powerful Pomodoro",
      description: "Customizable focus sessions with built-in breaks, ambient sounds, and productivity insights."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Insightful Analytics",
      description: "Deep dive into your productivity patterns with beautiful charts and actionable recommendations."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Lightning Fast",
      description: "Optimized performance with offline support so you can stay productive anywhere, anytime."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            Features Designed for Your <span className="bg-gradient-turquoise bg-clip-text text-transparent">Success</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Everything you need to boost productivity and achieve your goals with style and efficiency.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`${index % 2 === 0 ? 'bg-gradient-glass' : 'bg-glass-bg'} backdrop-blur-glass border border-glass-border rounded-xl p-6 hover:bg-gradient-glass-strong transition-all duration-300 transform hover:scale-105`}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-turquoise to-turquoise-light rounded-lg mb-4 text-primary shadow-lg shadow-turquoise/20">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                {feature.title.split(' ').slice(0, -1).join(' ')} <span className="bg-gradient-turquoise bg-clip-text text-transparent">{feature.title.split(' ').slice(-1)}</span>
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features; 