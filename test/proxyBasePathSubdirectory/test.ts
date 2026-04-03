import axios from 'axios'
import testPlausibleProvider from '../fixtures'
import { describe, it, expect } from '@jest/globals'

testPlausibleProvider((withPage, url) => {
  describe(
    'when used with a basePath and subdirectory',
    withPage('/test', (scriptAttr) => {
      describe('the script', () => {
        it('points to /test/subdirectory/js/script.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            '/test/subdirectory/js/script.js'
          ))

        it('uses the proxied api endpoint', () =>
          expect(
            scriptAttr('textContent', '#next-plausible-init')
          ).resolves.toContain('/test/subdirectory/api/event'))
      })
    })
  )

  describe('The script at', () => {
    describe('/test/subdirectory/js/script.js', () => {
      it('is proxied from https://plausible.io/js/pa-zQPm0mSb_NE1JtAQ6DiwY.js', async () => {
        const sourceScriptContent = (
          await axios.get(`${url}/test/subdirectory/js/script.js`)
        ).data
        const destinationScriptContent = (
          await axios.get('https://plausible.io/js/pa-zQPm0mSb_NE1JtAQ6DiwY.js')
        ).data
        expect(sourceScriptContent).toBe(destinationScriptContent)
      })
    })
  })
})
