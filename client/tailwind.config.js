/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
        'form-gradient': 'linear-gradient(to top, #a8edea 0%, #fed6e3 100%)',
        'header-gradient': 'linear-gradient(to top, #09203f 0%, #537895 100%)',
        'home-gradient': 'linear-gradient(to top, #a3bded 0%, #6991c7 100%)',
      },
    },
  },
  plugins: [],
}