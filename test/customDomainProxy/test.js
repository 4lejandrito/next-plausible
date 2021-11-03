const cheerio = require('cheerio')
const axios = require('axios')

const url = 'http://localhost:3000'

describe('PlausibleProvider', () => {
  describe('when used like <PlausibleProvider domain="example.com">', () => {
    let script

    beforeAll(async () => {
      const $ = cheerio.load((await axios(url)).data)
      script = $('head > script[data-domain="example.com"]')
    })

    describe('the script', () => {
      test('points to /test/js/script.js', () => {
        expect(script.attr('src')).toBe('/test/js/script.js')
      })

      test('uses the proxied api endpoint', () => {
        expect(script.attr('data-api')).toBe('/test/api/event')
      })
    })
  })
})

describe('The script at', () => {
  ;[
    {
      source: '/test/js/script.local.js',
      destination: `${url}/js/plausible.local.js`,
    },
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
