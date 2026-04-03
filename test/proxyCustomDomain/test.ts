import testPlausibleProvider from '../fixtures'
import axios from 'axios'
import { describe, it, expect } from '@jest/globals'

testPlausibleProvider((withPage, url) => {
  describe(
    'when used with a custom domain proxy',
    withPage('/', (scriptAttr) => {
      describe('the script', () => {
        it('points to /test/js/script.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/test/js/script.js'))
      })
    })
  )

  describe('The script at /test/js/script.js', () => {
    it('is proxied from the custom domain', async () => {
      const sourceScriptContent = (await axios.get(`${url}/test/js/script.js`))
        .data
      expect(sourceScriptContent).toBe('Fake script.js')
    })
  })
})
