import testPlausibleProvider from '../fixtures'
import { describe, it, expect } from '@jest/globals'

testPlausibleProvider((withPage) => {
  describe(
    'when used like <PlausibleProvider src="...">',
    withPage('/', (scriptAttr) => {
      describe('the script', () => {
        it('points to the provided src', () =>
          expect(scriptAttr('src')).resolves.toBe(
            'https://plausible.io/js/pa-zQPm0mSb_NE1JtAQ6DiwY.js'
          ))
      })
    })
  )

  describe(
    'when used like <PlausibleProvider src="..." enabled={false}>',
    withPage('/disabled', (scriptAttr) => {
      describe('the script', () => {
        it('is not rendered', () =>
          expect(scriptAttr('src')).rejects.toBeDefined())
      })
    })
  )

  describe(
    'when passing the integrity attribute',
    withPage('/integrity', (scriptAttr) => {
      describe('the script', () => {
        it('contains the integrity attribute', () =>
          expect(scriptAttr('integrity')).resolves.toBe(
            'sha-384-Wxt0f9q5Z1p6pEiVEw/jTJreeVlAcC08vg5shuvm5LccbFFLpb0aTUc6RMUSjgS7'
          ))

        it('contains the crossorigin attribute', () =>
          expect(scriptAttr('crossorigin')).resolves.toBe('anonymous'))
      })
    })
  )

  describe(
    'when passing custom script props',
    withPage('/scriptProps', (scriptAttr) => {
      describe('the script', () => {
        it('overrides src', async () => {
          await expect(scriptAttr('src')).resolves.toBe('/custom/js/script.js')
        })
      })
      describe('the init script', () => {
        it('contains the nonce attribute', async () => {
          await expect(
            scriptAttr('nonce', '#next-plausible-init')
          ).resolves.toBe('test')
        })
      })
    })
  )
})
