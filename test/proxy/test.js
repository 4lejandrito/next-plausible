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

    test('adds the plausible script to <head>', () => {
      expect(script).toBeDefined()
    })

    describe('the script', () => {
      test('loads asynchronously', () => {
        expect(script.attr('async')).toBeDefined()
        expect(script.attr('defer')).toBeDefined()
      })

      test('points to /js/script.js', () => {
        expect(script.attr('src')).toBe('/js/script.js')
      })
    })
  })

  describe('when excluding a page like <PlausibleProvider domain="example.com" exclude="page">', () => {
    let script

    beforeAll(async () => {
      const $ = cheerio.load((await axios(`${url}/exclude`)).data)
      script = $('head > script[data-domain="example.com"]')
    })

    describe('the script', () => {
      test('has the data-exclude attribute', () => {
        expect(script.data('exclude')).toBe('page')
      })

      test('points to /js/script.exclusions.js', () => {
        expect(script.attr('src')).toBe('/js/script.exclusions.js')
      })
    })
  })

  describe('when tracking outbound links like <PlausibleProvider domain="example.com" trackOutboundLinks />', () => {
    let script

    beforeAll(async () => {
      const $ = cheerio.load((await axios(`${url}/trackOutboundLinks`)).data)
      script = $('head > script[data-domain="example.com"]')
    })

    describe('the script', () => {
      test('points to /js/script.outbound-links.js', () => {
        expect(script.attr('src')).toBe('/js/script.outbound-links.js')
      })
    })
  })

  describe('when tracking outbound links and excluding a page like <PlausibleProvider domain="example.com" trackOutboundLinks exclude="page" />', () => {
    let script

    beforeAll(async () => {
      const $ = cheerio.load(
        (await axios(`${url}/trackOutboundLinksExclude`)).data
      )
      script = $('head > script[data-domain="example.com"]')
    })

    describe('the script', () => {
      test('has the data-exclude attribute', () => {
        expect(script.data('exclude')).toBe('page')
      })

      test('points to /js/script.outbound-links.exclusions.js', () => {
        expect(script.attr('src')).toBe(
          '/js/script.outbound-links.exclusions.js'
        )
      })
    })
  })
})

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
