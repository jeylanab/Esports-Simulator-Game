/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],

  darkMode: 'class',

  theme: {
    extend: {
      keyframes: {
        typing: {
          "0%": { width: "0%", visibility: "hidden" },
          "100%": { width: "100%" },
        },
        blink: {
          "50%": { borderColor: "transparent" },
          "100%": { borderColor: "white" },
        },
      },

      animation: {
        typing: "typing 2s steps(20) infinite alternate, blink .7s infinite",
      },

      colors: {
        scrollbarThumb: '#2dda0a',
        scrollbarTrack: '#2a2a2a',
        primary: '#00FF88',
        bgDark: '#0A0A0A',
        textPrimary: '#EDEDED',
        textSecondary: '#A0A0A0',
      },

      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },

      fontSize: {
        // Text sizing scale
        'xs': ['0.75rem', { lineHeight: '1rem' }],         // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],     // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],        // 16px
        'md': ['1.125rem', { lineHeight: '1.75rem' }],     // 18px
        'lg': ['1.25rem', { lineHeight: '1.75rem' }],      // 20px
        'xl': ['1.5rem', { lineHeight: '2rem' }],          // 24px
        '2xl': ['1.875rem', { lineHeight: '2.25rem' }],    // 30px
        '3xl': ['2.25rem', { lineHeight: '2.5rem' }],      // 36px
        '4xl': ['3rem', { lineHeight: '1' }],              // 48px
        '5xl': ['3.75rem', { lineHeight: '1' }],           // 60px
        '6xl': ['4.5rem', { lineHeight: '1' }],            // 72px
      },
    },

    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },

  plugins: [],
};
