import axios from 'axios'
import getCombinations from '../../lib/combinations'
import testPlausibleProvider, { url } from '../test'

testPlausibleProvider((withPage) => {
  describe(
    'when used like <PlausibleProvider domain="example.com">',
    withPage('/test', (scriptAttr) => {
      describe('the script', () => {
        test('is deferred', () =>
          expect(scriptAttr('defer')).resolves.toBe('true'))

        test('points to /test/subdirectory/js/script.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            '/test/subdirectory/js/script.js'
          ))

        test('uses the proxied api endpoint', () =>
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
        destination: 'https://plausible.io/js/plausible.js',
      },
      ...getCombinations([
        'exclusions',
        'local',
        'manual',
        'outbound-links',
      ]).map((modifiers) => ({
        source: `/test/subdirectory/js/script.${modifiers.join('.')}.js`,
        destination: `https://plausible.io/js/plausible.${modifiers.join(
          '.'
        )}.js`,
      })),
    ].map(({ source, destination }) => {
      describe(source, () => {
        test(`is proxied from ${destination}`, async () => {
          const sourceScriptContent = (await axios.get(`${url}${source}`)).data
          const destinationScriptContent = (await axios.get(destination)).data
          expect(sourceScriptContent).toBe(destinationScriptContent)
        })
      })
    })
  })
})
