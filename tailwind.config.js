/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- ¡ESTA LÍNEA ES OBLIGATORIA!
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'postula-blue': '#377BB5',
      }
    },
  },
  plugins: [],
}