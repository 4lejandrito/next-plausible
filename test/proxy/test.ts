import axios from 'axios'
import puppeteer from 'puppeteer'
import getCombinations from '../../lib/combinations'
import testPlausibleProvider from '../test'

const url = 'http://localhost:3000'

testPlausibleProvider((withPage) => {
  describe(
    'when used like <PlausibleProvider domain="example.com">',
    withPage('/', (scriptAttr) => {
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
        test('is deferred', () =>
          expect(scriptAttr('defer')).resolves.toBe('true'))

        test('points to /js/script.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/js/script.js'))
      })
    })
  )

  describe(
    'when excluding a page like <PlausibleProvider domain="example.com" exclude="page">',
    withPage('/exclude', (scriptAttr) => {
      describe('the script', () => {
        test('has the data-exclude attribute', () =>
          expect(scriptAttr('data-exclude')).resolves.toBe('page'))

        test('points to /js/script.exclusions.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/js/script.exclusions.js'))
      })
    })
  )

  describe(
    'when tracking outbound links like <PlausibleProvider domain="example.com" trackOutboundLinks />',
    withPage('/trackOutboundLinks', (scriptAttr) => {
      describe('the script', () => {
        test('points to /js/script.outbound-links.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            '/js/script.outbound-links.js'
          ))
      })
    })
  )

  describe(
    'when tracking localhost events like <PlausibleProvider domain="example.com" trackLocalhost />',
    withPage('/trackLocalhost', (scriptAttr) => {
      describe('the script', () => {
        test('points to /js/script.local.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/js/script.local.js'))
      })
    })
  )

  describe(
    'when disabling automatic page events like <PlausibleProvider domain="example.com" manual />',
    withPage('/manual', (scriptAttr) => {
      describe('the script', () => {
        test('points to /js/script.manual.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/js/script.manual.js'))
      })
    })
  )

  describe(
    'when tracking outbound links and excluding a page like <PlausibleProvider domain="example.com" trackOutboundLinks exclude="page" />',
    withPage('/trackOutboundLinksExclude', (scriptAttr) => {
      describe('the script', () => {
        test('has the data-exclude attribute', () =>
          expect(scriptAttr('data-exclude')).resolves.toBe('page'))

        test('points to /js/script.exclusions.outbound-links.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            '/js/script.exclusions.outbound-links.js'
          ))
      })
    })
  )

  describe(
    'when using all supported modifiers',
    withPage('/allModifiers', (scriptAttr) => {
      describe('the script', () => {
        test('has the data-exclude attribute', () =>
          expect(scriptAttr('data-exclude')).resolves.toBe('page'))

        test('points to /js/script.exclusions.local.manual.outbound-links.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            '/js/script.exclusions.local.manual.outbound-links.js'
          ))
      })
    })
  )

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
        await page.waitForNetworkIdle()
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
