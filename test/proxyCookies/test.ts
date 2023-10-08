import testPlausibleProvider from '../fixtures'
import http from 'http'
import axios from 'axios'
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

testPlausibleProvider((withPage) => {
  let server: http.Server
  let success = false
  beforeAll((done) => {
    server = http.createServer(async (req, res) => {
      if (req.url === '/js/script.local.js' && !req.headers.cookie) {
        success = true
        const scriptResponse = await axios.get(
          'https://plausible.io/js/script.local.js'
        )
        res.writeHead(200, scriptResponse.headers)
        res.end(scriptResponse.data)
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('okay')
      }
    })
    server.listen(8080, done)
  })
  afterAll(async () => {
    expect(success).toBe(true)
    server.close()
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
}, 'http://localhost:8080')
