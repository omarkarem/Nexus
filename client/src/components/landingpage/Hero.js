import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-night relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-text-primary mb-4 sm:mb-6 leading-tight">
          Master Your Focus with{' '}
          <span className="bg-gradient-aurora bg-clip-text text-transparent">
            Nexus
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl lg:text-2xl text-text-secondary mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
          Transform your productivity with intelligent task management, powerful Pomodoro timers, 
          and insightful analytics that help you achieve more in less time.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
          <Link 
            to="/signup"
            className="w-full sm:w-auto bg-gradient-to-r from-turquoise to-turquoise-light hover:from-turquoise-light hover:to-turquoise text-primary font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 text-center inline-block text-sm sm:text-base"
          >
            Start Your Free Trial
          </Link>
          <Link 
            to="/login"
            className="w-full sm:w-auto border-2 border-glass-border text-text-primary font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 hover:bg-glass-bg hover:backdrop-blur-glass text-center inline-block text-sm sm:text-base"
          >
            Learn More
          </Link>
        </div>
        
        {/* Abstract background decoration */}
        <div className="absolute top-1/2 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-radial-turquoise opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-gradient-aurora opacity-15 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}

export default Hero; 