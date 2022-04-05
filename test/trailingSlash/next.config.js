const { withPlausibleProxy } = require('../../dist')

module.exports = withPlausibleProxy()({
  trailingSlash: true,
})
