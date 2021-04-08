const fs = require('fs')
const cheerio = require('cheerio')

describe('PlausibleProvider', () => {
  describe('when used in the _app.js file', () => {
    const $ = cheerio.load(fs.readFileSync('./out/index.html', 'utf8'))
    const script = $('head > script[data-domain="example.com"]')

    test('adds the plausible script to <head>', () => {
      expect(script).toBeDefined()
    })
  })
})
