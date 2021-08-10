const { withPlausibleProxy } = require('../../dist')

module.exports = withPlausibleProxy({
  // This just proves that our customDomain mapping works
  customDomain: 'https://localhost:3000',
})({
  redirects: () => [
    {
      source: '/js/:scriptName',
      destination: '/api/fake/:scriptName',
      permanent: true,
    },
  ],
})
