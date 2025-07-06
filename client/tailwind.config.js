/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Primary Backgrounds
        'primary': '#000000',
        'secondary': 'rgba(42, 42, 74, 0.4)',
        'secondary-opaque': '#2A2A4A',
        
        // Accent Colors
        'turquoise': '#00CED1',
        'turquoise-light': '#40E0D0',
        
        // Text Colors
        'text-primary': '#FFFFFF',
        'text-secondary': '#E0E0E0',
        
        // Glass Effect Colors
        'glass-border': 'rgba(0, 206, 209, 0.3)',
        'glass-bg': 'rgba(42, 42, 74, 0.2)',
      },
      
      // Custom backdrop blur utilities
      backdropBlur: {
        'glass': '10px',
        'glass-strong': '16px',
      },
      
      // Custom font families
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
      },
      
      // Custom gradients
      backgroundImage: {
        // Primary gradients
        'gradient-primary': 'linear-gradient(135deg, #000000 0%, #1a1a2e 100%)',
        'gradient-dark': 'linear-gradient(135deg, #000000 0%, #2a2a4a 100%)',
        
        // Turquoise gradients
        'gradient-turquoise': 'linear-gradient(135deg, #00CED1 0%, #40E0D0 100%)',
        'gradient-turquoise-reverse': 'linear-gradient(135deg, #40E0D0 0%, #00CED1 100%)',
        'gradient-turquoise-dark': 'linear-gradient(135deg, #00CED1 0%, #008B8B 100%)',
        
        // Mixed gradients
        'gradient-cosmic': 'linear-gradient(135deg, #000000 0%, #00CED1 50%, #40E0D0 100%)',
        'gradient-night': 'linear-gradient(135deg, #000000 0%, #2a2a4a 50%, #40E0D0 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #001122 0%, #00CED1 100%)',
        
        // Glass gradients
        'gradient-glass': 'linear-gradient(135deg, rgba(42, 42, 74, 0.1) 0%, rgba(0, 206, 209, 0.1) 100%)',
        'gradient-glass-strong': 'linear-gradient(135deg, rgba(42, 42, 74, 0.3) 0%, rgba(0, 206, 209, 0.2) 100%)',
        
        // Radial gradients
        'gradient-radial-turquoise': 'radial-gradient(circle at center, #40E0D0 0%, #00CED1 70%, #000000 100%)',
        'gradient-radial-dark': 'radial-gradient(circle at center, #2a2a4a 0%, #000000 100%)',
        
        // Animated gradients (for special effects)
        'gradient-aurora': 'linear-gradient(45deg, #000000 0%, #00CED1 25%, #40E0D0 50%, #00CED1 75%, #000000 100%)',
        'gradient-cyber': 'linear-gradient(90deg, #000000 0%, #00CED1 20%, #40E0D0 40%, #00CED1 60%, #000000 100%)',
      }
    },
  },
  plugins: [],
}

