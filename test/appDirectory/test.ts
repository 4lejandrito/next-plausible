import axios from 'axios'
import getCombinations from '../../lib/combinations'
import testPlausibleProvider from '../fixtures'
import { describe, it, expect } from '@jest/globals'

testPlausibleProvider((withPage, url) => {
  console.log = console.warn = () => {}

  describe(
    'when used like <PlausibleProvider domain="example.com">',
    withPage('/', (scriptAttr) => {
      describe('the script', () => {
        it('is deferred', () =>
          expect(scriptAttr('defer')).resolves.toBe('true'))

        it('points to /js/script.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/js/script.js'))
      })
    })
  )

  describe('The script at', () => {
    ;[
      {
        source: '/js/script.js',
        destination: 'https://plausible.io/js/script.js',
      },
      ...getCombinations([
        'exclusions',
        'local',
        'manual',
        'outbound-links',
        'revenue',
      ]).map((modifiers) => ({
        source: `/js/script.${modifiers.join('.')}.js`,
        destination: `https://plausible.io/js/script.${modifiers.join('.')}.js`,
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
