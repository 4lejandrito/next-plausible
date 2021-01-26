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
})
