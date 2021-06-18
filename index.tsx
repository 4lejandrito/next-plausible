import React, { ReactNode } from 'react'
import Head from 'next/head'
import { NextConfig } from 'next/dist/next-server/server/config-shared'
import getConfig from 'next/config'

type NextPlausibleProxyOptions = {
  subdirectory?: string
  scriptName?: string
}

type ScriptModifier = 'exclusions' | 'outbound-links'

const getScriptPath = (
  options: NextPlausibleProxyOptions,
  ...modifiers: (ScriptModifier | null)[]
) => {
  const basePath = `/js/${[
    options.scriptName ?? 'script',
    ...modifiers.filter((modifier) => modifier !== null),
  ].join('.')}.js`
  if (options.subdirectory) {
    return `/${options.subdirectory}${basePath}`
  } else {
    return basePath
  }
}

export function withPlausibleProxy(options: NextPlausibleProxyOptions = {}) {
  return (nextConfig: NextConfig): NextConfig => ({
    ...nextConfig,
    publicRuntimeConfig: {
      ...nextConfig.publicRuntimeConfig,
      nextPlausibleProxyOptions: options,
    },
    rewrites: async () => {
      const plausibleRewrites = [
        {
          source: getScriptPath(options),
          destination: 'https://plausible.io/js/plausible.js',
        },
        {
          source: getScriptPath(options, 'exclusions'),
          destination: 'https://plausible.io/js/plausible.exclusions.js',
        },
        {
          source: getScriptPath(options, 'outbound-links'),
          destination: 'https://plausible.io/js/plausible.outbound-links.js',
        },
        {
          source: getScriptPath(options, 'outbound-links', 'exclusions'),
          destination:
            'https://plausible.io/js/plausible.outbound-links.exclusions.js',
        },
        {
          source: options.subdirectory
            ? `/${options.subdirectory}/api/event`
            : '/api/event',
          destination: `https://plausible.io/api/event`,
        },
      ]
      const rewrites = await nextConfig.rewrites?.()

      if (!rewrites) {
        return plausibleRewrites
      } else if (Array.isArray(rewrites)) {
        return rewrites.concat(plausibleRewrites)
      } else {
        rewrites.afterFiles = rewrites.afterFiles.concat(plausibleRewrites)
        return rewrites
      }
    },
  })
}

export default function PlausibleProvider(props: {
  domain: string
  customDomain?: string
  children: ReactNode | ReactNode[]
  trackOutboundLinks?: boolean
  exclude?: string
  selfHosted?: boolean
  enabled?: boolean
  integrity?: string
}) {
  const {
    customDomain = 'https://plausible.io',
    enabled = process.env.NODE_ENV === 'production',
  } = props
  const proxyOptions: NextPlausibleProxyOptions | undefined =
    getConfig()?.publicRuntimeConfig?.nextPlausibleProxyOptions

  return (
    <>
      <Head>
        {enabled && (
          <script
            async
            defer
            data-api={
              proxyOptions
                ? `${proxyOptions.subdirectory}/api/event`
                : undefined
            }
            data-domain={props.domain}
            data-exclude={props.exclude}
            src={
              (proxyOptions ? '' : customDomain) +
              getScriptPath(
                {
                  ...proxyOptions,
                  scriptName: proxyOptions
                    ? proxyOptions.scriptName
                    : props.selfHosted ||
                      customDomain === 'https://plausible.io'
                    ? 'plausible'
                    : 'index',
                },
                props.trackOutboundLinks ? 'outbound-links' : null,
                props.exclude ? 'exclusions' : null
              )
            }
            integrity={props.integrity}
            crossOrigin={props.integrity ? 'anonymous' : undefined}
          />
        )}
      </Head>
      {props.children}
    </>
  )
}

// https://docs.plausible.io/custom-event-goals#using-custom-props
type Props = Record<string, unknown> | never
type EventOptions<P extends Props> = {
  props: P
  callback?: VoidFunction
}
type EventOptionsTuple<P extends Props> = P extends never
  ? [Omit<EventOptions<P>, 'props'>?]
  : [EventOptions<P>]
type Events = { [K: string]: Props }

export function usePlausible<E extends Events = any>() {
  return function <N extends keyof E>(
    eventName: N,
    ...rest: EventOptionsTuple<E[N]>
  ) {
    return (window as any).plausible?.(eventName, rest[0])
  }
}
