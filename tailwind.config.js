/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Requested New Palette
        ivory: {
          light: '#FAF5ED',
          DEFAULT: '#F5ECDE', // Warm Ivory
          warm: '#F5ECDE',
          border: '#E8DCB',
          dark: '#E0D2C0',
        },
        sage: {
          light: '#476346',
          DEFAULT: '#30452F', // Deep Sage Green
          dark: '#1F2E1E',   // Midnight Sage (for rich depth)
          deep: '#1A2719',
          subtle: '#E8EFE8',
        },
        amber: {
          light: '#F3CF8A',
          DEFAULT: '#E6B25C', // Golden Amber
          dark: '#C9943B',
          accent: '#FDF6EA',
        },
        // Backwards-compatible aliases for existing classes
        gold: {
          light: '#F3CF8A',
          DEFAULT: '#E6B25C', // Golden Amber
          dark: '#C9943B',
          accent: '#FDF6EA',
        },
        darkgreen: {
          light: '#476346',
          DEFAULT: '#30452F', // Deep Sage Green
          deep: '#1A2719',
          surface: '#253825',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(48, 69, 47, 0.2)',
        'luxury-hover': '0 25px 50px -12px rgba(48, 69, 47, 0.3)',
        'gold-glow': '0 0 25px rgba(230, 178, 92, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
