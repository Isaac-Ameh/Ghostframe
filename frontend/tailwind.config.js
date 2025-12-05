/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Phase 2.1 Haunted theme colors (as requested)
        'ghost-gray': '#2D2D2D',
        'specter-purple': '#4C1D95', 
        'pumpkin-orange': '#FB923C',
        'grave-black': '#0A0A0A',
        // Additional spooky colors for enhanced theming
        'ghost-white': '#F8F8FF',
        'phantom-gray': '#2D2D2D', // Alias for ghost-gray
        'shadow-black': '#0A0A0A', // Alias for grave-black
        'eerie-purple': '#4C1D95', // Alias for specter-purple
        'haunted-orange': '#FB923C', // Alias for pumpkin-orange
        'spectral-green': '#10B981',
        'blood-red': '#DC2626',
        'midnight-blue': '#1E1B4B',
        'bone-white': '#FEF7ED',
      },
      fontFamily: {
        'spooky': ['Creepster', 'cursive'],
        'ghost': ['Nosifer', 'cursive'],
        'creepster': ['Creepster', 'cursive'], // Phase 2.1 requirement
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spooky-bounce': 'spooky-bounce 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #4C1D95' },
          '100%': { boxShadow: '0 0 20px #4C1D95, 0 0 30px #4C1D95' },
        },
        'spooky-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}