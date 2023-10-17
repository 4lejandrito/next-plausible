import { NextConfig } from 'next'
import getCombinations from './combinations'
import {
  NextPlausibleProxyOptions,
  NextPlausiblePublicProxyOptions,
  ScriptModifier,
  allModifiers,
  getApiEndpoint,
  getDomain,
  getRemoteScriptName,
  getScriptPath,
  plausibleDomain,
} from './common'

type NextPlausibleEnv = { next_plausible_proxy: 'true' } & {
  [K in keyof Required<NextPlausiblePublicProxyOptions> as `next_plausible_${K}`]:
    | string
    | undefined
}

export default function withPlausibleProxy(
  options: NextPlausibleProxyOptions = {}
) {
  return (nextConfig: NextConfig): NextConfig => {
    const nextPlausiblePublicProxyOptions: NextPlausiblePublicProxyOptions = {
      ...options,
      trailingSlash: !!nextConfig.trailingSlash,
      basePath: nextConfig.basePath,
    }
    const nextPlausibleEnv: NextPlausibleEnv = {
      next_plausible_proxy: 'true',
      next_plausible_trailingSlash:
        nextPlausiblePublicProxyOptions.trailingSlash ? 'true' : undefined,
      next_plausible_basePath: nextPlausiblePublicProxyOptions.basePath,
      next_plausible_customDomain: nextPlausiblePublicProxyOptions.customDomain,
      next_plausible_scriptName: nextPlausiblePublicProxyOptions.scriptName,
      next_plausible_subdirectory: nextPlausiblePublicProxyOptions.subdirectory,
    }
    return {
      ...nextConfig,
      env: {
        ...nextConfig.env,
        ...(Object.fromEntries(
          Object.entries(nextPlausibleEnv).filter(
            ([_, value]) => value !== undefined
          )
        ) as Record<string, string>),
      },
      rewrites: async () => {
        const domain = getDomain(options)
        const getRemoteScript = (...modifiers: (ScriptModifier | null)[]) =>
          (process.env.NEXT_PLAUSIBLE_TEST_DOMAIN ?? domain) +
          getScriptPath(
            {
              scriptName: getRemoteScriptName(domain !== plausibleDomain),
            },
            ...modifiers
          )
        const plausibleRewrites = [
          {
            source: getScriptPath(options),
            destination: getRemoteScript(),
          },
          ...getCombinations(allModifiers).map((modifiers) => ({
            source: getScriptPath(options, ...modifiers),
            destination: getRemoteScript(...modifiers),
          })),
          {
            source: getApiEndpoint({
              ...nextPlausiblePublicProxyOptions,
              basePath: '',
            }),
            destination: `${domain}/api/event`,
          },
        ]

        if (process.env.NEXT_PLAUSIBLE_DEBUG) {
          console.log('plausibleRewrites = ', plausibleRewrites)
        }

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
