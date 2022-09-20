const colors = require('tailwindcss/colors')
module.exports = {
  content: ['pages/*.js', 'components/*.js'],
  theme: {
    colors: {
      copy: {
        DEFAULT: colors.white,
        muted: colors.slate[500],
      },
      primary: {
        copy: colors.indigo[500],
        highlight: colors.indigo[500],
        background: colors.indigo[600],
      },
      inverse: {
        copy: colors.slate[800],
        highlight: colors.gray[200],
        background: colors.white,
      },
      background: {
        dark: colors.gray[900],
        light: colors.gray[800],
      },
      json: {
        nulls: colors.rose[500],
        string: colors.emerald[500],
        number: colors.amber[500],
      },
      help: colors.pink[500],
      heart: {
        DEFAULT: colors.pink[500],
        burst: colors.pink[600],
      },
    },
    extend: {
      screens: {
        lg: '1200px',
      },
      keyframes: {
        appear: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        wiggle: {
          '0%': {
            transform: 'rotate(-1deg)',
            'animation-timing-function': 'ease-in',
          },
          '50%': {
            transform: 'rotate(1.5deg)',
            'animation-timing-function': 'ease-out',
          },
        },
        beat: {
          '0%, 100%': { transform: 'scale(100%)' },
          '50%': { transform: 'scale(125%)' },
        },
      },
      animation: {
        appear: 'appear .3s ease-in-out',
        wiggle: 'wiggle .15s 2',
        beat: 'beat 200ms ease-in-out',
      },
    },
  },
}
