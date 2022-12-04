const { withPlausibleProxy } = require('../../dist')

module.exports = withPlausibleProxy({
  // This just proves that our customDomain mapping works
  customDomain: `http://localhost:${process.env.PORT}`,
  subdirectory: 'test',
})({
  redirects: () => [
    {
      source: '/js/:scriptName',
      destination: '/api/fake/:scriptName',
      permanent: true,
    },
  ],
})
