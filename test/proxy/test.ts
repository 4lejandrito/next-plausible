import axios from 'axios'
import testPlausibleProvider from '../fixtures'
import { describe, it, expect } from '@jest/globals'

testPlausibleProvider((withPage, url) => {
  describe(
    'when used with proxy like <PlausibleProvider>',
    withPage('/', (scriptAttr) => {
      describe('the script', () => {
        it('points to the local proxy path', () =>
          expect(scriptAttr('src')).resolves.toBe('/js/script.js'))
      })
    })
  )

  describe('The script at', () => {
    describe('/js/script.js', () => {
      it('is proxied from https://plausible.io/js/pa-zQPm0mSb_NE1JtAQ6DiwY.js', async () => {
        const sourceScriptContent = (await axios.get(`${url}/js/script.js`))
          .data
        const destinationScriptContent = (
          await axios.get('https://plausible.io/js/pa-zQPm0mSb_NE1JtAQ6DiwY.js')
        ).data
        expect(sourceScriptContent).toBe(destinationScriptContent)
      })
    })
  })
})
