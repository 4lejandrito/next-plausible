import testPlausibleProvider from '../fixtures'
import { describe, it, expect } from '@jest/globals'

testPlausibleProvider((withPage, url) => {
  console.log = console.warn = () => {}

  describe(
    'when used with proxy in an app directory setup',
    withPage('/', (scriptAttr, getPage, events) => {
      describe('the script', () => {
        it('points to /js/script.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/js/script.js'))
      })
      it('sends the pageview event', async () => {
        await getPage().waitForNetworkIdle()
        expect(events).toEqual([
          expect.objectContaining({
            n: 'pageview',
          }),
        ])
      })
    })
  )
})
