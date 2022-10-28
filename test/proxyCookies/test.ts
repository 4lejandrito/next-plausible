import testPlausibleProvider from '../test'
import next from 'next'
import { NextServer } from 'next/dist/server/next'
import { createServer, Server } from 'http'
import nock from 'nock'
import axios from 'axios'

describe('custom server', () => {
  let app: NextServer
  let server: Server
  let scope: nock.Scope
  beforeAll(async () => {
    app = next({
      conf: require('./next.config.js'),
      dev: true,
      hostname: 'localhost',
      port: 3000,
    })
    const handle = app.getRequestHandler()
    await app.prepare()
    server = createServer((req, res) => handle(req, res))
    await new Promise<void>((resolve) => {
      server.listen(3000, resolve)
    })
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
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()))
    })
    await app.close()
    scope.done()
  })
  testPlausibleProvider((withPage) => {
    describe(
      'when used like <PlausibleProvider domain="example.com">',
      withPage('/', (scriptAttr, getPage) => {
        beforeAll(() =>
          getPage().waitForResponse((response) =>
            response.url().includes('/api/event')
          )
        )
        describe('the script', () => {
          test('points to /test/js/script.js', () =>
            expect(scriptAttr('src')).resolves.toBe('/js/script.local.js'))

          test('uses the proxied api endpoint', () =>
            expect(scriptAttr('data-api')).resolves.toBe('/proxy/api/event'))
        })
      })
    )
  })
})
