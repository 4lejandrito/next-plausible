import axios from 'axios'
import getCombinations from '../../lib/combinations'
import testPlausibleProvider, { url } from '../test'

testPlausibleProvider((withPage) => {
  describe(
    'when used like <PlausibleProvider domain="example.com">',
    withPage('/', (scriptAttr) => {
      describe('the script', () => {
        test('points to /test/js/script.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/test/js/script.js'))

        test('uses the proxied api endpoint', () =>
          expect(scriptAttr('data-api')).resolves.toBe('/test/api/event'))
      })
    })
  )
})

describe('The script at', () => {
  ;[
    {
      source: '/test/js/script.js',
      destination: `${url}/js/plausible.js`,
    },
    ...getCombinations(['exclusions', 'local', 'manual', 'outbound-links']).map(
      (modifiers) => ({
        source: `/test/js/script.${modifiers.join('.')}.js`,
        destination: `${url}/js/plausible.${modifiers.join('.')}.js`,
      })
    ),
  ].map(({ source, destination }) => {
    describe(source, () => {
      test(`is proxied from ${destination}`, async () => {
        const sourceScriptContent = (await axios.get(`${url}${source}`)).data
        expect(sourceScriptContent).toBe(
          'Fake ' + destination.replace(`${url}/js/`, '')
        )
      })
    })
  })
})
