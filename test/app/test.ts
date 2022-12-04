import testPlausibleProvider from '../fixtures'
import { describe, it, expect } from '@jest/globals'

testPlausibleProvider((withPage) => {
  describe(
    'when used in the _app.js file',
    withPage('/', (scriptAttr) => {
      it('adds the plausible script', () =>
        expect(scriptAttr('src')).resolves.toBeDefined())
    })
  )
})
