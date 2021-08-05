const axios = require('axios')

const url = 'http://localhost:3000'

describe('The script at', () => {
  ;[
    {
      source: '/js/script.exclusions.js',
      destination: 'https://plausible.io/js/plausible.exclusions.js',
    },
    {
      source: '/js/script.outbound-links.js',
      destination: 'https://plausible.io/js/plausible.outbound-links.js',
    },
    {
      source: '/js/script.outbound-links.exclusions.js',
      destination:
        'https://plausible.io/js/plausible.outbound-links.exclusions.js',
    },
    {
      source: '/js/script.js',
      destination: 'https://plausible.io/js/plausible.js',
    },
  ].map(({ source, destination }) => {
    describe(source, () => {
      test(`is proxied from ${destination}`, async () => {
        const sourceScriptContent = (await axios.get(`${url}${source}`)).data
        const destinationScriptContent = (await axios.get(destination)).data
        expect(sourceScriptContent).toBe(destinationScriptContent)
      })
    })
  })
})
