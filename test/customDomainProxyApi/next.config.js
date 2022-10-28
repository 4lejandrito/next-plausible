const { withPlausibleProxy } = require('../../dist')

module.exports = withPlausibleProxy({
  customDomain: 'http://custom.domain',
})({})
