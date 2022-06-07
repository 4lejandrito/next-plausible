import testPlausibleProvider from '../test'

testPlausibleProvider((withPage) => {
  describe(
    'when used like <PlausibleProvider domain="example.com">',
    withPage('/', (scriptAttr) => {
      describe('the script', () => {
        test('uses the proxied api endpoint with the trailing slash', () =>
          expect(scriptAttr('data-api')).resolves.toBe('/proxy/api/event/'))
      })
    })
  )
})
