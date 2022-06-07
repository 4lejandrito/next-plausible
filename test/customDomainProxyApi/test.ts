import testPlausibleProvider from '../test'

testPlausibleProvider((withPage) => {
  describe(
    'when used like <PlausibleProvider domain="example.com">',
    withPage('/', (scriptAttr) => {
      describe('the script', () => {
        test('points to /js/script.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/js/script.js'))

        test('uses the proxied api endpoint', () =>
          expect(scriptAttr('data-api')).resolves.toBe('/proxy/api/event'))
      })
    })
  )
})
