import axios from 'axios'
import getCombinations from '../../lib/combinations'
import testPlausibleProvider from '../fixtures'
import { describe, it, expect } from '@jest/globals'

testPlausibleProvider((withPage, url) => {
  describe(
    'when used like <PlausibleProvider domain="example.com">',
    withPage('/', (scriptAttr) => {
      describe('the script', () => {
        it('points to /test/js/script.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/test/js/script.js'))

        it('uses the proxied api endpoint', () =>
          expect(scriptAttr('data-api')).resolves.toBe('/test/api/event'))
      })
    })
  )
  describe('The script at', () => {
    ;[
      {
        source: '/test/js/script.js',
        destination: `${url}/js/plausible.js`,
      },
      ...getCombinations([
        'exclusions',
        'local',
        'manual',
        'outbound-links',
        'revenue',
      ]).map((modifiers) => ({
        source: `/test/js/script.${modifiers.join('.')}.js`,
        destination: `${url}/js/plausible.${modifiers.join('.')}.js`,
      })),
    ].map(({ source, destination }) => {
      describe(source, () => {
        it(`is proxied from ${destination}`, async () => {
          const sourceScriptContent = (await axios.get(`${url}${source}`)).data
          expect(sourceScriptContent).toBe(
            'Fake ' + destination.replace(`${url}/js/`, '')
          )
        })
      })
    })
  })
})
