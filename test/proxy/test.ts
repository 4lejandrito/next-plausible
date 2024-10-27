import axios from 'axios'
import getCombinations from '../../lib/combinations'
import testPlausibleProvider from '../fixtures'
import { describe, it, expect } from '@jest/globals'

testPlausibleProvider((withPage, url) => {
  describe(
    'when used like <PlausibleProvider domain="example.com">',
    withPage('/', (scriptAttr) => {
      describe('the script', () => {
        it('is deferred', () => expect(scriptAttr('defer')).resolves.toBe(''))

        it('points to /js/script.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/js/script.js'))
      })
    })
  )

  describe(
    'when excluding a page like <PlausibleProvider domain="example.com" exclude="page">',
    withPage('/exclude', (scriptAttr) => {
      describe('the script', () => {
        it('has the data-exclude attribute', () =>
          expect(scriptAttr('data-exclude')).resolves.toBe('page'))

        it('points to /js/script.exclusions.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/js/script.exclusions.js'))
      })
    })
  )

  describe(
    'when tracking outbound links like <PlausibleProvider domain="example.com" trackOutboundLinks />',
    withPage('/trackOutboundLinks', (scriptAttr) => {
      describe('the script', () => {
        it('points to /js/script.outbound-links.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            '/js/script.outbound-links.js'
          ))
      })
    })
  )

  describe(
    'when tracking localhost events like <PlausibleProvider domain="example.com" trackLocalhost />',
    withPage('/trackLocalhost', (scriptAttr, getPage, events) => {
      describe('the script', () => {
        it('points to /js/script.local.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/js/script.local.js'))
      })
      it('sends the pageview event', async () => {
        await getPage().waitForNetworkIdle()
        expect(events).toEqual([
          expect.objectContaining({
            n: 'pageview',
          }),
        ])
      })
    })
  )

  describe(
    'when disabling automatic page events like <PlausibleProvider domain="example.com" manual />',
    withPage('/manual', (scriptAttr) => {
      describe('the script', () => {
        it('points to /js/script.manual.js', () =>
          expect(scriptAttr('src')).resolves.toBe('/js/script.manual.js'))
      })
    })
  )

  describe(
    'when tracking outbound links and excluding a page like <PlausibleProvider domain="example.com" trackOutboundLinks exclude="page" />',
    withPage('/trackOutboundLinksExclude', (scriptAttr) => {
      describe('the script', () => {
        it('has the data-exclude attribute', () =>
          expect(scriptAttr('data-exclude')).resolves.toBe('page'))

        it('points to /js/script.exclusions.outbound-links.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            '/js/script.exclusions.outbound-links.js'
          ))
      })
    })
  )

  describe(
    'when using all supported modifiers',
    withPage('/allModifiers', (scriptAttr) => {
      describe('the script', () => {
        it('has the data-exclude attribute', () =>
          expect(scriptAttr('data-exclude')).resolves.toBe('page'))

        it('points to /js/script.exclusions.local.manual.outbound-links.js', () =>
          expect(scriptAttr('src')).resolves.toBe(
            '/js/script.exclusions.local.manual.outbound-links.js'
          ))
      })
    })
  )

  describe(
    'when tracking a 404 page',
    withPage('/notFound', (_, getPage, events) => {
      it('there are 2 events sent', async () => {
        await getPage().waitForNetworkIdle()
        expect(events).toEqual([
          expect.objectContaining({
            n: 'Page Not Found',
            p: { page: '/notFound' },
          }),
          expect.objectContaining({
            n: 'pageview',
          }),
        ])
      })
    })
  )

  describe('The script at', () => {
    ;[
      {
        source: '/js/script.js',
        destination: 'https://plausible.io/js/script.js',
      },
      ...getCombinations([
        'exclusions',
        'local',
        'manual',
        'outbound-links',
        'revenue',
      ]).map((modifiers) => ({
        source: `/js/script.${modifiers.join('.')}.js`,
        destination: `https://plausible.io/js/script.${modifiers.join('.')}.js`,
      })),
    ].map(({ source, destination }) => {
      describe(source, () => {
        it(`is proxied from ${destination}`, async () => {
          const sourceScriptContent = (await axios.get(`${url}${source}`)).data
          const destinationScriptContent = (await axios.get(destination)).data
          expect(sourceScriptContent).toBe(destinationScriptContent)
        })
      })
    })
  })
})
