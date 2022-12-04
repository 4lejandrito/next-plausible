import testPlausibleProvider from '../fixtures'
import { describe, it, expect } from '@jest/globals'

testPlausibleProvider((withPage) => {
  describe(
    'when used like <PlausibleProvider domain="example.com">',
    withPage('/', (scriptAttr) => {
      describe('the script', () => {
        it('uses the proxied api endpoint with the trailing slash', () =>
          expect(scriptAttr('data-api')).resolves.toBe('/proxy/api/event/'))
      })
    })
  )
})
