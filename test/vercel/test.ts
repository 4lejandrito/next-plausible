import testPlausibleProvider from '../test'

testPlausibleProvider((withPage) => {
  describe(
    'when used in a production deployment on vercel',
    withPage(
      '/',
      (scriptAttr) => {
        describe('the script', () => {
          test('is rendered', () =>
            expect(scriptAttr('src')).resolves.toBeDefined())
        })
      },
      'next-plausible.vercel.app'
    )
  )
}, 'https://next-plausible.vercel.app')

testPlausibleProvider((withPage) => {
  describe(
    'when used in a preview deployment on vercel',
    withPage(
      '/',
      (scriptAttr) => {
        describe('the script', () => {
          test('is not rendered', () =>
            expect(scriptAttr('src')).rejects.toBeDefined())
        })
      },
      'demo-next-plausible.vercel.app'
    )
  )
}, 'https://demo-next-plausible.vercel.app')
