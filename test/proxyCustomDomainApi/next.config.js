const { withPlausibleProxy } = require('../../dist')

module.exports = withPlausibleProxy({
  src: `http://localhost:${process.env.PORT}/js/script.js`,
})({})
