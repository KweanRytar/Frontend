/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      './src/style/editor.css' ,
    ],
    theme: {
      extend: {},
    },
    plugins: [],
    
    "aliases": {
    "utils": "@/lib/utils"
  }
    
  }
  