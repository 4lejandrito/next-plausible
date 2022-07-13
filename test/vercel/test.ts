import testPlausibleProvider from '../test'

testPlausibleProvider((withPage) => {
  describe(
    'when used in a production deployment on vercel',
    withPage('/', (scriptAttr) => {
      describe('the script', () => {
        test('is rendered', () =>
          expect(scriptAttr('src')).resolves.toBeDefined())
      })
    })
  )
}, 'https://next-plausible.vercel.app')

testPlausibleProvider((withPage) => {
  describe(
    'when used in a preview deployment on vercel',
    withPage('/', (scriptAttr) => {
      describe('the script', () => {
        test('is not rendered', () =>
          expect(scriptAttr('src')).rejects.toBeDefined())
      })
    })
  )
}, 'https://vercel-next-plausible.vercel.app')
