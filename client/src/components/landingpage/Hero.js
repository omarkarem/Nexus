import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-night relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary mb-6 leading-tight">
          Master Your Focus with{' '}
          <span className="bg-gradient-aurora bg-clip-text text-transparent">
            Nexus
          </span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
          Transform your productivity with intelligent task management, powerful Pomodoro timers, 
          and insightful analytics that help you achieve more in less time.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link 
            to="/signup"
            className="w-full sm:w-auto bg-gradient-to-r from-turquoise to-turquoise-light hover:from-turquoise-light hover:to-turquoise text-primary font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 text-center inline-block"
          >
            Start Your Free Trial
          </Link>
          <Link 
            to="/login"
            className="w-full sm:w-auto border-2 border-glass-border text-text-primary font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:bg-glass-bg hover:backdrop-blur-glass text-center inline-block"
          >
            Learn More
          </Link>
        </div>
        
        {/* Abstract background decoration */}
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-radial-turquoise opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-aurora opacity-15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-gradient-cyber opacity-10 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}

export default Hero; 