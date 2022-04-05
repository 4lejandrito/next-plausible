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
      test('uses the proxied api endpoint with the trailing slash', () => {
        expect(script.attr('data-api')).toBe('/proxy/api/event/')
      })
    })
  })
})
