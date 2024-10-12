/** @type {import('tailwindcss').Config} */

theme = {
  // Light-mode colors
  'background': {
    DEFAULT: '#d2d3db',
    'lighter': "#eeeffb",
    'light': "#e4e5f1",
    'base': "#dadbe7",
    'darkBase': "#d2d3dd",
    'dark': "#9394a5",
  },
  'success': '#31a354',
  'warning': '#f8ed62',
  'alert': '#ee0000',
  'grey': '#6a6a6a',
  'blue': '#1111ee',
  'textColor': {
    DEFAULT: '#111111',
    'unimportant': '#333333'
  },


  // Dark-mode colors
  'dark-background': {
    DEFAULT: '#d2d3db',
    'light': "#e4e5f1",
    'dark': "#9394a5",
  },
  'dark-success': '#31a354',
  'dark-warning': '#f8ed62',
  'dark-grey': '#484b6a',
  'dark-textColor': {
    DEFAULT: '#111111',
    'dark-unimportant': '#333333'
  },
}

module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    screens: {
      '3xs': '384px',
      '2xs': '448px',
      'xs': '512px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      backgroundColor: theme,
      textColor: theme,
      shadowColor: theme,
      borderColor: theme,
      gradientColorStops: theme,
      colors: theme,
    }
  },
  plugins: [],
}