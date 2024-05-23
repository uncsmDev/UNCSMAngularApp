/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js" // add this line
  ],
  theme: {
    extend: {
      backgroundImage: { 
        ttuPattern_color: "url('http://localhost:4200/assets/img/fondo-color.png')",
        ttuPattern_white: "url('http://localhost:4200/assets/img/fondo-white.png')",
      },
      backgroundPosition: {
        'bottom-adjust': 'center bottom 50%', // Ajusta el valor según sea necesario
      },
      backgroundSize: {
        'smaller': '30%', // Ajusta este valor según sea necesario
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
