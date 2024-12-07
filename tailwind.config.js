/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Durchsuche alle JavaScript-, JSX-, TypeScript- und TSX-Dateien im src-Verzeichnis
  ],
  theme: {
    extend: {
      animation: {
        'scroll-song': 'scrollSong 10s linear infinite', // Dauer für die Animation anpassen
      },
      keyframes: {
        scrollSong: {
          '0%': {
            transform: 'translateX(100%)', // Start von der rechten Seite
          },
          '100%': {
            transform: 'translateX(-100%)', // Beendet auf der linken Seite
          },
        },
      },
    },
  },
  plugins: [],
}



