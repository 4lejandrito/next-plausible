import puppeteer from 'puppeteer'

type ScriptAttr = (name: string) => Promise<string | null>
type WithPage = (
  path: string,
  fn: (scriptAttr: ScriptAttr) => void
) => () => void

export default (fn: (withPage: WithPage) => void) =>
  describe('PlausibleProvider', () => {
    let browser: puppeteer.Browser, page: puppeteer.Page

    const scriptAttr: ScriptAttr = (name) =>
      page.$eval(
        'script[data-domain="example.com"]',
        (el, name) => el.getAttribute(name as string),
        name
      )

    const withPage: WithPage = (path, fn) => () => {
      beforeAll(() => page.goto(`http://localhost:3000${path}`))
      fn(scriptAttr)
    }

    beforeAll(async () => {
      browser = await puppeteer.launch()
      page = await browser.newPage()
    })

    fn(withPage)

    afterAll(() => browser.close())
  })
