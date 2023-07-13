import { createServer, Server } from 'http'
import { NextServer } from 'next/dist/server/next'
import next from 'next'
import puppeteer from 'puppeteer'
import path from 'path'
import util from 'util'
import cp from 'child_process'
import { existsSync, readdirSync } from 'fs'
import { describe, beforeAll, afterAll } from '@jest/globals'
import callerPath from 'caller-path'

const exec = util.promisify(cp.exec)

type ScriptAttr = (name: string) => Promise<string | null>
type PlausibleEvent = object
type WithPage = (
  path: string,
  fn: (
    scriptAttr: ScriptAttr,
    getPage: () => puppeteer.Page,
    events: PlausibleEvent[]
  ) => void,
  domain?: string
) => () => void

const getPort = (dir: string) => {
  const parentFolder = path.join(dir, '..')
  return (
    3000 +
    readdirSync(parentFolder).findIndex(
      (f) => path.resolve(path.join(parentFolder, f)) === path.resolve(dir)
    )
  )
}

export const testNextPlausible = (
  fn: (withPage: WithPage, url: string) => void,
  baseUrl: string
) =>
  describe('PlausibleProvider', () => {
    let browser: puppeteer.Browser

    beforeAll(async () => {
      browser = await puppeteer.launch()
    })

    afterAll(() => browser.close())

    const withPage: WithPage =
      (path, fn, domain = 'example.com') =>
      () => {
        let page: puppeteer.Page
        const events: PlausibleEvent[] = []

        const getScriptAttr =
          (domain: string): ScriptAttr =>
          async (name) => {
            const selector = `script[data-domain="${domain}"]`
            await page.waitForSelector(selector)
            return page.$eval(
              selector,
              (el, name) => el.getAttribute(name as string),
              name
            )
          }

        beforeAll(async () => {
          page = await browser.newPage()
          page.on('request', (request) => {
            if (request.url().endsWith('/api/event')) {
              events.push(JSON.parse(request.postData() ?? '{}'))
            }
          })
          await page.goto(`${baseUrl}${path}`)
        })

        fn(getScriptAttr(domain), () => page, events)
      }

    fn(withPage, baseUrl)
  })

export default (fn: (withPage: WithPage, url: string) => void) => {
  const dir = path.resolve(callerPath() ?? '', '..')
  const port = getPort(dir)
  let app: NextServer
  let server: Server
  beforeAll(async () => {
    process.env.PORT = `${port}`
    await exec(`next build`, { env: process.env, cwd: dir })
    const configPath = path.join(dir, 'next.config.js')
    app = next({
      dir,
      conf: existsSync(configPath) ? require(configPath) : undefined,
      port,
    })
    const handle = app.getRequestHandler()
    await app.prepare()
    server = createServer((req, res) => handle(req, res))
    await new Promise<void>((resolve) => {
      server.listen(port, resolve)
    })
  })

  afterAll(async () => {
    await app.close()
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()))
    })
  })

  testNextPlausible(fn, `http://localhost:${port}`)
}
