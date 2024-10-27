import axios from 'axios'
import getCombinations from '../../lib/combinations'
import testPlausibleProvider from '../fixtures'
import { describe, it, expect } from '@jest/globals'

testPlausibleProvider((withPage, url) => {
  describe(
    'when used like <PlausibleProvider domain="example.com">',
    withPage('/test', (scriptAttr) => {
      describe('the script', () => {
        it('is deferred', () => expect(scriptAttr('defer')).resolves.toBe(''))

        it('points to /test/subdirectory/js/script.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            '/test/subdirectory/js/script.js'
          ))

        it('uses the proxied api endpoint', () =>
          expect(scriptAttr('data-api')).resolves.toBe(
            '/test/subdirectory/api/event'
          ))
      })
    })
  )

  describe('The script at', () => {
    ;[
      {
        source: '/test/subdirectory/js/script.js',
        destination: 'https://plausible.io/js/script.js',
      },
      ...getCombinations([
        'exclusions',
        'local',
        'manual',
        'outbound-links',
        'revenue',
      ]).map((modifiers) => ({
        source: `/test/subdirectory/js/script.${modifiers.join('.')}.js`,
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
