import testPlausibleProvider from '../fixtures'
import { describe, it, expect } from '@jest/globals'

testPlausibleProvider((withPage) => {
  describe(
    'when used with trailingSlash',
    withPage('/', (scriptAttr) => {
      describe('the script', () => {
        it('uses the proxied api endpoint with trailing slash', () =>
          expect(
            scriptAttr('textContent', '#next-plausible-init')
          ).resolves.toContain('/api/event/'))
      })
    })
  )
})
