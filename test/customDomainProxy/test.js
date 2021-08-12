const axios = require('axios')

const url = 'http://localhost:3000'

describe('The script at', () => {
  ;[
    {
      source: '/test/js/script.exclusions.js',
      destination: `${url}/js/plausible.exclusions.js`,
    },
    {
      source: '/test/js/script.outbound-links.js',
      destination: `${url}/js/plausible.outbound-links.js`,
    },
    {
      source: '/test/js/script.outbound-links.exclusions.js',
      destination: `${url}/js/plausible.outbound-links.exclusions.js`,
    },
    {
      source: '/test/js/script.js',
      destination: `${url}/js/plausible.js`,
    },
  ].map(({ source, destination }) => {
    describe(source, () => {
      test(`is proxied from ${destination}`, async () => {
        const sourceScriptContent = (await axios.get(`${url}${source}`)).data
        expect(sourceScriptContent).toBe(
          'Fake ' + destination.replace(`${url}/js/`, '')
        )
      })
    })
  })
})
