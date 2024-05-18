import { testNextPlausible as testPlausibleProvider } from '../fixtures'
import { describe, it, expect } from '@jest/globals'

testPlausibleProvider((withPage) => {
  describe(
    'when used in a production deployment on vercel',
    withPage(
      '/',
      (scriptAttr, getPage, events) => {
        describe('the script', () => {
          it('is rendered', () =>
            expect(scriptAttr('src')).resolves.toBeDefined())
        })
        it('sends the pageview event', async () => {
          await getPage().waitForNetworkIdle()
          expect(events).toEqual([
            expect.objectContaining({
              n: 'pageview',
            }),
          ])
        })
      },
      'next-plausible.vercel.app'
    )
  )
}, 'https://next-plausible.vercel.app')

testPlausibleProvider((withPage) => {
  describe(
    'when used in a preview deployment on vercel',
    withPage(
      '/',
      (scriptAttr) => {
        describe('the script', () => {
          it('is not rendered', () =>
            expect(scriptAttr('src')).rejects.toBeDefined())
        })
      },
      'demo-next-plausible.vercel.app'
    )
  )
}, 'https://demo-next-plausible.vercel.app')
