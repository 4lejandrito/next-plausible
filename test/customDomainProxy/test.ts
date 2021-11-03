import cheerio, { Cheerio, Element } from 'cheerio'
import axios from 'axios'
import getCombinations from '../../lib/combinations'

const url = 'http://localhost:3000'

describe('PlausibleProvider', () => {
  describe('when used like <PlausibleProvider domain="example.com">', () => {
    let script: Cheerio<Element>

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
      source: '/test/js/script.js',
      destination: `${url}/js/plausible.js`,
    },
    ...getCombinations(['exclusions', 'local', 'manual', 'outbound-links']).map(
      (modifiers) => ({
        source: `/test/js/script.${modifiers.join('.')}.js`,
        destination: `${url}/js/plausible.${modifiers.join('.')}.js`,
      })
    ),
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
