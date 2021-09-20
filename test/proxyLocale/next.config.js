const { withPlausibleProxy } = require('../../dist')

module.exports = withPlausibleProxy()({
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  },
})
