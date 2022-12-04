const { withPlausibleProxy } = require('../../dist')

module.exports = withPlausibleProxy({
  customDomain: `http://localhost:${process.env.PORT}`,
})({})
