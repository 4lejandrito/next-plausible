import cheerio, { Cheerio, Element } from 'cheerio'
import axios from 'axios'
import puppeteer from 'puppeteer'
import getCombinations from '../../lib/combinations'

const url = 'http://localhost:3000'

describe('PlausibleProvider', () => {
  describe('when used like <PlausibleProvider domain="example.com">', () => {
    let script: Cheerio<Element>

    beforeAll(async () => {
      const $ = cheerio.load((await axios(url)).data)
      script = $('head > script[data-domain="example.com"]')
    })

    test('adds the plausible script to <head>', () => {
      expect(script).toBeDefined()
    })

    it('loads external images with next/image properly', async () => {
      const browser = await puppeteer.launch()
      try {
        const page = await browser.newPage()
        await page.goto(`${url}/withExternalImage`)
        expect(
          (
            await axios(
              `${url}/${
                (await page.$eval('img', (element) =>
                  element.getAttribute('src')
                )) as string
              }`
            )
          ).status
        ).toBe(200)
      } finally {
        await browser.close()
      }
    })

    describe('the script', () => {
      test('is deferred', () => {
        expect(script.attr('defer')).toBeDefined()
      })

      test('points to /js/script.js', () => {
        expect(script.attr('src')).toBe('/js/script.js')
      })
    })
  })

  describe('when excluding a page like <PlausibleProvider domain="example.com" exclude="page">', () => {
    let script: Cheerio<Element>

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
    let script: Cheerio<Element>

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

  describe('when tracking localhost events like <PlausibleProvider domain="example.com" trackLocalhost />', () => {
    let script: Cheerio<Element>

    beforeAll(async () => {
      const $ = cheerio.load((await axios(`${url}/trackLocalhost`)).data)
      script = $('head > script[data-domain="example.com"]')
    })

    describe('the script', () => {
      test('points to /js/script.local.js', () => {
        expect(script.attr('src')).toBe('/js/script.local.js')
      })
    })
  })

  describe('when disabling automatic page events like <PlausibleProvider domain="example.com" manual />', () => {
    let script: Cheerio<Element>

    beforeAll(async () => {
      const $ = cheerio.load((await axios(`${url}/manual`)).data)
      script = $('head > script[data-domain="example.com"]')
    })

    describe('the script', () => {
      test('points to /js/script.manual.js', () => {
        expect(script.attr('src')).toBe('/js/script.manual.js')
      })
    })
  })

  describe('when tracking outbound links and excluding a page like <PlausibleProvider domain="example.com" trackOutboundLinks exclude="page" />', () => {
    let script: Cheerio<Element>

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

      test('points to /js/script.exclusions.outbound-links.js', () => {
        expect(script.attr('src')).toBe(
          '/js/script.exclusions.outbound-links.js'
        )
      })
    })
  })

  describe('when using all supported modifiers', () => {
    let script: Cheerio<Element>

    beforeAll(async () => {
      const $ = cheerio.load((await axios(`${url}/allModifiers`)).data)
      script = $('head > script[data-domain="example.com"]')
    })

    describe('the script', () => {
      test('has the data-exclude attribute', () => {
        expect(script.data('exclude')).toBe('page')
      })

      test('points to /js/script.exclusions.local.manual.outbound-links.js', () => {
        expect(script.attr('src')).toBe(
          '/js/script.exclusions.local.manual.outbound-links.js'
        )
      })
    })
  })

  describe('when tracking a 404 page', () => {
    test('there are 2 events sent', async () => {
      const browser = await puppeteer.launch()
      try {
        const page = await browser.newPage()
        let plausibleEvents = 0
        page.on('console', (message) => {
          if (message.text().includes('Ignoring Event')) {
            plausibleEvents += 1
          }
        })
        await page.goto(`${url}/notFound`)
        await page.waitForFunction('!!window.plausible')
        expect(plausibleEvents).toBe(2)
      } finally {
        await browser.close()
      }
    })
  })
})

describe('The script at', () => {
  ;[
    {
      source: '/js/script.js',
      destination: 'https://plausible.io/js/plausible.js',
    },
    ...getCombinations(['exclusions', 'local', 'manual', 'outbound-links']).map(
      (modifiers) => ({
        source: `/js/script.${modifiers.join('.')}.js`,
        destination: `https://plausible.io/js/plausible.${modifiers.join(
          '.'
        )}.js`,
      })
    ),
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
