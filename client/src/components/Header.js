import { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed top-5 inset-x-0 z-50 flex justify-center">
      <header className="bg-glass-bg backdrop-blur-glass-strong border border-glass-border rounded-full">
                <div className="px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center py-4 gap-8">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-text-primary hover:text-turquoise transition-colors duration-300">
              Nexus
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-text-secondary hover:text-text-primary transition-colors duration-300">
              Features
            </a>
            <a href="#pricing" className="text-text-secondary hover:text-text-primary transition-colors duration-300">
              Pricing
            </a>
            <a href="#testimonials" className="text-text-secondary hover:text-text-primary transition-colors duration-300">
              Testimonials
            </a>
            <a href="#contact" className="text-text-secondary hover:text-text-primary transition-colors duration-300">
              Contact
            </a>
          </nav>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/signup"
              className="bg-gradient-to-r from-turquoise to-turquoise-light hover:from-turquoise-light hover:to-turquoise text-primary font-semibold px-6 py-2 rounded-full transition-all duration-300 inline-block"
            >
              Get Started
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-text-secondary hover:text-text-primary transition-colors duration-300">
                Features
              </a>
              <a href="#pricing" className="text-text-secondary hover:text-text-primary transition-colors duration-300">
                Pricing
              </a>
              <a href="#testimonials" className="text-text-secondary hover:text-text-primary transition-colors duration-300">
                Testimonials
              </a>
              <a href="#contact" className="text-text-secondary hover:text-text-primary transition-colors duration-300">
                Contact
              </a>
            </div>
          </div>
        )}
        </div>
      </header>
    </div>
  );
}

export default Header; 