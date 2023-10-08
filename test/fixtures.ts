import puppeteer from 'puppeteer'
import path from 'path'
import util from 'util'
import cp, { ChildProcess, spawn } from 'child_process'
import { readdirSync } from 'fs'
import { describe, beforeAll, afterAll } from '@jest/globals'
import callerPath from 'caller-path'
import waitPort from 'wait-port'

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

export default (
  fn: (withPage: WithPage, url: string) => void,
  testDomain?: string
) => {
  const dir = path.resolve(callerPath() ?? '', '..')
  const port = getPort(dir)
  let childProcess: ChildProcess
  beforeAll(async () => {
    const env = {
      ...process.env,
      NEXT_PLAUSIBLE_TEST_DOMAIN: testDomain,
      PORT: `${port}`,
    }
    await exec(`next build`, { env, cwd: dir })
    childProcess = spawn('next', ['start'], {
      env,
      cwd: dir,
    })
    await waitPort({ port, output: 'silent' })
  })

  afterAll(async () => {
    childProcess.kill()
  })

  testNextPlausible(fn, `http://localhost:${port}`)
}
