const { withPlausibleProxy } = require('../../dist')

module.exports = withPlausibleProxy({
  // This just proves that our customDomain mapping works
  customDomain: 'https://plausible.io',
})
