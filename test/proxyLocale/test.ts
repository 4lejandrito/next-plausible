import axios from 'axios'
import getCombinations from '../../lib/combinations'
import testPlausibleProvider, { url } from '../test'

testPlausibleProvider((withPage) => {
  describe(
    'when used like <PlausibleProvider domain="example.com">',
    withPage('/es', (scriptAttr) => {
      describe('the script', () => {
        test('is deferred', () =>
          expect(scriptAttr('defer')).resolves.toBeDefined())

        test('points to /js/script.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/js/script.js'))
      })
    })
  )

  describe(
    'when excluding a page like <PlausibleProvider domain="example.com" exclude="page">',
    withPage('/es/exclude', (scriptAttr) => {
      describe('the script', () => {
        test('has the data-exclude attribute', () =>
          expect(scriptAttr('data-exclude')).resolves.toBe('page'))

        test('points to /js/script.exclusions.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/js/script.exclusions.js'))
      })
    })
  )

  describe(
    'when tracking outbound links like <PlausibleProvider domain="example.com" trackOutboundLinks />',
    withPage('/es/trackOutboundLinks', (scriptAttr) => {
      describe('the script', () => {
        test('points to /js/script.outbound-links.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            '/js/script.outbound-links.js'
          ))
      })
    })
  )

  describe(
    'when tracking localhost events like <PlausibleProvider domain="example.com" trackLocalhost />',
    withPage('/es/trackLocalhost', (scriptAttr) => {
      describe('the script', () => {
        test('points to /js/script.local.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/js/script.local.js'))
      })
    })
  )

  describe(
    'when disabling automatic page events like <PlausibleProvider domain="example.com" manual />',
    withPage('/es/manual', (scriptAttr) => {
      describe('the script', () => {
        test('points to /js/script.manual.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/js/script.manual.js'))
      })
    })
  )

  describe(
    'when tracking outbound links and excluding a page like <PlausibleProvider domain="example.com" trackOutboundLinks exclude="page" />',
    withPage('/es/trackOutboundLinksExclude', (scriptAttr) => {
      describe('the script', () => {
        test('has the data-exclude attribute', () =>
          expect(scriptAttr('data-exclude')).resolves.toBe('page'))

        test('points to /js/script.exclusions.outbound-links.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            '/js/script.exclusions.outbound-links.js'
          ))
      })
    })
  )
})

describe('The script at', () => {
  ;[
    {
      source: '/js/script.js',
      destination: 'https://plausible.io/js/plausible.js',
    },
    ...getCombinations(['exclusions', 'local', 'manual', 'outbound-links']).map(
      (modifiers) => ({
        source: `/js/script.${modifiers.join('.')}.js`,
        destination: `https://plausible.io/js/plausible.${modifiers.join(
          '.'
        )}.js`,
      })
    ),
  ].map(({ source, destination }) => {
    describe(source, () => {
      test(`is proxied from ${destination}`, async () => {
        const sourceScriptContent = (await axios.get(`${url}${source}`)).data
        const destinationScriptContent = (await axios.get(destination)).data
        expect(sourceScriptContent).toBe(destinationScriptContent)
      })
    })
  })
})
