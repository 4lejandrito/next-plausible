const { withPlausibleProxy } = require('../../dist')

module.exports = withPlausibleProxy({
  src: 'https://plausible.io/js/pa-zQPm0mSb_NE1JtAQ6DiwY.js',
  scriptPath: '/subdirectory/js/script.js',
  apiPath: '/subdirectory/api/event',
})({
  basePath: '/test',
})
