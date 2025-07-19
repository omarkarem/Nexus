function Testimonials() {
  const testimonials = [
    {
      quote: "Nexus has completely transformed how I manage my daily tasks. The Pomodoro timer keeps me focused, and the analytics help me understand my productivity patterns.",
      author: "Sarah Chen",
      role: "Product Manager",
      company: "TechCorp"
    },
    {
      quote: "The intelligent task prioritization is a game-changer. I've increased my productivity by 40% since switching to Nexus. Highly recommended!",
      author: "Marcus Rodriguez",
      role: "Software Engineer",
      company: "InnovateLab"
    },
    {
      quote: "Clean interface, powerful features, and seamless sync across devices. Nexus has become an essential part of my daily workflow.",
      author: "Emily Watson",
      role: "Design Director",
      company: "Creative Studio"
    }
  ];

  return (
    <section id="testimonials" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-3 sm:mb-4">
            What Our <span className="bg-gradient-cosmic bg-clip-text text-transparent">Users</span> Say
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto px-4">
            Join thousands of professionals who've transformed their productivity with Nexus.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gradient-glass backdrop-blur-glass border border-glass-border rounded-xl p-4 sm:p-6 hover:bg-gradient-glass-strong transition-all duration-300 transform hover:scale-105"
            >
              <div className="mb-4 sm:mb-6">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-turquoise mb-3 sm:mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-4 sm:mb-6">
                  "{testimonial.quote}"
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-turquoise rounded-full flex items-center justify-center text-primary font-semibold text-sm sm:text-base mr-3 sm:mr-4">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-text-primary">{testimonial.author}</h4>
                  <p className="text-xs sm:text-sm text-text-secondary">{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials; 