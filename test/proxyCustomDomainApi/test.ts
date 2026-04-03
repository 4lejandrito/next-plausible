import testPlausibleProvider from '../fixtures'
import { describe, it, expect } from '@jest/globals'

testPlausibleProvider((withPage) => {
  describe(
    'when used with a custom domain proxy api',
    withPage('/', (scriptAttr) => {
      describe('the script', () => {
        it('points to /js/script.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/js/script.js'))

        it('uses the proxied api endpoint', () =>
          expect(
            scriptAttr('textContent', '#next-plausible-init')
          ).resolves.toContain('/api/event'))
      })
    })
  )
})
