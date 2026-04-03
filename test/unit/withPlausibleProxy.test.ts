import { describe, it, expect } from '@jest/globals'
import withPlausibleProxy from '../../lib/withPlausibleProxy'

describe('withPlausibleProxy', () => {
  it('sets the environment variables', () => {
    expect(
      withPlausibleProxy({ src: 'https://plausible.io/js/pa-XXXXX.js' })({}).env
    ).toEqual({
      next_plausible_proxy: 'true',
      next_plausible_scriptPath: '/js/script.js',
      next_plausible_apiPath: '/api/event',
    })
  })
  it('keeps previous environment variables', () => {
    expect(
      withPlausibleProxy({ src: 'https://plausible.io/js/pa-XXXXX.js' })({
        env: { previous: 'env' },
      }).env
    ).toEqual(
      expect.objectContaining({
        previous: 'env',
      })
    )
  })
  it('rewrites the script and the event endpoint to plausible', async () => {
    const rewrites = await withPlausibleProxy({
      src: 'https://plausible.io/js/pa-XXXXX.js',
    })({}).rewrites?.()
    expect(rewrites).toHaveLength(2)
    expect(rewrites).toEqual([
      {
        basePath: false,
        source: '/js/script.js',
        destination: 'https://plausible.io/js/pa-XXXXX.js',
      },
      {
        basePath: false,
        source: '/api/event',
        destination: 'https://plausible.io/api/event',
      },
    ])
  })
  it('keeps previous rewrites', async () => {
    expect(
      await withPlausibleProxy({ src: 'https://plausible.io/js/pa-XXXXX.js' })({
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
