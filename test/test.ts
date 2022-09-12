import puppeteer from 'puppeteer'

type ScriptAttr = (name: string) => Promise<string | null>
type WithPage = (
  path: string,
  fn: (scriptAttr: ScriptAttr, getPage: () => puppeteer.Page) => void,
  domain?: string
) => () => void

export const url = 'http://localhost:3000'

export default (fn: (withPage: WithPage) => void, baseUrl = url) =>
  describe('PlausibleProvider', () => {
    let browser: puppeteer.Browser, page: puppeteer.Page

    const getScriptAttr =
      (domain: string): ScriptAttr =>
      (name) =>
        page.$eval(
          `script[data-domain="${domain}"]`,
          (el, name) => el.getAttribute(name as string),
          name
        )

    const withPage: WithPage =
      (path, fn, domain = 'example.com') =>
      () => {
        beforeAll(() => page.goto(`${baseUrl}${path}`))
        fn(getScriptAttr(domain), () => page)
      }

    beforeAll(async () => {
      browser = await puppeteer.launch()
      page = await browser.newPage()
    })

    fn(withPage)

    afterAll(() => browser.close())
  })
