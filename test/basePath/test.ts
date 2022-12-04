import axios from 'axios'
import getCombinations from '../../lib/combinations'
import testPlausibleProvider from '../fixtures'
import { describe, it, expect } from '@jest/globals'

testPlausibleProvider((withPage, url) => {
  describe(
    'when used like <PlausibleProvider domain="example.com">',
    withPage('/test', (scriptAttr) => {
      describe('the script', () => {
        it('is deferred', () =>
          expect(scriptAttr('defer')).resolves.toBe('true'))

        it('points to /test/js/script.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/test/js/script.js'))

        it('uses the proxied api endpoint', () =>
          expect(scriptAttr('data-api')).resolves.toBe('/test/proxy/api/event'))
      })
    })
  )

  describe('The script at', () => {
    ;[
      {
        source: '/test/js/script.js',
        destination: 'https://plausible.io/js/plausible.js',
      },
      ...getCombinations([
        'exclusions',
        'local',
        'manual',
        'outbound-links',
      ]).map((modifiers) => ({
        source: `/test/js/script.${modifiers.join('.')}.js`,
        destination: `https://plausible.io/js/plausible.${modifiers.join(
          '.'
        )}.js`,
      })),
    ].map(({ source, destination }) => {
      describe(source, () => {
        it(`is proxied from ${destination}`, async () => {
          const sourceScriptContent = (await axios.get(`${url}${source}`)).data
          const destinationScriptContent = (await axios.get(destination)).data
          expect(sourceScriptContent).toBe(destinationScriptContent)
        })
      })
    })
  })
})
