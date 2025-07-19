import { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed top-2 sm:top-5 inset-x-0 z-50 flex justify-center px-4">
      <header className="bg-glass-bg backdrop-blur-glass-strong border border-glass-border rounded-full w-full max-w-4xl">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4 gap-4 sm:gap-8">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl sm:text-2xl font-bold text-text-primary hover:text-turquoise transition-colors duration-300">
              Nexus
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a href="#features" className="text-text-secondary hover:text-text-primary transition-colors duration-300 text-sm lg:text-base">
              Features
            </a>
            <a href="#pricing" className="text-text-secondary hover:text-text-primary transition-colors duration-300 text-sm lg:text-base">
              Pricing
            </a>
            <a href="#testimonials" className="text-text-secondary hover:text-text-primary transition-colors duration-300 text-sm lg:text-base">
              Testimonials
            </a>
            <a href="#contact" className="text-text-secondary hover:text-text-primary transition-colors duration-300 text-sm lg:text-base">
              Contact
            </a>
          </nav>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link 
              to="/signup"
              className="hidden sm:inline-block bg-gradient-to-r from-turquoise to-turquoise-light hover:from-turquoise-light hover:to-turquoise text-primary font-semibold px-4 sm:px-6 py-2 rounded-full transition-all duration-300 text-sm"
            >
              Get Started
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 px-4">
            <div className="flex flex-col space-y-3 sm:space-y-4 border-t border-glass-border pt-4">
              <a href="#features" className="text-text-secondary hover:text-text-primary transition-colors duration-300 text-sm">
                Features
              </a>
              <a href="#pricing" className="text-text-secondary hover:text-text-primary transition-colors duration-300 text-sm">
                Pricing
              </a>
              <a href="#testimonials" className="text-text-secondary hover:text-text-primary transition-colors duration-300 text-sm">
                Testimonials
              </a>
              <a href="#contact" className="text-text-secondary hover:text-text-primary transition-colors duration-300 text-sm">
                Contact
              </a>
              <Link 
                to="/signup"
                className="bg-gradient-to-r from-turquoise to-turquoise-light hover:from-turquoise-light hover:to-turquoise text-primary font-semibold px-4 py-2 rounded-full transition-all duration-300 text-sm text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
        </div>
      </header>
    </div>
  );
}

export default Header; 