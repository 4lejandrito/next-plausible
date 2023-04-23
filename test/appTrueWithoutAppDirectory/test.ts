import testPlausibleProvider from '../fixtures'
import { describe, it, expect } from '@jest/globals'

testPlausibleProvider((withPage) => {
  describe(
    'when used like <PlausibleProvider domain="example.com">',
    withPage('/', (scriptAttr) => {
      describe('the script', () => {
        it('points to https://plausible.io/js/script.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            'https://plausible.io/js/script.js'
          ))
      })
    })
  )
})
