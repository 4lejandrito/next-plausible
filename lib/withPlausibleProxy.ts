import { NextConfig } from 'next'
import { Rewrite } from 'next/dist/lib/load-custom-routes'

export default function withPlausibleProxy(options: {
  /**
   * The site-specific script URL from your Plausible dashboard, e.g. https://plausible.io/js/pa-XXXXX.js.
   */
  src: string
  /**
   * The local path for the proxied script. Defaults to /js/script.js.
   */
  scriptPath?: string
  /**
   * The local path for the proxied API endpoint. Defaults to /api/event.
   */
  apiPath?: string
}) {
  if (!options?.src) {
    throw new Error(
      "next-plausible: withPlausibleProxy requires a src option, e.g. 'https://plausible.io/js/pa-XXXXX.js'"
    )
  }
  return (nextConfig: NextConfig): NextConfig => {
    const scriptPath =
      (nextConfig.basePath ?? '') + (options.scriptPath ?? '/js/script.js')
    const apiPath =
      (nextConfig.basePath ?? '') + (options.apiPath ?? '/api/event')

    const testDomain = process.env.NEXT_PLAUSIBLE_TEST_DOMAIN
    const scriptDestination = testDomain
      ? testDomain + new URL(options.src).pathname
      : options.src
    const apiDestination =
      (testDomain ?? new URL(options.src).origin) + '/api/event'

    const plausibleRewrites: Rewrite[] = [
      {
        basePath: false,
        source: scriptPath,
        destination: scriptDestination,
      },
      {
        basePath: false,
        source: apiPath,
        destination: apiDestination,
      },
    ]

    if (process.env.NEXT_PLAUSIBLE_DEBUG) {
      console.log('plausibleRewrites = ', plausibleRewrites)
    }

    return {
      ...nextConfig,
      env: {
        ...nextConfig.env,
        next_plausible_proxy: 'true',
        next_plausible_scriptPath: scriptPath,
        next_plausible_apiPath: apiPath,
      },
      rewrites: async () => {
        const rewrites = await nextConfig.rewrites?.()

        if (!rewrites) {
          return plausibleRewrites
        } else if (Array.isArray(rewrites)) {
          return rewrites.concat(plausibleRewrites)
        } else if (rewrites.afterFiles) {
          rewrites.afterFiles = rewrites.afterFiles.concat(plausibleRewrites)
          return rewrites
        } else {
          rewrites.afterFiles = plausibleRewrites
          return rewrites
        }
      },
    }
  }
}
