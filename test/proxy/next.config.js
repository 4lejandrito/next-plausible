const path = require('path')
const { withPlausibleProxy } = require('../../dist')

module.exports = withPlausibleProxy()({
  webpack: (config) => {
    config.resolve.alias['react'] = path.resolve(
      __dirname,
      '..',
      '..',
      'node_modules',
      'react'
    )

    return config
  },
  images: {
    domains: ['github.githubassets.com'],
  },
})
