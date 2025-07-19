import { Link } from 'react-router-dom';

function CTA() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-cosmic backdrop-blur-glass border border-glass-border rounded-2xl p-6 sm:p-8 lg:p-12 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-radial-turquoise opacity-30 rounded-full blur-2xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-aurora opacity-25 rounded-full blur-2xl"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4 sm:mb-6">
              Ready to Transform Your 
              <span className="bg-gradient-turquoise bg-clip-text text-transparent"> Productivity</span>?
            </h2>
            
            <p className="text-lg sm:text-xl text-text-secondary mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Join over 10,000 professionals who have already boosted their productivity with Nexus. 
              Start your free trial today - no credit card required.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link 
                to="/signup"
                className="w-full sm:w-auto bg-gradient-to-r from-turquoise to-turquoise-light hover:from-turquoise-light hover:to-turquoise text-primary font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 text-center inline-block text-sm sm:text-base"
              >
                Start Free Trial
              </Link>
              <Link 
                to="/login"
                className="w-full sm:w-auto border-2 border-glass-border text-text-primary font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 hover:bg-glass-bg hover:backdrop-blur-glass text-center inline-block text-sm sm:text-base"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA; 