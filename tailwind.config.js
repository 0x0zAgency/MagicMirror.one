/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('daisyui')
  ],
  daisyui: {
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter'
    ]
  },
  theme: {
    extend: {
      fontFamily: {
        apocalypse: ['Apocalypse Grunge', 'cursive'],
        thenextfont: ['TheNextFont', 'sans-serif']
      },

      fontSize: {
        '10xl': '5rem',
        '11xl': '5.5rem',
        '12xl': '6rem',
        '13xl': '6.5rem',
        '14xl': '7rem',
        '15xl': '7.5rem',
        '16xl': '8rem',
        giant: '11rem'
      }
    }
  }
}
