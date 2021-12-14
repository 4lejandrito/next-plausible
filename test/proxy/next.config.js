const { withPlausibleProxy } = require('../../dist')

module.exports = withPlausibleProxy()({
  images: {
    domains: ['github.githubassets.com'],
  },
})
