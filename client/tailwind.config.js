/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Primary Backgrounds - Pure black
        'primary': '#000000',
        'secondary': 'rgba(20, 20, 20, 0.9)',
        'secondary-opaque': '#1a1a1a',
        
        // Accent Colors - Add back turquoise for buttons and accents
        'turquoise': '#00CED1',
        'turquoise-light': '#40E0D0',
        'accent-gray': '#404040',        // Keep gray as alternative
        'accent-gray-light': '#606060',
        
        // Text Colors
        'text-primary': '#FFFFFF',
        'text-secondary': '#E0E0E0',
        
        // Glass Effect Colors - Pure black/gray
        'glass-border': 'rgba(64, 64, 64, 0.3)',
        'glass-bg': 'rgba(20, 20, 20, 0.8)',
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
      
      // Custom gradients - Mix of black/gray backgrounds with colorful accents
      backgroundImage: {
        // Primary gradients - Pure black shades
        'gradient-primary': 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        'gradient-dark': 'linear-gradient(135deg, #000000 0%, #2a2a2a 100%)',
        
        // Accent gradients - Bring back turquoise for buttons
        'gradient-turquoise': 'linear-gradient(135deg, #00CED1 0%, #40E0D0 100%)',
        'gradient-turquoise-reverse': 'linear-gradient(135deg, #40E0D0 0%, #00CED1 100%)',
        'gradient-turquoise-dark': 'linear-gradient(135deg, #00CED1 0%, #008B8B 100%)',
        
        // Gray alternatives for subtle elements
        'gradient-gray': 'linear-gradient(135deg, #404040 0%, #606060 100%)',
        'gradient-gray-reverse': 'linear-gradient(135deg, #606060 0%, #404040 100%)',
        'gradient-gray-dark': 'linear-gradient(135deg, #404040 0%, #2a2a2a 100%)',
        
        // Mixed gradients - Pure black/gray
        'gradient-cosmic': 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #333333 100%)',
        'gradient-night': 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2a2a2a 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #0a0a0a 0%, #2a2a2a 100%)',
        
        // Glass gradients - Pure black/gray
        'gradient-glass': 'linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(40, 40, 40, 0.8) 100%)',
        'gradient-glass-strong': 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(35, 35, 35, 0.9) 100%)',
        
        // Radial gradients - Add colorful version for landing page
        'gradient-radial-turquoise': 'radial-gradient(circle at center, #40E0D0 0%, #00CED1 70%, #000000 100%)',
        'gradient-radial-dark': 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)',
        
        // Animated gradients - Bring back colorful versions for landing page
        'gradient-aurora': 'linear-gradient(45deg, #000000 0%, #00CED1 25%, #40E0D0 50%, #00CED1 75%, #000000 100%)',
        'gradient-cyber': 'linear-gradient(90deg, #000000 0%, #00CED1 20%, #40E0D0 40%, #00CED1 60%, #000000 100%)',
      }
    },
  },
  plugins: [],
}

