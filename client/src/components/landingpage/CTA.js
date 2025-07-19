import { Link } from 'react-router-dom';

function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-cosmic backdrop-blur-glass border border-glass-border rounded-2xl p-12 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-radial-turquoise opacity-30 rounded-full blur-2xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-aurora opacity-25 rounded-full blur-2xl"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-6">
              Ready to Transform Your 
              <span className="bg-gradient-turquoise bg-clip-text text-transparent"> Productivity</span>?
            </h2>
            
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Join over 10,000 professionals who have already boosted their productivity with Nexus. 
              Start your free trial today - no credit card required.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/signup"
                className="w-full sm:w-auto bg-gradient-to-r from-turquoise to-turquoise-light hover:from-turquoise-light hover:to-turquoise text-primary font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-turquoise/20 text-center inline-block"
              >
                Get Started Free
              </Link>
              <button className="w-full sm:w-auto text-text-secondary hover:text-text-primary transition-colors duration-300 underline decoration-turquoise underline-offset-4">
                Watch Demo (2 min)
              </button>
            </div>
            
            <p className="text-sm text-text-secondary mt-6">
              ✨ 14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA; 