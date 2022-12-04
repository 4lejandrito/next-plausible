import testPlausibleProvider from '../fixtures'
import nock from 'nock'
import axios from 'axios'
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

testPlausibleProvider((withPage) => {
  let scope: nock.Scope
  beforeAll(async () => {
    scope = nock('https://plausible.io')
      .get('/js/plausible.local.js')
      .reply(
        200,
        (await axios.get('https://plausible.io/js/script.local.js')).data
      )
      .post('/api/event')
      .matchHeader('cookie', '')
      .reply()
  })
  afterAll(async () => {
    scope.done()
    nock.restore()
  })
  describe(
    'when used like <PlausibleProvider domain="example.com">',
    withPage('/', (scriptAttr, getPage) => {
      beforeAll(() =>
        getPage().waitForResponse((response) =>
          response.url().includes('/api/event')
        )
      )
      describe('the script', () => {
        it('points to /test/js/script.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/js/script.local.js'))

        it('uses the proxied api endpoint', () =>
          expect(scriptAttr('data-api')).resolves.toBe('/proxy/api/event'))
      })
    })
  )
})
