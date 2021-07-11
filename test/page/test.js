const fs = require('fs')
const cheerio = require('cheerio')

describe('PlausibleProvider', () => {
  describe('when used like <PlausibleProvider domain="example.com">', () => {
    const $ = cheerio.load(fs.readFileSync('./out/index.html', 'utf8'))
    const script = $('head > script[data-domain="example.com"]')

    test('adds the plausible script to <head>', () => {
      expect(script).toBeDefined()
    })

    describe('the script', () => {
      test('loads asynchronously', () => {
        expect(script.attr('async')).toBeDefined()
        expect(script.attr('defer')).toBeDefined()
      })

      test('points to https://plausible.io/js/plausible.js', () => {
        expect(script.attr('src')).toBe('https://plausible.io/js/plausible.js')
      })
    })
  })

  describe('when passing a custom domain like <PlausibleProvider domain="example.com" customDomain="https://custom.example.com">', () => {
    const $ = cheerio.load(fs.readFileSync('./out/customDomain.html', 'utf8'))
    const script = $('head > script[data-domain="example.com"]')

    describe('the script', () => {
      test('points to https://custom.example.com/js/index.js', () => {
        expect(script.attr('src')).toBe(
          'https://custom.example.com/js/index.js'
        )
      })
    })
  })

  describe('when excluding a page like <PlausibleProvider domain="example.com" exclude="page">', () => {
    const $ = cheerio.load(fs.readFileSync('./out/exclude.html', 'utf8'))
    const script = $('head > script[data-domain="example.com"]')

    describe('the script', () => {
      test('has the data-exclude attribute', () => {
        expect(script.data('exclude')).toBe('page')
      })

      test('points to https://plausible.io/js/plausible.exclusions.js', () => {
        expect(script.attr('src')).toBe(
          'https://plausible.io/js/plausible.exclusions.js'
        )
      })
    })
  })

  describe('when excluding a page with a custom domain like <PlausibleProvider domain="example.com" customDomain="https://custom.example.com" exclude="page">', () => {
    const $ = cheerio.load(
      fs.readFileSync('./out/customDomainExclude.html', 'utf8')
    )
    const script = $('head > script[data-domain="example.com"]')

    describe('the script', () => {
      test('has the data-exclude attribute', () => {
        expect(script.data('exclude')).toBe('page')
      })

      test('points to https://custom.example.com/js/index.exclusions.js', () => {
        expect(script.attr('src')).toBe(
          'https://custom.example.com/js/index.exclusions.js'
        )
      })
    })
  })

  describe('when tracking outbound links like <PlausibleProvider domain="example.com" trackOutboundLinks />', () => {
    const $ = cheerio.load(
      fs.readFileSync('./out/trackOutboundLinks.html', 'utf8')
    )
    const script = $('head > script[data-domain="example.com"]')

    describe('the script', () => {
      test('points to https://plausible.io/js/plausible.outbound-links.js', () => {
        expect(script.attr('src')).toBe(
          'https://plausible.io/js/plausible.outbound-links.js'
        )
      })
    })
  })

  describe('when tracking outbound links and excluding a page like <PlausibleProvider domain="example.com" trackOutboundLinks exclude="page" />', () => {
    const $ = cheerio.load(
      fs.readFileSync('./out/trackOutboundLinksExclude.html', 'utf8')
    )
    const script = $('head > script[data-domain="example.com"]')

    describe('the script', () => {
      test('has the data-exclude attribute', () => {
        expect(script.data('exclude')).toBe('page')
      })

      test('points to https://plausible.io/js/plausible.outbound-links.exclusions.js', () => {
        expect(script.attr('src')).toBe(
          'https://plausible.io/js/plausible.outbound-links.exclusions.js'
        )
      })
    })
  })

  describe('when using a self hosted instance like <PlausibleProvider domain="example.com" customDomain="https://custom.example.com" selfHosted>', () => {
    const $ = cheerio.load(fs.readFileSync('./out/selfHosted.html', 'utf8'))
    const script = $('head > script[data-domain="example.com"]')

    describe('the script', () => {
      test('points to https://custom.example.com/js/plausible.js', () => {
        expect(script.attr('src')).toBe(
          'https://custom.example.com/js/plausible.js'
        )
      })
    })
  })

  describe('when used like <PlausibleProvider domain="example.com" enabled={false}>', () => {
    const $ = cheerio.load(fs.readFileSync('./out/disabled.html', 'utf8'))
    const script = $('head > script[data-domain="example.com"]')

    describe('the script', () => {
      test('is not rendered', () => {
        expect(script.length).toBe(0)
      })
    })
  })

  describe('when passing the integrity attribute like <PlausibleProvider domain="example.com" integrity={...}>', () => {
    const $ = cheerio.load(fs.readFileSync('./out/integrity.html', 'utf8'))
    const script = $('head > script[data-domain="example.com"]')

    describe('the script', () => {
      test('contains the integrity attribute', () => {
        expect(script.attr('integrity')).toBe(
          'sha-384-Wxt0f9q5Z1p6pEiVEw/jTJreeVlAcC08vg5shuvm5LccbFFLpb0aTUc6RMUSjgS7'
        )
      })

      test('contains the crossorigin attribute', () => {
        expect(script.attr('crossorigin')).toBe('anonymous')
      })
    })
  })

  describe('when passing custom script props like <PlausibleProvider domain="example.com" scriptProps={{...}}>', () => {
    const $ = cheerio.load(fs.readFileSync('./out/scriptProps.html', 'utf8'))
    const script = $('head > script[data-domain="example.com"]')

    describe('the script', () => {
      test('contains those attributes', () => {
        expect(script.attr('src')).toBe('/custom/js/script.js')
        expect(script.attr('data-api')).toBe('/api/custom/event')
      })
    })
  })
})
