const { withPlausibleProxy } = require('../../dist')

module.exports = withPlausibleProxy({
  subdirectory: 'subdirectory',
})({
  basePath: '/test',
})
