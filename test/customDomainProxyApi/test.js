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
      test('points to /js/script.js', () => {
        expect(script.attr('src')).toBe('/js/script.js')
      })

      test('uses the proxied api endpoint', () => {
        expect(script.attr('data-api')).toBe('/proxy/api/event')
      })
    })
  })
})
