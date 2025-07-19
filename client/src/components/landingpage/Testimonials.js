function Testimonials() {
  const testimonials = [
    {
      quote: "Nexus completely transformed how I approach my daily tasks. The intelligent prioritization is like having a personal productivity coach.",
      name: "Sarah Chen",
      role: "Product Manager",
      avatar: "SC"
    },
    {
      quote: "The Pomodoro feature with analytics helped me understand my focus patterns. I'm 40% more productive since switching to Nexus.",
      name: "Marcus Rodriguez", 
      role: "Software Engineer",
      avatar: "MR"
    },
    {
      quote: "Beautiful design, powerful features, and it actually helps me get things done. Nexus is the productivity app I've been waiting for.",
      name: "Emily Johnson",
      role: "Freelance Designer",
      avatar: "EJ"
    }
  ];

  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            What Our <span className="bg-gradient-cosmic bg-clip-text text-transparent">Users</span> Say
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Join thousands of professionals who've transformed their productivity with Nexus.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gradient-glass backdrop-blur-glass border border-glass-border rounded-xl p-6 hover:bg-gradient-glass-strong transition-all duration-300 transform hover:scale-105"
            >
              <div className="mb-6">
                <svg className="w-8 h-8 text-turquoise mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-text-secondary leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-turquoise to-turquoise-light rounded-full text-primary font-semibold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-text-primary font-semibold">
                    {testimonial.name}
                  </h4>
                  <p className="text-text-secondary text-sm">
                    {testimonial.role}
                  </p>
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