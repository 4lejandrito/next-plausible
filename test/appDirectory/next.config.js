const { withPlausibleProxy } = require('../../dist')

module.exports = withPlausibleProxy()({ experimental: { appDir: true } })
