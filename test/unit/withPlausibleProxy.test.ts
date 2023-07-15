import { describe, it, expect } from '@jest/globals'
import withPlausibleProxy from '../../lib/withPlausibleProxy'

describe('withPlausibleProxy', () => {
  it('sets the environment variables', () => {
    expect(withPlausibleProxy({})({}).env).toEqual({
      next_plausible_basePath: undefined,
      next_plausible_customDomain: undefined,
      next_plausible_proxy: 'true',
      next_plausible_scriptName: undefined,
      next_plausible_subdirectory: undefined,
      next_plausible_trailingSlash: undefined,
    })
  })
  it('keeps previous environment variables', () => {
    expect(withPlausibleProxy({})({ env: { previous: 'env' } }).env).toEqual(
      expect.objectContaining({
        previous: 'env',
      })
    )
  })
  it('rewrites the script and the event endpoint to plausible', async () => {
    const rewrites = await withPlausibleProxy({})({}).rewrites?.()
    expect(rewrites).toHaveLength(257)
    expect(rewrites).toEqual(
      expect.arrayContaining([
        {
          source: '/js/script.js',
          destination: 'https://plausible.io/js/script.js',
        },
        {
          source: '/proxy/api/event',
          destination: 'https://plausible.io/api/event',
        },
      ])
    )
  })
  it('keeps previous rewrites', async () => {
    expect(
      await withPlausibleProxy({})({
        rewrites: () =>
          Promise.resolve([
            {
              source: 'a',
              destination: 'b',
            },
          ]),
      }).rewrites?.()
    ).toEqual(
      expect.arrayContaining([
        {
          source: 'a',
          destination: 'b',
        },
      ])
    )
  })
})
