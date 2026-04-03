const { withPlausibleProxy } = require('../../dist')

module.exports = withPlausibleProxy({
  src: `http://localhost:${process.env.PORT}/js/script.js`,
  scriptPath: '/test/js/script.js',
  apiPath: '/test/api/event',
})({
  redirects: () => [
    {
      source: '/js/:scriptName',
      destination: '/api/fake/:scriptName',
      permanent: true,
    },
  ],
})
