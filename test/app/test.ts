import testPlausibleProvider from '../test'

testPlausibleProvider((withPage) => {
  describe(
    'when used in the _app.js file',
    withPage('/', (scriptAttr) => {
      test('adds the plausible script', () =>
        expect(scriptAttr('src')).resolves.toBeDefined())
    })
  )
})
