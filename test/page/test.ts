import testPlausibleProvider from '../fixtures'
import { describe, it, expect } from '@jest/globals'

testPlausibleProvider((withPage) => {
  describe(
    'when used like <PlausibleProvider domain="example.com">',
    withPage('/', (scriptAttr) => {
      describe('the script', () => {
        it('is deferred', () =>
          expect(scriptAttr('defer')).resolves.toBe('true'))

        it('points to https://plausible.io/js/script.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            'https://plausible.io/js/script.js'
          ))
      })
    })
  )

  describe(
    'when passing a custom domain like <PlausibleProvider domain="example.com" customDomain="https://custom.example.com">',
    withPage('/customDomain', (scriptAttr) => {
      describe('the script', () => {
        it('points to https://custom.example.com/js/script.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            'https://custom.example.com/js/script.js'
          ))
      })
    })
  )

  describe(
    'when excluding a page like <PlausibleProvider domain="example.com" exclude="page">',
    withPage('/exclude', (scriptAttr) => {
      describe('the script', () => {
        it('has the data-exclude attribute', () =>
          expect(scriptAttr('data-exclude')).resolves.toBe('page'))

        it('points to https://plausible.io/js/script.exclusions.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            'https://plausible.io/js/script.exclusions.js'
          ))
      })
    })
  )

  describe(
    'when excluding a page with a custom domain like <PlausibleProvider domain="example.com" customDomain="https://custom.example.com" exclude="page">',
    withPage('/customDomainExclude', (scriptAttr) => {
      describe('the script', () => {
        it('has the data-exclude attribute', () =>
          expect(scriptAttr('data-exclude')).resolves.toBe('page'))

        it('points to https://custom.example.com/js/script.exclusions.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            'https://custom.example.com/js/script.exclusions.js'
          ))
      })
    })
  )

  describe(
    'when tracking localhost events like <PlausibleProvider domain="example.com" trackLocalhost />',
    withPage('/trackLocalhost', (scriptAttr) => {
      describe('the script', () => {
        it('points to https://plausible.io/js/script.local.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            'https://plausible.io/js/script.local.js'
          ))
      })
    })
  )

  describe(
    'when disabling automatic page events like <PlausibleProvider domain="example.com" manual />',
    withPage('/manual', (scriptAttr) => {
      describe('the script', () => {
        it('points to https://plausible.io/js/script.manual.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            'https://plausible.io/js/script.manual.js'
          ))
      })
    })
  )

  describe(
    'when tracking outbound links like <PlausibleProvider domain="example.com" trackOutboundLinks />',
    withPage('/trackOutboundLinks', (scriptAttr) => {
      describe('the script', () => {
        it('points to https://plausible.io/js/script.outbound-links.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            'https://plausible.io/js/script.outbound-links.js'
          ))
      })
    })
  )

  describe(
    'when tracking outbound links and excluding a page like <PlausibleProvider domain="example.com" trackOutboundLinks exclude="page" />',
    withPage('/trackOutboundLinksExclude', (scriptAttr) => {
      describe('the script', () => {
        it('has the data-exclude attribute', () => {
          expect(scriptAttr('data-exclude')).resolves.toBe('page')
        })

        it('points to https://plausible.io/js/script.exclusions.outbound-links.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            'https://plausible.io/js/script.exclusions.outbound-links.js'
          ))
      })
    })
  )

  describe(
    'when tracking file downloads like <PlausibleProvider domain="example.com" trackFileDownloads />',
    withPage('/trackFileDownloads', (scriptAttr) => {
      describe('the script', () => {
        it('points to https://plausible.io/js/script.file-downloads.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            'https://plausible.io/js/script.file-downloads.js'
          ))
      })
    })
  )

  describe(
    'when using a self hosted instance like <PlausibleProvider domain="example.com" customDomain="https://custom.example.com" selfHosted>',
    withPage('/selfHosted', (scriptAttr) => {
      describe('the script', () => {
        it('points to https://custom.example.com/js/plausible.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            'https://custom.example.com/js/plausible.js'
          ))
      })
    })
  )

  describe(
    'when used like <PlausibleProvider domain="example.com" enabled={false}>',
    withPage('/disabled', (scriptAttr) => {
      describe('the script', () => {
        it('is not rendered', () =>
          expect(scriptAttr('src')).rejects.toBeDefined())
      })
    })
  )

  describe(
    'when passing the integrity attribute like <PlausibleProvider domain="example.com" integrity={...}>',
    withPage('/integrity', (scriptAttr) => {
      describe('the script', () => {
        it('contains the integrity attribute', () =>
          expect(scriptAttr('integrity')).resolves.toBe(
            'sha-384-Wxt0f9q5Z1p6pEiVEw/jTJreeVlAcC08vg5shuvm5LccbFFLpb0aTUc6RMUSjgS7'
          ))

        it('contains the crossorigin attribute', () =>
          expect(scriptAttr('crossorigin')).resolves.toBe('anonymous'))
      })
    })
  )

  describe(
    'when passing custom script props like <PlausibleProvider domain="example.com" scriptProps={{...}}>',
    withPage('/scriptProps', (scriptAttr) => {
      describe('the script', () => {
        it('contains those attributes', async () => {
          await expect(scriptAttr('src')).resolves.toBe('/custom/js/script.js')
          await expect(scriptAttr('data-api')).resolves.toBe(
            '/api/custom/event'
          )
        })
      })
    })
  )

  describe(
    'when enabling tagged events like <PlausibleProvider domain="example.com" taggedEvents ...>',
    withPage('/taggedEvents', (scriptAttr, getPage) => {
      describe('the script', () => {
        it('points to https://plausible.io/js/script.local.tagged-events.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            'https://plausible.io/js/script.local.tagged-events.js'
          ))
      })
      it('sends the custom event', async () => {
        const button = await getPage().$('button')
        button?.click()
        await getPage().waitForRequest((request) => {
          if (request.url().includes('/api/event')) {
            const body = JSON.parse(request.postData() ?? '')
            return body.n === 'CustomEventName' && body.p.prop === 'value'
          }
          return false
        })
      })
    })
  )

  describe(
    'when tracking ecommerce revenue like <PlausibleProvider domain="example.com" revenue />',
    withPage('/revenue', (scriptAttr, getPage) => {
      describe('the script', () => {
        it('points to https://plausible.io/js/script.local.revenue.tagged-events.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            'https://plausible.io/js/script.local.revenue.tagged-events.js'
          ))
      })
      it('sends the purchase event', async () => {
        const button = await getPage().$('button')
        button?.click()
        await getPage().waitForRequest((request) => {
          if (request.url().includes('/api/event')) {
            const body = JSON.parse(request.postData() ?? '')
            return (
              body.n === 'Purchase' &&
              body.$.amount === '10.29' &&
              body.$.currency === 'EUR'
            )
          }
          return false
        })
      })
    })
  )
})
